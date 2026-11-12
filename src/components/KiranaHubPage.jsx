import React, { useState, useEffect } from 'react';
import { 
  Store, 
  ArrowLeft, 
  QrCode, 
  CheckCircle2, 
  KeyRound, 
  Package, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  Search, 
  LogOut,
  Sparkles,
  ArrowRight,
  Scale,
  Wrench,
  Truck,
  Thermometer,
  CreditCard,
  RotateCcw,
  PhoneCall,
  Plus,
  Users,
  FileText,
  CheckCheck,
  Headphones,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function KiranaHubPage({ currentUser, onSignOut, onOpenAuth, onBackToHome }) {
  const [activeTab, setActiveTab] = useState('pickup'); // 'pickup' | 'intake' | 'inventory' | 'commission' | 'services'
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [serviceToast, setServiceToast] = useState('');
  const [activeHubServiceModal, setActiveHubServiceModal] = useState(null);
  const [bookedHubServices, setBookedHubServices] = useState([
    {
      id: 'HUB-SRV-201',
      title: 'Digital Weighbridge & Bluetooth Scale Recalibration',
      status: 'Technician Assigned',
      scheduled: 'Today, 02:30 PM',
      ref: 'Essae-Teraoka Service Eng #Vizag-04'
    },
    {
      id: 'HUB-SRV-202',
      title: 'Deep-Chill Condenser Sanitization & Filter Flush',
      status: 'Completed',
      scheduled: 'Yesterday',
      ref: 'Voltas Agri-Coldcare'
    }
  ]);

  // Shop / Hub Details
  const hubName = currentUser?.name || 'Sri Lakshmi Kirana Store';
  const hubWard = currentUser?.detail || 'Sector 4, MVP Colony (Visakhapatnam - 530017)';

  // 1. Dual-OTP Customer Pickup Handshake State (PDF: "Dual-OTP escrow", "There are too many OTP steps -> simplified")
  const [otpInput, setOtpInput] = useState('');
  const [pickupResult, setPickupResult] = useState(null);
  const [pickupError, setPickupError] = useState('');

  // Active Crates / Orders held in depot
  const [heldCrates, setHeldCrates] = useState([
    {
      orderId: 'ORD-8941',
      customerName: 'Ananya Rao',
      customerPhone: '+91 98480 54321',
      crop: 'Hybrid Vine Tomato (S-12)',
      quantityKg: 6,
      pickupOtp: 'FD-4821',
      shelfSlot: 'Bay A-1',
      arrivalTime: 'Today 06:15 AM',
      status: 'Ready for Pickup', // 'Ready for Pickup' | 'Released'
      paidVia: 'UPI Prepaid Escrow',
      tamperSeal: 'SEAL-AP-9941'
    },
    {
      orderId: 'ORD-8942',
      customerName: 'K. Venkatesh',
      customerPhone: '+91 94401 22334',
      crop: 'Tender Green Bhendi',
      quantityKg: 4,
      pickupOtp: 'FD-7193',
      shelfSlot: 'Bay A-2',
      arrivalTime: 'Today 06:20 AM',
      status: 'Ready for Pickup',
      paidVia: 'UPI Prepaid Escrow',
      tamperSeal: 'SEAL-AP-9942'
    },
    {
      orderId: 'ORD-8943',
      customerName: 'S. Sunitha',
      customerPhone: '+91 98852 99881',
      crop: 'Fresh Palak (Spinach) & Chilies',
      quantityKg: 5,
      pickupOtp: 'FD-3310',
      shelfSlot: 'Bay B-1',
      arrivalTime: 'Today 06:30 AM',
      status: 'Released',
      paidVia: 'UPI Prepaid Escrow',
      tamperSeal: 'SEAL-AP-9938'
    }
  ]);

  // 2. Morning Intake QR Scan State (PDF: "QR-labelled bags + nearby pickup hubs")
  const [intakeBagCode, setIntakeBagCode] = useState('');
  const [intakeSuccess, setIntakeSuccess] = useState(null);
  const [incomingDeliveries, setIncomingDeliveries] = useState([
    {
      deliveryId: 'DEL-3PL-902',
      driverName: 'Raju (Porter 3PL #AP31TE1042)',
      originCluster: 'Kasimkota Agro-Hub, Anakapalli',
      dispatchedAt: '05:15 AM',
      cratesCount: 8,
      status: 'Intake Completed',
      verifiedWeightKg: 200.0
    },
    {
      deliveryId: 'DEL-3PL-903',
      driverName: 'Chiranjeevi (Porter 3PL #AP31TG8821)',
      originCluster: 'Pendurthi Farm Valley',
      dispatchedAt: '05:40 AM',
      cratesCount: 6,
      status: 'Awaiting Gate Scan',
      verifiedWeightKg: 150.0
    }
  ]);

  // 3. Commission & Hub Buffer State (PDF: "Hubs reaching the Rs 500 buffer", "Kirana owners accept 50/50 share")
  const [bufferCurrent, setBufferCurrent] = useState(440); // Target Rs 500 buffer
  const [totalCommissionEarned, setTotalCommissionEarned] = useState(3850);
  const [cratesHandledThisMonth, setCratesHandledThisMonth] = useState(154);

  // Process Dual-OTP Handshake
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setPickupError('');
    setPickupResult(null);

    const cleanPin = otpInput.trim().toUpperCase();
    const formattedPin = cleanPin.startsWith('FD-') ? cleanPin : `FD-${cleanPin}`;

    // Look for matching crate
    const matched = heldCrates.find(
      c => c.pickupOtp.toUpperCase() === formattedPin && c.status === 'Ready for Pickup'
    );

    if (matched) {
      // Mark as released
      setHeldCrates(prev => prev.map(c => {
        if (c.orderId === matched.orderId) {
          return { ...c, status: 'Released' };
        }
        return c;
      }));

      // Add commission earnings (₹25 per crate/order)
      setTotalCommissionEarned(prev => prev + 25);
      setBufferCurrent(prev => Math.min(500, prev + 20));

      setPickupResult({
        ...matched,
        handshakeTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setOtpInput('');

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (_) {}
    } else {
      setPickupError(`Invalid OTP PIN '${otpInput}'. Please verify customer pickup code.`);
    }
  };

  // Simulate Crate Intake Check-in
  const handleIntakeCheckin = (e) => {
    e.preventDefault();
    const bagId = intakeBagCode.trim() || `BAG-FD-${Math.floor(910 + Math.random() * 80)}`;
    const newCrate = {
      orderId: `ORD-${Math.floor(8950 + Math.random() * 50)}`,
      customerName: 'Walk-in Household Customer',
      customerPhone: '+91 98480 11223',
      crop: 'Native Hill Potatoes & Onions',
      quantityKg: 10,
      pickupOtp: `FD-${Math.floor(1000 + Math.random() * 9000)}`,
      shelfSlot: `Bay B-${Math.floor(1 + Math.random() * 4)}`,
      arrivalTime: 'Just checked in',
      status: 'Ready for Pickup',
      paidVia: 'UPI Prepaid Escrow',
      tamperSeal: `SEAL-AP-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setHeldCrates(prev => [newCrate, ...prev]);
    setIntakeSuccess(`Crate ${bagId} logged into Depot inventory. Shelved in ${newCrate.shelfSlot}.`);
    setIntakeBagCode('');
    setTimeout(() => setIntakeSuccess(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F2EBDD] text-[#102F27] transition-colors duration-200">
      
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="sticky top-0 z-30 bg-[#F2EBDD]/95 backdrop-blur-md border-b border-[#78947F]/30 px-4 sm:px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Back & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 -ml-1 rounded-xl text-[#102F27]/70 hover:text-[#102F27] hover:bg-[#FAF6EF] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Return to Home Screen"
            >
              <ArrowLeft className="w-4 h-4 text-[#185844]" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#102F27] via-[#185844] to-[#102F27] flex items-center justify-center text-white shadow-sm border border-[#78947F]/30">
                <Store className="w-4 h-4 text-[#B08A4F]" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-[#102F27]">
                  Kirana <span className="text-[#B08A4F]">Micro-Depot</span>
                </span>
                <span className="hidden md:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#B08A4F]/20 text-[#102F27] border border-[#B08A4F]/40">
                  Ward Partner Node
                </span>
              </div>
            </div>
          </div>

          {/* Location Badge & Profile Button */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6EF] border border-[#78947F]/30 text-xs text-[#102F27]">
              <MapPin className="w-3.5 h-3.5 text-[#B08A4F]" />
              <span className="font-semibold truncate max-w-[160px]">{hubWard.split('(')[0]}</span>
            </div>

            <button
              onClick={() => setProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF6EF] hover:bg-[#F2EBDD] border border-[#78947F]/35 text-xs font-bold text-[#102F27] transition-all shadow-sm cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-[#B08A4F] text-[#F2EBDD] flex items-center justify-center text-[11px] font-bold">
                {hubName.charAt(0)}
              </div>
              <span className="hidden sm:inline-block max-w-[120px] truncate">{hubName}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold bg-[#B08A4F]/20 text-[#102F27]">
                Kirana Hub
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* ================= FUNCTIONAL TABS BAR (NO MARKETING FLUFF) ================= */}
      <div className="bg-[#FAF6EF] border-b border-[#78947F]/25 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5">
          {[
            { id: 'pickup', label: 'Customer Pickup (Dual-OTP)', icon: KeyRound, count: heldCrates.filter(c => c.status === 'Ready for Pickup').length },
            { id: 'intake', label: 'Morning Crate Intake & QR Scan', icon: QrCode },
            { id: 'inventory', label: 'Held Depot Inventory', icon: Package, count: heldCrates.length },
            { id: 'commission', label: 'Commission & ₹500 Buffer', icon: DollarSign },
            { id: 'services', label: 'Hub Services & Ops', icon: Wrench, count: bookedHubServices.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#185844] text-[#F2EBDD] shadow-sm shadow-[#102F27]/20'
                    : 'text-[#102F27]/70 hover:bg-[#F2EBDD]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white text-amber-800' : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* =========================================================================
            TAB 1: DUAL-OTP CUSTOMER PICKUP (PDF Page 8, 11, 14, 19, 23)
            ========================================================================= */}
        {activeTab === 'pickup' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Context Header */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/25 flex items-start gap-3">
              <KeyRound className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200 space-y-0.5">
                <p className="font-bold">Dual-OTP Zero-Trust Handshake Protocol</p>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                  When a neighborhood household arrives to pick up their vegetable crate, enter their 4-digit pickup code. 
                  Validating this code releases the crate custody and triggers instant UPI payout to the farmer.
                </p>
              </div>
            </div>

            {/* OTP Verification Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-amber-500/20 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Enter Customer Pickup Code</span>
                <span className="text-[11px] font-normal text-slate-400">Format: FD-XXXX</span>
              </h3>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.toUpperCase())}
                      placeholder="e.g. 4821 or FD-4821"
                      className="w-full px-4 py-3 rounded-2xl text-center font-mono text-xl sm:text-2xl font-black tracking-widest bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      maxLength={7}
                      required
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl font-bold text-xs tracking-wide uppercase text-white bg-amber-600 hover:bg-amber-500 transition-all shadow-md shadow-amber-900/20 flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Check className="w-4 h-4" />
                    <span>Verify & Release</span>
                  </button>
                </div>

                {/* Quick Test Codes */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                  <span>Quick Test Codes:</span>
                  {heldCrates.filter(c => c.status === 'Ready for Pickup').map(c => (
                    <button
                      key={c.pickupOtp}
                      type="button"
                      onClick={() => setOtpInput(c.pickupOtp)}
                      className="px-2 py-0.5 rounded-lg font-mono font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {c.pickupOtp} ({c.customerName.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </form>

              {/* Error Message */}
              {pickupError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{pickupError}</span>
                </div>
              )}

              {/* Handshake Success Receipt */}
              {pickupResult && (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-900 dark:text-emerald-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
                    <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Crate Released Successfully!</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{pickupResult.handshakeTime}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Customer:</span>
                      <p className="font-bold">{pickupResult.customerName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Order Produce:</span>
                      <p className="font-bold">{pickupResult.crop} ({pickupResult.quantityKg} kg)</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Storage Slot:</span>
                      <p className="font-bold text-amber-600">{pickupResult.shelfSlot}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Hub Handshake Fee:</span>
                      <p className="font-bold text-emerald-600">+₹25 Credited</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-black/30 border border-emerald-500/20 text-[11px] text-slate-600 dark:text-slate-300">
                    ✓ Farmer UPI payout escrow unlocked and dispatched automatically.
                  </div>
                </div>
              )}

            </div>

            {/* Waiting Pickups Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pending Pickups in Holding Bay ({heldCrates.filter(c => c.status === 'Ready for Pickup').length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {heldCrates.filter(c => c.status === 'Ready for Pickup').map(c => (
                  <div key={c.orderId} className="p-4 rounded-2xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{c.customerName}</span>
                        <p className="text-[11px] text-slate-400">{c.customerPhone}</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-300/40">
                        {c.shelfSlot}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                      <span>{c.crop}</span>
                      <span className="font-mono font-bold">{c.quantityKg} kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: MORNING CRATE INTAKE & QR SCAN (PDF Page 8, 11, 14, 15, 19)
            ========================================================================= */}
        {activeTab === 'intake' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Quick Intake Form */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-amber-500/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-amber-600" />
                  <span>Scan / Log Incoming Farm Crate</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">3PL Van Delivery Gate</span>
              </div>

              <form onSubmit={handleIntakeCheckin} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={intakeBagCode}
                    onChange={(e) => setIntakeBagCode(e.target.value)}
                    placeholder="Enter Bag Barcode e.g. BAG-FD-901 or scan QR"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-amber-600 hover:bg-amber-500 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Check In Crate</span>
                </button>
              </form>

              {intakeSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{intakeSuccess}</span>
                </div>
              )}
            </div>

            {/* 3PL Morning Manifests */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Morning Porter 3PL Delivery Manifests
              </h4>

              <div className="space-y-3">
                {incomingDeliveries.map((del) => (
                  <div key={del.deliveryId} className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{del.deliveryId}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {del.status}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Driver: {del.driverName} • Origin: {del.originCluster}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Dispatched: {del.dispatchedAt} • Total Weight: {del.verifiedWeightKg} kg
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-slate-700 dark:text-slate-200">{del.cratesCount} Crates</span>
                      <button
                        onClick={() => {
                          setIncomingDeliveries(prev => prev.map(d => d.deliveryId === del.deliveryId ? { ...d, status: 'Intake Completed' } : d));
                          setIntakeSuccess(`Manifest ${del.deliveryId} verified with zero weight disputes.`);
                        }}
                        disabled={del.status === 'Intake Completed'}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                      >
                        {del.status === 'Intake Completed' ? 'Verified' : 'Verify All Crates'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: DEPOT INVENTORY (PDF Page 8, 11, 21)
            ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Depot Storage Crates & Shelf Bays</h3>
                <p className="text-xs text-slate-500">Live custody tracking of pre-sorted vegetables in your Kirana store</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {heldCrates.filter(c => c.status === 'Ready for Pickup').length} pending collection
              </span>
            </div>

            <div className="overflow-x-auto rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-slate-800 shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-black/30 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Order / Crate ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Produce & Weight</th>
                    <th className="py-3 px-4">Shelf Slot</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Tamper Seal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {heldCrates.map((c) => (
                    <tr key={c.orderId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {c.orderId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{c.customerName}</span>
                        <span className="block text-[10px] text-slate-400">{c.customerPhone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold">{c.crop}</span>
                        <span className="block text-[11px] font-mono font-bold text-emerald-600">{c.quantityKg} kg</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {c.shelfSlot}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'Released'
                            ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400 text-[11px]">
                        {c.tamperSeal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: COMMISSION & ₹500 BUFFER (PDF Page 12, 16, 19: "Hubs reaching Rs 500 buffer", "50/50 share")
            ========================================================================= */}
        {activeTab === 'commission' && (
          <div className="space-y-6">
            
            {/* Top Revenue Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-amber-500/20 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Commission Earned</span>
                <p className="font-mono text-2xl font-black text-slate-900 dark:text-white mt-1">
                  ₹{totalCommissionEarned.toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold">50/50 platform-hub fee share</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-amber-500/20 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Crates Handled This Month</span>
                <p className="font-mono text-2xl font-black text-amber-600 mt-1">{cratesHandledThisMonth}</p>
                <span className="text-[10px] text-slate-400">Avg. 5.2 crates/day processed</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-amber-500/20 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CapEx Incurred</span>
                <p className="font-mono text-2xl font-black text-emerald-600 mt-1">₹0</p>
                <span className="text-[10px] text-slate-400">Zero investment, used existing shop</span>
              </div>
            </div>

            {/* Hub Buffer Progress Box (PDF Page 12: "Hubs reaching the Rs 500 buffer") */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-amber-500/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Monthly Hub Retention Security Buffer (Target: ₹500)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Micro-depot buffer unlocks zero-liability insurance and recurring monthly bonus
                  </p>
                </div>
                <span className="font-mono text-base font-black text-amber-600">
                  ₹{bufferCurrent} / ₹500
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(bufferCurrent / 500) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>Current Progress: {Math.round((bufferCurrent / 500) * 100)}%</span>
                <span className="text-emerald-600 font-bold">Only ₹{500 - bufferCurrent} remaining to reach 100% buffer</span>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 5: KIRANA HUB PARTNER SERVICES & OPS (DOMAIN SPECIFIC)
            ========================================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 uppercase tracking-wide">
                  Micro-Depot Partner Services
                </span>
                <h2 className="text-xl font-black mt-1">
                  Hub Hardware Maintenance, Instant Payouts & Transit Support
                </h2>
                <p className="text-xs text-amber-100/90 mt-1 max-w-2xl">
                  Keep your Kirana micro-depot running at peak efficiency with on-demand chiller servicing, Bluetooth weighbridge calibration, and zero-loss transit compensation.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-amber-300">Hub Partner Hotline</p>
                  <p className="text-xs font-mono font-bold text-white">0891-285-4400</p>
                  <span className="text-[9px] text-amber-200">24/7 Priority Operations Room</span>
                </div>
              </div>
            </div>

            {/* Service Action Toast */}
            {serviceToast && (
              <div className="p-3.5 rounded-2xl bg-amber-600 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{serviceToast}</span>
                </div>
                <button onClick={() => setServiceToast('')} className="text-white/80 hover:text-white">✕</button>
              </div>
            )}

            {/* Active Booked Services Status */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-amber-500/20 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Your Hub Service Requests & Maintenance Appointments</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  {bookedHubServices.length} Active Records
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bookedHubServices.map(srv => (
                  <div key={srv.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{srv.title}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {srv.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Scheduled: <span className="font-semibold text-slate-700 dark:text-slate-200">{srv.scheduled}</span>
                      </p>
                      <p className="text-[10px] text-amber-600 font-mono">Assigned: {srv.ref}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{srv.id}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6 Grid Kirana Services Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* SERVICE 1: Deep-Chill Chiller Maintenance */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-amber-500/20 shadow-sm flex flex-col justify-between hover:border-amber-500/50 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-400 flex items-center justify-center shadow-sm">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      Cold-Storage Upkeep
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      Hub Deep-Chill Maintenance & Coil Flush
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Certified refrigeration technician visits within 4 hours. Includes condenser sanitization, refrigerant top-up, and temperature sensor calibration.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 text-[11px] text-cyan-900 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-900/40 space-y-1">
                    <div className="flex justify-between">
                      <span>Service Fee:</span>
                      <span className="font-bold text-emerald-600">100% Covered by FarmDirect Buffer</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Arrival SLA:</span>
                      <span className="font-semibold">&lt; 4 Hours on Priority Call</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveHubServiceModal({
                    title: 'Hub Deep-Chill Technician Request',
                    type: 'chiller',
                    partner: 'Voltas Agri-Coldcare Vizag Services',
                    fee: '₹0 (Subsidized Platform Maintenance)',
                    timing: 'Today Afternoon (Within 3 Hours)'
                  })}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Request Chiller Technician</span>
                </button>
              </div>

              {/* SERVICE 2: Bluetooth Scale & Hardware */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-amber-500/20 shadow-sm flex flex-col justify-between hover:border-amber-500/50 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center shadow-sm">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Precision Hardware
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      Smart Scale Calibration & Tamper QR Seals
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Quarterly recalibration of Essae-Teraoka Bluetooth weighbridge with certified test weights. Restock rolls of tamper-evident AP security barcode seals.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-[11px] text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 space-y-1">
                    <div className="flex justify-between">
                      <span>Seal Bundle:</span>
                      <span className="font-bold">500 Tamper Labels (Free Dispatch)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Legal Metrology:</span>
                      <span className="font-semibold text-emerald-600">Govt Stamping Compliance</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveHubServiceModal({
                    title: 'Scale Recalibration & QR Seal Roll Dispatch',
                    type: 'scale',
                    partner: 'Essae Metrology Field Services',
                    fee: '₹0 (Supplied by Platform)',
                    timing: 'Tomorrow Morning Dispatch'
                  })}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Order Calibration & Seals</span>
                </button>
              </div>

              {/* SERVICE 3: Instant Daily UPI Settlement */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-amber-500/20 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Instant Liquidity
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      Instant Daily UPI Commission Cashout
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Withdraw earned staging commissions (₹4.50/crate + ₹15/delivery) in real-time. Zero waiting for monthly billing cycles; payouts hit your UPI in seconds.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-[11px] text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                    <div className="flex justify-between">
                      <span>Available Payout:</span>
                      <span className="font-bold text-emerald-600 font-mono">₹1,485.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transfer Channel:</span>
                      <span className="font-semibold">Instant IMPS / UPI 2.0</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setServiceToast('Instant Cashout of ₹1,485.50 dispatched to merchant UPI ID.');
                    try { confetti({ particleCount: 60, spread: 60 }); } catch (_) {}
                  }}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Cashout Balance to UPI</span>
                </button>
              </div>

              {/* SERVICE 4: Zero-Loss Transit Damage Claim */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-amber-500/20 shadow-sm flex flex-col justify-between hover:border-rose-500/50 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 flex items-center justify-center shadow-sm">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      Zero Merchant Risk
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      Line-Haul Transit Spoilage Claim Desk
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Received damaged crates from the morning 3PL line-haul truck? Log a photo before gate intake for an immediate credit adjustment. Zero loss for your store.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-[11px] text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 space-y-1">
                    <div className="flex justify-between">
                      <span>Approval Speed:</span>
                      <span className="font-bold text-rose-600">Auto-approved &lt; 15 mins</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protection:</span>
                      <span className="font-semibold">Covered by 3PL Transit Insurance</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveHubServiceModal({
                    title: 'Line-Haul Spoilage Compensation Claim',
                    type: 'spoilage',
                    partner: 'FarmDirect Escrow & 3PL Transit Underwriters',
                    fee: '100% Credit Reimbursement',
                    timing: 'Immediate Credit to Ledger'
                  })}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>File Spoilage Claim</span>
                </button>
              </div>

              {/* SERVICE 5: Hyperlocal Delivery Fleet */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-amber-500/20 shadow-sm flex flex-col justify-between hover:border-indigo-500/50 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Last-Mile Fleet
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      On-Demand Electric Delivery Rider Pool
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Activate pre-screened local delivery riders for early morning doorstep drop-offs in your 2km ward radius. Increase store throughput without hiring full-time staff.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-[11px] text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/40 space-y-1">
                    <div className="flex justify-between">
                      <span>Rider Payout:</span>
                      <span className="font-bold text-indigo-600">₹15.00 / drop</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Riders:</span>
                      <span className="font-semibold">3 Active in MVP Sector 4</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveHubServiceModal({
                    title: 'On-Demand Delivery Rider Fleet Callout',
                    type: 'fleet',
                    partner: 'Hyperlocal EV Logistics Network',
                    fee: '₹15/drop auto-billed to order fee',
                    timing: 'Tomorrow Morning Shift (06:00 - 08:30 AM)'
                  })}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Call Out Delivery Riders</span>
                </button>
              </div>

              {/* SERVICE 6: Dispatch Helpline */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-amber-500/20 shadow-sm flex flex-col justify-between hover:border-amber-500/50 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center shadow-sm">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Operations Desk
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      Priority Line-Haul Controller Hotline
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Direct intercom with the Visakhapatnam Central Dispatch Desk for unexpected delivery delays, extra crate requests, or route alterations.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-[11px] text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 space-y-1">
                    <div className="flex justify-between">
                      <span>Dispatch Controller:</span>
                      <span className="font-bold text-slate-900 dark:text-white">K. Mohan (+91 891 255-8812)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Fleet:</span>
                      <span className="font-semibold text-emerald-600">8 Porter Reefer Trucks En Route</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setServiceToast('Line-Haul Controller notified: K. Mohan (+91 891 255-8812) connected.');
                  }}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Dispatch Controller</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ================= HUB SERVICE CONFIRMATION MODAL ================= */}
      {activeHubServiceModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveHubServiceModal(null)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-[#111D16] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-amber-500/30 space-y-4 text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Confirm Hub Service Request
                </h3>
              </div>
              <button onClick={() => setActiveHubServiceModal(null)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-bold">Requested Service</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{activeHubServiceModal.title}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Provider:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeHubServiceModal.partner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Timeframe:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeHubServiceModal.timing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cost Terms:</span>
                  <span className="font-bold text-emerald-600">{activeHubServiceModal.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Store Ward:</span>
                  <span className="font-semibold">{hubWard}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveHubServiceModal(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newBooking = {
                    id: 'HUB-SRV-' + Math.floor(203 + Math.random() * 50),
                    title: activeHubServiceModal.title,
                    scheduled: activeHubServiceModal.timing,
                    ref: activeHubServiceModal.partner,
                    status: 'Dispatched & Confirmed'
                  };
                  setBookedHubServices(prev => [newBooking, ...prev]);
                  setServiceToast(`Hub service confirmed! Ref: ${newBooking.id} assigned to ${activeHubServiceModal.partner}.`);
                  setActiveHubServiceModal(null);
                  try {
                    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                  } catch (_) {}
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Service</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PROFILE MODAL ================= */}
      {profileModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setProfileModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-white dark:bg-[#111D16] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-amber-500/30 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kirana Depot Profile</h3>
              <button onClick={() => setProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-base">
                {hubName.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{hubName}</h4>
                <p className="text-xs text-slate-500 truncate max-w-[190px]">{hubWard}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Role: Micro-Depot Partner
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Ward Pincode:</span>
                <span className="font-mono font-bold">530017 (MVP Colony)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Holding Bay Capacity:</span>
                <span className="font-semibold">25 Standard Crates</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Depot Operating Hours:</span>
                <span className="font-semibold">06:00 AM - 09:30 PM</span>
              </div>
            </div>

            {currentUser ? (
              <button
                onClick={() => {
                  setProfileModalOpen(false);
                  onSignOut();
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setProfileModalOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 cursor-pointer"
              >
                Sign In to Save Account
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
