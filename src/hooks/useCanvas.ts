import { useRef, useEffect } from 'react';

const useCanvas = (draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    if (context.roundRect === undefined) {
      context.roundRect = function (x, y, w, h, r: number) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
      };
    }

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
