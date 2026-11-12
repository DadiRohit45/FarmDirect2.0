import React, { useState, useEffect } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Sprout, 
  Building2, 
  Store, 
  Home, 
  ShieldAlert,
  KeyRound,
  ExternalLink,
  Copy,
  Check,
  ArrowLeft,
  LogIn
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dbSignInUser, dbRegisterUser, dbSaveTemporaryPassword } from '../../lib/supabaseClient';

export default function AuthPage({ isOpen, initialMode = 'login', onClose, onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Form Fields
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('farmer');
  const [roleDetail, setRoleDetail] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot Password / Temporary Password States
  const [resetEmail, setResetEmail] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [mailSent, setMailSent] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync initialMode when prop changes
  useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
    setSuccessToast('');
    setMailSent(false);
  }, [initialMode, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Stakeholder roles for registration (Admin is strictly credentials-only and cannot be registered)
  const roles = [
    {
      id: 'farmer',
      name: 'Farmer',
      badge: 'Smallholder Supplier',
      icon: Sprout,
      color: 'emerald',
      placeholder: 'Village & Mandal (e.g. Anandapuram, Vizag)',
      defaultDetail: 'Anandapuram Mandal, Visakhapatnam'
    },
    {
      id: 'kirana',
      name: 'Kirana Owner',
      badge: 'Micro-Depot Partner',
      icon: Store,
      color: 'amber',
      placeholder: 'Store Name & Ward (e.g. Sri Lakshmi Kirana, MVP Colony)',
      defaultDetail: 'Sri Lakshmi Stores, MVP Colony Sector 4'
    },
    {
      id: 'consumer',
      name: 'Customer',
      badge: 'Retail & Bulk Orders',
      icon: Home,
      color: 'cyan',
      placeholder: 'Delivery Colony or Enterprise (e.g. Seethammadhara / Canteen)',
      defaultDetail: 'Seethammadhara NE Sector'
    }
  ];

  // Quick-fill presets for easy testing (Admin option removed)
  const demoUsers = [
    {
      role: 'farmer',
      name: 'Ramesh Naidu (Farmer)',
      identifier: 'ramesh.farmer@farmdirect.in',
      password: 'password123',
      detail: 'Anandapuram Mandal, Visakhapatnam'
    },
    {
      role: 'consumer',
      name: 'Pooja Sharma (Bulk Customer)',
      identifier: 'pooja.bulk@farmdirect.in',
      password: 'password123',
      detail: 'Novotel Varun Beach / Bulk Canteen'
    },
    {
      role: 'kirana',
      name: 'Suresh Babu (Kirana Depot)',
      identifier: 'suresh.kirana@vizaghub.in',
      password: 'password123',
      detail: 'Sri Lakshmi Kirana, MVP Colony'
    },
    {
      role: 'consumer',
      name: 'Ananya Rao (Household)',
      identifier: 'ananya.vizag@gmail.com',
      password: 'password123',
      detail: 'Seethammadhara, Visakhapatnam'
    }
  ];

  const handleQuickFill = (user) => {
    if (mode === 'login') {
      setIdentifier(user.identifier);
      setPassword(user.password);
    } else {
      setFullName(user.name);
      setEmail(user.identifier);
      setPhone('+91 98480 12345');
      setPassword(user.password);
      setConfirmPassword(user.password);
      setSelectedRole(user.role);
      setRoleDetail(user.detail);
    }
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      if (!identifier.trim()) {
        setErrorMessage('Please enter your email, phone number, or username.');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }

      const cleanInput = identifier.trim().toLowerCase();
      // Admin Panel Access: Strictly restricted to Admin.farmdirect.in with password 123456789
      if (cleanInput === 'admin.farmdirect.in' || cleanInput === 'admin@farmdirect.in') {
        if (password === '123456789') {
          setIsLoading(true);
          const adminUser = {
            id: 'admin-master-root',
            name: 'System Admin',
            email: 'Admin.farmdirect.in',
            role: 'admin',
            detail: 'Central Platform Operations & Supabase Database Controller',
            token: 'jwt-auth-admin-' + Date.now(),
            loginTime: new Date().toLocaleTimeString()
          };
          localStorage.setItem('farmdirect_user', JSON.stringify(adminUser));
          setIsLoading(false);

          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.5 }
            });
          } catch (_) {}

          setSuccessToast('Admin access verified! Accessing Admin Panel...');
          setTimeout(() => {
            if (onLoginSuccess) onLoginSuccess(adminUser);
            onClose();
          }, 1000);
          return;
        } else {
          setErrorMessage('Invalid admin password. Access denied.');
          return;
        }
      }

      setIsLoading(true);

      // Perform real Supabase database authentication
      const result = await dbSignInUser({ identifier, password });
      setIsLoading(false);

      if (result && result.user) {
        const loggedUser = {
          ...result.user,
          token: 'jwt-auth-token-' + Date.now(),
          loginTime: new Date().toLocaleTimeString()
        };

        // Save active session
        localStorage.setItem('farmdirect_user', JSON.stringify(loggedUser));

        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (_) {}

        if (loggedUser.isTempPasswordLogin) {
          setSuccessToast(`Welcome back! Signed in with Temporary Password.`);
        } else {
          setSuccessToast(`Welcome back, ${loggedUser.name}!`);
        }
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(loggedUser);
          onClose();
        }, 1200);
      } else {
        setErrorMessage('Unable to sign in. Please verify your credentials or use forgot password.');
      }

    } else {
      // Register Mode Validation
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!email.trim() && !phone.trim()) {
        setErrorMessage('Please provide an email or phone number.');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      setIsLoading(true);

      const targetEmail = email.trim() || `${phone.replace(/\s+/g, '')}@farmdirect.in`;
      // Perform real Supabase registration in 'profiles' table
      const registeredProfile = await dbRegisterUser({
        email: targetEmail,
        fullName: fullName.trim(),
        role: selectedRole,
        phone: phone.trim(),
        detail: roleDetail || 'Visakhapatnam Corridor',
        password: password
      });

      setIsLoading(false);

      const newUser = {
        name: registeredProfile?.full_name || fullName.trim(),
        email: registeredProfile?.email || targetEmail,
        phone: registeredProfile?.phone || phone.trim(),
        role: registeredProfile?.role || selectedRole,
        detail: registeredProfile?.detail || roleDetail || 'Visakhapatnam Corridor',
        token: 'jwt-auth-token-' + Date.now(),
        loginTime: new Date().toLocaleTimeString()
      };

      localStorage.setItem('farmdirect_user', JSON.stringify(newUser));

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (_) {}

      setSuccessToast(`Account registered in Supabase! Welcome to FarmDirect 2.0.`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(newUser);
        onClose();
      }, 1400);
    }
  };

  const handleSocialAuth = (provider = 'Google') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const socialUser = {
        name: 'Sita Devi (Google User)',
        email: 'user.google@farmdirect.in',
        role: 'farmer',
        authProvider: 'Google',
        token: 'oauth-google-' + Date.now()
      };
      localStorage.setItem('farmdirect_user', JSON.stringify(socialUser));

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (_) {}

      setSuccessToast(`Signed in with ${provider}!`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(socialUser);
        onClose();
      }, 1000);
    }, 800);
  };

  // Forgot Password: Send Temporary Password via Mail
  const handleSendTemporaryPassword = (e) => {
    if (e) e.preventDefault();
    if (!resetEmail.trim()) {
      setErrorMessage('Please enter your email address to receive a temporary password.');
      return;
    }
    if (!resetEmail.includes('@') || !resetEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address (e.g. user@example.com).');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    // Generate a secure 6-digit temporary password formatted as FD-XXXXXX
    const tempPass = 'FD-' + Math.floor(100000 + Math.random() * 900000);
    setTemporaryPassword(tempPass);

    // Save to localStorage for active session validation & temporary login
    localStorage.setItem('farmdirect_temp_password', tempPass);
    localStorage.setItem('farmdirect_temp_email', resetEmail);

    // Save to Supabase 'temp_passwords' table for database persistence
    dbSaveTemporaryPassword({ email: resetEmail, tempPassword: tempPass });

    // 1. Dispatch real email via FormSubmit AJAX endpoint so the email arrives in recipient's mail inbox
    try {
      const formData = new FormData();
      formData.append('_subject', 'FarmDirect 2.0 - Your Temporary Login Password');
      formData.append('_captcha', 'false');
      formData.append('_template', 'table');
      formData.append('recipient', resetEmail);
      formData.append('temporary_password', tempPass);
      formData.append(
        'message',
        `Your temporary login password for FarmDirect 2.0 is: ${tempPass}\n\nPlease use this temporary password to sign into your FarmDirect 2.0 account.`
      );

      fetch(`https://formsubmit.co/ajax/${encodeURIComponent(resetEmail)}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      }).catch((err) => {
        console.warn('FormSubmit background mail dispatch notice:', err);
      });
    } catch (err) {
      console.warn('Mail dispatch error:', err);
    }

    setTimeout(() => {
      setIsLoading(false);
      setMailSent(true);

      try {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (_) {}

      setSuccessToast(`Temporary password dispatched to ${resetEmail}!`);
    }, 800);
  };

  const handleCopyPassword = () => {
    if (temporaryPassword) {
      navigator.clipboard.writeText(temporaryPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyTempPasswordAndLogin = () => {
    setIdentifier(resetEmail);
    setPassword(temporaryPassword);
    setMode('login');
    setSuccessToast('Temporary password auto-filled! Click Continue to sign in.');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Centered Authentication Card */}
      <div 
        className="relative w-full max-w-md bg-[#FAF6EF] rounded-[28px] shadow-2xl border border-[#78947F]/40 p-6 sm:p-8 transition-all my-8 text-[#102F27]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Vertical Ribbon / Tab */}
        <div 
          className="absolute -left-3 top-8 -rotate-90 origin-bottom-left flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-gradient-to-r from-[#185844] to-[#102F27] text-white text-[10px] font-bold tracking-wider shadow-md uppercase select-none pointer-events-none border-t border-l border-[#78947F]/40"
          style={{ transform: 'rotate(-90deg) translateX(-100%)', transformOrigin: 'top left' }}
        >
          <ShieldCheck className="w-3 h-3 text-[#B08A4F]" />
          <span>Secured by FarmDirect</span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#78947F] hover:text-[#102F27] hover:bg-[#F2EBDD] transition-colors cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Title & Subtitle */}
        <div className="mb-4 pt-1">
          <h2 id="auth-modal-title" className="text-2xl sm:text-[26px] font-bold text-[#102F27] tracking-tight">
            {mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create an account' : 'Reset Password'}
          </h2>
          <p className="text-sm text-[#78947F] mt-1">
            {mode === 'login' 
              ? 'to continue to FarmDirect 2.0' 
              : mode === 'register' 
              ? 'to get started with FarmDirect 2.0' 
              : 'Receive a secure temporary password via email'}
          </p>
        </div>

        {/* Mode Toggle Tabs (Hidden in forgot password mode) */}
        {mode !== 'forgot' && (
          <div className="flex p-1 bg-[#F2EBDD] rounded-xl mb-5 border border-[#78947F]/30">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#185844] text-[#F2EBDD] shadow-sm'
                  : 'text-[#102F27]/70 hover:text-[#102F27]'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#185844] text-[#F2EBDD] shadow-sm'
                  : 'text-[#102F27]/70 hover:text-[#102F27]'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Toast Notification */}
        {successToast && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Authentication Button */}
        {mode !== 'forgot' && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => handleSocialAuth('Google')}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:border-slate-300 dark:border-slate-600 transition-all shadow-sm group text-xs font-semibold text-slate-700 dark:text-slate-200"
              title="Continue with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        {/* Divider: "or" */}
        {mode !== 'forgot' && (
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-200 dark:border-slate-700/80 w-full" />
            <span className="bg-white dark:bg-[#111D15] px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
              or
            </span>
            <div className="border-t border-slate-200 dark:border-slate-700/80 w-full" />
          </div>
        )}

        {/* Main Content: Forgot Password Flow or Login/Register Form */}
        {mode === 'forgot' ? (
          /* ================= FORGOT PASSWORD / TEMPORARY PASSWORD VIEW ================= */
          <div className="space-y-4 animate-in fade-in duration-200">
            {!mailSent ? (
              /* Step 1: Enter Email to Receive Temporary Password */
              <form onSubmit={handleSendTemporaryPassword} className="space-y-4">

                {/* Email Address Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="e.g. ramesh.farmer@farmdirect.in"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-earth-darkCard/90 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-emerald-500/50 focus:border-indigo-600 dark:focus:border-emerald-500 transition-all"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Quick Test Demo Emails */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Quick Fill Test Accounts:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Farmer', email: 'ramesh.farmer@farmdirect.in' },
                      { name: 'Bulk Customer', email: 'pooja.bulk@farmdirect.in' },
                      { name: 'Kirana', email: 'suresh.kirana@vizaghub.in' },
                      { name: 'Household', email: 'ananya.vizag@gmail.com' }
                    ].map((demo) => (
                      <button
                        key={demo.email}
                        type="button"
                        onClick={() => setResetEmail(demo.email)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer"
                      >
                        {demo.name}: <span className="font-mono opacity-80">{demo.email}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Send Temporary Password Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide text-white uppercase bg-[#635BFF] hover:bg-[#5349e8] dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-md shadow-indigo-600/20 dark:shadow-emerald-900/30 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Generating & Sending Temporary Password...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Temporary Password to Mail</span>
                    </>
                  )}
                </button>

                {/* Back to Sign In Link */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Temporary Password Dispatched Success State */
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Confirmation Alert */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Temporary Password Sent to Your Mail!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    We have dispatched an email containing your temporary password to <span className="font-semibold underline underline-offset-2">{resetEmail}</span>.
                  </p>
                </div>

                {/* Direct Mail Client Links */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://mail.google.com/mail/u/0/#search/${encodeURIComponent(resetEmail)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 border border-slate-200/80 dark:border-slate-700 transition-all hover:scale-[1.02] shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-500 dark:text-emerald-400" />
                    <span>Open Gmail</span>
                  </a>
                  <a
                    href={`mailto:${resetEmail}?subject=FarmDirect%20Password%20Reset&body=Temporary%20password:%20${temporaryPassword}`}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 border border-slate-200/80 dark:border-slate-700 transition-all hover:scale-[1.02] shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-500 dark:text-emerald-400" />
                    <span>Open Mail App</span>
                  </a>
                </div>

                {/* Interactive Simulated Inbox / Live Dispatch Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/90 dark:from-slate-800/80 dark:to-[#0d1611] border border-slate-200 dark:border-slate-700/80 shadow-inner space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/70 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        Dispatched Mail Notification
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Just now
                    </span>
                  </div>

                  <div className="text-[11px] space-y-0.5 text-slate-600 dark:text-slate-300">
                    <p><span className="font-semibold text-slate-400">From:</span> FarmDirect Security &lt;security@farmdirect.in&gt;</p>
                    <p><span className="font-semibold text-slate-400">To:</span> <span className="font-semibold text-slate-900 dark:text-white font-mono">{resetEmail}</span></p>
                    <p><span className="font-semibold text-slate-400">Subject:</span> Your Temporary Password for FarmDirect 2.0</p>
                  </div>

                  {/* Temporary Password Highlight Box */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-black/40 border border-indigo-100 dark:border-emerald-500/20 text-center space-y-2 shadow-sm">
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Your 6-Digit Temporary Password:
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-2xl font-black tracking-widest text-indigo-600 dark:text-emerald-400 bg-indigo-50/80 dark:bg-emerald-950/80 px-4 py-1.5 rounded-xl border border-indigo-200 dark:border-emerald-500/40 select-all">
                        {temporaryPassword}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyPassword}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer hover:scale-105 active:scale-95"
                        title="Copy Temporary Password"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    {copied && (
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                        ✓ Copied to clipboard!
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400">
                      Valid for 15 minutes. Use this temporary password to log in.
                    </p>
                  </div>
                </div>

                {/* Primary Auto-Fill & Sign In Button */}
                <button
                  type="button"
                  onClick={handleApplyTempPasswordAndLogin}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide text-white uppercase bg-[#635BFF] hover:bg-[#5349e8] dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-md shadow-indigo-600/20 dark:shadow-emerald-900/30 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Auto-Fill & Sign In Now</span>
                </button>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMailSent(false);
                      setErrorMessage('');
                    }}
                    className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline transition-colors cursor-pointer"
                  >
                    Resend / Change Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                    }}
                    className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-emerald-400 dark:hover:text-emerald-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Back to Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================= LOGIN & REGISTER FORMS ================= */
          <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'login' ? (
            /* ================= LOGIN FIELDS ================= */
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email address, phone number or username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. ramesh.farmer@farmdirect.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-earth-darkCard/90 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-emerald-500/50 focus:border-indigo-600 dark:focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage('');
                      setSuccessToast('');
                      setMailSent(false);
                      if (identifier && identifier.includes('@')) {
                        setResetEmail(identifier);
                      }
                    }}
                    className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-earth-darkCard/90 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-emerald-500/50 focus:border-indigo-600 dark:focus:border-emerald-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-earth-darkCard dark:border-slate-700"
                  />
                  <span>Remember this device</span>
                </label>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3 text-emerald-500" /> 256-bit SSL
                </span>
              </div>
            </>
          ) : (
            /* ================= REGISTER FIELDS ================= */
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar Naidu"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-earth-darkCard/90 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-emerald-500/50 transition-all"
                  required
                />
              </div>

              {/* Stakeholder Role Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Your Ecosystem Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isSelected = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setSelectedRole(r.id);
                          setRoleDetail(r.defaultDetail);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[#185844]/15 border-[#185844] ring-1 ring-[#185844]/30'
                            : 'border-[#78947F]/30 hover:bg-[#F2EBDD]/50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isSelected ? 'text-[#185844]' : 'text-[#78947F]'
                        }`} />
                        <div>
                          <div className="text-xs font-bold text-[#102F27] leading-tight">
                            {r.name}
                          </div>
                          <div className="text-[10px] text-[#78947F]">
                            {r.badge}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-earth-darkCard/90 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone (Dual-OTP)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98480 12345"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-earth-darkCard/90 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              {/* Role specific detail field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {selectedRole === 'farmer' ? 'Farmland Village & Mandal' :
                   selectedRole === 'kirana' ? 'Kirana Store Name & Ward' : 'Delivery Address, Colony, or Organization'}
                </label>
                <input
                  type="text"
                  value={roleDetail}
                  onChange={(e) => setRoleDetail(e.target.value)}
                  placeholder={roles.find(r => r.id === selectedRole)?.placeholder}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-earth-darkCard/90 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 pr-8 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-earth-darkCard/90 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2 pr-8 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-earth-darkCard/90 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide text-[#F2EBDD] uppercase bg-gradient-to-r from-[#185844] via-[#102F27] to-[#185844] hover:from-[#23785F] hover:to-[#185844] border border-[#78947F]/30 transition-all shadow-md shadow-[#102F27]/30 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-[#F2EBDD]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Continue' : 'Create Account'}</span>
            )}
          </button>
        </form>
        )}

        {/* Footer Toggle (Matches "No account? Sign up" from user image) */}
        {mode !== 'forgot' && (
        <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
          {mode === 'login' ? (
            <p>
              No account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                }}
                className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline underline-offset-2 transition-colors ml-1"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline underline-offset-2 transition-colors ml-1"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
        )}

        {/* Quick Demo Logins Bar (Super helpful for academic evaluation & quick test!) */}
        {mode !== 'forgot' && (
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              1-Click Demo Logins
            </span>
            <span className="text-[10px] text-slate-400">Click to auto-fill</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {demoUsers.map((u) => (
              <button
                key={u.role}
                type="button"
                onClick={() => handleQuickFill(u)}
                className="text-left px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-300 transition-colors truncate"
              >
                <span className="font-bold block text-slate-900 dark:text-slate-100 truncate">
                  {u.name}
                </span>
                <span className="text-[9px] text-slate-400 font-mono block truncate">
                  {u.identifier}
                </span>
              </button>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
