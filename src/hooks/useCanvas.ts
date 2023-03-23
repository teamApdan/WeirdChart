import { useRef, useEffect } from 'react';

const useCanvas = (draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  if (CanvasRenderingContext2D.prototype.roundRect === undefined) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r: number | number[]) {
      let upperLeft = 0;
      let upperRight = 0;
      let lowerLeft = 0;
      let lowerRight = 0;

      if (typeof r === 'number') {
        upperLeft = r;
        upperRight = r;
        lowerLeft = r;
        lowerRight = r;
      } else {
        upperLeft = r[0];
        upperRight = r[1];
        lowerLeft = r[2];
        lowerRight = r[3];
      }
      this.beginPath();
      this.moveTo(x + upperLeft, y);
      this.lineTo(x + w - upperRight, y);
      this.quadraticCurveTo(x + w, y, x + w, y + upperRight);
      this.lineTo(x + w, y + h - lowerRight);
      this.quadraticCurveTo(x + w, y + h, x + w - lowerRight, y + h);
      this.lineTo(x + lowerLeft, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - lowerLeft);
      this.lineTo(x, y + upperLeft);
      this.quadraticCurveTo(x, y, x + upperLeft, y);
      this.closePath();
      this.fill();
    };
  }

  useEffect(() => {
    if (!canvasRef || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const dpr = window.devicePixelRatio;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;

    const context = canvas.getContext('2d');

    if (!context) return;

    let frameCount = 0;
    let animationFrameId: number;

    const render = () => {
      if (frameCount <= 1000) frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return canvasRef;
};

export default useCanvas;
