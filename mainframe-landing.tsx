import React, { useState, useEffect, useRef } from 'react';

// --- Custom Hook: Typewriter ---
function useTypewriter(text: string, speed: number = 38, startDelay: number = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// --- Main Component ---
export default function MainframeLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPills, setShowPills] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevX = useRef<number>(0);
  const targetTime = useRef<number>(0);
  const isSeeking = useRef<boolean>(false);

  // Typewriter hook usage
  const { displayed, done } = useTypewriter(
    "Glad you stopped in. Good taste tends to find us. Now, what are we building?",
    38,
    600
  );

  // Show pills 400ms after mount
  useEffect(() => {
    const timer = setTimeout(() => setShowPills(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // Video Mouse Scrubbing Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!videoRef.current || !videoRef.current.duration) return;

      const currentX = e.clientX;
      if (prevX.current === 0) {
        prevX.current = currentX;
        return;
      }

      const delta = currentX - prevX.current;
      prevX.current = currentX;

      // Update target time based on horizontal mouse movement
      const sensitivity = 0.8;
      targetTime.current += (delta / window.innerWidth) * sensitivity * videoRef.current.duration;

      // Clamp target time
      targetTime.current = Math.max(0, Math.min(targetTime.current, videoRef.current.duration));

      if (!isSeeking.current) {
        isSeeking.current = true;
        videoRef.current.currentTime = targetTime.current;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Video onSeeked handler to prevent seek-flooding
  const handleSeeked = () => {
    if (!videoRef.current) return;
    
    // Check if we need to seek again to catch up to the latest target time
    if (Math.abs(videoRef.current.currentTime - targetTime.current) > 0.05) {
      videoRef.current.currentTime = targetTime.current;
    } else {
      isSeeking.current = false;
    }
  };

  // Copy to clipboard handler
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@mainframe.co');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* Background Video */}
      <video
        ref={videoRef}
        src="https://ashpikminev8xmwr.private.blob.vercel-storage.com/150155.mp4?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfQXNIUElrbWluRXY4WE1XUiIsIm93bmVySWQiOiJ0ZWFtX2h6a0ZHUHdYekZtb2xtMUZxaWVvZ1lRZyIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkwNTU3MjM3MzA2LCJpYXQiOjE3OTA1MTM4NDMyODZ9.JLOhM6vnsGW_t_b0bzJg185TZIImg3oW7CdJSfACUBk&vercel-blob-signature=4_7Uz9Yj6CXO4d_8T1iZSeajYtvo6urBPbGp-mgRQmA"
        className="fixed inset-0 z-0 object-cover"
        style={{ objectPosition: '70% center' }}
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-5 sm:px-8 py-4 sm:py-5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span 
            className="text-[21px] sm:text-[26px] tracking-tight text-black select-none"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mainframe(R)
          </span>
          <span 
            className="text-[25px] sm:text-[30px] text-black select-none"
            style={{ letterSpacing: '-0.02em' }}
          >
            ✳︎
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center text-[23px] text-black">
          <a href="#" className="hover:opacity-60 transition-opacity">Labs</a>,&nbsp;
          <a href="#" className="hover:opacity-60 transition-opacity">Studio</a>,&nbsp;
          <a href="#" className="hover:opacity-60 transition-opacity">Openings</a>,&nbsp;
          <a href="#" className="hover:opacity-60 transition-opacity">Shop</a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a href="#" className="text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity">
            Get in touch
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden flex flex-col gap-[5px] z-20"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`w-6 h-[2px] bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`w-6 h-[2px] bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-[2px] bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-[9] bg-white/95 backdrop-blur-sm flex flex-col justify-center px-8 gap-8 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <a href="#" className="text-[32px] font-medium text-black">Labs</a>
        <a href="#" className="text-[32px] font-medium text-black">Studio</a>
        <a href="#" className="text-[32px] font-medium text-black">Openings</a>
        <a href="#" className="text-[32px] font-medium text-black">Shop</a>
        <a href="#" className="text-[32px] font-medium text-black underline underline-offset-4">Get in touch</a>
      </div>

      {/* Hero Section */}
      <section className="relative z-[1] h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
        <div className="max-w-xl relative z-10">
          
          {/* Blurred Intro Label */}
          <div 
            className="pointer-events-none select-none mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              color: '#000',
              filter: 'blur(4px)'
            }}
          >
            <div>Hey there, meet A.R.I.A,</div>
            <div>Mainframe's Adaptive Response Interface Agent</div>
          </div>

          {/* Typewriter Text */}
          <div 
            className="mb-5 sm:mb-6 text-black"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: '54px'
            }}
          >
            {displayed}
            {!done && (
              <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />
            )}
          </div>

          {/* Action Pill Buttons */}
          <div 
            className={`flex flex-wrap gap-y-1 transition-all duration-400 ease-out ${
              showPills ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {/* White Pills */}
            {['Pitch us an idea', 'Come work here', 'Send a brief hello', 'See how we operate'].map((label) => (
              <button
                key={label}
                className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
              >
                {label}
              </button>
            ))}

            {/* Outline Pill with Copy Icon */}
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] gap-2 sm:gap-3 hover:bg-white hover:text-black transition-colors duration-200"
            >
              <span>
                Reach us: <span className="underline underline-offset-1">hello@mainframe.co</span>
              </span>
              {/* Copy Icon SVG */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              {copied && <span className="text-xs ml-1">Copied!</span>}
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
