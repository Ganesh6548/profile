import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import SnakeGame from './SnakeGame';

/* ============================================================
   VERCEL BLOB URLS
   ============================================================ */
const VIDEO_URL = 'https://aelxhrtr539redcp.public.blob.vercel-storage.com/150155_clean_1790524427344.mp4';

/* If you have a SEPARATE clip for the head/character, paste it here.
   If it's the same video, leave this as-is. */
const RIG_VIDEO_URL = VIDEO_URL;

/* Video for the games button in the nav */
const GAME_VIDEO_URL = 'https://aelxhrtr539redcp.public.blob.vercel-storage.com/150759.mp4';

const RESUME_URL = 'https://aelxhrtr539redcp.public.blob.vercel-storage.com/Ganesh_V_Resume_SOC_Analyst.pdf';

const CERTS = [
  'AICTE Internship — Data Analysis with LLM',
  'Coursera — Certified Information Security Manager (CISM)',
  'NPTEL — Java Certification',
  'Cognitive Class — SQL Certification',
  'Coursera — Data Analyst Professional Track',
  'Coursera — Cybersecurity Specialization',
  'Scaler — Java Certification',
  'Great Learning — Excel for Data Analysis',
  'Coursera — Ethical Hacking Certification',
  'Cisco — Networking & Cybersecurity / CCNA',
  'IAHV — Internship Certification',
  'Forage — Data Science Job Simulation',
  'Google — Foundations of Cybersecurity',
  'Google — Connect & Protect: Network Security',
  'Google — Prepare Data for Exploration',
  'IBM — SQL & Relational Databases 101',
  'L&T EduTech — Internship Certification',
];

/* ============================================================
   PORTFOLIO WRAPPER — with navigate hook for Games button
   ============================================================ */
