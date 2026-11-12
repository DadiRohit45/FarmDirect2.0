import React, { useState } from 'react';
import { 
  Sprout, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowUp 
} from 'lucide-react';

export default function Footer() {
  const [hoveredContact, setHoveredContact] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contactCards = [
    {
      id: 'phone',
      title: 'Helpline & Inquiries',
      primary: '1800-425-FARM (3276)',
      secondary: '+91 891 284 9900',
      icon: Phone,
      color: 'text-[#B08A4F] bg-[#185844]/20 border-[#78947F]/30',
      tag: 'Toll-Free (24/7)'
    },
    {
      id: 'email',
      title: 'Email Communications',
      primary: 'support@farmdirect.in',
      secondary: 'farmers@farmdirect.in',
      icon: Mail,
      color: 'text-[#B08A4F] bg-[#185844]/20 border-[#78947F]/30',
      tag: '< 2 Hr Response'
    },
    {
      id: 'location',
      title: 'Regional Head Office',
      primary: 'Plot 42, Agro Tech Corridor',
      secondary: 'MVP Colony Sec-4, Visakhapatnam, AP 530017',
      icon: MapPin,
      color: 'text-[#B08A4F] bg-[#185844]/20 border-[#78947F]/30',
      tag: 'Visakhapatnam HQ'
    }
  ];

  return (
    <footer className="bg-[#102F27] text-[#F2EBDD] border-t border-[#78947F]/30 relative transition-colors">
      
      {/* Top Contact Details Cards Row */}
      <div className="border-b border-[#78947F]/25 bg-[#0B211B]/60 py-9">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#B08A4F] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Contact Details & Regional Helpdesk
              </span>
              <h3 className="text-xl font-bold text-[#F2EBDD] mt-0.5">
                Get in Touch with FarmDirect 2.0
              </h3>
            </div>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#185844] hover:bg-[#23785F] text-[#F2EBDD] border border-[#78947F]/30 transition-all cursor-pointer w-fit shadow-sm"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Contact Cards: Phone, Email, Regional Office */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {contactCards.map((card) => {
              const Icon = card.icon;
              const isHovered = hoveredContact === card.id;

              return (
                <div
                  key={card.id}
                  onMouseEnter={() => setHoveredContact(card.id)}
                  onMouseLeave={() => setHoveredContact(null)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-4 ${
                    isHovered
                      ? 'bg-[#163D33] border-[#B08A4F]/60 shadow-xl -translate-y-1'
                      : 'bg-[#102F27]/80 border-[#78947F]/30 hover:border-[#78947F]/60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#F2EBDD] truncate">{card.title}</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#163D33] text-[#78947F] border border-[#78947F]/30">
                        {card.tag}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#F2EBDD] font-mono truncate">
                      {card.primary}
                    </p>
                    <p className="text-xs text-[#78947F] truncate mt-0.5">
                      {card.secondary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Brand & Copyright Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#78947F]/25">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#185844] to-[#102F27] border border-[#78947F]/30 flex items-center justify-center text-white shadow-md">
              <Sprout className="w-5 h-5 text-[#B08A4F]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-[#F2EBDD] font-sans">
                FarmDirect <span className="text-[#B08A4F]">2.0</span>
              </span>
              <p className="text-xs text-[#78947F]">
                Direct Farm-to-Fork Reverse-Demand Agricultural Corridor
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#185844]/25 border border-[#78947F]/30 text-[#F2EBDD] text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-[#B08A4F]" />
            <span>Guaranteed Price Collar & Zero-Trust Escrow</span>
          </div>

        </div>

        {/* Copyrights Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78947F] font-medium">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="text-[#F2EBDD]/80">
              © 2026 FarmDirect 2.0. All Rights Reserved.
            </span>
            <span className="hidden md:inline text-[#78947F]/50">•</span>
            <span className="hidden md:inline text-[#78947F]">
              Regulated Agricultural Exchange Platform
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a 
              href="mailto:support@farmdirect.in" 
              className="text-[#78947F] hover:text-[#B08A4F] transition-colors"
            >
              support@farmdirect.in
            </a>
            <span className="text-[#78947F]/50">•</span>
            <a 
              href="tel:18004253276" 
              className="text-[#78947F] hover:text-[#B08A4F] transition-colors font-mono"
            >
              1800-425-FARM
            </a>
            <span className="text-[#78947F]/50">•</span>
            <span className="text-[#78947F]">
              Visakhapatnam, Andhra Pradesh
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
