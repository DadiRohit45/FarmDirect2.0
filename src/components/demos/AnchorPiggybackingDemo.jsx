import React, { useState, useEffect } from 'react';
import { Truck, Home, Building2, Package, CheckCircle2, ArrowRight, RotateCcw, Zap, Sparkles, TrendingDown } from 'lucide-react';

export default function AnchorPiggybackingDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Idle, 1: Anakapalli loaded, 2: Passing Pendurthi, 3: MVP Colony micro-pickup, 4: Delivery completed
  const [marginalCost, setMarginalCost] = useState(45.0);
  const [householdOrders, setHouseholdOrders] = useState([
    { id: 'HH-1', name: 'Apartment 4B, MVP Colony', weight: 4.5, latPct: 65, lngPct: 40, status: 'dormant' },
    { id: 'HH-2', name: 'Plot 12, Seethammadhara', weight: 6.0, latPct: 52, lngPct: 48, status: 'dormant' },
    { id: 'HH-3', name: 'Villa 7, Lawsons Bay', weight: 3.5, latPct: 75, lngPct: 35, status: 'dormant' },
    { id: 'HH-4', name: 'Sector 5, MVP Colony', weight: 5.0, latPct: 80, lngPct: 42, status: 'dormant' },
    { id: 'HH-5', name: 'Hill View, Rushikonda', weight: 8.0, latPct: 88, lngPct: 22, status: 'dormant' },
  ]);

  const [truckLoad, setTruckLoad] = useState(500); // Base bulk load in kg
  const [co2Saved, setCo2Saved] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning) {
      if (currentStep < 4) {
        timer = setTimeout(() => {
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);

          // Update costs and household states as truck advances
          if (nextStep === 1) {
            setMarginalCost(28.5);
            setTruckLoad(500);
          } else if (nextStep === 2) {
            setMarginalCost(12.4);
            setHouseholdOrders(prev => prev.map((item, idx) => idx < 2 ? { ...item, status: 'piggybacked' } : item));
            setTruckLoad(510.5);
            setCo2Saved(4.2);
          } else if (nextStep === 3) {
            setMarginalCost(3.2);
            setHouseholdOrders(prev => prev.map((item, idx) => idx < 4 ? { ...item, status: 'piggybacked' } : item));
            setTruckLoad(522);
            setCo2Saved(8.6);
          } else if (nextStep === 4) {
            setMarginalCost(0.85);
            setHouseholdOrders(prev => prev.map(item => ({ ...item, status: 'delivered' })));
            setTruckLoad(527);
            setCo2Saved(14.8);
            setIsRunning(false);
          }
        }, 1500);
      }
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStep]);

  const handleTrigger = () => {
    setIsRunning(true);
    setCurrentStep(1);
    setMarginalCost(28.5);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setMarginalCost(45.0);
    setTruckLoad(500);
    setCo2Saved(0);
    setHouseholdOrders(prev => prev.map(item => ({ ...item, status: 'dormant' })));
  };

  return (
    <div className="bg-white dark:bg-earth-darkCard rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 p-6 md:p-8 shadow-xl">
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-400 mb-2">
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Module 1 Interactive Simulation
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            Anchor Piggybacking & Marginal Cost Convergence
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Simulate how bulk institutional freight absorbs trunk haulage, allowing dormant consumer micro-orders to be piggybacked at near-zero marginal cost.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleTrigger}
            disabled={isRunning || currentStep === 4}
            className={`px-5 py-2.5 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2 shadow-md transition-all ${
              isRunning || currentStep === 4
                ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                : 'bg-agri-800 hover:bg-agri-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-emerald-900/20 hover:scale-[1.02]'
            }`}
          >
            {isRunning ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Simulating Piggyback Route...
              </>
            ) : currentStep === 4 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Route Fully Manifested
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Trigger Anchor Bulk Route
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Map / Schematic View (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 relative overflow-hidden border border-slate-800 shadow-inner flex flex-col justify-between min-h-[380px]">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Top Bar on Map */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
            <span className="flex items-center gap-1.5 font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              VIZAG AGRO-CORRIDOR ROUTE: NH-16 → MVP URBAN
            </span>
            <span className="text-[11px] bg-slate-800 px-2.5 py-0.5 rounded text-slate-300">
              Stage {currentStep} of 4
            </span>
          </div>

          {/* SVG Route Visualization */}
          <div className="relative w-full h-64 my-2">
            <svg className="w-full h-full" viewBox="0 0 500 240">
              {/* Route Path Polyline */}
              <path
                d="M 50 190 Q 150 180 230 130 T 430 50"
                fill="none"
                stroke="#1e293b"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 50 190 Q 150 180 230 130 T 430 50"
                fill="none"
                stroke={currentStep > 0 ? '#10b981' : '#334155'}
                strokeWidth="4"
                strokeDasharray={currentStep > 0 ? '6 6' : 'none'}
                className={currentStep > 0 && currentStep < 4 ? 'animate-pulse' : ''}
              />

              {/* Node 1: Origin Farm Hub (Anakapalli) */}
              <g transform="translate(50, 190)">
                <circle r="14" fill="#166534" stroke="#4ade80" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">AP</text>
                <text x="0" y="28" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="500">Anakapalli (531001)</text>
                <text x="0" y="38" textAnchor="middle" fill="#4ade80" fontSize="8">Origin Farm-Gate</text>
              </g>

              {/* Intermediate Transit Waypoint: Pendurthi */}
              <g transform="translate(180, 155)">
                <circle r="9" fill={currentStep >= 2 ? '#10b981' : '#334155'} />
                <text x="0" y="20" textAnchor="middle" fill="#64748b" fontSize="8">Pendurthi Transit</text>
              </g>

              {/* Node 2: Kirana Drop Hub (MVP Colony) */}
              <g transform="translate(320, 95)">
                <circle r="12" fill={currentStep >= 3 ? '#d97706' : '#334155'} stroke={currentStep >= 3 ? '#fbbf24' : 'none'} strokeWidth="2" />
                <text x="0" y="3" textAnchor="middle" fill="#fff" fontSize="9">K</text>
                <text x="0" y="24" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">MVP Kirana Hub</text>
                <text x="0" y="34" textAnchor="middle" fill="#fbbf24" fontSize="7">Pincode 530017</text>
              </g>

              {/* Node 3: Anchor Buyer Destination (AU / Hospital Mess) */}
              <g transform="translate(430, 50)">
                <circle r="14" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">AU</text>
                <text x="0" y="26" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="500">Anchor Mega-Mess</text>
                <text x="0" y="36" textAnchor="middle" fill="#f59e0b" fontSize="8">500kg Bulk Anchor</text>
              </g>

              {/* Household Micro-order nodes */}
              {householdOrders.map((hh, idx) => {
                // map positions
                const cx = 160 + idx * 55 + (idx % 2 === 0 ? 10 : -15);
                const cy = 175 - idx * 28 + (idx % 2 === 0 ? -25 : 20);
                const isPiggybacked = hh.status === 'piggybacked' || hh.status === 'delivered';
                return (
                  <g key={hh.id} transform={`translate(${cx}, ${cy})`} className="transition-all duration-500">
                    <circle
                      r="6"
                      fill={isPiggybacked ? '#10b981' : '#475569'}
                      stroke={isPiggybacked ? '#86efac' : '#1e293b'}
                      strokeWidth="1.5"
                      className={isPiggybacked ? 'animate-bounce-gentle' : ''}
                    />
                    {isPiggybacked && (
                      <line
                        x1="0"
                        y1="0"
                        x2={idx % 2 === 0 ? -15 : 15}
                        y2={idx % 2 === 0 ? 25 : -20}
                        stroke="#10b981"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                    )}
                    <text x="9" y="3" fill={isPiggybacked ? '#86efac' : '#64748b'} fontSize="7.5">
                      {hh.weight}kg
                    </text>
                  </g>
                );
              })}

              {/* Truck Icon Positioning based on step */}
              {currentStep > 0 && (
                <g
                  transform={
                    currentStep === 1
                      ? 'translate(65, 185)'
                      : currentStep === 2
                      ? 'translate(195, 145)'
                      : currentStep === 3
                      ? 'translate(315, 90)'
                      : 'translate(415, 50)'
                  }
                  className="transition-all duration-1000 ease-in-out"
                >
                  <circle r="14" fill="#F59E0B" className="animate-ping opacity-30" />
                  <circle r="12" fill="#F59E0B" stroke="#fff" strokeWidth="1.5" />
                  <text x="0" y="4" textAnchor="middle" fill="#000" fontSize="10">🚚</text>
                </g>
              )}
            </svg>
          </div>

          {/* Map Footer Route Info */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Green Nodes = Micro-Orders absorbed into manifest
            </span>
            <span className="font-mono text-amber-400">
              Bulk Base: 500 kg | Micro: {truckLoad - 500 > 0 ? (truckLoad - 500).toFixed(1) : '0'} kg
            </span>
          </div>
        </div>

        {/* Live Metrics & Telemetry (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Main Marginal Cost Meter Card */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Marginal Delivery Cost Meter
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-300">
                Per Household Order
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                ₹{marginalCost.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {marginalCost < 2 ? 'Near-Zero threshold achieved' : 'Converging on zero...'}
              </span>
            </div>

            {/* Progress bar towards zero */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-700 rounded-full"
                style={{ width: `${Math.max(5, ((45 - marginalCost) / 45) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <span>Standalone Courier: ₹45.00</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Piggybacked: ₹0.85</span>
            </div>
          </div>

          {/* Real-time Order Manifest List */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-agri-700 dark:text-emerald-400" />
                Live Household Micro-Order Manifest
              </span>
              <span className="text-[11px] text-slate-500">
                {householdOrders.filter(h => h.status !== 'dormant').length}/{householdOrders.length} Absorbed
              </span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {householdOrders.map(order => (
                <div
                  key={order.id}
                  className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-800 dark:text-slate-200 truncate max-w-[130px] font-medium">
                      {order.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-[11px]">{order.weight} kg</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        order.status === 'dormant'
                          ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          : order.status === 'piggybacked'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 animate-pulse'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      }`}
                    >
                      {order.status === 'dormant' ? 'Dormant' : order.status === 'piggybacked' ? 'Piggybacked' : 'Delivered'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Efficiency Summary Chips */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">Total Truck Payload</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                {truckLoad.toFixed(1)} <span className="text-xs font-normal">kg</span>
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">Urban CO₂ Avoided</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {co2Saved.toFixed(1)} <span className="text-xs font-normal">kg CO₂e</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Illustrative Simulation Disclaimer Tag */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>* Illustrative client-side simulation based on Visakhapatnam urban density and NH-16 freight vectors.</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-medium">Algorithmic Target: Marginal Cost &lt; ₹1.00</span>
      </div>
    </div>
  );
}