function Portfolio() {
  return <App />;
}

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/snake-game" element={<SnakeGame />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  const navRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const rigTiltRef = useRef<HTMLDivElement>(null);
  const rigVideoRef = useRef<HTMLVideoElement>(null);
  const yrRef = useRef<HTMLSpanElement>(null);

  /* ---------- Year ---------- */
  useEffect(() => {
    if (yrRef.current) yrRef.current.textContent = String(new Date().getFullYear());
  }, []);

  /* ---------- Video autoplay safety (iOS/Safari) ---------- */
  useEffect(() => {
    if (rigVideoRef.current) {
      rigVideoRef.current.muted = true;
      rigVideoRef.current.pause();
      rigVideoRef.current.currentTime = 0;
    }
  }, []);

  /* ---------- Nav scroll + burger menu ---------- */
  useEffect(() => {
    const nav = navRef.current;
    const burger = burgerRef.current;
    const menu = mobileMenuRef.current;
    if (!nav || !burger || !menu) return;

    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const onBurger = () => {
      const open = menu.classList.toggle('show');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    };
    burger.addEventListener('click', onBurger);

    const links = Array.from(menu.querySelectorAll('a'));
    const closeMenu = () => {
      menu.classList.remove('show');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    };
    links.forEach((a) => a.addEventListener('click', closeMenu));

    return () => {
      window.removeEventListener('scroll', onScroll);
      burger.removeEventListener('click', onBurger);
      links.forEach((a) => a.removeEventListener('click', closeMenu));
    };
  }, []);

  /* ---------- Scroll reveal ---------- */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 75}ms`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  /* ---------- Pointer tracking + rig tilt loop ---------- */
  useEffect(() => {
    const glow = glowRef.current;
    const rig = rigRef.current;
    const tilt = rigTiltRef.current;
    if (!glow || !rig || !tilt) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let hasMoved = false;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const MAX_TILT = 10;   // degrees of rotation on the rig video
    const MAX_SHIFT = 9;   // px of translation
    const LERP = 0.085;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        current.x = target.x;
        current.y = target.y;
      }
      glow.style.opacity = '1';
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        glow.style.opacity = '0';
      }, 2500);
    };

    const onLeave = () => {
      glow.style.opacity = '0';
    };

    const onTouch = (e: TouchEvent) => {
      if (!e.touches.length) return;
      target.x = e.touches[0].clientX;
      target.y = e.touches[0].clientY;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('touchmove', onTouch, { passive: true });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const frame = () => {
      current.x += (target.x - current.x) * LERP;
      current.y += (target.y - current.y) * LERP;

      glow.style.transform = `translate3d(${current.x.toFixed(2)}px,${current.y.toFixed(2)}px,0)`;

      if (!reduceMotion) {
        const nx = (current.x / window.innerWidth - 0.5) * 2;
        const ny = (current.y / window.innerHeight - 0.5) * 2;

        const v = rigVideoRef.current;
        if (v && v.duration && !Number.isNaN(v.duration)) {
          // Map nx (-1..1) to a 0..1 progress, with a small dead zone
          const progress = Math.max(0, Math.min(1, (nx + 1) / 2));
          // Smooth toward the target time so it doesn't snap
          const targetTime = progress * (v.duration - 0.05);
          const smoothTime = v.currentTime + (targetTime - v.currentTime) * 0.15;
          // Only seek if we've moved enough to matter
          if (Math.abs(smoothTime - v.currentTime) > 0.01) {
            v.currentTime = smoothTime;
          }
        }

        tilt.style.transform =
          `perspective(1000px) rotateY(${(nx * MAX_TILT).toFixed(2)}deg) ` +
          `rotateX(${(-ny * MAX_TILT).toFixed(2)}deg) ` +
          `translate3d(${(nx * MAX_SHIFT).toFixed(2)}px,${(ny * MAX_SHIFT).toFixed(2)}px,0)`;
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    idleTimer = setTimeout(() => {
      glow.style.opacity = '0';
    }, 2500);

    return () => {
      cancelAnimationFrame(raf);
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return (
    <>
      {/* ===== BACKGROUND STACK ===== */}

      <div className="backdrop" />
      <div className="bloom-cool" />
      <div className="bloom-warm" />
      <div className="vignette" />
      <div className="grain" />
      <div className="glow" ref={glowRef} />

      {/* ===== NAV ===== */}
      <nav className="nav" id="nav" ref={navRef}>
        <div className="nav-inner">
          <a href="#top" className="brand">
            Ganesh<span className="dot-sep">.</span>V
            <span className="star">✳︎</span>
          </a>

          <div className="nav-links">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>

          <a href="mailto:ganeshveerappan640@gmail.com" className="nav-cta">
            Get in touch
          </a>

          {/* Games Dropdown with animated video background */}
          <div className="nav-games-wrapper">
            <Link to="/snake-game" className="nav-games-btn" aria-label="Games">
              <video
                className="nav-games-video"
                src={GAME_VIDEO_URL}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            </Link>
            
            {/* Dropdown Menu */}
            <div className="nav-games-dropdown">
              <Link to="/snake-game" className="nav-dropdown-item">
                <span className="nav-dropdown-icon">🐍</span>
                Snake Game
              </Link>
              <a 
                href="https://lab.patrickheintzmann.com/demo/demoFormula" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nav-dropdown-item nav-dropdown-highlight"
              >
                <span className="nav-dropdown-icon">🏎️</span>
                [03] Formula ↗
              </a>
            </div>
          </div>

          <button
            className="burger"
            id="burger"
            ref={burgerRef}
            aria-label="Toggle menu"
            aria-expanded="false"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className="mobile-menu" id="mobileMenu" ref={mobileMenuRef}>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <Link to="/snake-game" className="mobile-games-link">
            <span>🐍</span> Snake Game
          </Link>
          <a 
            href="https://lab.patrickheintzmann.com/demo/demoFormula" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mobile-games-link highlight-mobile-link"
          >
            <span>🏎️</span> [03] Formula ↗
          </a>
        </div>
      </nav>

      <div className="wrap" id="top">
        {/* ===== HERO ===== */}
        <header className="hero">
          <div className="ghost" aria-hidden="true">
            Ganesh V
          </div>

          <div className="container hero-grid">
            <div>
              <div className="eyebrow">
                <span className="dot" /> Available for 2026 roles
              </div>

              <h1 className="hero-name">
                Ganesh <span className="accent">V</span>
              </h1>

              <div className="hero-role">
                SOC Analyst <span>·</span> Cybersecurity Analyst
              </div>

              <p className="hero-copy">
                I build <strong>clean architecture</strong>, <strong>dynamic motion</strong>, and{' '}
                <strong>scalable web solutions</strong> — where data pipelines meet interface craft.
                B.Tech AI &amp; Data Science, 2026 batch, based in Chennai.
              </p>

              <div className="hero-actions">
                <a href={RESUME_URL} target="_blank" rel="noopener" className="btn btn-primary">
                  View Resume
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7M17 7H8M17 7v9" />
                  </svg>
                </a>
                <a href="mailto:ganeshveerappan640@gmail.com" className="btn btn-ghost">
                  Start a conversation
                </a>
              </div>

              <div className="hero-meta">
                <span>
                  <b>Chennai, IN</b>
                </span>
                <span>Immediate joiner</span>
                <span>Open to relocation</span>
              </div>
            </div>

            {/* ===== CHARACTER RIG — video instead of PNGs ===== */}
            <div className="rig-stage">
              <div className="rig-halo" />
              <div className="rig" ref={rigRef}>
                <div className="rig-tilt" ref={rigTiltRef}>
                  <video
                    ref={rigVideoRef}
                    className="rig-head"
                    src={RIG_VIDEO_URL}
                    muted
                    playsInline
                    preload="auto"
                    controls={false}
                    disablePictureInPicture
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ===== EXPERIENCE ===== */}
        <section id="work">
          <div className="container">
            <div className="sec-head reveal">
              <span className="sec-num">01 — Experience</span>
              <h2 className="sec-title">Where I've put in the work.</h2>
              <p className="sec-sub">
                Three internships across analytics, machine learning and LLM-driven automation —
                each one shipping pipelines that removed manual overhead.
              </p>
            </div>

            <div className="exp-list">
              <article className="exp reveal">
                <div>
                  <div className="exp-when">Apr 2025 — Aug 2025</div>
                  <div className="exp-org">L&amp;T EduTech</div>
                  <div className="exp-place">Data &amp; Content Operations</div>
                </div>
                <div>
                  <h3 className="exp-role">Data Analytics &amp; Content Operations Intern</h3>
                  <ul className="exp-bullets">
                    <li>Programmed automated web-scraping and ETL cleansing pipelines in Python.</li>
                    <li>
                      Consolidated operational workflows and standardised multi-source analytical
                      reporting.
                    </li>
                    <li>
                      Built business intelligence dashboards and statistical summaries driving data-led
                      decisions.
                    </li>
                  </ul>
                </div>
              </article>

              <article className="exp reveal">
                <div>
                  <div className="exp-when">Sep 2025 — Oct 2025</div>
                  <div className="exp-org">Edunet Foundation</div>
                  <div className="exp-place">LLM-Based Analytics</div>
                </div>
                <div>
                  <h3 className="exp-role">AI &amp; Data Analysis Intern</h3>
                  <ul className="exp-bullets">
                    <li>
                      Architected end-to-end Python pipelines integrating large language models for
                      automated text analytics.
                    </li>
                    <li>
                      Extracted structured entities and generated summaries from unstructured data
                      corpora.
                    </li>
                    <li>
                      Applied NLP methodologies to categorise and evaluate enterprise text
                      repositories.
                    </li>
                    <li>
                      Improved precision metrics in downstream frameworks used for automated decision
                      support.
                    </li>
                  </ul>
                </div>
              </article>

              <article className="exp reveal">
                <div>
                  <div className="exp-when">2025 — 2026 · 2 Months</div>
                  <div className="exp-org">IAHV</div>
                  <div className="exp-place">in association with Stella Maris College</div>
                </div>
                <div>
                  <h3 className="exp-role">Analytics &amp; AI Intern</h3>
                  <ul className="exp-bullets">
                    <li>
                      Engineered data ingestion and processing workflows in Python to evaluate survey
                      and project impact datasets.
                    </li>
                    <li>
                      Deployed machine learning models to identify operational trends and surface
                      actionable metrics for program teams.
                    </li>
                    <li>
                      Developed automated analysis pipelines with NumPy and Pandas, cutting manual
                      processing overhead.
                    </li>
                    <li>
                      Standardised reporting workflows to keep cyclical analytical dashboards
                      consistent.
                    </li>
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="divider" />
        </div>

        {/* ===== PROJECTS ===== */}
        <section id="projects">
          <div className="container">
            <div className="sec-head reveal">
              <span className="sec-num">02 — Projects</span>
              <h2 className="sec-title">Things I built end to end.</h2>
              <p className="sec-sub">
                Two systems that go all the way down — from model training to the interface someone
                actually clicks.
              </p>
            </div>

            <div className="proj-grid">
              <article className="proj reveal">
                <div className="proj-top">
                  <h3 className="proj-title">CyberShield ML</h3>
                  <span className="proj-year">2024 — 2026</span>
                </div>
                <ul className="proj-bullets">
                  <li>
                    Deployed an end-to-end ML detection pipeline built on XGBoost, identifying 25+
                    distinct cyberattack vectors.
                  </li>
                  <li>
                    Built an automated notification subsystem using SMTP protocols and Watchdog
                    system event monitoring for instant alerting.
                  </li>
                  <li>
                    Interfaced software defences with Digispark hardware microcontrollers for a
                    multi-layered security barrier.
                  </li>
                </ul>
                <div className="tags">
                  <span className="tag">Python</span>
                  <span className="tag">XGBoost</span>
                  <span className="tag">Watchdog</span>
                  <span className="tag">SMTP</span>
                  <span className="tag">Digispark</span>
                </div>
              </article>

              <article className="proj reveal">
                <div className="proj-top">
                  <h3 className="proj-title">LLM Recommendation &amp; Analytics Platform</h3>
                  <span className="proj-year">2025</span>
                </div>
                <ul className="proj-bullets">
                  <li>
                    Developed a hybrid recommendation engine combining collaborative filtering with
                    NLP-driven feature extraction.
                  </li>
                  <li>
                    Engineered and deployed an interactive analytics web interface using the
                    Streamlit framework.
                  </li>
                  <li>
                    Implemented prompt engineering routines and structured JSON schema parsers to
                    interface with LLM APIs.
                  </li>
                </ul>
                <div className="tags">
                  <span className="tag">Streamlit</span>
                  <span className="tag">Collaborative Filtering</span>
                  <span className="tag">NLP</span>
                  <span className="tag">LLM APIs</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="divider" />
        </div>

        {/* ===== ABOUT ===== */}
        <section id="about">
          <div className="container">
            <div className="sec-head reveal">
              <span className="sec-num">03 — About</span>
              <h2 className="sec-title">The short version.</h2>
            </div>

            <div className="about-grid">
              <div className="about-text reveal">
                <p>
                  I'm an aspiring <strong>SOC Analyst and Cybersecurity professional</strong> from
                  Chennai, finishing my B.Tech in Artificial Intelligence &amp; Data Science in 2026. 
                  My focus is at the intersection of <strong>threat detection, data analysis, and security operations</strong>.
                </p>
                <p>
                  I leverage my background in data pipelines and analytics to investigate anomalies, 
                  automate threat intelligence workflows, and monitor system vulnerabilities. I 
                  care deeply about <strong>proactive defense mechanisms</strong>, <strong>log analysis</strong>, 
                  and building resilient infrastructure that can withstand modern attack vectors.
                </p>
                <p>
                  Outside of work: participating in CTFs, exploring ethical hacking methodologies, and diving into 
                  network security rabbit holes.
                </p>
              </div>

              <div className="reveal">
                <dl className="facts">
                  <div className="fact">
                    <dt>Location</dt>
                    <dd>Chennai, Tamil Nadu, India</dd>
                  </div>
                  <div className="fact">
                    <dt>Batch</dt>
                    <dd>2026 Graduate</dd>
                  </div>
                  <div className="fact">
                    <dt>Availability</dt>
                    <dd>Immediate · 15-day notice</dd>
                  </div>
                  <div className="fact">
                    <dt>Relocation</dt>
                    <dd>Chennai · Bangalore · Noida</dd>
                  </div>
                  <div className="fact">
                    <dt>Languages</dt>
                    <dd>English, Tamil</dd>
                  </div>
                  <div className="fact">
                    <dt>Email</dt>
                    <dd>
                      <a href="mailto:ganeshveerappan640@gmail.com">
                        ganeshveerappan640@gmail.com
                      </a>
                    </dd>
                  </div>
                  <div className="fact">
                    <dt>Phone</dt>
                    <dd>
                      <a href="tel:+918148594859">+91 81485 94859</a>
                    </dd>
                  </div>
                  <div className="fact">
                    <dt>Links</dt>
                    <dd>
                      <a href="https://github.com/Ganesh6548" target="_blank" rel="noopener">
                        GitHub
                      </a>{' '}
                      ·{' '}
                      <a
                        href="https://linkedin.com/in/v-ganesh-61991326a"
                        target="_blank"
                        rel="noopener"
                      >
                        LinkedIn
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="edu-list reveal">
              <div className="edu">
                <div>
                  <div className="edu-name">
                    B.Tech — Artificial Intelligence &amp; Data Science
                  </div>
                  <div className="edu-inst">
                    Sree Sastha Institute of Engineering &amp; Technology, Chennai · 2022 – 2026
                  </div>
                </div>
                <div className="edu-score">80%</div>
              </div>
              <div className="edu">
                <div>
                  <div className="edu-name">Senior Secondary (Class XII)</div>
                  <div className="edu-inst">National Open School · 2022</div>
                </div>
                <div className="edu-score">80%</div>
              </div>
              <div className="edu">
                <div>
                  <div className="edu-name">Secondary (Class X)</div>
                  <div className="edu-inst">National Open School · 2020</div>
                </div>
                <div className="edu-score">90%</div>
              </div>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="divider" />
        </div>

        {/* ===== CERTIFICATIONS ===== */}
        <section id="certifications">
          <div className="container">
            <div className="sec-head reveal">
              <span className="sec-num">04 — Certifications</span>
              <h2 className="sec-title">Seventeen and counting.</h2>
              <p className="sec-sub">
                Formal credentials across data analysis, cybersecurity, networking, and Java.
              </p>
            </div>

            <div className="cert-grid reveal">
              {CERTS.map((title, i) => (
                <div className="cert" key={i}>
                  <span className="cert-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cert-t">{title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <section className="contact" id="contact">
          <div className="container">
            <h2 className="reveal">
              Let's build something <em>worth shipping.</em>
            </h2>
            <p className="reveal">
              Open to full-stack, data, and AI/ML roles for the 2026 batch. Fastest way to reach me
              is email.
            </p>

            <div className="contact-actions reveal">
              <a href="mailto:ganeshveerappan640@gmail.com" className="btn btn-primary">
                ganeshveerappan640@gmail.com
              </a>
              <a href={RESUME_URL} target="_blank" rel="noopener" className="btn btn-ghost">
                Download Resume
              </a>
            </div>

            <div className="contact-links reveal">
              <a href="tel:+918148594859">+91 81485 94859</a>
              <a href="https://github.com/Ganesh6548" target="_blank" rel="noopener">
                GitHub ↗
              </a>
              <a
                href="https://linkedin.com/in/v-ganesh-61991326a"
                target="_blank"
                rel="noopener"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://maps.google.com/?q=Chennai,Tamil+Nadu"
                target="_blank"
                rel="noopener"
              >
                Chennai, India
              </a>
            </div>
          </div>
        </section>

        <footer>
          <div className="container footer-inner">
            <span className="brand">
              Ganesh<span className="dot-sep">.</span>V <span className="star">✳︎</span>
            </span>
            <span>
              © <span ref={yrRef}></span> Ganesh V — Built in Chennai
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}