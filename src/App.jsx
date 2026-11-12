import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CustomerPage from './components/CustomerPage';
import FarmerPage from './components/FarmerPage';
import KiranaHubPage from './components/KiranaHubPage';
import ProjectAbstractModal from './components/ProjectAbstractModal';
import AuthPage from './components/auth/AuthPage';
import SupabaseDataModal from './components/SupabaseDataModal';
import LivePlatformMetrics from './components/LivePlatformMetrics';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import AIAssistantChatbot from './components/AIAssistantChatbot';
import ScrollTopOption from './components/ScrollTopOption';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A120D] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center text-2xl font-bold">
            ⚠️
          </div>
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p className="text-xs text-slate-400 max-w-md font-mono bg-black/40 p-3 rounded-xl border border-slate-800">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => {
              window.location.hash = '#home';
              window.location.reload();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer"
          >
            Return to Home & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'customer' | 'farmer' | 'kirana' | 'bulk'
  const [abstractOpen, setAbstractOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [currentUser, setCurrentUser] = useState(null);

  // Lock to custom brand color theme (Ivory, Forest, Emerald, Sage, Antique Gold)
  useEffect(() => {
    localStorage.removeItem('theme');
    document.documentElement.classList.remove('dark');
  }, []);

  const getRespectedView = (role) => {
    const r = role?.toLowerCase() || '';
    if (r === 'farmer') return 'farmer';
    if (r === 'kirana') return 'kirana';
    if (r === 'anchor' || r === 'bulk' || r === 'consumer' || r === 'customer') return 'customer';
    return 'home';
  };

  // Load existing session & redirect to their respected page according to user credentials
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('farmdirect_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        const targetView = getRespectedView(parsed.role);
        if (targetView !== 'home' && (!window.location.hash || window.location.hash === '' || window.location.hash === '#home')) {
          setCurrentView(targetView);
          window.location.hash = `#${targetView}`;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved user:', e);
    }

    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#customer' || hash === '#market' || hash === '#products' || hash === '#bulk' || hash === '#anchor' || hash === '#services' || hash === '#tracking') {
        setCurrentView('customer');
      } else if (hash === '#farmer' || hash === '#farmer-tracking' || hash === '#rwbcis') {
        setCurrentView('farmer');
      } else if (hash === '#kirana' || hash === '#hub') {
        setCurrentView('kirana');
      } else if (hash === '#home' || hash === '') {
        setCurrentView('home');
      } else if (hash === '#admin') {
        try {
          const saved = localStorage.getItem('farmdirect_user');
          const u = saved ? JSON.parse(saved) : null;
          if (u?.role === 'admin') {
            setSupabaseModalOpen(true);
          } else {
            setAuthMode('login');
            setAuthOpen(true);
          }
        } catch (_) {
          setAuthMode('login');
          setAuthOpen(true);
        }
      } else if (hash === '#login') {
        setAuthMode('login');
        setAuthOpen(true);
      } else if (hash === '#register' || hash === '#signup') {
        setAuthMode('register');
        setAuthOpen(true);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem('farmdirect_user');
    setCurrentUser(null);
    setSupabaseModalOpen(false);
    setCurrentView('home');
    window.location.hash = '#home';
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user?.role === 'admin') {
      setCurrentView('home');
      window.location.hash = '#admin';
      setSupabaseModalOpen(true);
      return;
    }
    // Automatically redirect to their respected page according to user credentials
    const targetView = getRespectedView(user?.role);
    setCurrentView(targetView);
    if (targetView !== 'home') {
      window.location.hash = `#${targetView}`;
    } else {
      window.location.hash = '#home';
    }
  };

  const navigateToView = (view) => {
    setCurrentView(view);
    window.location.hash = `#${view}`;
  };

  const navigateToHome = () => {
    setCurrentView('home');
    window.location.hash = '#home';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F2EBDD] text-[#102F27] transition-colors duration-200">
      
      {/* Role View Routing (Tabbed functional pages without unnecessary fluff) */}
      <ErrorBoundary>
        {currentView === 'customer' ? (
          <CustomerPage
            currentUser={currentUser}
            onSignOut={handleSignOut}
            onOpenAuth={handleOpenAuth}
            onBackToHome={navigateToHome}
          />
        ) : currentView === 'farmer' ? (
          <FarmerPage
            currentUser={currentUser}
            onSignOut={handleSignOut}
            onOpenAuth={handleOpenAuth}
            onBackToHome={navigateToHome}
          />
        ) : currentView === 'kirana' ? (
          <KiranaHubPage
            currentUser={currentUser}
            onSignOut={handleSignOut}
            onOpenAuth={handleOpenAuth}
            onBackToHome={navigateToHome}
          />
        ) : (
          <>
            {/* Sticky Navigation Bar */}
            <Navbar 
              onOpenAbstract={() => setAbstractOpen(true)}
              onOpenAuth={handleOpenAuth}
              currentUser={currentUser}
              onSignOut={handleSignOut}
              onOpenDatabase={() => setSupabaseModalOpen(true)}
              onNavigate={navigateToView}
              currentView={currentView}
            />

            {/* Main Interactive Home Page */}
            <main className="flex-1 flex flex-col">
              <Hero 
                onOpenAuth={handleOpenAuth}
                currentUser={currentUser}
                onSignOut={handleSignOut}
                onNavigateToPortal={() => navigateToView(getRespectedView(currentUser?.role))}
              />

              {/* Moving Animated Counters: Customers, Farmers, Kirana Hubs */}
              <LivePlatformMetrics />

              {/* Comprehensive Interactive About the Application Section */}
              <AboutSection />
            </main>

            {/* Floating Scroll to Top Option with entrance animation after scrolling from top */}
            <ScrollTopOption />

            {/* Footer with Copyrights & Contact Details */}
            <Footer 
              onOpenAbstract={() => setAbstractOpen(true)}
              onNavigate={navigateToView}
            />
          </>
        )}
      </ErrorBoundary>

      {/* Academic Project Abstract & Whitepaper Modal */}
      <ProjectAbstractModal
        isOpen={abstractOpen}
        onClose={() => setAbstractOpen(false)}
      />

      {/* Modern Authentication Page (Sign In & Register) */}
      <AuthPage
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => {
          setAuthOpen(false);
          // If hash was #login or #register, clean it up without jumping page
          if (window.location.hash === '#login' || window.location.hash === '#register' || window.location.hash === '#signup') {
            history.pushState(null, '', window.location.pathname + window.location.search);
          }
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Live Supabase Database Activities Manager Modal (Restricted to Admin Only) */}
      {currentUser?.role === 'admin' && (
        <SupabaseDataModal
          isOpen={supabaseModalOpen}
          onClose={() => setSupabaseModalOpen(false)}
        />
      )}

      {/* Kisan-Mitra AI Assistant Chatbot with RAG Knowledge Engine */}
      <AIAssistantChatbot
        currentUser={currentUser}
        onNavigate={navigateToView}
        onOpenAuth={handleOpenAuth}
      />
    </div>
  );
}
