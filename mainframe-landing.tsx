import React, { useEffect, useRef, useState } from 'react';

// Typewriter Hook
const useTypewriter = (text: string, speed = 38, startDelay = 600) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let index = 0;
      intervalRef.current = setInterval(() => {
        if (index <= text.length) {
          setDisplayed(text.slice(0, index));
          index++;
        } else {
          setDone(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
};

// Copy to Clipboard Hook
const useCopyToClipboard = () => {
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };
  return { copy };
};

export default function MainframeLanding() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const prevXRef = useRef(0);
  const targetTimeRef = useRef(0);
  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Good taste tends to find us. Now, what are we building?',
    38,
    600
  );
  const { copy } = useCopyToClipboard();

  // Mouse scrub video control
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!videoRef.current) return;

      const currentX = e.clientX;
      const delta = currentX - prevXRef.current;
      const sensitivity = 0.8;
      const offset = (delta / window.innerWidth) * sensitivity * videoRef.current.duration;
      
      targetTimeRef.current = Math.max(0, Math.min(videoRef.current.duration, targetTimeRef.current + offset));
      videoRef.current.currentTime = targetTimeRef.current;
      
      prevXRef.current = currentX;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Show action buttons after 400ms
  useEffect(() => {
    const timer = setTimeout(() => setShowActionButtons(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyEmail = () => {
    copy('hello@mainframe.co');
  };

  const navLinks = [
    { label: 'Labs', href: '#' },
    { label: 'Studio', href: '#' },
    { label: 'Openings', href: '#' },
    { label: 'Shop', href: '#' },
  ];

  const actionButtons = [
    { label: 'Pitch us an idea', href: '#' },
    { label: 'Come work here', href: '#' },
    { label: 'Send a brief hello', href: '#' },
    { label: 'See how we operate', href: '#' },
  ];

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="fixed inset-0 w-full h-full object-cover"
        style={{ objectPosition: '70% center', zIndex: 0 }}
        muted
        playsInline
        preload="auto"
      >
        <source src="https://ashpikminev8xmwr.private.blob.vercel-storage.com/150155.mp4?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfQXNIUElrbWluRXY4WE1XUiIsIm93bmVySWQiOiJ0ZWFtX2h6a0ZHUHdYekZtb2xtMUZxaWVvZ1lRZyIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwNTU3MjM3MzA2LCJpYXQiOjE3OTA1MTM4NDMyODZ9.JLOhM6vnsGW_t_b0bzJg185TZIImg3oW7CdJSfACUBk&vercel-blob-signature=4_7Uz9Yj6CXO4d_8T1iZSeajYtvo6urBPbGp-mgRQmA" />
      </video>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center bg-white/5 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex flex-row gap-3 items-center">
          <span
            className="text-[21px] sm:text-[26px] font-black tracking-tight text-black"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mainframe®
          </span>
          <span className="text-[25px] sm:text-[30px] text-black select-none" style={{ letterSpacing: '-0.02em' }}>
            ✳︎
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex flex-row gap-2 text-[23px] text-black">
          {navLinks.map((link, idx) => (
            <React.Fragment key={idx}>
              <a href={link.href} className="hover:opacity-60 transition-opacity">
                {link.label}
              </a>
              {idx < navLinks.length - 1 && <span>, </span>}
            </React.Fragment>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="#"
          className="hidden md:inline text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex flex-col gap-[5px]"
          aria-label="Toggle menu"
        >
          <div
            className="w-6 h-[2px] bg-black transition-all duration-300"
            style={{
              transform: isMobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'rotate(0)',
            }}
          />
          <div
            className="w-6 h-[2px] bg-black transition-all duration-300"
            style={{ opacity: isMobileMenuOpen ? 0 : 1 }}
          />
          <div
            className="w-6 h-[2px] bg-black transition-all duration-300"
            style={{
              transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'rotate(0)',
            }}
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-9 bg-white/95 backdrop-blur-sm md:hidden flex flex-col justify-center items-start px-8 gap-8 pt-20"
          style={{
            opacity: isMobileMenuOpen ? 1 : 0,
            pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
          }}
        >
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-[32px] font-medium text-black">
              {link.label}
            </a>
          ))}
          <a href="#" className="text-[32px] font-medium text-black underline">
            Get in touch
          </a>
        </div>
      )}

      {/* Hero Section */}
      <section
        className="relative z-1 h-screen flex flex-col overflow-hidden px-5 sm:px-8 md:px-10"
        style={{
          justifyContent: window.innerWidth < 768 ? 'flex-end' : 'center',
          paddingBottom: window.innerWidth < 768 ? '3rem' : '0',
        }}
      >
        <div className="max-w-xl relative z-10">
          {/* Blurred Intro Label */}
          <div
            className="pointer-events-none select-none mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              color: '#000',
              filter: 'blur(4px)',
            }}
          >
            <p>Hey there, meet A.R.I.A,</p>
            <p>Mainframe's Adaptive Response Interface Agent</p>
          </div>

          {/* Typewriter Text */}
          <div
            className="mb-5 sm:mb-6 min-h-[54px] text-black font-normal"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
            }}
          >
            {displayed}
            {!done && (
              <span
                className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px]"
                style={{
                  animation: 'blink 1s step-end infinite',
                }}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: showActionButtons ? 1 : 0,
              transform: showActionButtons ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {/* White Pill Buttons */}
            {actionButtons.map((btn) => (
              <a
                key={btn.label}
                href={btn.href}
                className="inline-flex items-center justify-center bg-white text-black rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap border border-black/10 hover:bg-black hover:text-white transition-colors duration-200"
              >
                {btn.label}
              </a>
            ))}

            {/* Outline Pill Button */}
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center text-white bg-transparent rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap border border-white gap-2 sm:gap-3 hover:bg-white hover:text-black transition-colors duration-200"
            >
              <span>
                Reach us:{' '}
                <span className="underline underline-offset-1">hello@mainframe.co</span>
              </span>
              {/* Copy Icon SVG */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="4" width="6" height="6" stroke="currentColor" strokeWidth="0.75" />
                <rect x="2" y="2" width="6" height="6" stroke="currentColor" strokeWidth="0.75" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Blink Animation */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        :root {
          --font-heading: 'HelveticaNowDisplay-Medium', 'Helvetica Neue', Arial, sans-serif;
          --font-body: 'HelveticaNowDisplayW01-Rg', 'Helvetica Neue', Arial, sans-serif;
        }
        
        body {
          font-family: var(--font-body);
        }
      `}</style>
    </div>
  );
}
