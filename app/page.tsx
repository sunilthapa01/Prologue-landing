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
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

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
      y: -60,
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
      boxShadow: '0 40px 80px rgba(30, 28, 26, 0.2)',
      duration: 1,
    }, 0.1);

    // Schematic active line flow
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
          scrub: 1.5,
        }
      });

      gsap.from('.node-group', {
        opacity: 0.3,
        scale: 0.95,
        stagger: 0.1,
        duration: 0.8,
        scrollTrigger: {
          trigger: archSection,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      });
    }

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

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistSubmitted(true);
  };

  return (
    <div ref={containerRef}>
      {/* ===================== NAVIGATION ===================== */}
      <nav className="nav-bar">
        <div className="nav-container">
          <a className="nav-logo-link" href="#" id="nav-logo">
            <svg viewBox="0 0 280 90" width="130" height="42" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Prologue Logo">
              <path d="M 22 7 C 58 7 76 22 76 45 C 76 68 58 83 22 83 Z" fill="#C93B2B"/>
              <rect x="10" y="5" width="16" height="80" rx="3" fill="#1E1C1A"/>
              <text x="94" y="60" fontFamily="Georgia, serif" fontSize="44" fill="#1E1C1A" letterSpacing="3" fontWeight="bold">Prologue</text>
            </svg>
          </a>
          <div className="nav-meta-tag">ISSUE NO. 01 / PEDAGOGICAL BLUEPRINT</div>
          <div className="nav-links">
            <a href="#problem" id="link-problem">The Cognitive Gap</a>
            <a href="#sandbox" id="link-sandbox">Interactive Sandbox</a>
            <a href="#pedagogy" id="link-pedagogy">Our Framework</a>
            <a href="#architecture" id="link-architecture">Architecture</a>
            <a href="#cta" className="nav-btn" id="link-cta">Enter the Platform</a>
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
            <a href="#cta" className="btn btn-secondary" id="hero-btn-reserve">Reserve Seat</a>
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
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(201, 59, 43, 0.08)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                  <circle cx="200" cy="200" r="80" fill="none" stroke="#C93B2B" strokeDasharray="4 4" strokeWidth="2" />
                  <line x1="200" y1="200" x2="256" y2="144" stroke="#1E1C1A" strokeWidth="2" />
                  <circle cx="256" cy="144" r="6" fill="#C93B2B" />
                  <text x="270" y="140" fontFamily="'DM Sans', sans-serif" fontSize="12" fill="#1E1C1A">r = 5.2 cm</text>
                  <text x="140" y="270" fontFamily="'DM Serif Display', serif" fontSize="18" fill="#1E1C1A">Interactive Geometry</text>
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
                  <span>Scroll to peel open</span>
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

      {/* ===================== SECTION: ARCHITECTURE BLUEPRINT ===================== */}
      <section className="section-architecture" id="architecture">
        <div className="architecture-container">
          <div className="arch-header">
            <div className="arch-meta">04 / CORE ARCHITECTURE</div>
            <h2 className="section-heading">Designed for zero-marginal cost.</h2>
            <p className="arch-sub">
              Generating live code for simulations is expensive. Our layered caching engine matches concepts and delivers responses in milliseconds at near-zero operating costs.
            </p>
          </div>

          {/* Schematic Grid */}
          <div className="arch-schematic">
            <svg className="schematic-svg" viewBox="0 0 800 300" width="100%" height="100%">
              {/* Flow Line path */}
              <path id="schematic-flow-line" d="M 50 150 L 170 150 M 290 150 L 410 150 M 530 150 L 650 150" fill="none" stroke="#DDD7CD" strokeWidth="2" />
              <path id="schematic-active-line" d="M 50 150 L 170 150 M 290 150 L 410 150 M 530 150 L 650 150" fill="none" stroke="#C93B2B" strokeWidth="2" strokeDasharray="800" strokeDashoffset="800" />
              
              {/* Node 1: Input */}
              <g className="node-group" transform="translate(50, 100)">
                <rect width="120" height="100" rx="8" fill="#F0EAE1" stroke="#DDD7CD" strokeWidth="1.5" />
                <text x="60" y="35" fontFamily="'DM Sans', sans-serif" fontWeight="bold" fontSize="12" fill="#1E1C1A" textAnchor="middle">Student Query</text>
                <text x="60" y="65" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#8F8880" textAnchor="middle">"What is a derivative?"</text>
                <circle cx="120" cy="50" r="4" fill="#C93B2B" />
              </g>

              {/* Node 2: Hive Local Cache */}
              <g className="node-group" transform="translate(210, 100)">
                <rect width="120" height="100" rx="8" fill="#F0EAE1" stroke="#DDD7CD" strokeWidth="1.5" />
                <text x="60" y="35" fontFamily="'DM Sans', sans-serif" fontWeight="bold" fontSize="12" fill="#1E1C1A" textAnchor="middle">Hive Cache</text>
                <text x="60" y="55" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#C93B2B" textAnchor="middle">&lt; 50ms (On-Device)</text>
                <text x="60" y="75" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#8F8880" textAnchor="middle">Layer 1</text>
                <circle cx="0" cy="50" r="4" fill="#C93B2B" />
                <circle cx="120" cy="50" r="4" fill="#C93B2B" />
              </g>

              {/* Node 3: PostgreSQL Cache */}
              <g className="node-group" transform="translate(370, 100)">
                <rect width="120" height="100" rx="8" fill="#F0EAE1" stroke="#DDD7CD" stroke-width="1.5" />
                <text x="60" y="35" fontFamily="'DM Sans', sans-serif" fontWeight="bold" fontSize="12" fill="#1E1C1A" textAnchor="middle">Postgres Cache</text>
                <text x="60" y="55" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#C93B2B" textAnchor="middle">&lt; 300ms (Database)</text>
                <text x="60" y="75" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#8F8880" text-anchor="middle">Layer 2</text>
                <circle cx="0" cy="50" r="4" fill="#C93B2B" />
                <circle cx="120" cy="50" r="4" fill="#C93B2B" />
              </g>

              {/* Node 4: Claude Sonnet Gen */}
              <g className="node-group" transform="translate(530, 100)">
                <rect width="120" height="100" rx="8" fill="#1E1C1A" stroke="#1E1C1A" strokeWidth="1.5" />
                <text x="60" y="35" fontFamily="'DM Sans', sans-serif" fontWeight="bold" fontSize="12" fill="#FAF7F2" textAnchor="middle">Sonnet Engine</text>
                <text x="60" y="55" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#FAF7F2" text-anchor="middle">New Generation</text>
                <text x="60" y="75" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#8F8880" text-anchor="middle">Layer 3 (Cache Miss)</text>
                <circle cx="0" cy="50" r="4" fill="#C93B2B" />
                <circle cx="120" cy="50" r="4" fill="#C93B2B" />
              </g>

              {/* Node 5: Render */}
              <g className="node-group" transform="translate(690, 100)">
                <rect width="90" height="100" rx="8" fill="#F0EAE1" stroke="#DDD7CD" strokeWidth="1.5" />
                <text x="45" y="45" fontFamily="'DM Sans', sans-serif" fontWeight="bold" fontSize="12" fill="#1E1C1A" text-anchor="middle">Live Visual</text>
                <text x="45" y="65" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#C93B2B" text-anchor="middle">Interactive</text>
                <circle cx="0" cy="50" r="4" fill="#C93B2B" />
              </g>
            </svg>
          </div>

          {/* Cost Table & System details */}
          <div className="architecture-specs">
            <div className="spec-text">
              <h4>The Four-Layer System</h4>
              <p>
                By caching visual HTML templates keyed by a normalized semantic hash (SHA-256), a request for standard educational concepts (e.g., cell division, gravitational orbits) is generated only once. All subsequent students query the database cache directly, reducing API calls and cost by over 98%.
              </p>
            </div>
            <div className="cost-matrix">
              <div className="cost-header">PROLOGUE RUNTIME COSTS</div>
              <div className="cost-row">
                <span>Cache Hit (On-device)</span>
                <span className="cost-price">$0.0000</span>
              </div>
              <div className="cost-row">
                <span>Cache Hit (PostgreSQL / Edge)</span>
                <span className="cost-price">$0.0004</span>
              </div>
              <div className="cost-row">
                <span>Prompt Cache Hit (Anthropic)</span>
                <span className="cost-price">$0.0120</span>
              </div>
              <div className="cost-row">
                <span>Full Generation (Cache Miss)</span>
                <span className="cost-price" style={{ color: '#C93B2B' }}>$0.0240</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION: CONTENT SAFETY AUDIT ===================== */}
      <section className="section-problem" id="safety" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="grid-container">
          <div className="sticky-column">
            <div className="problem-meta">05 / AUDIT TRAIL</div>
            <h2 className="section-heading">Content safety by architectural design.</h2>
            <p className="problem-lead">
              Every query undergoes a high-speed classification pass. If a query aims to cheat on an exam or bypass homework rules, the system logs it and shifts back to conceptual illustrations.
            </p>
          </div>
          <div className="scrolling-column">
            <div className="audit-panel">
              <div className="audit-header">LIVE AUDIT LOG / LEVEL 1 &amp; 2 DECODERS</div>
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Intercepted Prompt</th>
                    <th>Classification</th>
                    <th>System Response</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>14:13:21</td>
                    <td>"Write my essay about the cold war"</td>
                    <td>Academic Cheat Attempt</td>
                    <td className="status-blocked">BLOCKED</td>
                  </tr>
                  <tr>
                    <td>14:14:45</td>
                    <td>"Explain cellular respiration slider"</td>
                    <td>Educational / Biology</td>
                    <td className="status-allowed">ALLOWED</td>
                  </tr>
                  <tr>
                    <td>14:16:10</td>
                    <td>"Give me answer key to exam paper"</td>
                    <td>Malicious / Exam Cheat</td>
                    <td className="status-blocked">BLOCKED</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                  <button type="submit" className="btn btn-primary btn-block" id="form-submit-btn">Reserve Waitlist Spot</button>
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
              <a href="#architecture">Caching Specs</a>
              <a href="#safety">Content Safety</a>
              <a href="https://github.com/notnishant" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
            <div className="footer-col">
              <h5>Legal</h5>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Institutional Terms</a>
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
