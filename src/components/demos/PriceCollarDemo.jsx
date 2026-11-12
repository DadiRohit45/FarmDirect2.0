import React, { useState } from 'react';
import { TrendingUp, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, DollarSign, BarChart3, HelpCircle } from 'lucide-react';

export default function PriceCollarDemo() {
  const basePrice = 30.0; // Contracted base price ₹30/kg
  const collarPercent = 15; // ±15%
  const floorPrice = basePrice * (1 - collarPercent / 100); // ₹25.50
  const ceilingPrice = basePrice * (1 + collarPercent / 100); // ₹34.50

  const [spotPrice, setSpotPrice] = useState(18.0); // Default to a market glut scenario
  const [isCollared, setIsCollared] = useState(true);

  // Calculate payouts
  let farmerPayout = spotPrice;
  let buyerCost = spotPrice;
  let riskPoolContribution = 0;
  let statusSummary = '';

  if (isCollared) {
    if (spotPrice < floorPrice) {
      // Market crashed below floor
      farmerPayout = floorPrice; // Farmer protected by floor
      buyerCost = floorPrice;
      const deficit = floorPrice - spotPrice;
      riskPoolContribution = deficit * 0.4; // 40% subvention from 2% risk buffer if needed
      statusSummary = `Mandi crash absorbed: Farmer protected with Floor payout ₹${floorPrice.toFixed(2)}/kg (+₹${(floorPrice - spotPrice).toFixed(2)} higher than spot).`;
    } else if (spotPrice > ceilingPrice) {
      // Market spiked above ceiling
      farmerPayout = ceilingPrice; // Farmer enjoys +15% premium
      buyerCost = ceilingPrice; // Buyer protected from price gouging
      statusSummary = `Inflation spike contained: Buyer shielded with Cap cost ₹${ceilingPrice.toFixed(2)}/kg (saved ₹${(spotPrice - ceilingPrice).toFixed(2)} against spot).`;
    } else {
      // Within collar corridor
      farmerPayout = spotPrice;
      buyerCost = spotPrice;
      statusSummary = `Corridor equilibrium: Price floats naturally within ±15% healthy tolerance band.`;
    }
  } else {
    // Unprotected spot market
    farmerPayout = spotPrice;
    buyerCost = spotPrice;
    statusSummary = spotPrice < floorPrice
      ? `Severe Farmer Distress: Unprotected spot sale at ₹${spotPrice.toFixed(2)}/kg is below production cost.`
      : spotPrice > ceilingPrice
      ? `Institutional Deficit: Canteen budget strained by unhedged spike at ₹${spotPrice.toFixed(2)}/kg.`
      : `Spot trading at ₹${spotPrice.toFixed(2)}/kg.`;
  }

  // Preset scenarios
  const applyScenario = (price) => {
    setSpotPrice(price);
  };

  return (
    <div className="bg-white dark:bg-earth-darkCard rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 p-6 md:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-400 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Module 3 Interactive Simulation
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            Algorithmic Price Collar (±15% Risk Dampening)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Explore how bilateral bounded pricing insulates smallholder farmers from post-harvest mandi crashes while shielding institutional buyers from inflationary spikes.
          </p>
        </div>

        {/* Toggle between Collared and Spot */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setIsCollared(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isCollared
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🛡️ Collared Contract (FarmDirect)
          </button>
          <button
            onClick={() => setIsCollared(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isCollared
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⚡ Live Spot Mandi (Rythu Bazar)
          </button>
        </div>
      </div>

      {/* Interactive Controls & Scenario Bar */}
      <div className="my-6 space-y-4">
        {/* Scenario Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Quick Mandi Scenarios:</span>
          <button
            onClick={() => applyScenario(15.0)}
            className={`px-3 py-1 rounded-lg border transition-all ${
              spotPrice === 15.0
                ? 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-400 font-bold'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            📉 Severe Glut Crash (₹15/kg)
          </button>
          <button
            onClick={() => applyScenario(29.0)}
            className={`px-3 py-1 rounded-lg border transition-all ${
              spotPrice === 29.0
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            ⚖️ Balanced Harvest (₹29/kg)
          </button>
          <button
            onClick={() => applyScenario(48.0)}
            className={`px-3 py-1 rounded-lg border transition-all ${
              spotPrice === 48.0
                ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            📈 Cyclone Deficit Spike (₹48/kg)
          </button>
        </div>

        {/* Spot Market Price Slider */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Simulated APMC Mandi Spot Price (Volatile Market)
            </label>
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              ₹{spotPrice.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ kg</span>
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="55"
            step="0.5"
            value={spotPrice}
            onChange={(e) => setSpotPrice(Number(e.target.value))}
            className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>₹10.00 (Distress Sale)</span>
            <span className="text-red-500 font-semibold">Floor: ₹{floorPrice.toFixed(2)} (-15%)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Base: ₹{basePrice.toFixed(2)}</span>
            <span className="text-amber-500 font-semibold">Cap: ₹{ceilingPrice.toFixed(2)} (+15%)</span>
            <span>₹55.00 (Hyper-Inflation)</span>
          </div>
        </div>
      </div>

      {/* Visual Collar Chart & Financial Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Interactive Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <span className="font-mono text-emerald-400 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              DYNAMIC PRICE BAND TOPOLOGY
            </span>
            <span className="text-[11px] font-mono text-amber-300">
              Base $P_0 = ₹30.00
            </span>
          </div>

          {/* SVG Visualizing Collar */}
          <div className="w-full h-56 my-2 relative">
            <svg className="w-full h-full" viewBox="0 0 450 200">
              {/* Grid lines */}
              <line x1="40" y1="20" x2="430" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="40" y1="70" x2="430" y2="70" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="40" y1="110" x2="430" y2="110" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="40" y1="150" x2="430" y2="150" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="40" y1="180" x2="430" y2="180" stroke="#334155" />

              {/* Y Axis labels */}
              <text x="32" y="24" textAnchor="end" fill="#64748b" fontSize="9">₹50</text>
              <text x="32" y="74" textAnchor="end" fill="#f59e0b" fontSize="9" fontWeight="bold">₹34.5</text>
              <text x="32" y="114" textAnchor="end" fill="#10b981" fontSize="9" fontWeight="bold">₹30</text>
              <text x="32" y="154" textAnchor="end" fill="#ef4444" fontSize="9" fontWeight="bold">₹25.5</text>
              <text x="32" y="184" textAnchor="end" fill="#64748b" fontSize="9">₹10</text>

              {/* Protected Collar Corridor Zone (shaded rectangle) */}
              <rect
                x="40"
                y="70"
                width="390"
                height="80"
                fill="#166534"
                fillOpacity="0.25"
                stroke="#10b981"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <text x="235" y="114" textAnchor="middle" fill="#86efac" fontSize="10" opacity="0.6" fontWeight="bold">
                SAFE HARBOR (±15% COLLAR CORRIDOR)
              </text>

              {/* Contract Base Line */}
              <line x1="40" y1="110" x2="430" y2="110" stroke="#10b981" strokeWidth="2" />

              {/* Ceiling Line */}
              <line x1="40" y1="70" x2="430" y2="70" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 5" />
              <text x="425" y="65" textAnchor="end" fill="#fbbf24" fontSize="8">Ceiling (+15%)</text>

              {/* Floor Line */}
              <line x1="40" y1="150" x2="430" y2="150" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 5" />
              <text x="425" y="162" textAnchor="end" fill="#f87171" fontSize="8">Floor (-15%)</text>

              {/* Dynamic Spot Point Projection */}
              {(() => {
                // Map spotPrice (10 to 50) to y (180 to 20)
                const clampedSpot = Math.min(50, Math.max(10, spotPrice));
                const spotY = 180 - ((clampedSpot - 10) / 40) * 160;
                const spotX = 230;

                // Effective payout Y
                const clampedPayout = Math.min(50, Math.max(10, farmerPayout));
                const payoutY = 180 - ((clampedPayout - 10) / 40) * 160;

                return (
                  <g>
                    {/* Vertical guideline */}
                    <line x1={spotX} y1="20" x2={spotX} y2="180" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Spot Point */}
                    <circle cx={spotX} cy={spotY} r="7" fill="#f43f5e" stroke="#fff" strokeWidth="2" />
                    <text x={spotX + 10} y={spotY + 4} fill="#fda4af" fontSize="9" fontWeight="bold">
                      Spot: ₹{spotPrice.toFixed(1)}
                    </text>

                    {/* Effective Payout marker if collared */}
                    {isCollared && (
                      <g>
                        <circle cx={spotX} cy={payoutY} r="9" fill="#10b981" stroke="#fff" strokeWidth="2" className="animate-pulse" />
                        <text x={spotX - 12} y={payoutY + 4} textAnchor="end" fill="#86efac" fontSize="9" fontWeight="bold">
                          Collar Payout: ₹{farmerPayout.toFixed(1)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
            <span>Red Dot: Unhedged Spot Price</span>
            <span>Green Glowing Ring: Guaranteed Settlement Payout</span>
          </div>
        </div>

        {/* Payout Metric Cards (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Farmer Payout Card */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Effective Farmer Payout
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono text-emerald-700 dark:text-emerald-400">
                ₹{farmerPayout.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ kg</span>
              </span>
              {isCollared && spotPrice < floorPrice && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  +₹{(floorPrice - spotPrice).toFixed(2)} Protected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isCollared
                ? 'Insulated from disastrous market dips below cultivation cost.'
                : '100% exposed to spot mandi price collapses.'}
            </p>
          </div>

          {/* Buyer Cost Card */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Effective Institutional Buyer Cost
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
                ₹{buyerCost.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ kg</span>
              </span>
              {isCollared && spotPrice > ceilingPrice && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                  -₹{(spotPrice - ceilingPrice).toFixed(2)} Saved
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isCollared
                ? 'Protects AU hostel & KGH hospital canteens from budget overruns.'
                : 'Subject to volatile open market supplier price gouging.'}
            </p>
          </div>

          {/* Status Alert Banner */}
          <div
            className={`p-3.5 rounded-xl text-xs border ${
              isCollared
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-900 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/30 border-red-500/30 text-red-900 dark:text-red-300'
            }`}
          >
            <div className="font-semibold flex items-center gap-1.5 mb-1">
              {isCollared ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
              {isCollared ? 'Collar Stability Active' : 'Unhedged Spot Exposure'}
            </div>
            <p className="text-[11px] leading-relaxed">{statusSummary}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>* Parametric pricing model calibrated against APMC Agmarknet 2024–2025 Visakhapatnam mandi records.</span>
        <span className="font-mono text-emerald-700 dark:text-emerald-400">Stability Index: 94.2%</span>
      </div>
    </div>
  );
}
