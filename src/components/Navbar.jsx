import React, { useState, useEffect } from 'react';
import { Sprout, LogIn, LogOut, Database, User, ArrowRight } from 'lucide-react';

export default function Navbar({ onOpenAuth, currentUser, onSignOut, onOpenDatabase, onNavigate, currentView }) {
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPortalName = (role) => {
    switch (role?.toLowerCase()) {
      case 'farmer':
        return 'Farmer Hub';
      case 'kirana':
        return 'Kirana Depot';
      case 'anchor':
      case 'bulk':
      case 'consumer':
      case 'customer':
        return 'Customer & Bulk Market';
      default:
        return 'Dashboard';
    }
  };

  const getPortalView = (role) => {
    switch (role?.toLowerCase()) {
      case 'farmer':
        return 'farmer';
      case 'kirana':
        return 'kirana';
      case 'anchor':
      case 'bulk':
      case 'consumer':
      case 'customer':
        return 'customer';
      default:
        return 'home';
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F2EBDD]/95 backdrop-blur-md shadow-md border-b border-[#78947F]/30 py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Left empty slot (Title & logo removed as requested) */}
          <div />

          {/* Right Controls: Supabase DB (Admin Only) + User Profile / Header Login */}
          <div className="flex items-center gap-2.5">
            
            {/* Admin Panel Button - Restricted to Admin Only */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenDatabase}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#185844] bg-[#185844]/10 border border-[#78947F]/40 hover:bg-[#185844]/20 transition-all shadow-sm cursor-pointer"
                title="Open Admin Panel & Supabase Manager"
              >
                <Database className="w-3.5 h-3.5 text-[#185844]" />
                <span className="hidden sm:inline">Admin Panel</span>
              </button>
            )}

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF6EF] border border-[#78947F]/35 hover:border-[#185844] transition-all text-xs font-semibold cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#185844] text-[#F2EBDD] flex items-center justify-center text-[11px] font-bold uppercase">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate text-[#102F27]">
                    {currentUser.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-[#78947F]/20 text-[#185844] border border-[#78947F]/30">
                    {currentUser.role || 'Member'}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#F2EBDD] border border-[#78947F]/40 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-[#78947F]/20">
                      <p className="text-xs font-bold text-[#102F27] truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-[#78947F] font-mono truncate">
                        {currentUser.email}
                      </p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-[#185844]/15 text-[#185844] border border-[#78947F]/30">
                        Role: {currentUser.role}
                      </span>
                    </div>

                    {/* Quick navigation to user's respected portal or Admin Panel */}
                    {currentUser.role === 'admin' ? (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          if (onOpenDatabase) onOpenDatabase();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-[#185844] hover:bg-[#185844]/10 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Database className="w-3.5 h-3.5 text-[#185844]" />
                          <span>Open Admin Panel</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          if (onNavigate) onNavigate(getPortalView(currentUser.role));
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-[#185844] hover:bg-[#185844]/10 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>Open {getPortalName(currentUser.role)}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors cursor-pointer border-t border-[#78947F]/20"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#F2EBDD] bg-[#185844] hover:bg-[#23785F] dark:bg-[#185844] dark:hover:bg-[#23785F] shadow-sm shadow-[#102F27]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#78947F]/30"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
