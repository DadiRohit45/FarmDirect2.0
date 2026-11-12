import React, { useState, useEffect } from 'react';
import { AlertTriangle, CloudRain, GitFork, ShieldAlert, Truck, FileText, CheckCircle2, RotateCcw, Activity, Droplets, ArrowRight, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResilienceDemo() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0); // 0: Normal, 1: Split-Node, 2: Day-Zero SOS, 3: Backup Farmer, 4: 3PL Funded, 5: RWBCIS Generated
  const [rainfallMm, setRainfallMm] = useState(32); // normal 32mm
  const rainfallThreshold = 80; // RWBCIS trigger threshold 80mm
  const [riskPoolBalance, setRiskPoolBalance] = useState(84250); // ₹84,250 platform reserve

  const steps = [
    {
      num: 1,
      title: 'Split-Node Routing Check',
      desc: 'Transit graph detects blocked road node (NH-16 Anakapalli Causeway flooded). Node quarantined.',
      icon: GitFork,
      color: 'amber',
    },
    {
      num: 2,
      title: 'Day-Zero SOS Broadcast',
      desc: 'Autonomous protocol triggered within 180ms. Demand manifest repartitioned across resilient clusters.',
      icon: AlertTriangle,
      color: 'red',
    },
    {
      num: 3,
      title: 'Backup Farmer Allocation',
      desc: 'Automated failover routes 400 kg requirement to Lakshmi Kameswari (Pendurthi Hub, 9.4 km, Tier A).',
      icon: CheckCircle2,
      color: 'emerald',
    },
    {
      num: 4,
      title: '3PL Emergency Dispatch',
      desc: 'Rapid 3PL carrier dispatched instantly. ₹1,200 transit surge funded 100% by 2% Risk Pool Buffer.',
      icon: Truck,
      color: 'blue',
    },
    {
      num: 5,
      title: 'RWBCIS Parametric Report',
      desc: 'Automated crop-loss claim generated using GPS coordinates, AP e-Crop plot registry & OpenWeather telemetry.',
      icon: FileText,
      color: 'emerald',
    },
  ];

  // Animated pipeline progression
  useEffect(() => {
    let timer;
    if (isSimulating && pipelineStep < 5) {
      timer = setTimeout(() => {
        const next = pipelineStep + 1;
        setPipelineStep(next);

        if (next === 1) {
          setRainfallMm(142); // severe flood spike
        } else if (next === 4) {
          setRiskPoolBalance(prev => prev - 1200); // 3PL transit surge funded
        } else if (next === 5) {
          setIsSimulating(false);
          confetti({
            particleCount: 75,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#047857', '#F59E0B', '#3B82F6'],
          });
        }
      }, 1600);
    }
    return () => clearTimeout(timer);
  }, [isSimulating, pipelineStep]);

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setPipelineStep(1);
    setRainfallMm(142);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setPipelineStep(0);
    setRainfallMm(32);
    setRiskPoolBalance(84250);
  };

  return (
    <div className="bg-white dark:bg-earth-darkCard rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 p-6 md:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-400 mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            Module 5 Interactive Simulation
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            Algorithmic Resilience & Parametric Recovery
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Simulate an extreme weather event on harvest day to witness autonomous Split-Node routing, 2% Risk Pool 3PL funding, and instant RWBCIS parametric insurance filing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset State
          </button>
          <button
            onClick={handleStartSimulation}
            disabled={isSimulating || pipelineStep === 5}
            className={`px-5 py-2.5 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2 shadow-md transition-all ${
              isSimulating || pipelineStep === 5
                ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20 hover:scale-[1.02]'
            }`}
          >
            {isSimulating ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                Executing Recovery Flow...
              </>
            ) : pipelineStep === 5 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Resilience Flow Complete
              </>
            ) : (
              <>
                <CloudRain className="w-4 h-4" />
                Simulate Flood on Fulfillment Day
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Pipeline Visualizer + Telemetry & RWBCIS Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Animated Recovery Pipeline (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 pb-1">
            <span>Autonomous Crisis Resolution Sequence</span>
            <span className="font-mono text-xs text-slate-500">
              {pipelineStep === 0 ? 'Status: Normal Monitoring' : `Stage ${pipelineStep} of 5 Active`}
            </span>
          </div>

          <div className="space-y-2.5">
            {steps.map((st) => {
              const Icon = st.icon;
              const isCurrent = pipelineStep === st.num;
              const isCompleted = pipelineStep > st.num;
              const isPending = pipelineStep < st.num;

              return (
                <div
                  key={st.num}
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex items-start gap-3.5 ${
                    isCurrent
                      ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-500/30'
                      : isCompleted
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-500/30'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCurrent
                        ? 'bg-amber-500 text-white animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {st.num}. {st.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded">
                        {isCurrent ? (
                          <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" /> In Progress
                          </span>
                        ) : isCompleted ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Resolved</span>
                        ) : (
                          <span className="text-slate-400">Standby</span>
                        )}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Telemetry Gauge & RWBCIS Dossier (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Weather Telemetry Gauge Card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-mono text-blue-400 flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5" />
                OPENWEATHER API IOT TELEMETRY
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Station: Anakapalli IMD</span>
            </div>

            <div className="py-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Recorded 24h Precipitation</span>
                  <span className={`text-4xl font-black font-mono tracking-tight ${rainfallMm > rainfallThreshold ? 'text-red-400' : 'text-blue-400'}`}>
                    {rainfallMm} <span className="text-sm font-normal text-slate-400">mm</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">RWBCIS Flood Threshold</span>
                  <span className="text-2xl font-bold font-mono text-amber-400">
                    {rainfallThreshold} <span className="text-xs font-normal text-slate-400">mm</span>
                  </span>
                </div>
              </div>

              {/* Gauge Meter Bar */}
              <div className="w-full bg-slate-800 h-3 rounded-full mt-3 overflow-hidden relative">
                {/* 80mm threshold indicator line */}
                <div className="absolute top-0 bottom-0 left-[53%] w-0.5 bg-amber-400 z-10" title="Threshold: 80mm" />
                <div
                  className={`h-full transition-all duration-700 rounded-full ${
                    rainfallMm > rainfallThreshold ? 'bg-gradient-to-r from-blue-500 via-amber-500 to-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, (rainfallMm / 150) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0 mm</span>
                <span className="text-amber-400">Trigger Threshold: 80 mm</span>
                <span>150 mm</span>
              </div>
            </div>

            {rainfallMm > rainfallThreshold && (
              <div className="p-2.5 bg-red-950/60 border border-red-500/30 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>Parametric condition satisfied: Rainfall exceeded index by 177.5%. Zero manual loss adjusters required!</span>
              </div>
            )}
          </div>

          {/* 2% Risk Pool Reserve Liquidity */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Platform 2% Risk Pool Liquidity
              </span>
              <span className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
                ₹{riskPoolBalance.toLocaleString()}
              </span>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <span className="block font-medium">Auto-absorbed:</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">
                {pipelineStep >= 4 ? '-₹1,200 (Emergency 3PL)' : '₹0.00 (Zero Drag)'}
              </span>
            </div>
          </div>

          {/* Generated RWBCIS Parametric Dossier Preview */}
          <div className={`p-4 rounded-xl border transition-all ${
            pipelineStep === 5
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/40'
              : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                RWBCIS Parametric Loss Certificate
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-300">
                {pipelineStep === 5 ? 'Verified & Filed' : 'Pending Trigger'}
              </span>
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 font-mono">
              <p>Claim ID: RWBCIS-VZG-2026-8812</p>
              <p>Insured Plot: AP e-Crop Survey #214/B (Kasimkota)</p>
              <p>Indemnity Payout: ₹12,800.00 (Automated Direct Benefit Transfer to Farmer Account)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>* Restructured Weather Based Crop Insurance Scheme (RWBCIS) rules aligned with Andhra Pradesh State Agriculture Department guidelines.</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-mono">Disaster Resolution Time: &lt; 4.2 minutes</span>
      </div>
    </div>
  );
}
