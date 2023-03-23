import React from 'react';
import { useCanvas } from '../../hooks';

type Props = {
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void;
} & React.CanvasHTMLAttributes<HTMLCanvasElement>;

const Canvas = ({ draw, ...rest }: Props) => {
  const canvasRef = useCanvas(draw);
  return <canvas ref={canvasRef} {...rest} />;
};

export default Canvas;
