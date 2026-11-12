import React, { useState } from 'react';
import { Sparkles, Truck, Sliders, TrendingUp, ShieldCheck, CloudRain, ArrowRight } from 'lucide-react';
import AnchorPiggybackingDemo from './demos/AnchorPiggybackingDemo';
import DirectedDispatchDemo from './demos/DirectedDispatchDemo';
import PriceCollarDemo from './demos/PriceCollarDemo';
import ZeroTrustCustodyDemo from './demos/ZeroTrustCustodyDemo';
import ResilienceDemo from './demos/ResilienceDemo';

export default function InteractiveDemosSection() {
  const [selectedDemo, setSelectedDemo] = useState('piggybacking');

  const demoTabs = [
    { id: 'piggybacking', name: '1. Anchor Piggybacking', icon: Truck, short: 'Micro-Orders & Freight' },
    { id: 'dispatch', name: '2. Directed Dispatch', icon: Sliders, short: 'Waterfall Match Score' },
    { id: 'collar', name: '3. Price Collar', icon: TrendingUp, short: '±15% Risk Dampener' },
    { id: 'custody', name: '4. Zero-Trust Custody', icon: ShieldCheck, short: 'Kirana Dual-OTP Ledger' },
    { id: 'resilience', name: '5. Parametric Resilience', icon: CloudRain, short: 'Day-Zero SOS & Flood' },
  ];

  return (
    <section id="demos" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive Capstone Laboratory
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Module Deep-Dives & Interactive Demos
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
          Test each core algorithm using live interactive client-side simulators. Calibrated with spatial and market telemetry from the Visakhapatnam pilot region.
        </p>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {demoTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedDemo === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedDemo(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-agri-800 text-white dark:bg-emerald-600 shadow-md scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Selected Interactive Demo */}
      <div className="transition-all duration-300">
        {selectedDemo === 'piggybacking' && <AnchorPiggybackingDemo />}
        {selectedDemo === 'dispatch' && <DirectedDispatchDemo />}
        {selectedDemo === 'collar' && <PriceCollarDemo />}
        {selectedDemo === 'custody' && <ZeroTrustCustodyDemo />}
        {selectedDemo === 'resilience' && <ResilienceDemo />}
      </div>
    </section>
  );
}
