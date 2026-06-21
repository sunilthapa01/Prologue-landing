'use client';

import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import DerivativeSimulation from '../components/DerivativeSimulation';
import GravitySimulation from '../components/GravitySimulation';
import InteractiveGridTrail from '../components/InteractiveGridTrail';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'derivative' | 'gravity'>('derivative');
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistRole, setWaitlistRole] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(() =>
    typeof window !== 'undefined' && !!localStorage.getItem('prologue_waitlist_submitted')
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [activeConcept, setActiveConcept] = useState<'gravity' | 'goldenRatio' | 'printingPress'>('gravity');

  const conceptData = {
    gravity: {
      title: 'Gravity',
      subjects: {
        physics: { hook: 'Force & Orbits', desc: 'Understand forces, orbital motion, and gravitational fields.' },
        astronomy: { hook: 'Black Holes', desc: 'Trace the birth of stars, galaxies, and black holes.' },
        mathematics: { hook: 'Calculus of Curves', desc: 'Express curves using Newton\'s calculus and differential equations.' },
        philosophy: { hook: 'The Pinned Universe', desc: 'Inquire about determinism and the clockwork universe model.' },
        design: { hook: 'Visual Weight & Mass', desc: 'Visualize structural balance, weight distribution, and mass.' },
        computerScience: { hook: 'Physics Engines', desc: 'Simulate particle physics and N-body collisions in code.' },
        psychology: { hook: 'Perceiving Balance', desc: 'Study spatial perception and how humans feel balance and weight.' },
        history: { hook: 'Newton\'s Apple', desc: 'Understand Newton\'s plague-year discovery and Einstein\'s relativity leap.' },
      }
    },
    goldenRatio: {
      title: 'Golden Ratio',
      subjects: {
        physics: { hook: 'Spiral Hurricanes', desc: 'Discover patterns in spiral hurricanes and crystal structures.' },
        astronomy: { hook: 'Planetary Harmony', desc: 'Explore orbital resonances and planetary alignments.' },
        mathematics: { hook: 'Fibonacci Sequence', desc: 'Analyze the Fibonacci sequence and infinite nested fractions.' },
        philosophy: { hook: 'Theory of Beauty', desc: 'Contemplate aesthetic theories, natural harmony, and beauty.' },
        design: { hook: 'The Divine Grid', desc: 'Apply the divine proportion to layouts, grids, and typography.' },
        computerScience: { hook: 'Golden Section Search', desc: 'Optimize search algorithms using golden section methods.' },
        psychology: { hook: 'Symmetry Preference', desc: 'Examine human preferences for facial and architectural symmetry.' },
        history: { hook: 'Renaissance Masterpieces', desc: 'Trace usage from Greek architecture to Renaissance masterpieces.' },
      }
    },
    printingPress: {
      title: 'Printing Press',
      subjects: {
        physics: { hook: 'Optics & Lenses', desc: 'Develop optical lenses for typesetting and press machinery.' },
        astronomy: { hook: 'Planetary Tables', desc: 'Distribute planetary tables and Kepler\'s astronomical treatises.' },
        mathematics: { hook: 'Grid Geometry', desc: 'Standardize geometric typeface design and typesetting grids.' },
        philosophy: { hook: 'The Enlightenment', desc: 'Observe the rise of individualism, rationalism, and the Enlightenment.' },
        design: { hook: 'Typography Systems', desc: 'Evolve grid systems, typeface anatomy, and page proportions.' },
        computerScience: { hook: 'Text & Hashing', desc: 'Pioneer text encoding, data storage, and Gutenberg hashing.' },
        psychology: { hook: 'The Literate Mind', desc: 'Study how literacy reshaped memory, learning, and human cognition.' },
        history: { hook: 'Information Age 1.0', desc: 'Examine the shift from handwritten manuscripts to mass information.' },
      }
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Scroll-driven book peeling
    const tlHero = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '+=150%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });

    tlHero.to('.hero-container', {
      opacity: 0,
      y: -100,
      duration: 0.5,
    }, 0);

    tlHero.to('#notebook-page-front', {
      rotateY: -140,
      opacity: 0.1,
      ease: 'power1.inOut',
      duration: 1,
    }, 0.1);

    tlHero.to('.notebook-shell', {
      scale: 1.05,
      y: -360,
      boxShadow: '0 40px 80px rgba(30, 28, 26, 0.2)',
      duration: 1,
    }, 0.1);

    // Concept Map animations are handled reactively in a separate hook below to prevent scroll-pin issues.

    // Heading fade-ins
    gsap.utils.toArray('.section-heading').forEach((heading: any) => {
      gsap.from(heading, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: {
          trigger: heading,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      });
    });
  }, { scope: containerRef });

  useGSAP(() => {
    // Stagger cards entrance whenever activeConcept changes
    gsap.fromTo('.subject-card',
      { opacity: 0, y: 20, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.5, ease: 'power2.out', overwrite: 'auto' }
    );
    
    // Quick elastic scale on the central orb
    gsap.fromTo('.central-orb',
      { scale: 0.9 },
      { scale: 1, duration: 0.5, ease: 'back.out(1.8)', overwrite: 'auto' }
    );

    // Fade in background connecting lines
    gsap.fromTo('.concept-map-backdrop-svg path',
      { opacity: 0.2 },
      { opacity: 1, duration: 0.8, stagger: 0.03, ease: 'power1.out', overwrite: 'auto' }
    );
  }, { dependencies: [activeConcept], scope: containerRef });

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: waitlistName, email: waitlistEmail, role: waitlistRole }),
      });
      if (!res.ok) throw new Error('server');
      localStorage.setItem('prologue_waitlist_submitted', '1');
      setWaitlistSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={containerRef}>
      {/* ===================== NAVIGATION ===================== */}
      <nav className="nav-bar">
        <div className="nav-container">
          <a className="nav-logo-link" href="#" id="nav-logo">
            <svg viewBox="0 0 280 90" width="130" height="42" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Prologue Logo">
              <path d="M 22 7 C 58 7 76 22 76 45 C 76 68 58 83 22 83 Z" fill="var(--vermillion)"/>
              <rect x="10" y="5" width="16" height="80" rx="3" fill="var(--ink)"/>
              <text x="94" y="60" fontFamily="Georgia, serif" fontSize="44" fill="var(--ink)" letterSpacing="3" fontWeight="bold">Prologue</text>
            </svg>
          </a>
          <div className="nav-links">
            <a href="#safety" id="link-how">How It Works</a>
            <a href="#sandbox" id="link-explore">Explore</a>
            <a href="#pedagogy" id="link-why">Why Prologue</a>
          </div>
          <div className="nav-actions">
            <a href="https://app.prologuelearn.com/login" className="nav-login" id="link-login">Log In</a>
            <a href="https://app.prologuelearn.com/signup" className="nav-btn" id="link-cta">Get Started</a>
          </div>
        </div>
      </nav>

      {/* ===================== HERO SECTION ===================== */}
      <header className="section-hero" id="hero">
        <div className="hero-container">
          <div className="hero-meta">PROLOGUE ESSAYS / SPRING 2026</div>
          <h1 className="hero-title">We don't solve problems.<br />We show you what they look like.</h1>
          <p className="hero-subtitle">
            For the student who stares at a block of static text, hoping it will suddenly make sense. Prologue builds responsive, interactive environments you can touch, stretch, and break. Understand anything by exploring it.
          </p>
          <div className="hero-cta-group">
            <a href="#sandbox" className="btn btn-primary btn-inquiry" id="hero-btn-explore">
              <span className="btn-glare-shimmer">
                <svg className="btn-graph-canvas" viewBox="0 0 190 52">
                  <path className="graph-curve" d="M 10 38 Q 50 10, 100 28 T 190 12" fill="none" stroke="rgba(250, 247, 242, 0.25)" strokeWidth="2" />
                  <circle className="graph-point" r="4" fill="#FAF7F2" />
                </svg>
              </span>
              <span className="btn-text">Begin the Inquiry</span>
            </a>
            <a href="https://app.prologuelearn.com/signup" className="btn btn-secondary" id="hero-btn-reserve">Reserve Seat</a>
          </div>
        </div>

        {/* The interactive book page turn visual system */}
        <div className="hero-notebook-viewport">
          <div className="notebook-shell" id="notebook-trigger">
            <div className="notebook-page back-page">
              <div className="simulation-reveal-preview">
                <svg className="preview-svg-grid" viewBox="0 0 400 400" width="100%" height="100%">
                  <defs>
                    <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(212, 71, 42, 0.15)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                  <circle cx="200" cy="200" r="80" fill="none" stroke="var(--vermillion)" strokeDasharray="4 4" strokeWidth="2" />
                  <line x1="200" y1="200" x2="256" y2="144" stroke="var(--ink)" strokeWidth="2" />
                  <circle cx="256" cy="144" r="6" fill="var(--vermillion)" />
                  <text x="270" y="140" fontFamily="'DM Sans', sans-serif" fontSize="12" fill="var(--ink)">r = 5.2 cm</text>
                  <text x="140" y="270" fontFamily="'DM Serif Display', serif" fontSize="18" fill="var(--ink)">Interactive Geometry</text>
                </svg>
              </div>
            </div>
            <div className="notebook-page front-page" id="notebook-page-front">
              <InteractiveGridTrail />

              <div className="front-page-content">
                <div className="notebook-header">
                  <span className="nb-label">MODULE 12</span>
                  <span className="nb-date">APRIL 2026</span>
                </div>
                <h3 className="notebook-title">The Limit of static pages</h3>
                <p className="notebook-excerpt">
                  For four hundred years, education lived on sheets of paper. We drew three-dimensional coordinate fields on flat planes. We wrote formulas representing acceleration, and expected minds to mentally simulate the motion. Today, we replace static representation with living, interactive models.
                </p>
                <div className="notebook-peel-indicator">
                  <div className="arrow-down"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== SECTION: THE COGNITIVE GAP ===================== */}
      <section className="section-problem" id="problem">
        <div className="grid-container">
          <div className="sticky-column">
            <div className="problem-meta">01 / THE COGNITIVE GAP</div>
            <h2 className="section-heading">Why textbooks fail active minds.</h2>
            <p className="problem-lead">
              A static diagram requires mental simulation. You have to imagine how a variable behaves. This creates a massive cognitive burden. Interactive visuals shift that burden from the student to the platform.
            </p>
          </div>
          <div className="scrolling-column">
            {/* Row 1: Traditional textbook */}
            <div className="comparison-card">
              <div className="card-eyebrow">Traditional Textbook</div>
              <h4 className="card-title">Three paragraphs of dry notation</h4>
              <p className="card-desc">
                "Let a derivative be defined as the limit of the difference quotient as h approaches zero..." A formula is memorized for the exam, but the actual geometric meaning is entirely lost.
              </p>
              <div className="mock-ui text-mock">
                <div className="mock-line"></div>
                <div className="mock-line"></div>
                <div className="mock-line half"></div>
              </div>
            </div>
            
            {/* Row 2: Video Lecture */}
            <div className="comparison-card">
              <div className="card-eyebrow">Passive Video</div>
              <h4 className="card-title">A six-minute passive timeline</h4>
              <p className="card-desc">
                You watch a teacher draw lines on a digital whiteboard. You nod along, but your brain remains in receiver mode. Ten minutes later, you cannot reproduce the logic.
              </p>
              <div className="mock-ui video-mock">
                <div className="video-play-btn"></div>
                <div className="video-timeline"><div className="video-progress"></div></div>
              </div>
            </div>

            {/* Row 3: Answer Machines (SaaS AI) */}
            <div className="comparison-card">
              <div className="card-eyebrow">Answer Machines</div>
              <h4 className="card-title">Instant solution, zero comprehension</h4>
              <p className="card-desc">
                SaaS chatbots spit out step-by-step solutions instantly. You copy-paste it to finish your homework. You get the grade, but your understanding is non-existent.
              </p>
              <div className="mock-ui ai-mock">
                <div className="chat-bubble user">Solve x^2 - 4 = 0</div>
                <div className="chat-bubble ai">The answers are x = 2 and x = -2. Here are the steps...</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION: INTERACTIVE SANDBOX ===================== */}
      <section className="section-sandbox" id="sandbox">
        <div className="sandbox-header center">
          <div className="sandbox-meta">02 / EXPERIMENTAL ENVIRONMENT</div>
          <h2 className="section-heading">The Interactive Playground</h2>
          <p className="section-sub">
            Interact directly with these real-time models. Drag elements and watch how the equations calculate instantly in response.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="sandbox-tabs">
          <button 
            className={`tab-btn ${activeTab === 'derivative' ? 'active' : ''}`} 
            onClick={() => setActiveTab('derivative')}
          >
            The Tangent Line (Math)
          </button>
          <button 
            className={`tab-btn ${activeTab === 'gravity' ? 'active' : ''}`} 
            onClick={() => setActiveTab('gravity')}
          >
            Newtonian Gravity (Physics)
          </button>
        </div>

        {/* Simulation Workspace */}
        <div className="sandbox-workspace">
          {activeTab === 'derivative' ? (
            <DerivativeSimulation />
          ) : (
            <GravitySimulation />
          )}
        </div>
      </section>

      {/* ===================== SECTION: PEDAGOGICAL INTEGRITY ===================== */}
      <section className="section-pedagogy" id="pedagogy">
        <div className="pedagogy-container">
          <div className="pedagogy-statement-block">
            <div className="pedagogy-meta">03 / PEDAGOGICAL CORE</div>
            <h2 className="pedagogy-large-statement">
              We are structurally incapable of completing a student's homework.
            </h2>
            <p className="pedagogy-supporting-text">
              Traditional learning tools solve questions for students, fostering dependency. Prologue does the opposite: it generates custom visual models. The student holds the controls and makes the final conclusions.
            </p>
          </div>

          <div className="framework-grid">
            {/* Feature 1 */}
            <div className="framework-feature">
              <div className="feature-num">01</div>
              <h4 className="feature-title">Predict-Then-Check</h4>
              <p className="feature-body">
                Before the simulation snaps into its final state, the student manipulates a ghost element to predict where the regression line falls or the equilibrium shifts. Committing to an outcome first increases memory retention by 4x.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="framework-feature">
              <div className="feature-num">02</div>
              <h4 className="feature-title">Scaffolded Fading</h4>
              <p className="feature-body">
                Early visual sessions offer guided highlights and explanations. As the student demonstrates conceptual growth, the hints are quietly scaled back. Support is present when they stumble, and absent once they fly.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="framework-feature">
              <div className="feature-num">03</div>
              <h4 className="feature-title">Companion Explanations</h4>
              <p className="feature-body">
                Each visual comes with a brief, contextual explanation. Instead of generic textbook definitions, it guides the student on what controls to drag, showing them exactly where to focus their attention to feel the concept.
              </p>
            </div>
          </div>

          {/* Comparison Matrix */}
          <div className="comparison-matrix-container">
            <h3 className="comparison-title">A Different Class of Tool</h3>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Capability</th>
                  <th>Static Courseware</th>
                  <th>ChatGPT / Gemini</th>
                  <th>Prologue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="feature-col">Concept Coverage</td>
                  <td>Pre-built lessons only</td>
                  <td>Text answers only</td>
                  <td className="prologue-cell">Any academic topic</td>
                </tr>
                <tr>
                  <td className="feature-col">Interaction Type</td>
                  <td>Passive reading / video</td>
                  <td>Boring chatbot prompt</td>
                  <td className="prologue-cell">Draggable simulations</td>
                </tr>
                <tr>
                  <td className="feature-col">Cheating Vulnerability</td>
                  <td>Quiz answer keys leaked</td>
                  <td>Highly vulnerable</td>
                  <td className="prologue-cell">Zero (no solutions given)</td>
                </tr>
                <tr>
                  <td className="feature-col">Custom Gen Speed</td>
                  <td>Static (cannot scale)</td>
                  <td>Fast but text-only</td>
                  <td className="prologue-cell">Infinite live SVG outputs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===================== SECTION: CONCEPT MAP ===================== */}
      <section className="section-concept-map" id="concept-map">
        <div className="concept-map-container">
          <div className="arch-header">
            <div className="arch-meta">04 / INTERDISCIPLINARY WEB</div>
            <h2 className="section-heading">Understand anything in context.</h2>
            <p className="arch-sub">
              Concepts do not live in isolation. Prologue maps the connections between disciplines, letting you trace how a single idea branches into mathematics, design, physics, or philosophy.
            </p>
          </div>

          <div className="concept-selectors">
            <button 
              className={`selector-btn ${activeConcept === 'gravity' ? 'active' : ''}`} 
              onClick={() => setActiveConcept('gravity')}
            >
              Gravity
            </button>
            <button 
              className={`selector-btn ${activeConcept === 'goldenRatio' ? 'active' : ''}`} 
              onClick={() => setActiveConcept('goldenRatio')}
            >
              Golden Ratio
            </button>
            <button 
              className={`selector-btn ${activeConcept === 'printingPress' ? 'active' : ''}`} 
              onClick={() => setActiveConcept('printingPress')}
            >
              Printing Press
            </button>
          </div>

          <div className="concept-map-visual">
            {/* SVG Backdrop connecting lines */}
            <svg className="concept-map-backdrop-svg" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Concentric orbit lines */}
              <circle cx="500" cy="300" r="140" stroke="rgba(201, 59, 43, 0.12)" strokeWidth="1" />
              <circle cx="500" cy="300" r="240" stroke="rgba(201, 59, 43, 0.08)" strokeWidth="1" strokeDasharray="6,6" />
              <circle cx="500" cy="300" r="340" stroke="rgba(201, 59, 43, 0.04)" strokeWidth="1" />
              
              {/* Connecting paths */}
              <path d="M 500 300 L 500 70" stroke="rgba(201, 59, 43, 0.12)" strokeWidth="1.5" strokeDasharray="4,4" />
              <path d="M 500 300 L 780 150" stroke="rgba(201, 59, 43, 0.12)" strokeWidth="1.5" strokeDasharray="4,4" />
              <path d="M 500 300 L 860 300" stroke="rgba(201, 59, 43, 0.12)" strokeWidth="1.5" strokeDasharray="4,4" />
              <path d="M 500 300 L 780 450" stroke="rgba(201, 59, 43, 0.12)" strokeWidth="1.5" strokeDasharray="4,4" />
              <path d="M 500 300 L 500 530" stroke="rgba(201, 59, 43, 0.12)" strokeWidth="1.5" strokeDasharray="4,4" />
              <path d="M 500 300 L 220 450" stroke="rgba(201, 59, 43, 0.12)" strokeWidth="1.5" strokeDasharray="4,4" />
              <path d="M 500 300 L 140 300" stroke="rgba(201, 59, 43, 0.12)" strokeWidth="1.5" strokeDasharray="4,4" />
              <path d="M 500 300 L 220 150" stroke="rgba(201, 59, 43, 0.12)" strokeWidth="1.5" strokeDasharray="4,4" />

              {/* Dotted nodes */}
              <circle cx="500" cy="180" r="5" fill="var(--vermillion)" />
              <circle cx="640" cy="225" r="5" fill="var(--vermillion)" />
              <circle cx="680" cy="300" r="5" fill="var(--vermillion)" />
              <circle cx="640" cy="375" r="5" fill="var(--vermillion)" />
              <circle cx="500" cy="420" r="5" fill="var(--vermillion)" />
              <circle cx="360" cy="375" r="5" fill="var(--vermillion)" />
              <circle cx="320" cy="300" r="5" fill="var(--vermillion)" />
              <circle cx="360" cy="225" r="5" fill="var(--vermillion)" />
            </svg>

            {/* Glowing backdrop behind central orb */}
            <div className="orb-glow"></div>

            {/* Center Orb */}
            <div className="central-orb-container">
              <div className="central-orb">
                <span className="orb-eyebrow">Core Concept</span>
                <span className="orb-title">{conceptData[activeConcept].title}</span>
              </div>
            </div>

            {/* Surrounding Cards container */}
            <div className="concept-cards-grid">
              {/* Physics */}
              <div 
                className="subject-card card-physics"
                style={{ '--card-glow-color': '#c93b2b', '--card-bg-light': '#fceceb' } as React.CSSProperties}
              >
                <div className="subject-card-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#c93b2b" strokeWidth="2.5" fill="none">
                    <circle cx="12" cy="12" r="3"/>
                    <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(30, 12, 12)"/>
                    <ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(-30, 12, 12)"/>
                  </svg>
                </div>
                <div className="subject-card-info">
                  <span className="subject-card-title">Physics</span>
                  <div key={activeConcept} className="subject-card-desc">
                    <strong className="subject-card-hook">{conceptData[activeConcept].subjects.physics.hook}</strong>
                    <p className="subject-card-text">{conceptData[activeConcept].subjects.physics.desc}</p>
                  </div>
                </div>
              </div>

              {/* Astronomy */}
              <div 
                className="subject-card card-astronomy"
                style={{ '--card-glow-color': '#1d83e0', '--card-bg-light': '#e6f3ff' } as React.CSSProperties}
              >
                <div className="subject-card-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#1d83e0" strokeWidth="2.5" fill="none">
                    <circle cx="12" cy="12" r="6"/>
                    <path d="M 4 15 C 8 18 16 18 20 15" transform="rotate(-15, 12, 12)"/>
                  </svg>
                </div>
                <div className="subject-card-info">
                  <span className="subject-card-title">Astronomy</span>
                  <div key={activeConcept} className="subject-card-desc">
                    <strong className="subject-card-hook">{conceptData[activeConcept].subjects.astronomy.hook}</strong>
                    <p className="subject-card-text">{conceptData[activeConcept].subjects.astronomy.desc}</p>
                  </div>
                </div>
              </div>

              {/* History */}
              <div 
                className="subject-card card-history"
                style={{ '--card-glow-color': '#e66a15', '--card-bg-light': '#fff3eb' } as React.CSSProperties}
              >
                <div className="subject-card-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#e66a15" strokeWidth="2.5" fill="none">
                    <line x1="3" y1="20" x2="21" y2="20"/>
                    <line x1="4" y1="6" x2="20" y2="6"/>
                    <path d="M 4 6 L 12 2 L 20 6"/>
                    <line x1="6" y1="6" x2="6" y2="20"/>
                    <line x1="10" y1="6" x2="10" y2="20"/>
                    <line x1="14" y1="6" x2="14" y2="20"/>
                    <line x1="18" y1="6" x2="18" y2="20"/>
                  </svg>
                </div>
                <div className="subject-card-info">
                  <span className="subject-card-title">History</span>
                  <div key={activeConcept} className="subject-card-desc">
                    <strong className="subject-card-hook">{conceptData[activeConcept].subjects.history.hook}</strong>
                    <p className="subject-card-text">{conceptData[activeConcept].subjects.history.desc}</p>
                  </div>
                </div>
              </div>

              {/* Philosophy */}
              <div 
                className="subject-card card-philosophy"
                style={{ '--card-glow-color': '#7c3aed', '--card-bg-light': '#f5f0ff' } as React.CSSProperties}
              >
                <div className="subject-card-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#7c3aed" strokeWidth="2.5" fill="none">
                    <path d="M 12 2 C 7.5 2 4 5.5 4 10 C 4 13.5 6 15 7 16 L 8 20 H 16 L 17 16 C 18 15 20 13.5 20 10 C 20 5.5 16.5 2 12 2 Z"/>
                    <circle cx="12" cy="10" r="2"/>
                  </svg>
                </div>
                <div className="subject-card-info">
                  <span className="subject-card-title">Philosophy</span>
                  <div key={activeConcept} className="subject-card-desc">
                    <strong className="subject-card-hook">{conceptData[activeConcept].subjects.philosophy.hook}</strong>
                    <p className="subject-card-text">{conceptData[activeConcept].subjects.philosophy.desc}</p>
                  </div>
                </div>
              </div>

              {/* Design */}
              <div 
                className="subject-card card-design"
                style={{ '--card-glow-color': '#ec4899', '--card-bg-light': '#fdf2f8' } as React.CSSProperties}
              >
                <div className="subject-card-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#ec4899" strokeWidth="2.5" fill="none">
                    <path d="M 12 2 L 20 7 L 20 17 L 12 22 L 4 17 L 4 7 Z"/>
                    <line x1="12" y1="2" x2="12" y2="22"/>
                    <line x1="4" y1="7" x2="12" y2="12"/>
                    <line x1="20" y1="7" x2="12" y2="12"/>
                  </svg>
                </div>
                <div className="subject-card-info">
                  <span className="subject-card-title">Design</span>
                  <div key={activeConcept} className="subject-card-desc">
                    <strong className="subject-card-hook">{conceptData[activeConcept].subjects.design.hook}</strong>
                    <p className="subject-card-text">{conceptData[activeConcept].subjects.design.desc}</p>
                  </div>
                </div>
              </div>

              {/* Computer Science */}
              <div 
                className="subject-card card-cs"
                style={{ '--card-glow-color': '#10b981', '--card-bg-light': '#ecfdf5' } as React.CSSProperties}
              >
                <div className="subject-card-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#10b981" strokeWidth="2.5" fill="none">
                    <path d="M 8 6 L 2 12 L 8 18"/>
                    <path d="M 16 6 L 22 12 L 16 18"/>
                    <line x1="14" y1="4" x2="10" y2="20"/>
                  </svg>
                </div>
                <div className="subject-card-info">
                  <span className="subject-card-title">Computer Science</span>
                  <div key={activeConcept} className="subject-card-desc">
                    <strong className="subject-card-hook">{conceptData[activeConcept].subjects.computerScience.hook}</strong>
                    <p className="subject-card-text">{conceptData[activeConcept].subjects.computerScience.desc}</p>
                  </div>
                </div>
              </div>

              {/* Psychology */}
              <div 
                className="subject-card card-psychology"
                style={{ '--card-glow-color': '#ef4444', '--card-bg-light': '#fef2f2' } as React.CSSProperties}
              >
                <div className="subject-card-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#ef4444" strokeWidth="2.5" fill="none">
                    <path d="M 12 5 C 9 2 4 3 4 8 C 4 12 8 14 12 19 C 16 14 20 12 20 8 C 20 3 15 2 12 5 Z"/>
                  </svg>
                </div>
                <div className="subject-card-info">
                  <span className="subject-card-title">Psychology</span>
                  <div key={activeConcept} className="subject-card-desc">
                    <strong className="subject-card-hook">{conceptData[activeConcept].subjects.psychology.hook}</strong>
                    <p className="subject-card-text">{conceptData[activeConcept].subjects.psychology.desc}</p>
                  </div>
                </div>
              </div>

              {/* Mathematics */}
              <div 
                className="subject-card card-mathematics"
                style={{ '--card-glow-color': '#8a4fff', '--card-bg-light': '#f3efff' } as React.CSSProperties}
              >
                <div className="subject-card-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#8a4fff" strokeWidth="2.5" fill="none">
                    <circle cx="6" cy="6" r="2"/>
                    <circle cx="18" cy="18" r="2"/>
                    <circle cx="6" cy="18" r="2"/>
                    <circle cx="18" cy="6" r="2"/>
                    <line x1="8" y1="8" x2="16" y2="16"/>
                    <line x1="8" y1="16" x2="16" y2="8"/>
                  </svg>
                </div>
                <div className="subject-card-info">
                  <span className="subject-card-title">Mathematics</span>
                  <div key={activeConcept} className="subject-card-desc">
                    <strong className="subject-card-hook">{conceptData[activeConcept].subjects.mathematics.hook}</strong>
                    <p className="subject-card-text">{conceptData[activeConcept].subjects.mathematics.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION: HOW IT WORKS ===================== */}
      <section className="section-how" id="safety">
        <div className="how-inner">

          <div className="how-label">05 / HOW IT WORKS</div>
          <h2 className="how-heading">From question to understanding<br />in three steps.</h2>

          <div className="how-steps">

            <div className="how-step">
              <div className="how-num">01</div>
              <div className="how-step-divider"></div>
              <h4 className="how-step-title">Ask anything.</h4>
              <p className="how-step-desc">
                Type any concept from your syllabus — a chapter, a formula, a historical event. No special syntax needed.
              </p>
            </div>

            <div className="how-step-connector">
              <svg viewBox="0 0 60 12" width="60" height="12" fill="none">
                <path d="M 0 6 L 52 6 M 46 2 L 52 6 L 46 10" stroke="rgba(250,247,242,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="how-step">
              <div className="how-num">02</div>
              <div className="how-step-divider"></div>
              <h4 className="how-step-title">Get a live model.</h4>
              <p className="how-step-desc">
                Prologue generates a custom draggable simulation — not a video, not a wall of text. A living visual you can touch.
              </p>
            </div>

            <div className="how-step-connector">
              <svg viewBox="0 0 60 12" width="60" height="12" fill="none">
                <path d="M 0 6 L 52 6 M 46 2 L 52 6 L 46 10" stroke="rgba(250,247,242,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="how-step">
              <div className="how-num">03</div>
              <div className="how-step-divider"></div>
              <h4 className="how-step-title">Learn by doing.</h4>
              <p className="how-step-desc">
                Drag elements, change variables, break the system. The concept clicks when you feel it, not when you read it.
              </p>
            </div>

          </div>

          <div className="how-footer-strip">
            <span className="how-footer-text">No answers. No shortcuts. Just understanding.</span>
            <a href="https://app.prologuelearn.com/signup" className="how-cta-link">Reserve your seat &rarr;</a>
          </div>

        </div>
      </section>

      {/* ===================== SECTION: CTA / JOIN WAITLIST ===================== */}
      <section className="section-cta" id="cta">
        <div className="cta-inner">
          <div className="cta-grid">
            <div className="cta-copy">
              <div className="cta-meta font-serif">Inquiry No. 1</div>
              <h2 className="cta-heading">Enter the Next Chapter.</h2>
              <p className="cta-sub">
                Join the waitlist to receive access to the active learning workbook. Discover the difference between reading and understanding.
              </p>
            </div>
            <div className="cta-form-container">
              {waitlistSubmitted ? (
                <div className="waitlist-success-message">
                  <h4>Thank You.</h4>
                  <p>Your spot has been reserved. We will reach out to <strong>{waitlistEmail}</strong> shortly.</p>
                </div>
              ) : (
                <form className="cta-form" id="waitlist-form" onSubmit={handleWaitlistSubmit}>
                  <div className="form-group">
                    <label htmlFor="student-name">Your Name</label>
                    <input 
                      type="text" 
                      id="student-name" 
                      placeholder="E.g., Alan Turing" 
                      value={waitlistName}
                      onChange={(e) => setWaitlistName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="student-email">Email Address</label>
                    <input 
                      type="email" 
                      id="student-email" 
                      placeholder="E.g., alan@domain.edu" 
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="student-role">Learning Role</label>
                    <select 
                      id="student-role" 
                      value={waitlistRole}
                      onChange={(e) => setWaitlistRole(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select your profile</option>
                      <option value="student">Student</option>
                      <option value="educator">Educator / Teacher</option>
                      <option value="parent">Parent</option>
                      <option value="administrator">School Administrator</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block" id="form-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Reserve Waitlist Spot'}
                  </button>
                  {submitError && (
                    <div id="form-error" style={{ marginTop: 16, padding: '12px 16px', borderRadius: 4, fontSize: '0.9rem', fontWeight: 500, textAlign: 'center', background: 'rgba(201,59,43,0.12)', border: '1px solid rgba(201,59,43,0.3)', color: '#C93B2B' }}>
                      Something went wrong — please try again.
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <svg viewBox="0 0 280 90" width="130" height="42" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Prologue Logo Footer">
              <path d="M 22 7 C 58 7 76 22 76 45 C 76 68 58 83 22 83 Z" fill="#C93B2B"/>
              <rect x="10" y="5" width="16" height="80" rx="3" fill="#FAF7F2"/>
              <text x="94" y="60" fontFamily="Georgia, serif" fontSize="44" fill="#FAF7F2" letterSpacing="3" fontWeight="bold">Prologue</text>
            </svg>
            <p className="footer-motto">
              "Don't read it. Touch it."
            </p>
          </div>
          
          <div className="footer-links-grid">
            <div className="footer-col">
              <h5>Core System</h5>
              <a href="#problem">The Cognitive Gap</a>
              <a href="#sandbox">Interactive Sandbox</a>
              <a href="#pedagogy">Framework</a>
            </div>
            <div className="footer-col">
              <h5>Architecture</h5>
              <a href="#concept-map">Interdisciplinary Web</a>
              <a href="#safety">How It Works</a>
            </div>
            <div className="footer-col">
              <h5>Legal</h5>
              <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              <a href="/terms.html" target="_blank" rel="noopener noreferrer">Terms of Service</a>
              <a href="/institutional-terms.html" target="_blank" rel="noopener noreferrer">Institutional Terms</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-container">
            <span>© 2026 Prologue, Inc. All rights reserved. Created by notnishant.</span>
            <span>Issue No. 01 / April 2026 / Version 1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
