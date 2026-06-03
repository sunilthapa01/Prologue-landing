'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function DerivativeSimulation() {
  const [xVal, setXVal] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef<boolean>(false);

  const dScaleX = 80;
  const dScaleY = 80;

  const drawDerivative = (ctx: CanvasRenderingContext2D, width: number, height: number, x: number) => {
    ctx.clearRect(0, 0, width, height);

    const dCenterX = width / 2;
    const dCenterY = height / 2;

    // Fine layout grid
    ctx.strokeStyle = '#EAE4D8';
    ctx.lineWidth = 0.5;
    for (let i = 40; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let j = 40; j < height; j += 40) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }

    // X and Y Axes
    ctx.strokeStyle = '#8F8880';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    // X Axis
    ctx.moveTo(0, dCenterY);
    ctx.lineTo(width, dCenterY);
    // Y Axis
    ctx.moveTo(dCenterX, 0);
    ctx.lineTo(dCenterX, height);
    ctx.stroke();

    // Sine Curve formula: y = 1.2 * sin(x)
    ctx.strokeStyle = '#1E1C1A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let first = true;
    for (let lx = -3; lx <= 3; lx += 0.04) {
      const ly = 1.2 * Math.sin(lx);
      const cx = dCenterX + lx * dScaleX;
      const cy = dCenterY - ly * dScaleY;
      if (first) {
        ctx.moveTo(cx, cy);
        first = false;
      } else {
        ctx.lineTo(cx, cy);
      }
    }
    ctx.stroke();

    // Current derivative point P(x)
    const y = 1.2 * Math.sin(x);
    // Slope derivative formula: dy/dx = 1.2 * cos(x)
    const slope = 1.2 * Math.cos(x);

    const px = dCenterX + x * dScaleX;
    const py = dCenterY - y * dScaleY;

    // Draw Tangent line segment
    const dxSpan = 1.5;
    const lx1 = x - dxSpan;
    const ly1 = slope * (lx1 - x) + y;
    const cx1 = dCenterX + lx1 * dScaleX;
    const cy1 = dCenterY - ly1 * dScaleY;

    const lx2 = x + dxSpan;
    const ly2 = slope * (lx2 - x) + y;
    const cx2 = dCenterX + lx2 * dScaleX;
    const cy2 = dCenterY - ly2 * dScaleY;

    ctx.strokeStyle = '#C93B2B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx1, cy1);
    ctx.lineTo(cx2, cy2);
    ctx.stroke();

    // Draw point node P
    ctx.fillStyle = '#1E1C1A';
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FAF7F2';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label coordinate P
    ctx.fillStyle = '#1E1C1A';
    ctx.font = 'italic bold 14px "DM Serif Display", serif';
    ctx.fillText("P", px + 12, py - 12);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawDerivative(ctx, canvas.width, canvas.height, xVal);
  }, [xVal]);

  const getLocalX = (clientX: number, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const dCenterX = canvas.width / 2;
    const lx = (mouseX - dCenterX) / dScaleX;
    return Math.max(-2, Math.min(2, lx));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDragging.current = true;
    setXVal(getLocalX(e.clientX, canvas));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDragging.current) return;
    setXVal(getLocalX(e.clientX, canvas));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    isDragging.current = true;
    setXVal(getLocalX(e.touches[0].clientX, canvas));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDragging.current || e.touches.length === 0) return;
    setXVal(getLocalX(e.touches[0].clientX, canvas));
  };

  // Bind mouseup listeners globally to handle drag-out
  useEffect(() => {
    const globalMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mouseup', globalMouseUp);
    window.addEventListener('touchend', globalMouseUp);
    return () => {
      window.removeEventListener('mouseup', globalMouseUp);
      window.removeEventListener('touchend', globalMouseUp);
    };
  }, []);

  const currentY = 1.2 * Math.sin(xVal);
  const currentSlope = 1.2 * Math.cos(xVal);

  return (
    <div className="sim-container active" id="sim-derivative-container">
      <div className="sim-sidebar">
        <div className="sim-label">Concept Explainer</div>
        <h3 className="sim-title">Understanding the Derivative</h3>
        <p className="sim-explanation">
          The derivative is the instantaneous rate of change. Don't memorize the formula. Drag the slider to move the point <span className="math-char">P</span> along the curve. Watch the tangent line tilt. The slope updates live.
        </p>
        <div className="sim-controls">
          <label htmlFor="derivative-slider">Position along curve (<span className="math-char">x</span>):</label>
          <input
            type="range"
            id="derivative-slider"
            min="-2"
            max="2"
            step="0.05"
            value={xVal}
            onChange={(e) => setXVal(parseFloat(e.target.value))}
          />
          <div className="slider-labels">
            <span>-2.0</span>
            <span>0.0</span>
            <span>2.0</span>
          </div>
        </div>
        <div className="sim-telemetry">
          <div className="telemetry-row">
            <span>Current X Coordinate:</span>
            <span className="telemetry-value" id="val-x">{xVal.toFixed(2)}</span>
          </div>
          <div className="telemetry-row">
            <span>Current Y Coordinate:</span>
            <span className="telemetry-value" id="val-y">{currentY.toFixed(2)}</span>
          </div>
          <div className="telemetry-row highlight">
            <span>Slope (Derivative dy/dx):</span>
            <span className="telemetry-value font-serif" id="val-slope" style={{ color: '#C93B2B' }}>{currentSlope.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="sim-viewport">
        <canvas
          ref={canvasRef}
          id="derivative-canvas"
          width="500"
          height="360"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        />
      </div>
    </div>
  );
}
