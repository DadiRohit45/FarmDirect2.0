import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sprout, 
  ArrowLeft, 
  User, 
  Plus, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Check, 
  Copy, 
  Mic, 
  MapPin, 
  Scale, 
  FileText, 
  Zap,
  Printer,
  ChevronRight,
  LogOut,
  Wrench,
  Truck,
  Thermometer,
  PhoneCall,
  CloudSun,
  CreditCard,
  FlaskConical,
  Calendar,
  Building2,
  HelpCircle,
  ExternalLink,
  Umbrella,
  Navigation,
  Activity,
  CheckCheck,
  Eye,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dbFetchFarmers, dbFetchOrders } from '../lib/supabaseClient';

export default function FarmerPage({ currentUser, onSignOut, onOpenAuth, onBackToHome }) {
  const [activeTab, setActiveTab] = useState(() => {
    if (window.location.hash === '#farmer-tracking') return 'tracking';
    if (window.location.hash === '#rwbcis' || window.location.hash === '#farmer-services') return 'services';
    return 'harvest';
  }); // 'harvest' | 'matches' | 'tracking' | 'qrbags' | 'payouts' | 'services'

  // Sync activeTab on hashchange (e.g., from AI Assistant deep-links)
  useEffect(() => {
    const handleFarmerHash = () => {
      const h = window.location.hash;
      if (h === '#farmer-tracking') setActiveTab('tracking');
      else if (h === '#rwbcis' || h === '#farmer-services') setActiveTab('services');
      else if (h === '#farmer' || h === '#harvest') setActiveTab('harvest');
      else if (h === '#matches') setActiveTab('matches');
      else if (h === '#qrbags') setActiveTab('qrbags');
      else if (h === '#payouts') setActiveTab('payouts');
    };
    window.addEventListener('hashchange', handleFarmerHash);
    return () => window.removeEventListener('hashchange', handleFarmerHash);
  }, []);

  const [isTelugu, setIsTelugu] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeServiceModal, setActiveServiceModal] = useState(null);
  const [serviceToast, setServiceToast] = useState('');

  // =========================================================================
  // RWBCIS: Restructured Weather Based Crop Insurance Scheme State
  // =========================================================================
  const [rwbcisModalOpen, setRwbcisModalOpen] = useState(false);
  const [rwbcisAcreage, setRwbcisAcreage] = useState(2);
  const [rwbcisCrop, setRwbcisCrop] = useState('Hybrid Tomato (S-12)');
  const [rwbcisMandal, setRwbcisMandal] = useState('Kasimkota AWS Station (#AP-MET-14)');
  const [enrolledRwbcisPolicies, setEnrolledRwbcisPolicies] = useState([
    {
      policyId: 'RWBCIS-AP-2026-9812',
      crop: 'Hybrid Tomato (S-12)',
      acreage: 2,
      sumInsured: 44000,
      farmerPremium: 660, // 1.5%
      govtSubsidy: 43340, // 98.5%
      awsStation: 'Kasimkota AWS (#AP-MET-14)',
      period: 'Kharif/Rabi 2026-27',
      status: 'Active Policy Covered',
      triggerParameters: 'Rainfall Deficit (>45%) or Heat Wave (>38°C for 3 consecutive days)',
      claimStatus: 'Nominal Weather (Zero Deficit)'
    }
  ]);

  // =========================================================================
  // FARMER LIVE DISPATCH & ORDER TRACKING STATE
  // =========================================================================
  const [dispatchFilter, setDispatchFilter] = useState('all');
  const [farmerDispatches, setFarmerDispatches] = useState([
    {
      dispatchId: 'DSP-AP-801',
      matchId: 'MATCH-801',
      buyerName: 'Novotel Varun Beach Vizag',
      buyerType: 'Institutional Anchor Kitchen',
      crop: 'Hybrid Tomato (S-12)',
      quantityKg: 200,
      cratesCount: 8,
      collarPrice: 28,
      escrowLocked: 5600,
      carrier: 'Porter Electric Reefer Van',
      driverName: 'Suresh Maddala (+91 98480 33441)',
      vehicleNumber: 'AP-31-TV-8821',
      cargoTemp: '10.4°C (Nominal 8-12°C)',
      status: 'In Transit',
      dispatchedAt: 'Today 05:45 AM',
      estArrival: '06:30 AM (In 15 mins)',
      currentStep: 4,
      steps: [
        { title: 'Safe Contract Accepted & Escrow Funded', time: '05:00 AM', done: true },
        { title: 'QR Bags Weighed & Tamper Sealed (Gross: 26.2kg/crate)', time: '05:30 AM', done: true },
        { title: 'Farmgate 3PL Reefer Pickup Handshake', time: '05:45 AM', done: true },
        { title: 'Cold-Chain Line-Haul Transit (Anandapuram Agro-Corridor)', time: '06:00 AM', done: true, active: true },
        { title: 'Dock Receiving Bay Weighbridge & Tamper Scan', time: 'Est. 06:30 AM', done: false },
        { title: 'Instant UPI Escrow Payout to Farmer Account', time: 'Pending Scan', done: false }
      ]
    },
    {
      dispatchId: 'DSP-AP-802',
      matchId: 'MATCH-802',
      buyerName: 'MVP Colony Kirana Cluster Hub #1',
      buyerType: 'Hyperlocal Micro-Depot',
      crop: 'Hybrid Tomato (S-12)',
      quantityKg: 150,
      cratesCount: 6,
      collarPrice: 27,
      escrowLocked: 4050,
      carrier: 'Porter 3PL Reefer',
      driverName: 'Raju (+91 94401 22990)',
      vehicleNumber: 'AP-31-TE-1042',
      cargoTemp: '9.8°C',
      status: 'Delivered',
      dispatchedAt: 'Today 05:15 AM',
      estArrival: '06:05 AM',
      currentStep: 6,
      upiRef: 'UPI/2026/AP/98124098',
      payoutSpeed: 'Settled in 6.2 seconds after hub scan',
      steps: [
        { title: 'Safe Contract Accepted & Escrow Funded', time: '04:45 AM', done: true },
        { title: 'QR Bags Weighed & Tamper Sealed', time: '05:00 AM', done: true },
        { title: 'Farmgate 3PL Reefer Pickup Handshake', time: '05:15 AM', done: true },
        { title: 'Cold-Chain Line-Haul Transit', time: '05:45 AM', done: true },
        { title: 'Hub Receiving Bay Weighbridge & Tamper Scan', time: '06:05 AM', done: true },
        { title: 'Instant UPI Escrow Payout Released (+₹4,050.00)', time: '06:05:06 AM', done: true }
      ]
    }
  ]);
  const [bookedServices, setBookedServices] = useState([
    {
      id: 'SRV-AG-101',
      title: 'Farmgate 3PL Reefer Pickup Truck',
      scheduledDate: 'Tomorrow 05:00 AM',
      partner: 'Porter Cold-Chain Fleet (AP-31-TV-8821)',
      status: 'Confirmed & En Route'
    },
    {
      id: 'SRV-AG-102',
      title: 'Soil N-P-K & Carbon Profiling Drive',
      scheduledDate: 'Oct 24, 2026',
      partner: 'Rythu Bharosa Kendra (Kasimkota Node)',
      status: 'Sample Pickup Scheduled'
    }
  ]);

  // Farmer Details State
  const farmerName = currentUser?.name || 'Ramesh Naidu';
  const farmerVillage = currentUser?.detail || 'Kasimkota, Anandapuram Mandal (Visakhapatnam)';

  // 1. Blind Yield Input Form State (PDF: "Blind yield input, no browsing")
  const [cropName, setCropName] = useState('Hybrid Tomato (S-12)');
  const [harvestQuantity, setHarvestQuantity] = useState(350);
  const [acreage, setAcreage] = useState(2);
  const [harvestDate, setHarvestDate] = useState('Tomorrow Dawn (5:30 AM)');
  const [floorPrice, setFloorPrice] = useState(26); // Safe contract floor price
  const [isListening, setIsListening] = useState(false);
  const [harvestLoggedSuccess, setHarvestLoggedSuccess] = useState(false);

  // 2. Active Safe Contracts & Directed Matches State (PDF: "Directed dispatch, price collar and escrow")
  const [matches, setMatches] = useState([
    {
      id: 'MATCH-801',
      buyerName: 'Novotel Varun Beach Vizag',
      buyerType: 'Institutional Anchor',
      crop: 'Hybrid Tomato (S-12)',
      quantityKg: 200,
      agreedPrice: 28,
      mandiBenchmark: 18,
      matchScore: 96,
      distanceKm: 18,
      timeRemainingMinutes: 84,
      status: 'pending', // 'pending' | 'accepted' | 'dispatched'
      contractType: 'Safe Contract (Floor Protected)'
    },
    {
      id: 'MATCH-802',
      buyerName: 'MVP Colony Kirana Cluster Hub #1',
      buyerType: 'Micro-Depot Network',
      crop: 'Hybrid Tomato (S-12)',
      quantityKg: 150,
      agreedPrice: 27,
      mandiBenchmark: 18,
      matchScore: 92,
      distanceKm: 12,
      timeRemainingMinutes: 45,
      status: 'pending',
      contractType: 'Safe Contract (Floor Protected)'
    }
  ]);

  // 3. QR Produce Bags State (PDF: "QR-labelled bags eliminate weight disputes")
  const [qrBags, setQrBags] = useState([
    {
      bagId: 'BAG-FD-901',
      crop: 'Hybrid Tomato (S-12)',
      netWeightKg: 25.0,
      tareWeightKg: 1.2,
      grossWeightKg: 26.2,
      packTime: 'Today, 05:45 AM',
      tamperSeal: 'SEAL-AP-9941',
      status: 'Verified at Farmgate',
      qrCodeString: 'FD:BAG:901:RAMESH:TOMATO:25KG:SEAL9941'
    },
    {
      bagId: 'BAG-FD-902',
      crop: 'Hybrid Tomato (S-12)',
      netWeightKg: 25.0,
      tareWeightKg: 1.2,
      grossWeightKg: 26.2,
      packTime: 'Today, 05:50 AM',
      tamperSeal: 'SEAL-AP-9942',
      status: 'Verified at Farmgate',
      qrCodeString: 'FD:BAG:902:RAMESH:TOMATO:25KG:SEAL9942'
    },
    {
      bagId: 'BAG-FD-903',
      crop: 'Hybrid Tomato (S-12)',
      netWeightKg: 25.0,
      tareWeightKg: 1.2,
      grossWeightKg: 26.2,
      packTime: 'Today, 05:55 AM',
      tamperSeal: 'SEAL-AP-9943',
      status: 'In Transit via 3PL',
      qrCodeString: 'FD:BAG:903:RAMESH:TOMATO:25KG:SEAL9943'
    }
  ]);

  // 4. Instant Payouts & Escrow Ledger State (PDF: "Quick payment feels safe, instant payout")
  const [payouts, setPayouts] = useState([
    {
      payoutId: 'PAY-FD-3312',
      date: 'Yesterday',
      crop: 'Fresh Palak & Okra',
      quantityKg: 180,
      amount: 4860,
      upiRef: 'UPI/39201948102/SBI',
      status: 'Credited to Bank',
      speed: 'Instant (12s after Kirana OTP)'
    },
    {
      payoutId: 'PAY-FD-3290',
      date: '3 Days Ago',
      crop: 'Hybrid Tomato (Crate Batch A)',
      quantityKg: 300,
      amount: 8400,
      upiRef: 'UPI/39109482104/SBI',
      status: 'Credited to Bank',
      speed: 'Instant (8s after Hub Handshake)'
    }
  ]);

  // Voice Input Simulator (Telugu / English)
  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setCropName('Purple Round Brinjal (Vankaya)');
      setHarvestQuantity(220);
      setFloorPrice(24);
      setHarvestLoggedSuccess(true);
      setTimeout(() => setHarvestLoggedSuccess(false), 3000);
    }, 1500);
  };

  // Submit Blind Yield Harvest Log
  const handleLogHarvest = (e) => {
    e.preventDefault();
    const newMatch = {
      id: 'MATCH-' + Math.floor(810 + Math.random() * 90),
      buyerName: 'Andhra University Dining Mess',
      buyerType: 'Institutional Anchor',
      crop: cropName,
      quantityKg: Math.min(harvestQuantity, 250),
      agreedPrice: Math.max(floorPrice + 2, 28),
      mandiBenchmark: floorPrice - 6,
      matchScore: 97,
      distanceKm: 14,
      timeRemainingMinutes: 120,
      status: 'pending',
      contractType: 'Safe Contract (Floor Protected)'
    };

    setMatches(prev => [newMatch, ...prev]);

    // Generate new QR bags for this harvest
    const newBags = Array.from({ length: Math.min(3, Math.ceil(harvestQuantity / 50)) }).map((_, i) => ({
      bagId: `BAG-FD-${Math.floor(904 + Math.random() * 90)}`,
      crop: cropName,
      netWeightKg: 25.0,
      tareWeightKg: 1.2,
      grossWeightKg: 26.2,
      packTime: 'Just logged',
      tamperSeal: `SEAL-AP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Ready for Tagging',
      qrCodeString: `FD:BAG:${Math.floor(100 + Math.random() * 900)}:${cropName}:25KG`
    }));
    setQrBags(prev => [...newBags, ...prev]);

    setHarvestLoggedSuccess(true);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}

    setTimeout(() => {
      setHarvestLoggedSuccess(false);
      setActiveTab('matches');
    }, 1200);
  };

  // Accept Safe Contract Offer
  const handleAcceptMatch = (matchId) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return { ...m, status: 'accepted' };
      }
      return m;
    }));

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (_) {}
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
                <Sprout className="w-4 h-4 text-[#B08A4F]" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-[#102F27]">
                  Farmer <span className="text-[#185844]">Portal</span>
                </span>
                <span className="hidden md:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#185844]/15 text-[#185844] border border-[#78947F]/30">
                  e-Crop Verified Producer
                </span>
              </div>
            </div>
          </div>

          {/* Controls: Telugu Language Toggle & Profile Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bilingual Telugu Voice Support Toggle */}
            <button
              onClick={() => setIsTelugu(!isTelugu)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF6EF] text-[#B08A4F] border border-[#B08A4F]/40 hover:bg-[#B08A4F]/10 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Switch language to Telugu"
            >
              <span className="text-xs">🌐</span>
              <span>{isTelugu ? 'English' : 'తెలుగు (Telugu)'}</span>
            </button>

            {/* Profile Button */}
            <button
              onClick={() => setProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF6EF] hover:bg-[#F2EBDD] border border-[#78947F]/35 text-xs font-bold text-[#102F27] transition-all shadow-sm cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-[#185844] text-[#F2EBDD] flex items-center justify-center text-[11px] font-bold">
                {farmerName.charAt(0)}
              </div>
              <span className="hidden sm:inline-block max-w-[110px] truncate">{farmerName}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold bg-[#185844]/15 text-[#185844]">
                Farmer
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* ================= FUNCTIONAL TABS BAR (NO MARKETING FLUFF) ================= */}
      <div className="bg-[#FAF6EF] border-b border-[#78947F]/25 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5">
          {[
            { id: 'harvest', label: isTelugu ? 'పంట నమోదు (Blind Yield Input)' : 'Log Harvest (Blind Yield)', icon: Plus },
            { id: 'matches', label: isTelugu ? 'డైరెక్టెడ్ మ్యాచ్‌లు (Safe Contracts)' : 'Safe Contracts & Matches', count: matches.filter(m => m.status === 'pending').length, icon: ShieldCheck },
            { id: 'tracking', label: isTelugu ? 'ఆర్డర్ & డిస్పాచ్ ట్రాకింగ్' : 'Order & Dispatch Tracking', count: farmerDispatches.filter(d => d.status === 'In Transit').length, icon: Truck },
            { id: 'qrbags', label: isTelugu ? 'క్యూఆర్ బస్తాలు (QR Produce Bags)' : 'QR Produce Bags', icon: QrCode },
            { id: 'payouts', label: isTelugu ? 'యూపీఐ చెల్లింపులు (Instant Payouts)' : 'UPI Escrow & Payouts', icon: DollarSign },
            { id: 'services', label: isTelugu ? 'రైతు సేవలు (Agri Services)' : 'Farmer Support & Services', icon: Wrench, count: bookedServices.length }
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
                    isActive ? 'bg-[#FAF6EF] text-[#185844]' : 'bg-[#185844]/15 text-[#185844]'
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
            TAB 1: LOG HARVEST (BLIND YIELD INPUT - PDF Page 11)
            ========================================================================= */}
        {activeTab === 'harvest' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Quick Context Card */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/25 flex items-start gap-3">
              <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 dark:text-emerald-200 space-y-0.5">
                <p className="font-bold">
                  {isTelugu ? 'సరళమైన పంట నమోదు - బ్రౌజింగ్ అవసరం లేదు' : 'Simple Blind Yield Input — No browsing required'}
                </p>
                <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                  {isTelugu 
                    ? 'మీ పంట మరియు పరిమాణం నమోదు చేయండి. వ్యవస్థ స్వయంచాలకంగా సరైన కొనుగోలుదారులను కనుగొంటుంది మరియు కనీస ధరను రక్షిస్తుంది.'
                    : 'Enter your available crop and harvest quantity. FarmDirect matches your yield with institutional buyers and kirana hubs with guaranteed price collars.'}
                </p>
              </div>
            </div>

            {/* Harvest Entry Form */}
            <form onSubmit={handleLogHarvest} className="p-6 rounded-3xl bg-white dark:bg-[#101C15] border border-slate-200 dark:border-emerald-500/20 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>{isTelugu ? 'కోత వివరాలు నమోదు చేయండి' : 'Enter Harvest & Produce Details'}</span>
                </h3>
                
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isListening 
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100'
                  }`}
                  title="Simulate Voice Input in Telugu/English"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isListening ? (isTelugu ? 'వింటున్నాము...' : 'Listening...') : (isTelugu ? 'వాయిస్ ద్వారా చెప్పండి' : 'Speak Produce (Voice)')}</span>
                </button>
              </div>

              {/* Crop Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isTelugu ? 'పంట పేరు (Crop Variety)' : 'Crop Name / Variety'}
                  </label>
                  <select
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="Hybrid Tomato (S-12)">Hybrid Tomato (S-12) - తమాటా</option>
                    <option value="Tender Bhendi (Ladyfinger)">Tender Bhendi (Ladyfinger) - బెండకాయ</option>
                    <option value="Purple Round Brinjal (Vankaya)">Purple Round Brinjal (Vankaya) - వంకాయ</option>
                    <option value="Organic Palak (Spinach)">Organic Palak (Spinach) - పాలకూర</option>
                    <option value="Fresh G4 Green Chilies">Fresh G4 Green Chilies - పచ్చిమిర్చి</option>
                    <option value="Native Red Onions">Native Red Onions - ఉల్లిపాయ</option>
                    <option value="Hill Potatoes">Hill Potatoes - బంగాళాదుంప</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isTelugu ? 'పంట విస్తీర్ణం (Plot Acreage)' : 'Field Acreage (Acres)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="50"
                    value={acreage}
                    onChange={(e) => setAcreage(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              {/* Quantity & Pickup Window */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isTelugu ? 'అందుబాటులో ఉన్న పరిమాణం (Quantity in Kg)' : 'Available Harvest Quantity (kg)'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="25"
                      min="25"
                      max="10000"
                      value={harvestQuantity}
                      onChange={(e) => setHarvestQuantity(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      required
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      kg (~{Math.round(harvestQuantity / 25)} crates)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isTelugu ? 'కోత సమయం (Harvest & Pickup Slot)' : 'Harvest & Pickup Window'}
                  </label>
                  <select
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="Tomorrow Dawn (5:30 AM)">Tomorrow Dawn (5:30 AM - 6:30 AM)</option>
                    <option value="Today Evening (5:00 PM)">Today Evening (5:00 PM - 6:30 PM)</option>
                    <option value="Day After Tomorrow (5:30 AM)">Day After Tomorrow (5:30 AM)</option>
                  </select>
                </div>
              </div>

              {/* Price Collar Protection Input */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isTelugu ? 'రక్షిత కనీస ధర (Safe Contract Minimum Price)' : 'Safe Contract Minimum Floor (₹/kg)'}</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    ₹{floorPrice}/kg
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  value={floorPrice}
                  onChange={(e) => setFloorPrice(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Mandi Crash Risk: ₹14/kg</span>
                  <span className="text-emerald-600 font-bold">Guaranteed Floor: ₹{floorPrice}/kg</span>
                  <span>Direct Value: ₹{floorPrice + 8}/kg</span>
                </div>
              </div>

              {/* Success Notification */}
              {harvestLoggedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Harvest logged! Directed dispatch algorithm is matching institutional buyers...</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isTelugu ? 'పంట నమోదు చేసి కొనుగోలుదారులను కనుగొనండి' : 'Log Harvest & Match Institutional Buyers'}</span>
              </button>

            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 2: DIRECTED MATCHES & SAFE CONTRACTS (PDF Page 10, 11, 14, 21)
            ========================================================================= */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isTelugu ? 'డైరెక్టెడ్ మ్యాచ్‌లు & సేఫ్ కాంట్రాక్టులు' : 'Directed Buyer Matches & Safe Contracts'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isTelugu ? 'ధర రక్షణ కాలర్‌తో కొనుగోలుదారుల ఆఫర్‌లు' : 'Matched buyer requisitions protected by price collar and escrow'}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {matches.filter(m => m.status === 'pending').length} Active Matches
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((m) => (
                <div
                  key={m.id}
                  className={`p-5 rounded-3xl border transition-all space-y-4 ${
                    m.status === 'accepted'
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500/50'
                      : 'bg-white dark:bg-[#101C15] border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40'
                  }`}
                >
                  {/* Top Bar: Match Score & Time Limit (PDF: "Orders are offered to buyers with a time limit") */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40">
                      Match Score: {m.matchScore}%
                    </span>
                    {m.status === 'pending' ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        {m.timeRemainingMinutes}m left to accept
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Contract Locked
                      </span>
                    )}
                  </div>

                  {/* Buyer & Crop Info */}
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{m.buyerName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {m.buyerType} • Distance: {m.distanceKm} km from farm
                    </p>
                  </div>

                  {/* Pricing Comparison Box (PDF: "Safe Contract gives a minimum price range") */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Crop Requested:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{m.crop}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Volume:</span>
                      <span className="font-mono font-bold">{m.quantityKg} kg</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1 border-t border-slate-200/50 dark:border-slate-800">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Agreed Contract Price:</span>
                      <div className="text-right">
                        <span className="font-mono text-lg font-black text-emerald-600 dark:text-emerald-400">₹{m.agreedPrice}/kg</span>
                        <span className="block text-[10px] text-slate-400 line-through">Mandi Floor: ₹{m.mandiBenchmark}/kg</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100/50 dark:bg-emerald-950/60 p-2 rounded-xl text-center">
                      Guaranteed Revenue: ₹{m.quantityKg * m.agreedPrice} (Escrow Protected)
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div>
                    {m.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptMatch(m.id)}
                          className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Safe Contract</span>
                        </button>
                        <button
                          onClick={() => setMatches(prev => prev.filter(item => item.id !== m.id))}
                          className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <div className="py-2 px-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center">
                        ✓ Contract Active — Tag QR Bags for Morning Pickup
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB: ORDER & DISPATCH TRACKING (FARMER VIEW)
            ========================================================================= */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 uppercase tracking-wide">
                  {isTelugu ? 'రియల్-టైమ్ డిస్పాచ్ ట్రాకింగ్' : 'Cold-Chain Logistics & Escrow Tracking'}
                </span>
                <h2 className="text-lg sm:text-xl font-black mt-1">
                  {isTelugu ? 'రవాణా వాహన ట్రాకింగ్ & యూపీఐ చెల్లింపు విడుదల' : 'Live Reefer Van Telemetry & Escrow Payout Tracking'}
                </h2>
                <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl">
                  {isTelugu 
                    ? 'మీ పంట పొలం నుండి కొనుగోలుదారుని హబ్ వరకు ఉష్ణోగ్రత నియంత్రణ, డ్రైవర్ లొకేషన్ మరియు వేబ్రిడ్జ్ స్కాన్ తర్వాత తక్షణ యూపీఐ చెల్లింపులను ఇక్కడ చూడవచ్చు.'
                    : 'Monitor 3PL solar reefer cold-chain transit temperatures, live driver GPS coordinates, dock weighbridge scans, and instant UPI escrow disbursement within seconds of intake.'}
                </p>
              </div>

              {/* Status Stats Pill */}
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <span className="text-[10px] font-mono text-emerald-200 uppercase block">Active Transit</span>
                  <span className="text-base font-black text-amber-300 font-mono">1 Reefer</span>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="text-center">
                  <span className="text-[10px] font-mono text-emerald-200 uppercase block">In Escrow</span>
                  <span className="text-base font-black text-white font-mono">₹5,600</span>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="text-center">
                  <span className="text-[10px] font-mono text-emerald-200 uppercase block">Cargo Temp</span>
                  <span className="text-base font-black text-emerald-300 font-mono">10.4°C</span>
                </div>
              </div>
            </div>

            {/* Filter Chips Bar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                {[
                  { id: 'all', label: isTelugu ? 'అన్ని రవాణాలు' : 'All Dispatches' },
                  { id: 'in_transit', label: isTelugu ? 'ప్రస్తుతం రవాణాలో ఉన్నాయి' : 'In Transit (1)' },
                  { id: 'delivered', label: isTelugu ? 'డెలివరీ & జమ అయ్యాయి' : 'Delivered & Paid (1)' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setDispatchFilter(filter.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      dispatchFilter === filter.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-[#101C15] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-500 font-mono">
                Showing {farmerDispatches.filter(d => dispatchFilter === 'all' ? true : dispatchFilter === 'in_transit' ? d.status === 'In Transit' : d.status === 'Delivered').length} Dispatches
              </span>
            </div>

            {/* Dispatch Cards */}
            <div className="space-y-5">
              {farmerDispatches
                .filter(d => dispatchFilter === 'all' ? true : dispatchFilter === 'in_transit' ? d.status === 'In Transit' : d.status === 'Delivered')
                .map(dispatch => (
                  <div
                    key={dispatch.dispatchId}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#101C15] border border-slate-200 dark:border-emerald-500/20 shadow-sm space-y-5 hover:border-emerald-500/40 transition-all"
                  >
                    {/* Top Row: Dispatch ID, Status, Buyer & Escrow Locked */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                            {dispatch.dispatchId}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">Linked to {dispatch.matchId}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            dispatch.status === 'In Transit'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 animate-pulse'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          }`}>
                            ● {dispatch.status}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          {dispatch.crop} — <span className="text-emerald-600">{dispatch.quantityKg} kg</span> ({dispatch.cratesCount} Tamper-Sealed Crates)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Destination: <span className="font-semibold text-slate-800 dark:text-slate-200">{dispatch.buyerName}</span> ({dispatch.buyerType})
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          {dispatch.status === 'In Transit' ? 'Locked in Escrow' : 'Released Payout'}
                        </span>
                        <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                          ₹{dispatch.escrowLocked.toLocaleString('en-IN')}.00
                        </span>
                        <span className="text-[11px] block font-mono text-slate-500">
                          Guaranteed @ ₹{dispatch.collarPrice}/kg Floor
                        </span>
                      </div>
                    </div>

                    {/* Logistics Carrier & Cold-Chain Live Telemetry Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">3PL Carrier & Van</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                          <Truck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{dispatch.carrier}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Reg: {dispatch.vehicleNumber}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Driver</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5 truncate">
                          {dispatch.driverName}
                        </span>
                        <button
                          onClick={() => {
                            setServiceToast(`Calling 3PL driver ${dispatch.driverName}...`);
                            try { confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 } }); } catch (_) {}
                          }}
                          className="mt-1 text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>Direct Call Driver</span>
                        </button>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Reefer Cargo Temp</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                            {dispatch.cargoTemp}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-600">IoT Sensor Active</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          {dispatch.status === 'In Transit' ? 'Estimated Arrival' : 'Delivered At'}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                          {dispatch.estArrival}
                        </span>
                        <span className="text-[10px] text-slate-400">Dispatched: {dispatch.dispatchedAt}</span>
                      </div>
                    </div>

                    {/* Visual 6-Step Stepper Timeline */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                        Lifecycle Timeline & Payout Verification Steps:
                      </span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                        {dispatch.steps.map((step, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-2xl border text-xs flex flex-col justify-between transition-all ${
                              step.done
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                                : step.active
                                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/30'
                                : 'bg-slate-50 dark:bg-black/20 border-slate-200/60 dark:border-slate-800 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-mono text-[10px] font-bold">Step {idx + 1}</span>
                              {step.done ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : step.active ? (
                                <Activity className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              )}
                            </div>
                            <p className="font-bold text-[11px] line-clamp-2 leading-snug">
                              {step.title}
                            </p>
                            <span className="font-mono text-[9px] text-slate-500 mt-2 block">
                              {step.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Settlement Detail if Completed */}
                    {dispatch.upiRef && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900 dark:text-emerald-200">
                        <div className="flex items-center gap-2">
                          <CheckCheck className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold">Instant Payout Settled to Farmer Account!</span>
                          <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
                            Ref: {dispatch.upiRef}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                          ⚡ {dispatch.payoutSpeed}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          setServiceToast(`IoT Telemetry Check: Sensor reading nominal 10.4°C on reefer ${dispatch.vehicleNumber}. Producing no heat shock.`);
                          try { confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } }); } catch (_) {}
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Thermometer className="w-3.5 h-3.5 text-teal-500" />
                        <span>Verify IoT Temp</span>
                      </button>

                      <button
                        onClick={() => {
                          setServiceToast(`QR Tamper Hash verified: 8 crates sealed with tamper tape AP-SEAL-8821.`);
                          try { confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 } }); } catch (_) {}
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Inspect Tamper Seals</span>
                      </button>
                    </div>

                  </div>
                ))}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 4: QR PRODUCE BAGS (PDF Page 8, 11, 14, 15, 19)
            ========================================================================= */}
        {activeTab === 'qrbags' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isTelugu ? 'క్యూఆర్ లేబుల్డ్ బస్తాలు' : 'QR-Labelled Tamper-Evident Bags'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isTelugu ? 'తూకం వివాదాలు లేకుండా నేరుగా పికప్ చేసుకోండి' : 'Pre-weighted, digital QR-sealed crates to eliminate weight and quality disputes'}
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print All Labels</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {qrBags.map((bag) => (
                <div
                  key={bag.bagId}
                  className="p-5 rounded-3xl bg-white dark:bg-[#101C15] border border-slate-200 dark:border-emerald-500/20 shadow-sm space-y-4"
                >
                  {/* Top Crate Identification */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {bag.bagId}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {bag.status}
                    </span>
                  </div>

                  {/* QR Graphic Container */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center space-y-2">
                    <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-inner border border-slate-200 flex items-center justify-center">
                      <QrCode className="w-20 h-20 text-slate-900" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 truncate max-w-[200px]">
                      {bag.qrCodeString}
                    </span>
                  </div>

                  {/* Weights & Tamper Seal Info (PDF: "QR labels reduce weight disputes") */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Crop:</span>
                      <span className="font-bold">{bag.crop}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Net Weight:</span>
                      <span className="font-mono font-bold text-emerald-600">{bag.netWeightKg} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tare / Crate:</span>
                      <span className="font-mono">{bag.tareWeightKg} kg</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200/50 dark:border-slate-800 text-[10px]">
                      <span className="text-slate-400">Tamper Seal PIN:</span>
                      <span className="font-mono font-bold text-amber-600">{bag.tamperSeal}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: INSTANT PAYOUTS & ESCROW LEDGER (PDF Page 6, 8, 11, 12, 19)
            ========================================================================= */}
        {activeTab === 'payouts' && (
          <div className="space-y-6">
            
            {/* Header Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#101C15] border border-slate-200 dark:border-emerald-500/20 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Realized Payouts</span>
                <p className="font-mono text-2xl font-black text-slate-900 dark:text-white mt-1">₹13,260</p>
                <span className="text-[10px] text-emerald-600 font-semibold">100% On-time bank credit via UPI</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#101C15] border border-slate-200 dark:border-emerald-500/20 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active in Escrow</span>
                <p className="font-mono text-2xl font-black text-amber-600 mt-1">₹9,650</p>
                <span className="text-[10px] text-slate-400">Releases upon Kirana depot handshake</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#101C15] border border-slate-200 dark:border-emerald-500/20 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Income Premium vs Mandi</span>
                <p className="font-mono text-2xl font-black text-emerald-600 mt-1">+18.4%</p>
                <span className="text-[10px] text-slate-400">Exceeds pilot target (+15%)</span>
              </div>
            </div>

            {/* Transactions Ledger */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#101C15] border border-slate-200 dark:border-emerald-500/20 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isTelugu ? 'ఇటీవలి బ్యాంకు చెల్లింపుల రికార్డు' : 'Recent Bank Dispatches & UPI Settlement Ledger'}
              </h4>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {payouts.map((pay) => (
                  <div key={pay.payoutId} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{pay.crop}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {pay.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {pay.date} • {pay.quantityKg} kg • Ref: <span className="font-mono">{pay.upiRef}</span>
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold">{pay.speed}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-base font-black text-slate-900 dark:text-white">
                        +₹{pay.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 5: FARMER SERVICES & SUPPORT (DOMAIN SPECIFIC)
            ========================================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 uppercase tracking-wide">
                  {isTelugu ? 'రైతు సేవా కేంద్రం' : 'Farmer Domain Services'}
                </span>
                <h2 className="text-lg sm:text-xl font-black mt-1">
                  {isTelugu ? 'వ్యవసాయ మద్దతు మరియు లాజిస్టిక్స్ సేవలు' : 'Farmgate Logistics, Soil Testing & Financial Services'}
                </h2>
                <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl">
                  {isTelugu 
                    ? 'మట్టి పరీక్షలు, ఉష్ణోగ్రత నియంత్రిత రవాణా, శీతల గిడ్డంగులు మరియు తక్షణ పరపతి సౌకర్యాలు అన్నీ మీ గ్రామంలోనే అందుబాటులో ఉన్నాయి.'
                    : 'End-to-end support engineered for smallholder farmers in Visakhapatnam & Anakapalli. Zero middlemen commissions, direct RBK integration, and instant UPI settlements.'}
                </p>
              </div>

              {/* Quick Contact Desk */}
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-amber-300">RBK Kisan Support Line</p>
                  <p className="text-xs font-mono font-bold text-white">1800-425-6677 (Toll-Free)</p>
                  <span className="text-[9px] text-emerald-200">Telugu Voice Desk: 06:00 - 21:00</span>
                </div>
              </div>
            </div>

            {/* Service Action Toast */}
            {serviceToast && (
              <div className="p-3.5 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{serviceToast}</span>
                </div>
                <button onClick={() => setServiceToast('')} className="text-white/80 hover:text-white">✕</button>
              </div>
            )}

            {/* =========================================================================
                GOVERNMENT SCHEME FEATURED: RWBCIS
                Restructured Weather Based Crop Insurance Scheme
                ========================================================================= */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900 via-sky-950 to-slate-900 text-white shadow-xl border border-sky-500/30 space-y-5">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-sky-500/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-amber-950 uppercase tracking-wide">
                      Flagship Govt. Scheme
                    </span>
                    <span className="text-sky-300 text-[11px] font-mono font-semibold">
                      National Crop Insurance Portal (NCIP) & AP Agri Dept
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5">
                    <Umbrella className="w-5 h-5 text-amber-300" />
                    <span>Restructured Weather Based Crop Insurance Scheme (RWBCIS)</span>
                  </h3>
                  <p className="text-xs text-sky-200">
                    {isTelugu ? 'పునర్వ్యవస్థీకరించిన వాతావరణ ఆధారిత పంట బీమా పథకం (RWBCIS)' : 'Parametric Weather Shield for Horticultural & Vegetable Crops'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setServiceToast('Kasimkota AWS (#AP-MET-14) Status: 29.4°C, 72% RH, Rain: 0.0mm. Weather conditions are nominal.');
                      try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } }); } catch (_) {}
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-sky-200 border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-amber-300" />
                    <span>Check Mandal AWS Telemetry</span>
                  </button>

                  <button
                    onClick={() => setRwbcisModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-950/30 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Enroll Crop in RWBCIS</span>
                  </button>
                </div>
              </div>

              {/* RWBCIS Key Benefits Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-sky-300 uppercase font-bold block">Farmer Premium Share</span>
                  <p className="text-base font-black text-amber-300 font-mono mt-0.5">Only 1.5%</p>
                  <p className="text-[10px] text-slate-300 mt-1">98.5% subsidized by Central & State Govt</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-sky-300 uppercase font-bold block">Claim Settlement</span>
                  <p className="text-base font-black text-emerald-400 font-mono mt-0.5">100% Automated</p>
                  <p className="text-[10px] text-slate-300 mt-1">Triggered by Mandal AWS stations, 0 paperwork</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-sky-300 uppercase font-bold block">Trigger Tranches</span>
                  <p className="text-base font-black text-sky-200 font-mono mt-0.5">Deficit & Heatwave</p>
                  <p className="text-[10px] text-slate-300 mt-1">&gt;45% Rain deficit or &gt;38°C for 3 days</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-sky-300 uppercase font-bold block">Disbursement Mode</span>
                  <p className="text-base font-black text-teal-300 font-mono mt-0.5">Direct DBT to Bank</p>
                  <p className="text-[10px] text-slate-300 mt-1">Directly into Aadhaar-linked e-Crop account</p>
                </div>
              </div>

              {/* Enrolled Policies Accordion / Table */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Your Active RWBCIS Policies ({enrolledRwbcisPolicies.length})</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Kasimkota Mandal Node</span>
                </div>

                <div className="space-y-2">
                  {enrolledRwbcisPolicies.map(policy => (
                    <div 
                      key={policy.policyId}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-300">{policy.policyId}</span>
                          <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ✓ {policy.status}
                          </span>
                        </div>
                        <p className="text-white font-semibold">
                          {policy.crop} • {policy.acreage} Acres ({policy.period})
                        </p>
                        <p className="text-[10px] text-slate-300">
                          Linked AWS: <span className="text-sky-300 font-mono">{policy.awsStation}</span> | Triggers: {policy.triggerParameters}
                        </p>
                      </div>

                      <div className="sm:text-right space-y-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Sum Insured Coverage</span>
                          <span className="text-sm font-black font-mono text-emerald-400">₹{policy.sumInsured.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-[10px] text-slate-300 font-mono">
                          Farmer Paid: <span className="text-amber-300 font-bold">₹{policy.farmerPremium}</span> (1.5%) | Govt Share: ₹{policy.govtSubsidy.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Active Booked Services Status */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#101C15] border border-slate-200 dark:border-emerald-500/20 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isTelugu ? 'మీ సక్రియ సేవా బుకింగ్‌లు' : 'Your Active Service Appointments'}</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {bookedServices.length} Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bookedServices.map(srv => (
                  <div key={srv.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{srv.title}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          {srv.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Scheduled: <span className="font-semibold text-slate-700 dark:text-slate-200">{srv.scheduledDate}</span>
                      </p>
                      <p className="text-[10px] text-emerald-600 font-mono">Assigned: {srv.partner}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{srv.id}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6 Grid Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* SERVICE 1: Soil Testing */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#101C15] border border-slate-200 dark:border-emerald-500/20 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center shadow-sm">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {isTelugu ? 'మట్టి & పోషకాల పరీక్ష' : 'Soil Health & Nutrients'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {isTelugu ? 'రైతు భరోసా కేంద్రం ఉచిత మట్టి పరీక్ష' : 'Soil Health Card & N-P-K Profiling'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Comprehensive NABL test for Nitrogen, Phosphorus, Potassium, Organic Carbon, pH & Zinc. Includes tailored organic amendment schedule.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-[11px] text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 space-y-1">
                    <div className="flex justify-between">
                      <span>Cost:</span>
                      <span className="font-bold text-emerald-600">100% Free (Govt Subsidized)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Turnaround:</span>
                      <span className="font-semibold">Sample collected at field within 24h</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveServiceModal({
                    title: 'Soil Health & N-P-K Sample Booking',
                    type: 'soil',
                    partner: 'Kasimkota Rythu Bharosa Kendra (KVK Lab)',
                    fee: '₹0 (Free Govt Scheme)',
                    timing: 'Tomorrow between 09:00 AM - 12:00 PM'
                  })}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isTelugu ? 'మట్టి నమూనా సేకరణ బుక్ చేయండి' : 'Request Soil Sample Pickup'}</span>
                </button>
              </div>

              {/* SERVICE 2: Reefer Logistics */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#101C15] border border-slate-200 dark:border-emerald-500/20 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {isTelugu ? 'శీతల రవాణా' : 'Farmgate Logistics'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {isTelugu ? 'పొలంలోకే సోలార్ రీఫర్ పికప్ వ్యాన్' : 'Farmgate 3PL Reefer Truck Booking'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Temperature-controlled (10-12°C) electric 3PL pickup directly at your field GPS pin. Zero weight tampering with integrated digital scale.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-[11px] text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                    <div className="flex justify-between">
                      <span>Transit Temp:</span>
                      <span className="font-bold">10°C - 12°C Active Chill</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Freight Cost:</span>
                      <span className="font-bold text-emerald-600">Paid by Buyer Escrow (₹0 to Farmer)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveServiceModal({
                    title: 'Farmgate 3PL Solar Reefer Dispatch',
                    type: 'reefer',
                    partner: 'Porter Cold-Chain Logistics AP',
                    fee: '₹0 (Paid via Escrow Settlement)',
                    timing: 'Tomorrow Dawn Slot (05:00 AM - 06:30 AM)'
                  })}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isTelugu ? 'రవాణా వాహనాన్ని బుక్ చేయండి' : 'Schedule Farmgate Truck'}</span>
                </button>
              </div>

              {/* SERVICE 3: Subsidized Cold Storage */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#101C15] border border-slate-200 dark:border-emerald-500/20 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-400 flex items-center justify-center shadow-sm">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      {isTelugu ? 'శీతల గిడ్డంగి' : 'Cold Chain Storage'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {isTelugu ? 'సబ్సిడీ శీతల గిడ్డంగి రిజర్వేషన్' : 'Packhouse Cold Vault Reservation'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Reserve buffer crate storage at Anandapuram Regional Packhouse. Zero decay nitrogen circulation protects tomatoes and leafy crops up to 15 days.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 text-[11px] text-cyan-900 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-900/40 space-y-1">
                    <div className="flex justify-between">
                      <span>Subsidized Rate:</span>
                      <span className="font-bold text-cyan-700 dark:text-cyan-300">₹1.20 / crate / day</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span className="font-semibold">38 Crate Slots Available Today</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveServiceModal({
                    title: 'Cold Storage Vault Crate Reservation',
                    type: 'coldstorage',
                    partner: 'Anandapuram Packhouse Agro-Vault',
                    fee: '₹1.20 per crate / day (Auto-deducted)',
                    timing: 'Immediate Intake Slot'
                  })}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isTelugu ? 'గిడ్డంగి స్థలాన్ని బుక్ చేయండి' : 'Reserve Cold Vault Space'}</span>
                </button>
              </div>

              {/* SERVICE 4: Kisan Working Capital */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#101C15] border border-slate-200 dark:border-emerald-500/20 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {isTelugu ? 'పరపతి & ఇన్పుట్ సబ్సిడీ' : 'Working Capital & Inputs'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {isTelugu ? 'పంటపై 70% ముందస్తు నగదు పరపతి' : 'Instant Harvest Input Cash Advance'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Draw up to 70% cash advance against locked safe contracts. Purchase certified seeds, drip spare parts, and organic inputs without high-interest moneylenders.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-[11px] text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/40 space-y-1">
                    <div className="flex justify-between">
                      <span>Max Advance:</span>
                      <span className="font-bold text-emerald-600">₹45,000 (Based on e-Crop)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className="font-bold">0% (if cleared at final delivery)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveServiceModal({
                    title: 'Instant Kisan Harvest Working Capital Advance',
                    type: 'credit',
                    partner: 'State Cooperative Bank & FarmDirect Escrow',
                    fee: '0% Interest Advance',
                    timing: 'Direct UPI transfer in 10 minutes'
                  })}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isTelugu ? 'ముందస్తు నగదు పొందండి' : 'Apply for Input Advance'}</span>
                </button>
              </div>

              {/* SERVICE 5: Weather Radar & Pest Alerts */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#101C15] border border-slate-200 dark:border-emerald-500/20 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 flex items-center justify-center shadow-sm">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      {isTelugu ? 'వాతావరణం & తెగుళ్ల సలహా' : 'Weather & Pest Advisory'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {isTelugu ? 'హైపర్‌లోకల్ వాతావరణం మరియు కీటక హెచ్చరికలు' : 'Hyperlocal Doppler Weather & Pest Alert'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Monsoon cloud radar alerts, high humidity fungal warning, and organic bio-pest spray recipes delivered via WhatsApp voice notes in Telugu.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-[11px] text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 space-y-1">
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span className="font-bold">Daily Voice Notes & SMS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rain Forecast:</span>
                      <span className="font-semibold text-rose-700 dark:text-rose-300">Light Shower Expected (4:30 PM)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveServiceModal({
                    title: 'Hyperlocal Weather & Pest SMS Alert Desk',
                    type: 'weather',
                    partner: 'IMD Andhra Coastal Radar & KVK Agronomy',
                    fee: 'Free Service',
                    timing: 'Twice daily at 06:00 AM & 06:00 PM'
                  })}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isTelugu ? 'హెచ్చరికలకు నమోదు చేసుకోండి' : 'Activate Weather Advisory'}</span>
                </button>
              </div>

              {/* SERVICE 6: Custom Hiring Center */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#101C15] border border-slate-200 dark:border-emerald-500/20 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center shadow-sm">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {isTelugu ? 'యంత్ర పరికరాల అద్దె' : 'Farm Mechanization'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {isTelugu ? 'కస్టమ్ హైరింగ్ సెంటర్ యంత్రాల బుకింగ్' : 'Custom Hiring Machinery & Sprayer Rental'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Rent 4WD mini-tractors with rotary tillers, automated produce crate washers, and battery knapsack sprayers by the hour. Operator included.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-[11px] text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 space-y-1">
                    <div className="flex justify-between">
                      <span>Rental Rate:</span>
                      <span className="font-bold">₹280 / hour (Driver included)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Depot:</span>
                      <span className="font-semibold">Kasimkota CHC Station #4</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveServiceModal({
                    title: 'Custom Hiring Center Machinery Rental',
                    type: 'machinery',
                    partner: 'Anakapalli Mandal Custom Hiring Cooperative',
                    fee: '₹280/hour',
                    timing: 'Tomorrow Morning Slot'
                  })}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isTelugu ? 'యంత్రాన్ని బుక్ చేయండి' : 'Book Farm Machinery'}</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ================= RWBCIS ENROLLMENT MODAL ================= */}
      {rwbcisModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setRwbcisModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-white dark:bg-[#101C15] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-sky-500/30 space-y-4 text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-bold">
                  <Umbrella className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    RWBCIS Crop Enrollment Portal
                  </h3>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono">
                    Restructured Weather Based Crop Insurance Scheme
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setRwbcisModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Crop Selection */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Crop for Parametric Insurance Cover:
                </label>
                <select
                  value={rwbcisCrop}
                  onChange={(e) => setRwbcisCrop(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Hybrid Tomato (S-12)">🍅 Hybrid Tomato (S-12)</option>
                  <option value="Purple Round Brinjal (Vankaya)">🍆 Purple Round Brinjal (Vankaya)</option>
                  <option value="Tender Green Bhendi (Ladyfinger)">🥒 Tender Green Bhendi (Ladyfinger)</option>
                  <option value="Spicy G4 Green Chilies">🌶️ Spicy G4 Green Chilies</option>
                  <option value="Sweet Native Bell Pepper">🫑 Sweet Native Bell Pepper (Capsicum)</option>
                </select>
              </div>

              {/* Acreage Selection */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Cultivated Land Acreage:
                  </label>
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-xs">
                    {rwbcisAcreage} Acres
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={rwbcisAcreage}
                  onChange={(e) => setRwbcisAcreage(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>1 Acre</span>
                  <span>5 Acres</span>
                  <span>10 Acres</span>
                </div>
              </div>

              {/* Mandal AWS Weather Station Selection */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Reference Automated Weather Station (AWS):
                </label>
                <select
                  value={rwbcisMandal}
                  onChange={(e) => setRwbcisMandal(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Kasimkota AWS Station (#AP-MET-14)">Kasimkota AWS Station (#AP-MET-14)</option>
                  <option value="Anandapuram AWS Station (#AP-MET-09)">Anandapuram AWS Station (#AP-MET-09)</option>
                  <option value="Sabbavaram Agro AWS (#AP-MET-04)">Sabbavaram Agro AWS (#AP-MET-04)</option>
                  <option value="Bheemili Coastal Weather Station (#AP-MET-22)">Bheemili Coastal Weather Station (#AP-MET-22)</option>
                </select>
              </div>

              {/* Dynamic RWBCIS Premium Calculation Box */}
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-500/30 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Total Sum Insured Coverage:</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white">
                    ₹{(22000 * rwbcisAcreage).toLocaleString('en-IN')}.00
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Govt. Premium Subsidy (98.5%):</span>
                  <span className="font-mono font-bold text-emerald-600">
                    ₹{(21670 * rwbcisAcreage).toLocaleString('en-IN')}.00 (Central + AP Govt)
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1.5 border-t border-sky-200 dark:border-sky-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Your Net Farmer Premium (1.5%):
                  </span>
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
                    ₹{(330 * rwbcisAcreage).toLocaleString('en-IN')}.00
                  </span>
                </div>
              </div>

              {/* Parametric Weather Triggers */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 space-y-1 text-[11px]">
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  Automatic Claim Triggers Programmed at Mandal AWS:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-500 dark:text-slate-400">
                  <li>Rainfall Deficit: Continuous dry spell &gt; 21 days or &gt;45% deficit</li>
                  <li>Excess Unseasonal Rain: &gt; 50mm in 24 hours during harvest stage</li>
                  <li>Heat Stress: Maximum daytime temp &gt; 38°C for 3 consecutive days</li>
                  <li>Zero physical damage survey needed; DBT payout executes to bank</li>
                </ul>
              </div>

            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRwbcisModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newPolicy = {
                    policyId: 'RWBCIS-AP-2026-' + Math.floor(1000 + Math.random() * 9000),
                    crop: rwbcisCrop,
                    acreage: rwbcisAcreage,
                    sumInsured: 22000 * rwbcisAcreage,
                    farmerPremium: 330 * rwbcisAcreage,
                    govtSubsidy: 21670 * rwbcisAcreage,
                    awsStation: rwbcisMandal,
                    period: 'Rabi 2026-27',
                    status: 'Active Policy Covered',
                    triggerParameters: 'Rainfall Deficit (>45%) or Heat Wave (>38°C for 3 consecutive days)',
                    claimStatus: 'Nominal Weather (Zero Deficit)'
                  };
                  setEnrolledRwbcisPolicies(prev => [newPolicy, ...prev]);
                  setServiceToast(`RWBCIS Policy ${newPolicy.policyId} activated! Parametric weather coverage linked to ${rwbcisMandal}.`);
                  setRwbcisModalOpen(false);
                  try {
                    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                  } catch (_) {}
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-sky-900/30 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Enroll Crop Policy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SERVICE CONFIRMATION MODAL ================= */}
      {activeServiceModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveServiceModal(null)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-[#101C15] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-emerald-500/30 space-y-4 text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Confirm Service Request
                </h3>
              </div>
              <button 
                onClick={() => setActiveServiceModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-bold">Requested Service</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{activeServiceModal.title}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Partner:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeServiceModal.partner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Preferred Slot:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeServiceModal.timing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Charges:</span>
                  <span className="font-bold text-emerald-600">{activeServiceModal.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Farmer Village:</span>
                  <span className="font-semibold">{farmerVillage}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>e-Crop land coordinates will be automatically shared with the service technician.</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveServiceModal(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newBooking = {
                    id: 'SRV-AG-' + Math.floor(103 + Math.random() * 50),
                    title: activeServiceModal.title,
                    scheduledDate: activeServiceModal.timing,
                    partner: activeServiceModal.partner,
                    status: 'Confirmed & Assigned'
                  };
                  setBookedServices(prev => [newBooking, ...prev]);
                  setServiceToast(`Service request confirmed! Ref: ${newBooking.id} assigned to ${activeServiceModal.partner}.`);
                  setActiveServiceModal(null);
                  try {
                    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                  } catch (_) {}
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/20 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Booking</span>
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
            className="w-full max-w-sm bg-white dark:bg-[#101C15] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-emerald-500/30 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Farmer Profile</h3>
              <button onClick={() => setProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                {farmerName.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{farmerName}</h4>
                <p className="text-xs text-slate-500 truncate max-w-[190px]">{farmerVillage}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Role: Verified Farmer Supplier
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">e-Crop Land Registry:</span>
                <span className="font-bold text-emerald-600">AP-AGRI-99214-VERIFIED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Trust Tier:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Tier A+ (98.4%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Cluster:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Anakapalli North Sector #2</span>
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
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
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
