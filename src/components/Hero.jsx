import React from 'react';
import { 
  Sprout, 
  LogIn, 
  ArrowRight, 
  ChevronDown
} from 'lucide-react';

export default function Hero({ onOpenAuth, currentUser, onNavigateToPortal }) {
  const getPortalLabel = (role) => {
    switch (role?.toLowerCase()) {
      case 'farmer': return 'Go to Farmer Hub';
      case 'kirana': return 'Go to Kirana Depot';
      case 'bulk':
      case 'anchor':
      case 'customer':
      case 'consumer': return 'Go to Customer & Bulk Market';
      default: return 'Open Dashboard';
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-28 sm:pb-20 overflow-hidden select-none"
    >
      {/* 1. Countryside Farm Landscape Background Image */}
      <img
        src="/farm-hero-bg.jpg"
        alt="FarmDirect 2.0 Regional Agro-Corridor"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
      />

      {/* 2. Top and Bottom Atmospheric Gradients for seamless transitions */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/40 via-black/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#F2EBDD] via-[#F2EBDD]/70 to-transparent pointer-events-none" />

      {/* 3. Centered Content displayed directly on the landscape background (no card / box) */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center relative z-10 px-4">

        {/* Brand Icon Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#102F27] flex items-center justify-center text-[#B08A4F] shadow-lg border border-[#B08A4F]/40 mb-5">
          <Sprout className="w-8 h-8 sm:w-10 sm:h-10 text-[#B08A4F]" />
        </div>

        {/* Main Title: Solid high-contrast typography without gradient text clipping */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#102F27] font-sans leading-tight mb-4">
          FarmDirect <span className="text-[#185844]">2.0</span>
        </h1>

        {/* Clear, empirical mission statement */}
        <p className="text-base sm:text-lg text-[#102F27] font-medium leading-relaxed max-w-2xl mb-8">
          Eliminating multi-tier APMC middlemen across the Visakhapatnam corridor. 
          Connecting farmers directly with households, kirana micro-depots, and institutional anchors 
          with zero-trust custody and guaranteed price collar protection.
        </p>

        {/* Action Buttons: Solid, disciplined buttons without rainbow gradients */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {currentUser ? (
            <button
              onClick={onNavigateToPortal}
              className="px-8 py-3.5 rounded-xl font-bold text-sm text-[#F2EBDD] bg-[#185844] hover:bg-[#102F27] shadow-xl hover:shadow-2xl transition-all duration-150 flex items-center gap-2 cursor-pointer border border-[#78947F]/40 active:scale-[0.98]"
            >
              <span>{getPortalLabel(currentUser.role)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="px-8 py-3.5 rounded-xl font-bold text-sm text-[#F2EBDD] bg-[#185844] hover:bg-[#102F27] shadow-xl hover:shadow-2xl transition-all duration-150 flex items-center gap-2 cursor-pointer border border-[#78947F]/40 active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4 text-[#B08A4F]" />
              <span>Get Started / Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Clean Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={() => scrollToSection('metrics')}
          className="flex flex-col items-center gap-1 text-[#78947F] hover:text-[#185844] transition-colors cursor-pointer group"
          aria-label="Scroll to explore"
        >
          <span className="text-[10px] font-semibold tracking-wider uppercase opacity-75 group-hover:opacity-100 transition-opacity">
            Scroll to explore
          </span>
          <ChevronDown className="w-4 h-4 text-[#185844] opacity-75 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </section>
  );
}
