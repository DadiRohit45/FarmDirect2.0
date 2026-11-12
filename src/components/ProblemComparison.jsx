import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, TrendingDown, ArrowRight, ShieldAlert, Sparkles, Scale, DollarSign, Clock, Truck } from 'lucide-react';

export default function ProblemComparison() {
  const [activeCategory, setActiveCategory] = useState('all');

  const comparisons = [
    {
      category: 'logistics',
      dimension: 'Demand Discovery & Freight Direction',
      traditional: {
        title: 'Supply Blindly Chases Demand',
        desc: 'Farmers harvest without committed buyers, load produce onto costly private tempos, and arrive uncoordinated at urban APMC Rythu Bazars hoping for buyers.',
        metric: '₹45–60 / crate transit freight',
      },
      farmDirect: {
        title: 'Reverse-Demand Ingestion & Piggybacking',
        desc: 'Forward contracts from institutional anchors (hostels, hospital messes) lock demand pre-harvest. Micro-orders piggyback along the transit vector.',
        metric: 'Near-Zero (₹0.85/order) marginal freight',
      },
    },
    {
      category: 'financial',
      dimension: 'Price Volatility & Market Risk',
      traditional: {
        title: '100% Farmer Risk Absorption',
        desc: 'Mandi spot prices crash during local harvest gluts (e.g. tomatoes tumbling to ₹8–12/kg). Middlemen take fat margins; smallholders absorb all market losses.',
        metric: 'Uncapped downside (100% spot exposure)',
      },
      farmDirect: {
        title: 'Algorithmic ±15% Price Collar',
        desc: 'Pre-agreed contract price with dynamic ±15% protective ceiling and floor bands. Floor guarantees livelihood; cap protects institutional food budgets.',
        metric: 'Bounded volatility corridor (±15%)',
      },
    },
    {
      category: 'spoilage',
      dimension: 'Perishable Spoilage & Cold Chain',
      traditional: {
        title: 'Capital-Heavy or Zero Cold Chain',
        desc: 'Centralized cold-storage requires high CAPEX and electricity. Delayed warehouse dwell times lead to massive spoilage and distress dumping.',
        metric: '32–40% post-harvest produce loss',
      },
      farmDirect: {
        title: 'Asset-Light Kirana Micro-Hubs',
        desc: 'Neighborhood grocery stores serve as zero-capex micro-depots. Produce moves from harvest gate to consumer plate in under 8 hours.',
        metric: '< 5% transit and storage loss',
      },
    },
    {
      category: 'settlement',
      dimension: 'Custody Trust & Settlement Velocity',
      traditional: {
        title: 'Informal Credit & Delayed Clearance',
        desc: 'Commission agents issue informal paper slips. Farmers wait 15–45 days for bank payments, suffering shrinkage disputes and payment defaults.',
        metric: '15–45 days payment lag',
      },
      farmDirect: {
        title: 'Zero-Trust Dual-OTP & UPI Escrow',
        desc: '10% UPI e-Mandate token locked upfront. Physical handoffs verified cryptographically with Dual-OTP keys. Immediate multi-split settlement.',
        metric: 'Sub-minute automated IMPS clearance',
      },
    },
    {
      category: 'resilience',
      dimension: 'Extreme Weather & Climate Shock Recovery',
      traditional: {
        title: 'Catastrophic Default on Disaster',
        desc: 'Floods or coastal depressions wash out roads or ruin crops. Insurance adjusters take 6–9 months for manual damage surveys; supply chain halts.',
        metric: '6–9 months insurance delay',
      },
      farmDirect: {
        title: 'Day-Zero SOS & Parametric RWBCIS',
        desc: 'Autonomous Split-Node routing re-allocates orders to backup farmers. 2% Risk Pool funds emergency 3PL. OpenWeather telemetry triggers instant insurance dossiers.',
        metric: 'Autonomous recovery in < 5 minutes',
      },
    },
  ];

  const filtered = activeCategory === 'all'
    ? comparisons
    : comparisons.filter(c => c.category === activeCategory);

  return (
    <section id="problem" className="py-16 md:py-24 bg-slate-50 dark:bg-earth-dark/50 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-400 mb-3">
            <Scale className="w-3.5 h-3.5" />
            Structural Paradigm Shift
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The Supply Chain Dilemma: Before vs. After
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
            Conventional agricultural logistics burdens smallholder farmers with 100% of the logistical, financial, and environmental risk. FarmDirect 2.0 re-engineers the paradigm into a predictive, algorithmically coordinated network.
          </p>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { id: 'all', label: 'All Dimensions' },
              { id: 'logistics', label: 'Logistics' },
              { id: 'financial', label: 'Price Risk' },
              { id: 'spoilage', label: 'Waste & Storage' },
              { id: 'settlement', label: 'Settlement' },
              { id: 'resilience', label: 'Climate Shock' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveCategory(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === f.id
                    ? 'bg-agri-800 text-white dark:bg-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Column Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Traditional Model (Negative) */}
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Traditional Reactive Model (Mandi Spot System)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Supply chases volatile demand; farmers bear 100% logistical and weather liability.
              </p>
            </div>

            <div className="space-y-4">
              {filtered.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-earth-darkCard p-5 rounded-2xl border border-red-200/60 dark:border-red-950/40 shadow-sm space-y-2 relative"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                    {item.dimension}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    {item.traditional.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.traditional.desc}
                  </p>
                  <div className="pt-2 text-xs font-mono font-bold text-red-600 dark:text-red-400">
                    Impact: {item.traditional.metric}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: FarmDirect 2.0 (Positive) */}
          <div className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                FarmDirect 2.0 Predictive Supply Chain
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Reverse-demand aggregation, bounded price collars, and algorithmic resilience.
              </p>
            </div>

            <div className="space-y-4">
              {filtered.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-earth-darkCard p-5 rounded-2xl border border-emerald-500/30 dark:border-emerald-500/20 shadow-md space-y-2 relative"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono block">
                    {item.dimension}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {item.farmDirect.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.farmDirect.desc}
                  </p>
                  <div className="pt-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    Impact: {item.farmDirect.metric}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
