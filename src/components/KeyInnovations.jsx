import React from 'react';
import { Truck, Cpu, TrendingUp, ShieldCheck, Key, GitFork, AlertTriangle, CloudRain, Sparkles, CheckCircle2 } from 'lucide-react';
import { KEY_INNOVATIONS } from '../data/mockData';

export default function KeyInnovations() {
  const iconMap = {
    Truck: Truck,
    Cpu: Cpu,
    TrendingUp: TrendingUp,
    ShieldCheck: ShieldCheck,
    Key: Key,
    GitFork: GitFork,
    AlertTriangle: AlertTriangle,
    CloudRain: CloudRain,
  };

  return (
    <section id="innovations" className="py-16 md:py-24 bg-slate-50 dark:bg-earth-dark/50 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Core Research Contributions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Key Architectural Innovations
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
            Eight algorithmic and protocol innovations developed for the final-year capstone, bridging software engineering, spatial optimization, and agrarian financial engineering.
          </p>
        </div>

        {/* 8-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {KEY_INNOVATIONS.map((inv, idx) => {
            const Icon = iconMap[inv.icon] || Sparkles;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-earth-darkCard p-6 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/15 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-agri-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/20 text-agri-800 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-agri-800 dark:text-emerald-400" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {inv.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-agri-800 dark:group-hover:text-emerald-400 transition-colors">
                    {inv.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {inv.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Benchmark</span>
                  <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400">
                    {inv.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
