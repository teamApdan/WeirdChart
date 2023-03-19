import React from 'react';
import { useCanvas } from '../../hooks';

interface Props {
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void;
  style: React.CSSProperties;
  [key: string]: any;
}

const Canvas = ({ draw, style, ...rest }: Props) => {
  const canvasRef = useCanvas(draw);

  return <canvas ref={canvasRef} {...rest} style={style} />;
};

export default Canvas;
