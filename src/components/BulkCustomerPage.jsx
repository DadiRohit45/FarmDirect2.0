import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  Plus, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  DollarSign, 
  MapPin, 
  Check, 
  AlertCircle, 
  Calendar, 
  Scale, 
  FileText, 
  LogOut,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BulkCustomerPage({ currentUser, onSignOut, onOpenAuth, onBackToHome }) {
  const [activeTab, setActiveTab] = useState('offers'); // 'offers' | 'requisition' | 'escrow' | 'logistics'
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Institution / Buyer details
  const companyName = currentUser?.name || 'Novotel Varun Beach';
  const companyBranch = currentUser?.detail || 'Central Procurement Kitchen, Beach Road (Visakhapatnam)';

  // 1. Post Bulk Requisition State (PDF: "What do buyers need in quality, quantity and delivery time?")
  const [reqCrop, setReqCrop] = useState('Hybrid Tomato (Grade A)');
  const [reqQty, setReqQty] = useState(300);
  const [reqGrade, setReqGrade] = useState('Grade A (Table-Ready Uniform)');
  const [deliverySlot, setDeliverySlot] = useState('Tomorrow 06:30 AM (Morning Kitchen Shift)');
  const [targetCeilingPrice, setTargetCeilingPrice] = useState(30);
  const [requisitionSubmitted, setRequisitionSubmitted] = useState(false);

  // 2. Incoming Matched Farmer Offers with Countdown Timer (PDF Page 11, 14, 21, 24: "Orders are offered with a time limit")
  const [matchedOffers, setMatchedOffers] = useState([
    {
      offerId: 'OFFER-FD-501',
      farmerName: 'Ramesh Varma',
      cluster: 'Kasimkota Agro-Hub (Anakapalli)',
      crop: 'Hybrid Tomato (S-12)',
      offeredQtyKg: 300,
      collarPrice: 28,
      marketSpotPrice: 38,
      matchScore: 98,
      distanceKm: 22,
      timeLimitMinutes: 114, // 2-hour or 4-hour countdown window
      trustTier: 'Tier A+ (98.4%)',
      eCropVerified: true,
      status: 'pending' // 'pending' | 'locked'
    },
    {
      offerId: 'OFFER-FD-502',
      farmerName: 'Suresh Maddala',
      cluster: 'Govada Cluster (Chodavaram)',
      crop: 'Fresh Hill Potatoes & Onions',
      offeredQtyKg: 500,
      collarPrice: 26,
      marketSpotPrice: 35,
      matchScore: 94,
      distanceKm: 28,
      timeLimitMinutes: 165,
      trustTier: 'Tier A (96.2%)',
      eCropVerified: true,
      status: 'pending'
    }
  ]);

  // 3. Active Locked Orders & Escrow Ledger (PDF: "Trust and payment security: UPI e-mandate, dual-OTP escrow")
  const [activeOrders, setActiveOrders] = useState([
    {
      orderId: 'BLK-ORD-4401',
      farmerName: 'Lakshmi Kameswari',
      cluster: 'Pendurthi Farm Valley',
      crop: 'Fresh Palak & Green Leafy Bunches',
      quantityKg: 150,
      agreedPrice: 22,
      totalAmount: 3300,
      escrowStatus: 'Locked in UPI Escrow',
      scheduledDelivery: 'Today 06:15 AM',
      fulfillmentStatus: 'In Transit via 3PL'
    },
    {
      orderId: 'BLK-ORD-4392',
      farmerName: 'Venkat Rao',
      cluster: 'Sabbavaram Valley',
      crop: 'Spicy G4 Green Chilies',
      quantityKg: 80,
      agreedPrice: 42,
      totalAmount: 3360,
      escrowStatus: 'Released upon Dock Inspection',
      scheduledDelivery: 'Yesterday',
      fulfillmentStatus: 'Delivered & Accepted'
    }
  ]);

  // 4. Logistics & Morning Gate Receiving (PDF: "Porter 3PL delivery, QR-sealed bags")
  const [dispatches, setDispatches] = useState([
    {
      dispatchId: 'DISP-3PL-101',
      driver: 'K. Prasad (Porter 3PL AP31TE9910)',
      crates: 12,
      totalWeightKg: 300.0,
      departureTime: '05:30 AM',
      estArrival: '06:20 AM',
      tamperSealsVerified: true,
      status: 'Docked at Kitchen Bay #2'
    }
  ]);

  // Handle Submit Requisition
  const handleSubmitRequisition = (e) => {
    e.preventDefault();
    const newOffer = {
      offerId: 'OFFER-FD-' + Math.floor(503 + Math.random() * 50),
      farmerName: 'Appala Raju',
      cluster: 'Padmanabham Agro-Corridor',
      crop: reqCrop,
      offeredQtyKg: reqQty,
      collarPrice: targetCeilingPrice - 2,
      marketSpotPrice: targetCeilingPrice + 8,
      matchScore: 97,
      distanceKm: 19,
      timeLimitMinutes: 120,
      trustTier: 'Tier A (95.0%)',
      eCropVerified: true,
      status: 'pending'
    };

    setMatchedOffers(prev => [newOffer, ...prev]);
    setRequisitionSubmitted(true);

    try {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}

    setTimeout(() => {
      setRequisitionSubmitted(false);
      setActiveTab('offers');
    }, 1200);
  };

  // Lock Offer & Fund Escrow
  const handleLockOffer = (offerId) => {
    const offer = matchedOffers.find(o => o.offerId === offerId);
    if (!offer) return;

    // Update offer status
    setMatchedOffers(prev => prev.map(o => o.offerId === offerId ? { ...o, status: 'locked' } : o));

    // Add to active orders
    const newOrder = {
      orderId: `BLK-ORD-${Math.floor(4410 + Math.random() * 50)}`,
      farmerName: offer.farmerName,
      cluster: offer.cluster,
      crop: offer.crop,
      quantityKg: offer.offeredQtyKg,
      agreedPrice: offer.collarPrice,
      totalAmount: offer.offeredQtyKg * offer.collarPrice,
      escrowStatus: 'Locked in UPI Escrow',
      scheduledDelivery: 'Tomorrow 06:30 AM',
      fulfillmentStatus: 'Confirmed with Farmer'
    };
    setActiveOrders(prev => [newOrder, ...prev]);

    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
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
                <Building2 className="w-4 h-4 text-[#B08A4F]" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-[#102F27]">
                  Bulk Buyer <span className="text-[#185844]">Portal</span>
                </span>
                <span className="hidden md:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#185844]/15 text-[#185844] border border-[#78947F]/30">
                  Institutional Anchor
                </span>
              </div>
            </div>
          </div>

          {/* Profile Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF6EF] hover:bg-[#F2EBDD] border border-[#78947F]/35 text-xs font-bold text-[#102F27] transition-all shadow-sm cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-[#185844] text-[#F2EBDD] flex items-center justify-center text-[11px] font-bold">
                {companyName.charAt(0)}
              </div>
              <span className="hidden sm:inline-block max-w-[130px] truncate">{companyName}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold bg-[#185844]/15 text-[#185844]">
                Anchor
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* ================= FUNCTIONAL TABS BAR (NO MARKETING FLUFF) ================= */}
      <div className="bg-white dark:bg-[#0C1610] border-b border-slate-200 dark:border-indigo-500/15 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5">
          {[
            { id: 'offers', label: 'Incoming Farmer Matches (Timer)', count: matchedOffers.filter(o => o.status === 'pending').length, icon: ShieldCheck },
            { id: 'requisition', label: 'Post Bulk Requisition', icon: Plus },
            { id: 'escrow', label: 'Active Escrow Orders', count: activeOrders.length, icon: DollarSign },
            { id: 'logistics', label: 'Morning Dock Receiving & 3PL', icon: Truck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white text-indigo-700' : 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200'
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
            TAB 1: INCOMING MATCHED FARMER OFFERS WITH TIMER (PDF Page 10, 11, 21, 24)
            ========================================================================= */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Incoming Direct Farmer Supply Offers
                </h3>
                <p className="text-xs text-slate-500">
                  Time-limited direct matches with certified local farmers within 30 km cluster
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                {matchedOffers.filter(o => o.status === 'pending').length} Pending Acceptance
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedOffers.map((o) => (
                <div
                  key={o.offerId}
                  className={`p-6 rounded-3xl border transition-all space-y-4 ${
                    o.status === 'locked'
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-500/50'
                      : 'bg-white dark:bg-[#111D15] border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/40'
                  }`}
                >
                  {/* Top Bar: Match Score & Countdown Timer (PDF Page 21, 24) */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300/40">
                      Match Score: {o.matchScore}%
                    </span>
                    {o.status === 'pending' ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        {o.timeLimitMinutes}m acceptance window
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Locked in Escrow
                      </span>
                    )}
                  </div>

                  {/* Farmer Identification */}
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{o.farmerName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {o.cluster} • {o.distanceKm} km transit • {o.trustTier}
                    </p>
                  </div>

                  {/* Pricing Comparison (PDF: "Price range around agreed price") */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Crop Offered:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{o.crop}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Batch Volume:</span>
                      <span className="font-mono font-bold">{o.offeredQtyKg} kg</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1 border-t border-slate-200/50 dark:border-slate-800">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Contract Locked Price:</span>
                      <div className="text-right">
                        <span className="font-mono text-lg font-black text-indigo-600 dark:text-indigo-400">
                          ₹{o.collarPrice}/kg
                        </span>
                        <span className="block text-[10px] text-slate-400 line-through">
                          Spot Mandi: ₹{o.marketSpotPrice}/kg
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] text-indigo-800 dark:text-indigo-200 font-bold bg-indigo-100/60 dark:bg-indigo-950/70 p-2 rounded-xl text-center">
                      Total Invoice: ₹{(o.offeredQtyKg * o.collarPrice).toLocaleString('en-IN')} (Saves ~₹{(o.offeredQtyKg * (o.marketSpotPrice - o.collarPrice)).toLocaleString('en-IN')})
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {o.status === 'pending' ? (
                      <button
                        onClick={() => handleLockOffer(o.offerId)}
                        className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Lock Contract & Fund Escrow</span>
                      </button>
                    ) : (
                      <div className="py-2.5 px-3 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-bold text-center">
                        ✓ Contract Active — Scheduled for Morning 3PL Dock Intake
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: POST BULK REQUISITION (PDF Page 4, 5, 7, 10, 11)
            ========================================================================= */}
        {activeTab === 'requisition' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/25 flex items-start gap-3">
              <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-900 dark:text-indigo-200 space-y-0.5">
                <p className="font-bold">Post Institutional Bulk Requirement</p>
                <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80">
                  Broadcast your kitchen or institutional produce demand. FarmDirect matches your required volume 
                  with certified regional farmers, securing guaranteed delivery schedules and price collar protection.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitRequisition} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111D15] border border-slate-200 dark:border-indigo-500/20 shadow-sm space-y-5">
              
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Bulk Procurement Specifications
                </h3>
              </div>

              {/* Crop & Volume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Crop Name / Category
                  </label>
                  <select
                    value={reqCrop}
                    onChange={(e) => setReqCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="Hybrid Tomato (Grade A)">Hybrid Tomato (Grade A) - 300+ kg</option>
                    <option value="Native Red Onions">Native Red Onions - 500+ kg</option>
                    <option value="Hill Potatoes (Uniform Sorting)">Hill Potatoes (Uniform Sorting) - 400+ kg</option>
                    <option value="Tender Bhendi (Ladyfinger)">Tender Bhendi (Ladyfinger) - 150+ kg</option>
                    <option value="G4 Green Chilies">G4 Green Chilies - 100+ kg</option>
                    <option value="Leafy Greens Mix (Palak/Coriander)">Leafy Greens Mix (Palak/Coriander) - 100+ kg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Required Volume (kg)
                  </label>
                  <input
                    type="number"
                    step="50"
                    min="100"
                    max="5000"
                    value={reqQty}
                    onChange={(e) => setReqQty(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
              </div>

              {/* Quality Grade & Delivery Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Quality Grading Specification
                  </label>
                  <select
                    value={reqGrade}
                    onChange={(e) => setReqGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="Grade A (Table-Ready Uniform)">Grade A (Table-Ready Uniform & Unblemished)</option>
                    <option value="Grade B (Commercial Kitchen Cooking)">Grade B (Commercial Kitchen Cooking)</option>
                    <option value="Bulk Processing Grade">Bulk Processing Grade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Required Morning Dock Arrival
                  </label>
                  <select
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="Tomorrow 06:30 AM (Morning Kitchen Shift)">Tomorrow 06:30 AM (Kitchen Shift #1)</option>
                    <option value="Tomorrow 07:30 AM">Tomorrow 07:30 AM</option>
                    <option value="Daily Recurring (06:30 AM)">Daily Recurring 3-Day Cycle (06:30 AM)</option>
                  </select>
                </div>
              </div>

              {/* Target Price Collar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Max Ceiling Budget (₹/kg)
                  </span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    ₹{targetCeilingPrice}/kg
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={targetCeilingPrice}
                  onChange={(e) => setTargetCeilingPrice(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Farm Direct Base: ₹{targetCeilingPrice - 6}</span>
                  <span className="text-indigo-600 font-bold">Max Willing to Pay: ₹{targetCeilingPrice}</span>
                  <span>Mandi Spot: ₹{targetCeilingPrice + 12}</span>
                </div>
              </div>

              {/* Submit Notification */}
              {requisitionSubmitted && (
                <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Bulk demand posted! Directed matching engine is finding farmer supply...</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Bulk Tender & Match Farmers</span>
              </button>

            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 3: ACTIVE ESCROW & ORDERS (PDF Page 8, 11, 14, 17)
            ========================================================================= */}
        {activeTab === 'escrow' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Purchase Contracts & UPI Escrow</h3>
                <p className="text-xs text-slate-500">Funds are held safely in escrow and only disbursed upon loading bay delivery verification</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeOrders.map((ord) => (
                <div key={ord.orderId} className="p-5 rounded-3xl bg-white dark:bg-[#111D15] border border-slate-200 dark:border-indigo-500/20 shadow-sm space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{ord.orderId}</span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{ord.crop}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                      {ord.fulfillmentStatus}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Farmer Supplier:</span>
                      <span className="font-bold">{ord.farmerName} ({ord.cluster})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Order Quantity:</span>
                      <span className="font-mono font-bold">{ord.quantityKg} kg @ ₹{ord.agreedPrice}/kg</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800">
                      <span className="font-bold text-slate-700 dark:text-slate-200">Total Escrow Value:</span>
                      <span className="font-mono font-bold text-sm text-emerald-600">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Slot: {ord.scheduledDelivery}
                    </span>
                    <span className="text-indigo-600 font-semibold">{ord.escrowStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: MORNING DOCK RECEIVING & 3PL LOGISTICS (PDF Page 5, 8, 11, 15, 19)
            ========================================================================= */}
        {activeTab === 'logistics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Morning Gate Intake & 3PL Porter Fleet</h3>
                <p className="text-xs text-slate-500">Consolidated farm-to-dock deliveries with QR tamper-seal digital intake</p>
              </div>
            </div>

            <div className="space-y-4">
              {dispatches.map((disp) => (
                <div key={disp.dispatchId} className="p-6 rounded-3xl bg-white dark:bg-[#111D15] border border-slate-200 dark:border-indigo-500/20 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="font-mono text-xs font-bold text-indigo-600">{disp.dispatchId}</span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{disp.driver}</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {disp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Crates on Truck</span>
                      <span className="font-bold text-sm">{disp.crates} Crates</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Total Net Weight</span>
                      <span className="font-mono font-bold text-sm text-emerald-600">{disp.totalWeightKg} kg</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Farm Departure</span>
                      <span className="font-bold">{disp.departureTime}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Tamper Seals</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Intact
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => alert('Delivery QR manifests verified. Zero weight disputes recorded.')}
                      className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
                    >
                      Acknowledge Loading Dock Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ================= PROFILE MODAL ================= */}
      {profileModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setProfileModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-white dark:bg-[#111D15] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-indigo-500/30 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Buyer Profile</h3>
              <button onClick={() => setProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base">
                {companyName.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{companyName}</h4>
                <p className="text-xs text-slate-500 truncate max-w-[190px]">{companyBranch}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  Role: Institutional Anchor Buyer
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Protocol:</span>
                <span className="font-semibold">UPI e-Mandate / Corporate NetBanking</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Intake Dock:</span>
                <span className="font-semibold">Kitchen Receiving Bay #2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verified Organization:</span>
                <span className="font-bold text-emerald-600">Hospitality Enterprise</span>
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
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
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
