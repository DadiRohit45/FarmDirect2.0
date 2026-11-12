import React from 'react';
import { Target, TrendingUp, Sparkles, Sprout, ArrowRight, ShieldCheck, Cpu, LineChart, Globe } from 'lucide-react';

export default function ImpactFuture() {
  const outcomes = [
    {
      metric: '38%',
      label: 'Reduction in Post-Harvest Spoilage',
      desc: 'By locking reverse-demand 14–30 days pre-harvest and capping transit dwell times under 8 hours.',
      color: 'emerald',
    },
    {
      metric: '+₹4,200',
      label: 'Monthly Net Farmer Income Stabilization',
      desc: 'The ±15% price collar eliminates distributor middleman cuts and protects against distress mandi dumping.',
      color: 'amber',
    },
    {
      metric: '88%',
      label: 'Drop in Marginal Delivery Freight Cost',
      desc: 'Piggybacking household micro-orders on institutional bulk trucks drives per-order logistics to < ₹1.',
      color: 'emerald',
    },
    {
      metric: '< 5 Mins',
      label: 'Automated Parametric Disaster Recovery',
      desc: 'Split-Node graph re-routing and autonomous RWBCIS claim generation replace 6-month loss adjustment delays.',
      color: 'blue',
    },
  ];

  const futureRoadmap = [
    {
      phase: 'Phase II (Q3 2026)',
      title: 'IoT LoRaWAN Telemetry & Cold-Box Sensors',
      desc: 'Deploy low-cost LoRaWAN temperature, humidity, and ethylene gas sensors inside reusable Kirana crate batches for real-time shelf-life tracking.',
    },
    {
      phase: 'Phase III (Q4 2026)',
      title: 'Decentralized Community Risk Pool DAO',
      desc: 'Migrate the 2% Platform Risk Pool to an on-chain algorithmic escrow treasury governed by regional Farmer Producer Organizations (FPOs).',
    },
    {
      phase: 'Phase IV (2027)',
      title: 'Statewide AP Rythu Bharosa Kendra Integration',
      desc: 'Scale the pilot from the Visakhapatnam coastal corridor to all 26 districts of Andhra Pradesh, interoperating with state government RBK centers.',
    },
  ];

  return (
    <section id="impact" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-400 mb-3">
          <Target className="w-3.5 h-3.5" />
          Quantified Outcomes & Horizons
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Projected Impact & Future Scope
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
          Validated against Andhra Pradesh agricultural economics data and spatial simulations across the Visakhapatnam agrarian belt.
        </p>
      </div>

      {/* 4 Outcome Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {outcomes.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-earth-darkCard p-6 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/15 shadow-md flex flex-col justify-between"
          >
            <div>
              <span className="text-3xl sm:text-4xl font-black font-mono text-agri-800 dark:text-emerald-400 tracking-tight block mb-2">
                {item.metric}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                {item.label}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full w-4/5" />
            </div>
          </div>
        ))}
      </div>

      {/* Future Roadmap Timeline */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Subtle Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-2">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">Engineering Trajectory</span>
            <h3 className="text-xl font-bold text-white mt-0.5">Future Research & Scaling Roadmap</h3>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full self-start sm:self-auto">
            Capstone Phase 2+ Extension
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {futureRoadmap.map((rm, idx) => (
            <div
              key={idx}
              className="bg-slate-800/60 p-5 rounded-xl border border-slate-700/60 space-y-2 hover:border-emerald-500/40 transition-colors"
            >
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                {rm.phase}
              </span>
              <h4 className="text-sm font-bold text-white">
                {rm.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {rm.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
