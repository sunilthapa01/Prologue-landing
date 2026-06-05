'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function GravitySimulation() {
  const [massSun, setMassSun] = useState<number>(150);
  const [massPlanet, setMassPlanet] = useState<number>(20);

  const massSunRef = useRef<number>(150);
  const massPlanetRef = useRef<number>(20);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPlanetDragging = useRef<boolean>(false);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  // Physical coordinates tracking in refs to run loop smoothly without triggering React re-renders at 60fps
  const starX = 250;
  const starY = 180;
  const G = 1600;

  const pX = useRef<number>(250);
  const pY = useRef<number>(80);
  const pVx = useRef<number>(4.2);
  const pVy = useRef<number>(0);

  const [telemetry, setTelemetry] = useState({
    velocity: '0 px/s',
    radius: '0 px',
    force: '0 N'
  });

  const drawVectorArrow = (
    ctx: CanvasRenderingContext2D,
    fx: number,
    fy: number,
    tx: number,
    ty: number,
    color: string,
    width: number
  ) => {
    const head = 8;
    const dx = tx - fx;
    const dy = ty - fy;
    const angle = Math.atan2(dy, dx);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - head * Math.cos(angle - Math.PI / 6), ty - head * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(tx - head * Math.cos(angle + Math.PI / 6), ty - head * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  };

  const drawGravityScene = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Fine grid background
    ctx.strokeStyle = '#D8D3CC';
    ctx.lineWidth = 0.5;
    for (let i = 30; i < width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let j = 30; j < height; j += 30) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }

    const dx = starX - pX.current;
    const dy = starY - pY.current;
    const r = Math.sqrt(dx * dx + dy * dy);

    // Draw Orbit Trail Circle representing current radius path
    ctx.strokeStyle = 'rgba(192, 57, 43, 0.1)'; // Vermillion orbit trail (subtle on light)
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(starX, starY, r, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Star Core with radial gradient
    const starRadius = Math.max(16, Math.min(48, 12 + massSunRef.current * 0.12));
    const grad = ctx.createRadialGradient(starX, starY, 2, starX, starY, starRadius);
    grad.addColorStop(0, '#FFD500'); // Gold center
    grad.addColorStop(0.3, '#C0392B'); // Vermillion main
    grad.addColorStop(1, 'rgba(192, 57, 43, 0)'); // transparent outer
 
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(starX, starY, starRadius, 0, Math.PI * 2);
    ctx.fill();
 
    ctx.strokeStyle = '#C0392B'; // Vermillion outline
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(starX, starY, starRadius - 2, 0, Math.PI * 2);
    ctx.stroke();
 
    // Draw Planet Node
    const planetRadius = Math.max(6, Math.min(16, 4 + massPlanetRef.current * 0.25));
    ctx.fillStyle = '#1C1917'; // Ink planet
    ctx.beginPath();
    ctx.arc(pX.current, pY.current, planetRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#F7F2EA'; // Paper stroke
    ctx.lineWidth = 1.5;
    ctx.stroke();
 
    // Vector arrows (Force and Velocity direction vectors)
    if (r > 10) {
      // Gravitational force vector (pointing towards central star)
      const forceMagnitude = (massSunRef.current * massPlanetRef.current) / (r * r);
      const forceArrowLen = Math.min(80, Math.max(18, forceMagnitude * 2800));
      const fx = (dx / r) * forceArrowLen;
      const fy = (dy / r) * forceArrowLen;
      drawVectorArrow(ctx, pX.current, pY.current, pX.current + fx, pY.current + fy, '#C0392B', 2.5);
 
      // Velocity vector (pointing in current travel tangent direction)
      const velScale = 12;
      drawVectorArrow(ctx, pX.current, pY.current, pX.current + pVx.current * velScale, pY.current + pVy.current * velScale, '#3498DB', 2.0);
    }
  };

  const updatePhysics = (timestamp: number) => {
    if (previousTimeRef.current !== null) {
      const elapsed = (timestamp - previousTimeRef.current) / 1000;
      let dt = elapsed > 0.08 ? 0.08 : elapsed;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (!isPlanetDragging.current) {
            const dx = starX - pX.current;
            const dy = starY - pY.current;
            const r = Math.max(18, Math.sqrt(dx * dx + dy * dy));

            // Newtonian Force acceleration vector
            const accMagnitude = (G * massSunRef.current) / (r * r);
            const ax = accMagnitude * (dx / r);
            const ay = accMagnitude * (dy / r);

            // Update velocity with speed scaling factor of 30 (instead of 60) for a calmer speed
            pVx.current += ax * dt * 30;
            pVy.current += ay * dt * 30;

            // Update position
            pX.current += pVx.current * dt * 30;
            pY.current += pVy.current * dt * 30;

            // Bounce back if flies completely off bounds
            if (
              pX.current < -100 ||
              pX.current > canvas.width + 100 ||
              pY.current < -100 ||
              pY.current > canvas.height + 100
            ) {
              pX.current = starX;
              pY.current = starY - 100;
              pVx.current = 4.0;
              pVy.current = 0;
            }
          }

          drawGravityScene(ctx, canvas.width, canvas.height);

          // Update telemetry states
          const currentDx = starX - pX.current;
          const currentDy = starY - pY.current;
          const currentR = Math.sqrt(currentDx * currentDx + currentDy * currentDy);
          const velMagnitude = Math.sqrt(pVx.current * pVx.current + pVy.current * pVy.current);
          const absoluteForceVal = (G * massSunRef.current * massPlanetRef.current) / (currentR * currentR);

          setTelemetry({
            velocity: (velMagnitude * 10).toFixed(0) + ' px/s',
            radius: currentR.toFixed(0) + ' px',
            force: absoluteForceVal.toFixed(0) + ' N'
          });
        }
      }
    }
    previousTimeRef.current = timestamp;
    requestRef.current = requestAnimationFrame(updatePhysics);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handlePlanetDrag = (clientX: number, clientY: number, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;

    pX.current = Math.max(10, Math.min(canvas.width - 10, mx));
    pY.current = Math.max(10, Math.min(canvas.height - 10, my));

    // Re-initialize orbital circular velocity tangent component when released
    const dx = starX - pX.current;
    const dy = starY - pY.current;
    const r = Math.sqrt(dx * dx + dy * dy);

    if (r > 15) {
      const vCirc = Math.sqrt((G * massSun) / r);
      pVx.current = (-dy / r) * vCirc;
      pVy.current = (dx / r) * vCirc;
    } else {
      pVx.current = 0;
      pVy.current = 0;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const dist = Math.sqrt((mx - pX.current) ** 2 + (my - pY.current) ** 2);

    if (dist < 30) {
      isPlanetDragging.current = true;
      handlePlanetDrag(e.clientX, e.clientY, canvas);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlanetDragging.current) return;
    handlePlanetDrag(e.clientX, e.clientY, canvas);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.touches[0].clientX - rect.left;
    const my = e.touches[0].clientY - rect.top;
    const dist = Math.sqrt((mx - pX.current) ** 2 + (my - pY.current) ** 2);

    if (dist < 40) {
      isPlanetDragging.current = true;
      handlePlanetDrag(e.touches[0].clientX, e.touches[0].clientY, canvas);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlanetDragging.current || e.touches.length === 0) return;
    handlePlanetDrag(e.touches[0].clientX, e.touches[0].clientY, canvas);
  };

  useEffect(() => {
    const globalMouseUp = () => {
      isPlanetDragging.current = false;
    };
    window.addEventListener('mouseup', globalMouseUp);
    window.addEventListener('touchend', globalMouseUp);
    return () => {
      window.removeEventListener('mouseup', globalMouseUp);
      window.removeEventListener('touchend', globalMouseUp);
    };
  }, []);

  const handleStarMassChange = (newMass: number) => {
    setMassSun(newMass);
    massSunRef.current = newMass;
    if (!isPlanetDragging.current) {
      const dx = starX - pX.current;
      const dy = starY - pY.current;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r > 15) {
        const vCirc = Math.sqrt((G * newMass) / r);
        pVx.current = (-dy / r) * vCirc;
        pVy.current = (dx / r) * vCirc;
      }
    }
  };

  return (
    <div className="sim-container active" id="sim-gravity-container">
      <div className="sim-sidebar">
        <div className="sim-label">Concept Explainer</div>
        <h3 className="sim-title">Newton's Law of Gravitation</h3>
        <p className="sim-explanation">
          Gravity is an attractive force that increases with mass and drops off drastically with distance. Drag the planet to change its orbit. Drag the mass sliders to watch the gravity vectors recalculate in real-time.
        </p>
        <div className="sim-controls">
          <div className="control-group">
            <label htmlFor="mass-sun-slider">Mass of Star (<span className="math-char">M₁</span>):</label>
            <input
              type="range"
              id="mass-sun-slider"
              min="50"
              max="250"
              step="5"
              value={massSun}
              onChange={(e) => handleStarMassChange(parseFloat(e.target.value))}
            />
          </div>
          <div className="control-group">
            <label htmlFor="mass-planet-slider">Mass of Planet (<span className="math-char">M₂</span>):</label>
            <input
              type="range"
              id="mass-planet-slider"
              min="5"
              max="50"
              step="1"
              value={massPlanet}
              onChange={(e) => {
                const newMass = parseFloat(e.target.value);
                setMassPlanet(newMass);
                massPlanetRef.current = newMass;
              }}
            />
          </div>
        </div>
        <div className="sim-telemetry">
          <div className="telemetry-row">
            <span>Orbital Velocity:</span>
            <span className="telemetry-value" id="val-gravity-vel">{telemetry.velocity}</span>
          </div>
          <div className="telemetry-row">
            <span>Orbital Radius:</span>
            <span className="telemetry-value" id="val-gravity-radius">{telemetry.radius}</span>
          </div>
          <div className="telemetry-row highlight">
            <span>Gravitational Force:</span>
            <span className="telemetry-value font-serif" id="val-gravity-force" style={{ color: '#C0392B' }}>{telemetry.force}</span>
          </div>
        </div>
      </div>

      <div className="sim-viewport">
        <canvas
          ref={canvasRef}
          id="gravity-canvas"
          width="500"
          height="360"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        />
      </div>
    </div>
  );
}
