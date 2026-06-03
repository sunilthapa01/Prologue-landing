/* ==========================================================================
   PROLOGUE INTERACTIVE ENGINE
   Includes: GSAP scroll animations, Tab management, Sandbox physics solvers
   ========================================================================== */

function initPrologue() {

  // ==========================================
  // GSAP SCROLL ANIMATIONS
  // ==========================================
  
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Pin the Hero Section and peel open the notebook front page
    const heroSection = document.getElementById('hero');
    const notebookFrontPage = document.getElementById('notebook-page-front');
    const notebookTrigger = document.getElementById('notebook-trigger');

    if (heroSection && notebookFrontPage && notebookTrigger) {
      // Timeline for scroll-driven page turn
      const tlHero = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // 1. Fade out the hero typography
      tlHero.to('.hero-container', {
        opacity: 0,
        y: -60,
        duration: 0.5
      }, 0);

      // 2. Rotate/Peel the front page of the textbook open (3D book turn)
      tlHero.to(notebookFrontPage, {
        rotateY: -140,
        opacity: 0.1,
        ease: 'power1.inOut',
        duration: 1
      }, 0.1);

      // 3. Scale up notebook back-page slightly for focus
      tlHero.to('.notebook-shell', {
        scale: 1.05,
        boxShadow: '0 40px 80px rgba(30, 28, 26, 0.2)',
        duration: 1
      }, 0.1);
    }

    // Schematic flow animation on ScrollTrigger (Section 5 Architecture)
    const schematicLine = document.getElementById('schematic-active-line');
    const archSection = document.getElementById('architecture');

    if (schematicLine && archSection) {
      gsap.to(schematicLine, {
        strokeDashoffset: 0,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: archSection,
          start: 'top 60%',
          end: 'top 20%',
          scrub: 1.5
        }
      });
      
      // Node groups fade in
      gsap.from('.node-group', {
        opacity: 0.3,
        scale: 0.95,
        stagger: 0.1,
        duration: 0.8,
        scrollTrigger: {
          trigger: archSection,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      });
    }

    // Staggered reveal animations on headers
    gsap.utils.toArray('.section-heading').forEach((heading) => {
      gsap.from(heading, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: {
          trigger: heading,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }

  // ==========================================
  // SANDBOX TAB NAVIGATION
  // ==========================================

  const tabDeriv = document.getElementById('tab-derivative');
  const tabGrav = document.getElementById('tab-gravity');
  const simDeriv = document.getElementById('sim-derivative-container');
  const simGrav = document.getElementById('sim-gravity-container');

  if (tabDeriv && tabGrav && simDeriv && simGrav) {
    tabDeriv.addEventListener('click', () => {
      tabDeriv.classList.add('active');
      tabGrav.classList.remove('active');
      simDeriv.classList.add('active');
      simGrav.classList.remove('active');
      
      // Pause gravity animation when not in tab
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      // Re-trigger derivative draw
      drawDerivative();
    });

    tabGrav.addEventListener('click', () => {
      tabGrav.classList.add('active');
      tabDeriv.classList.remove('active');
      simGrav.classList.add('active');
      simDeriv.classList.remove('active');
      
      // Reset gravity timer & start loop
      lastTime = 0;
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(updateGravityPhysics);
      }
    });
  }

  // ==========================================
  // SIMULATION 1: DERIVATIVE MATH RESOLVER
  // ==========================================

  const dCanvas = document.getElementById('derivative-canvas');
  if (dCanvas) {
    const dCtx = dCanvas.getContext('2d');
    const dWidth = dCanvas.width;
    const dHeight = dCanvas.height;
    const dSlider = document.getElementById('derivative-slider');

    const dScaleX = 80;
    const dScaleY = 80;
    const dCenterX = dWidth / 2;
    const dCenterY = dHeight / 2;

    function drawDerivative() {
      dCtx.clearRect(0, 0, dWidth, dHeight);

      // Fine layout grid
      dCtx.strokeStyle = '#EAE4D8';
      dCtx.lineWidth = 0.5;
      for (let i = 40; i < dWidth; i += 40) {
        dCtx.beginPath();
        dCtx.moveTo(i, 0);
        dCtx.lineTo(i, dHeight);
        dCtx.stroke();
      }
      for (let j = 40; j < dHeight; j += 40) {
        dCtx.beginPath();
        dCtx.moveTo(0, j);
        dCtx.lineTo(dWidth, j);
        dCtx.stroke();
      }

      // X and Y Axes
      dCtx.strokeStyle = '#8F8880';
      dCtx.lineWidth = 1.2;
      dCtx.beginPath();
      // X Axis
      dCtx.moveTo(0, dCenterY);
      dCtx.lineTo(dWidth, dCenterY);
      // Y Axis
      dCtx.moveTo(dCenterX, 0);
      dCtx.lineTo(dCenterX, dHeight);
      dCtx.stroke();

      // Sine Curve formula: y = 1.2 * sin(x)
      dCtx.strokeStyle = '#1E1C1A';
      dCtx.lineWidth = 2.5;
      dCtx.beginPath();
      let first = true;
      for (let lx = -3; lx <= 3; lx += 0.04) {
        let ly = 1.2 * Math.sin(lx);
        let cx = dCenterX + lx * dScaleX;
        let cy = dCenterY - ly * dScaleY;
        if (first) {
          dCtx.moveTo(cx, cy);
          first = false;
        } else {
          dCtx.lineTo(cx, cy);
        }
      }
      dCtx.stroke();

      // Current derivative point P(x)
      let x = parseFloat(dSlider.value);
      let y = 1.2 * Math.sin(x);
      
      // Slope derivative formula: dy/dx = 1.2 * cos(x)
      let slope = 1.2 * Math.cos(x);

      let px = dCenterX + x * dScaleX;
      let py = dCenterY - y * dScaleY;

      // Draw Tangent line line segment
      // Equation: Y - py = -slope * (X - px)
      let dxSpan = 1.5;
      let lx1 = x - dxSpan;
      let ly1 = slope * (lx1 - x) + y;
      let cx1 = dCenterX + lx1 * dScaleX;
      let cy1 = dCenterY - ly1 * dScaleY;

      let lx2 = x + dxSpan;
      let ly2 = slope * (lx2 - x) + y;
      let cx2 = dCenterX + lx2 * dScaleX;
      let cy2 = dCenterY - ly2 * dScaleY;

      dCtx.strokeStyle = '#C93B2B';
      dCtx.lineWidth = 3;
      dCtx.beginPath();
      dCtx.moveTo(cx1, cy1);
      dCtx.lineTo(cx2, cy2);
      dCtx.stroke();

      // Draw point node P
      dCtx.fillStyle = '#1E1C1A';
      dCtx.beginPath();
      dCtx.arc(px, py, 7, 0, Math.PI * 2);
      dCtx.fill();
      dCtx.strokeStyle = '#FAF7F2';
      dCtx.lineWidth = 2;
      dCtx.stroke();

      // Label coordinate P
      dCtx.fillStyle = '#1E1C1A';
      dCtx.font = 'italic bold 14px "DM Serif Display", serif';
      dCtx.fillText("P", px + 12, py - 12);

      // Update values in UI
      document.getElementById('val-x').textContent = x.toFixed(2);
      document.getElementById('val-y').textContent = y.toFixed(2);
      document.getElementById('val-slope').textContent = slope.toFixed(2);
    }

    // Drag interaction directly on Canvas
    let isDragging = false;

    function getLocalX(clientX) {
      const rect = dCanvas.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      let lx = (mouseX - dCenterX) / dScaleX;
      return Math.max(-2, Math.min(2, lx));
    }

    dCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      dSlider.value = getLocalX(e.clientX);
      drawDerivative();
    });

    dCanvas.addEventListener('mousemove', (e) => {
      if (isDragging) {
        dSlider.value = getLocalX(e.clientX);
        drawDerivative();
      }
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events for mobile screens
    dCanvas.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches.length > 0) {
        dSlider.value = getLocalX(e.touches[0].clientX);
        drawDerivative();
      }
    });

    dCanvas.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length > 0) {
        dSlider.value = getLocalX(e.touches[0].clientX);
        drawDerivative();
      }
    });

    dCanvas.addEventListener('touchend', () => {
      isDragging = false;
    });

    dSlider.addEventListener('input', drawDerivative);
    
    // Initial draw
    drawDerivative();
  }

  // ==========================================
  // SIMULATION 2: GRAVITY PHYSICS SOLVER
  // ==========================================

  const gCanvas = document.getElementById('gravity-canvas');
  let animFrameId = null;
  let lastTime = 0;

  // Star and planet configuration
  let starX = 250;
  let starY = 180;
  let G = 1600; // Gravitational constant scale factor
  
  let pX = 250;
  let pY = 80;
  let pVx = 4.2;
  let pVy = 0;
  let isPlanetDragging = false;

  if (gCanvas) {
    const gCtx = gCanvas.getContext('2d');
    const gWidth = gCanvas.width;
    const gHeight = gCanvas.height;
    
    const starMassInput = document.getElementById('mass-sun-slider');
    const planetMassInput = document.getElementById('mass-planet-slider');

    function updateGravityPhysics(timestamp) {
      if (!lastTime) lastTime = timestamp;
      let dt = (timestamp - lastTime) / 1000;
      if (dt > 0.08) dt = 0.08; // Cap delta to prevent explosion
      lastTime = timestamp;

      if (!isPlanetDragging) {
        let starMass = parseFloat(starMassInput.value);
        
        // Displacement vector
        let dx = starX - pX;
        let dy = starY - pY;
        let r = Math.sqrt(dx * dx + dy * dy);
        
        if (r < 18) r = 18; // Soften singularity at center contact
        
        // Newtonian Force acceleration vector
        let accMagnitude = (G * starMass) / (r * r);
        let ax = accMagnitude * (dx / r);
        let ay = accMagnitude * (dy / r);

        // Update velocity
        pVx += ax * dt * 60; // scale for frame updates
        pVy += ay * dt * 60;

        // Update position
        pX += pVx * dt * 60;
        pY += pVy * dt * 60;

        // Bounce back if flies completely off bounds (gravity pull recovery helper)
        if (pX < -100 || pX > gWidth + 100 || pY < -100 || pY > gHeight + 100) {
          pX = starX;
          pY = starY - 100;
          pVx = 4.0;
          pVy = 0;
        }
      }

      drawGravityScene();
      animFrameId = requestAnimationFrame(updateGravityPhysics);
    }

    function drawGravityScene() {
      gCtx.clearRect(0, 0, gWidth, gHeight);

      // Fine grid background
      gCtx.strokeStyle = '#EAE4D8';
      gCtx.lineWidth = 0.5;
      for (let i = 30; i < gWidth; i += 30) {
        gCtx.beginPath();
        gCtx.moveTo(i, 0);
        gCtx.lineTo(i, gHeight);
        gCtx.stroke();
      }
      for (let j = 30; j < gHeight; j += 30) {
        gCtx.beginPath();
        gCtx.moveTo(0, j);
        gCtx.lineTo(gWidth, j);
        gCtx.stroke();
      }

      let starMass = parseFloat(starMassInput.value);
      let planetMass = parseFloat(planetMassInput.value);
      let dx = starX - pX;
      let dy = starY - pY;
      let r = Math.sqrt(dx * dx + dy * dy);

      // Draw Orbit Trail Circle representing current radius path
      gCtx.strokeStyle = 'rgba(201, 59, 43, 0.06)';
      gCtx.lineWidth = 1;
      gCtx.beginPath();
      gCtx.arc(starX, starY, r, 0, Math.PI * 2);
      gCtx.stroke();

      // Draw Star Core with radial gradient
      let starRadius = Math.max(16, Math.min(48, 12 + starMass * 0.12));
      let grad = gCtx.createRadialGradient(starX, starY, 2, starX, starY, starRadius);
      grad.addColorStop(0, '#FFE566');
      grad.addColorStop(0.3, '#C93B2B');
      grad.addColorStop(1, 'rgba(201, 59, 43, 0.05)');

      gCtx.fillStyle = grad;
      gCtx.beginPath();
      gCtx.arc(starX, starY, starRadius, 0, Math.PI * 2);
      gCtx.fill();

      gCtx.strokeStyle = '#C93B2B';
      gCtx.lineWidth = 1.5;
      gCtx.beginPath();
      gCtx.arc(starX, starY, starRadius - 2, 0, Math.PI * 2);
      gCtx.stroke();

      // Draw Planet Node
      let planetRadius = Math.max(6, Math.min(16, 4 + planetMass * 0.25));
      gCtx.fillStyle = '#1E1C1A';
      gCtx.beginPath();
      gCtx.arc(pX, pY, planetRadius, 0, Math.PI * 2);
      gCtx.fill();
      gCtx.strokeStyle = '#FAF7F2';
      gCtx.lineWidth = 1.5;
      gCtx.stroke();

      // Vector arrows (Force and Velocity direction vectors)
      if (r > 10) {
        // Gravitational force vector (pointing towards central star)
        let forceMagnitude = (starMass * planetMass) / (r * r);
        let forceArrowLen = Math.min(80, Math.max(18, forceMagnitude * 2800));
        let fx = (dx / r) * forceArrowLen;
        let fy = (dy / r) * forceArrowLen;
        drawVectorArrow(gCtx, pX, pY, pX + fx, pY + fy, '#C93B2B', 2.5);

        // Velocity vector (pointing in current travel tangent direction)
        let velScale = 12;
        drawVectorArrow(gCtx, pX, pY, pX + pVx * velScale, pY + pVy * velScale, '#3498DB', 2.0);
      }

      // Update telemetry readouts
      let velMagnitude = Math.sqrt(pVx * pVx + pVy * pVy);
      let absoluteForceVal = (G * starMass * planetMass) / (r * r);

      document.getElementById('val-gravity-vel').textContent = (velMagnitude * 10).toFixed(0) + " px/s";
      document.getElementById('val-gravity-radius').textContent = r.toFixed(0) + " px";
      document.getElementById('val-gravity-force').textContent = absoluteForceVal.toFixed(0) + " N";
    }

    function drawVectorArrow(ctx, fx, fy, tx, ty, color, width) {
      let head = 8;
      let dx = tx - fx;
      let dy = ty - fy;
      let angle = Math.atan2(dy, dx);
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
    }

    // Direct Planet dragging interface
    function handlePlanetDrag(clientX, clientY) {
      const rect = gCanvas.getBoundingClientRect();
      let mx = clientX - rect.left;
      let my = clientY - rect.top;

      pX = Math.max(10, Math.min(gWidth - 10, mx));
      pY = Math.max(10, Math.min(gHeight - 10, my));

      // Re-initialize orbital circular velocity tangent component when released
      let starMass = parseFloat(starMassInput.value);
      let dx = starX - pX;
      let dy = starY - pY;
      let r = Math.sqrt(dx * dx + dy * dy);

      if (r > 15) {
        // V_circular = sqrt(G * M / r)
        let vCirc = Math.sqrt((G * starMass) / r);
        // Tangent vector direction
        pVx = (-dy / r) * vCirc;
        pVy = (dx / r) * vCirc;
      } else {
        pVx = 0;
        pVy = 0;
      }
      
      drawGravityScene();
    }

    gCanvas.addEventListener('mousedown', (e) => {
      const rect = gCanvas.getBoundingClientRect();
      let mx = e.clientX - rect.left;
      let my = e.clientY - rect.top;
      let dist = Math.sqrt((mx - pX) ** 2 + (my - pY) ** 2);
      
      if (dist < 30) {
        isPlanetDragging = true;
        handlePlanetDrag(e.clientX, e.clientY);
      }
    });

    gCanvas.addEventListener('mousemove', (e) => {
      if (isPlanetDragging) {
        handlePlanetDrag(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', () => {
      isPlanetDragging = false;
    });

    // Touch events for mobile screens
    gCanvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const rect = gCanvas.getBoundingClientRect();
        let mx = e.touches[0].clientX - rect.left;
        let my = e.touches[0].clientY - rect.top;
        let dist = Math.sqrt((mx - pX) ** 2 + (my - pY) ** 2);

        if (dist < 40) {
          isPlanetDragging = true;
          handlePlanetDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
      }
    });

    gCanvas.addEventListener('touchmove', (e) => {
      if (isPlanetDragging && e.touches.length > 0) {
        handlePlanetDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    });

    gCanvas.addEventListener('touchend', () => {
      isPlanetDragging = false;
    });

    // Redraw on inputs
    starMassInput.addEventListener('input', () => {
      if (!isPlanetDragging) {
        // Redo circular velocity calculations for current distance
        let starMass = parseFloat(starMassInput.value);
        let dx = starX - pX;
        let dy = starY - pY;
        let r = Math.sqrt(dx * dx + dy * dy);
        if (r > 15) {
          let vCirc = Math.sqrt((G * starMass) / r);
          pVx = (-dy / r) * vCirc;
          pVy = (dx / r) * vCirc;
        }
      }
      drawGravityScene();
    });

    planetMassInput.addEventListener('input', drawGravityScene);
  }

  // ==========================================
  // NOTEBOOK GRID HOVER TRAIL GENERATION
  // ==========================================
  const gridEffectContainer = document.getElementById('notebook-grid-effect');
  if (gridEffectContainer) {
    for (let i = 0; i < 100; i++) {
      const tile = document.createElement('div');
      tile.className = 'grid-tile';
      gridEffectContainer.appendChild(tile);
    }
  }

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPrologue);
} else {
  initPrologue();
}
