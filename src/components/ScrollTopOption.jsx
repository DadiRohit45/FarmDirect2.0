import React, { useState, useEffect } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';

export default function ScrollTopOption() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, Math.round((scrollY / scrollHeight) * 100)));
        setScrollProgress(progress);
      }

      // Show after scrolling 160px from the top
      if (scrollY > 160) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#F2EBDD]/95 border border-[#78947F]/40 hover:border-[#185844] shadow-xl shadow-[#102F27]/20 backdrop-blur-md hover:shadow-[#185844]/25 active:scale-95 transition-all duration-300 cursor-pointer animate-bounce-gentle select-none"
        aria-label="Scroll back to top"
      >
        {/* Ambient Animated Glow Aura */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#185844]/25 via-[#B08A4F]/25 to-[#78947F]/25 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Circular Progress Ring */}
        <div className="relative w-6 h-6 flex items-center justify-center">
          <svg className="w-6 h-6 -rotate-90 transform" viewBox="0 0 36 36">
            <path
              className="text-[#78947F]/25"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#185844] transition-all duration-150 ease-out"
              strokeDasharray={`${scrollProgress}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <ArrowUp className="w-3.5 h-3.5 text-[#185844] absolute group-hover:-translate-y-0.5 transition-transform" />
        </div>

        {/* Text Label with Progress */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#102F27]">
          <span>Scroll to Top</span>
          <span className="text-[10px] font-mono font-medium text-[#185844] bg-[#185844]/10 px-1.5 py-0.5 rounded-full border border-[#78947F]/30">
            {scrollProgress}%
          </span>
        </div>

        {/* Sparkle subtle highlight on hover */}
        <Sparkles className={`w-3.5 h-3.5 text-[#B08A4F] transition-all duration-300 ${isHovered ? 'scale-110 rotate-12 opacity-100' : 'opacity-70'}`} />
      </button>
    </div>
  );
}

