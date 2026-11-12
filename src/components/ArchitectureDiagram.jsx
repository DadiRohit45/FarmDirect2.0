import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, ArrowRight, Cpu, Sparkles, Database, ArrowDown, ExternalLink } from 'lucide-react';
import { ARCHITECTURE_MODULES } from '../data/mockData';

export default function ArchitectureDiagram() {
  const [expandedId, setExpandedId] = useState('mod-1');

  const toggleModule = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section id="architecture" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-400 mb-3">
          <Layers className="w-3.5 h-3.5" />
          5-Tier Modular Specification
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          System Architecture Overview
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
          An end-to-end, deterministic software pipeline connecting agricultural forward contracts to decentralized last-mile Kirana distribution. Click each module layer to inspect algorithmic formulations.
        </p>
      </div>

      {/* Layered Interactive Stack */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {ARCHITECTURE_MODULES.map((mod, index) => {
          const isExpanded = expandedId === mod.id;

          return (
            <div
              key={mod.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? 'bg-white dark:bg-earth-darkCard border-emerald-500/40 shadow-xl ring-1 ring-emerald-500/20'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-emerald-500/30'
              }`}
            >
              {/* Module Header Bar (Clickable) */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 transition-colors ${
                      isExpanded
                        ? 'bg-agri-800 text-white dark:bg-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {mod.number}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
                      {mod.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block text-[11px] font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                    {mod.algorithm.split('+')[0].trim()}
                  </span>
                  <div className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </button>

              {/* Expanded Detailed Breakdown */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-5 bg-slate-50/50 dark:bg-slate-950/20">
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {mod.details}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Algorithmic Formulation */}
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1.5 font-mono">
                        Algorithm & Engine
                      </span>
                      <p className="font-semibold text-slate-900 dark:text-white font-mono text-xs">
                        {mod.algorithm}
                      </p>
                    </div>

                    {/* Inputs */}
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5 font-mono">
                        Ingested Inputs
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {mod.inputs.map((inp, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {inp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Outputs */}
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1.5 font-mono">
                        Deterministic Outputs
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {mod.outputs.map((out, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            {out}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Jump to demo link */}
                  <div className="flex justify-end pt-2">
                    <a
                      href="#demos"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-agri-800 dark:text-emerald-400 hover:underline"
                    >
                      <span>Test Live Interactive Demo for Module {mod.number}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
