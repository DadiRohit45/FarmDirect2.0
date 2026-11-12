import React from 'react';
import { Server, Database, Cpu, CloudRain, CreditCard, Shield, Globe, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export default function TechStack() {
  const stackBadges = [
    { name: 'React 19', role: 'Reactive Client UI & Real-Time Simulations', category: 'Frontend' },
    { name: 'Tailwind CSS v3', role: 'Agri-Tech Design System & Dark Mode', category: 'Styling' },
    { name: 'Django REST Framework', role: 'Async REST API & Contract State Machine', category: 'Backend' },
    { name: 'Python 3.12', role: 'Match Score Engine & Spatial Clustering', category: 'Compute' },
    { name: 'PostgreSQL + PostGIS', role: 'Geo-Spatial Spatial Coordinate Indexing', category: 'Database' },
    { name: 'Celery + Redis', role: 'Async Queue & 15-Min Time-Lock Scheduling', category: 'Worker' },
    { name: 'NPCI UPI 2.0', role: 'e-Mandate Pre-Authorization & Clearing', category: 'FinTech' },
    { name: 'OpenWeather API', role: 'Parametric Weather Telemetry (RWBCIS)', category: 'IoT/InsurTech' },
    { name: 'AP e-Crop Registry', role: 'Government Land Parcel & Crop Ground-Truthing', category: 'GovTech' },
    { name: '3PL Webhook Gateway', role: 'Porter/Dunzo Automated Rapid SOS Dispatch', category: 'Logistics' },
  ];

  return (
    <section id="tech-stack" className="py-16 md:py-24 bg-slate-50 dark:bg-earth-dark/50 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-400 mb-3">
            <Server className="w-3.5 h-3.5" />
            Engineering Blueprint
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            System Architecture & Tech Stack
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
            Distributed micro-service pipeline orchestrated with a Python/Django backend, PostGIS spatial indexing, and low-latency financial and meteorological API integrations.
          </p>
        </div>

        {/* Full-Stack Architectural Diagram Grid */}
        <div className="bg-white dark:bg-earth-darkCard rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 p-6 md:p-8 shadow-xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Tier 1: Client Interfaces */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono pb-2 border-b border-slate-200 dark:border-slate-800">
                <Globe className="w-4 h-4" />
                1. Presentation Tier
              </div>
              <div className="space-y-2.5">
                <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">Farmer PWA App</span>
                  <span className="text-[11px] text-slate-500">Offline-first Telugu/English SMS & OTP interface</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">Anchor Buyer Portal</span>
                  <span className="text-[11px] text-slate-500">AU & KGH forward demand commitment dashboard</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">Kirana Merchant App</span>
                  <span className="text-[11px] text-slate-500">QR scanner, Dual-OTP verification & buffer ledger</span>
                </div>
              </div>
            </div>

            {/* Tier 2: Backend & Engine */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono pb-2 border-b border-slate-200 dark:border-slate-800">
                <Cpu className="w-4 h-4" />
                2. Algorithmic Core
              </div>
              <div className="space-y-2.5">
                <div className="bg-amber-50/70 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-500/30 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">Django REST Engine</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">Stateless REST API & Contract Lifecycle Engine</span>
                </div>
                <div className="bg-amber-50/70 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-500/30 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">Match Score Engine</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">Gale-Shapley variant with multi-attribute weighting</span>
                </div>
                <div className="bg-amber-50/70 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-500/30 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">Celery / Redis Worker</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">15-min contract locks & waterfall timeout queues</span>
                </div>
              </div>
            </div>

            {/* Tier 3: Database & Spatial Layer */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono pb-2 border-b border-slate-200 dark:border-slate-800">
                <Database className="w-4 h-4" />
                3. Spatial Data Layer
              </div>
              <div className="space-y-2.5">
                <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">PostGIS Geo-Database</span>
                  <span className="text-[11px] text-slate-500">Spatial Voronoi cells & 800m Kirana cluster bins</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">OSRM Routing Graph</span>
                  <span className="text-[11px] text-slate-500">Split-Node graph partitioning for NH-16 corridor</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">2% Risk Pool Ledger</span>
                  <span className="text-[11px] text-slate-500">Automated reserve liquidity & hedge payouts</span>
                </div>
              </div>
            </div>

            {/* Tier 4: External Integrations */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono pb-2 border-b border-slate-200 dark:border-slate-800">
                <Server className="w-4 h-4" />
                4. External Gateways
              </div>
              <div className="space-y-2.5">
                <div className="bg-purple-50/70 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-500/30 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">NPCI UPI 2.0 API</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">10% pre-auth e-mandates & instant settlement</span>
                </div>
                <div className="bg-purple-50/70 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-500/30 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">OpenWeather IoT API</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">80mm threshold parametric rainfall triggers</span>
                </div>
                <div className="bg-purple-50/70 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-500/30 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">AP e-Crop & 3PL APIs</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">Govt cadastral link & Porter/Dunzo failover</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Badge Row */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block text-center mb-4 font-mono">
            Key Technologies & Frameworks Utilized
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {stackBadges.map((badge, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 hover:border-emerald-500/40 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                  {badge.name}
                </span>
                <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
                  • {badge.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
