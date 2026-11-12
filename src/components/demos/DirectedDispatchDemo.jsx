import React, { useState, useEffect } from 'react';
import { Sliders, Award, Clock, ArrowDown, UserCheck, AlertCircle, RefreshCw, CheckCircle2, ShieldCheck, MapPin, Database } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_FARMERS } from '../../data/mockData';
import { dbFetchFarmers } from '../../lib/supabaseClient';

export default function DirectedDispatchDemo() {
  const [farmers, setFarmers] = useState(MOCK_FARMERS);
  const [isSupabaseSynced, setIsSupabaseSynced] = useState(false);

  // Weights (normalized to sum to 100%)
  const [proximityWeight, setProximityWeight] = useState(40);
  const [trustWeight, setTrustWeight] = useState(35);
  const [volumeWeight, setVolumeWeight] = useState(25);

  // Waterfall and simulation state
  const [declinedIds, setDeclinedIds] = useState([]);
  const [acceptedId, setAcceptedId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15:00 minutes countdown
  const [timerActive, setTimerActive] = useState(true);
  const [waterfallLog, setWaterfallLog] = useState([
    'System initialized demand: 450 kg Tomato (S-12) for Andhra University Mega Mess.',
    'Multi-attribute scoring computed candidate pool rankings.',
  ]);

  // Fetch live farmers from Supabase 'farmers' table
  useEffect(() => {
    async function loadFarmers() {
      const liveData = await dbFetchFarmers();
      if (liveData && liveData.length > 0) {
        setFarmers(liveData);
        setIsSupabaseSynced(true);
      }
    }
    loadFarmers();
  }, []);

  // Compute live match scores for candidates
  const scoredFarmers = farmers.map(farmer => {
    // Proximity score: closer is better (max distance benchmark ~35km)
    const proxScore = Math.max(0, 1 - (farmer.distanceKm / 35));
    // Trust score is already 0.0 - 1.0
    const trustSc = farmer.trustScore;
    // Volume fit score: target is 450 kg
    const targetVolume = 450;
    const volDiffRatio = Math.abs(farmer.dailyCapacityKg - targetVolume) / targetVolume;
    const volScore = Math.max(0, 1 - volDiffRatio);

    const totalWeight = proximityWeight + trustWeight + volumeWeight || 1;
    const compositeScore = (
      (proxScore * proximityWeight) +
      (trustSc * trustWeight) +
      (volScore * volumeWeight)
    ) / totalWeight;

    return {
      ...farmer,
      compositeScore: Math.round(compositeScore * 100),
      proxScoreComponent: Math.round(proxScore * 100),
      trustScoreComponent: Math.round(trustSc * 100),
      volScoreComponent: Math.round(volScore * 100),
    };
  }).sort((a, b) => b.compositeScore - a.compositeScore);

  // Active top available candidate (excluding declined/expired ones)
  const activeCandidate = scoredFarmers.find(f => !declinedIds.includes(f.id));

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (timerActive && !acceptedId && activeCandidate && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleIgnoreOffer(activeCandidate.id, 'Timeout expired');
            return 15 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, acceptedId, activeCandidate, timeLeft]);

  // Handle ignoring / declining offer -> waterfalls to next candidate
  const handleIgnoreOffer = (farmerId, reason = 'Offer ignored by candidate') => {
    if (!farmerId) return;
    const farmer = farmers.find(f => f.id === farmerId);
    setDeclinedIds(prev => [...prev, farmerId]);
    setTimeLeft(15 * 60); // reset 15-minute lock for next farmer

    // Next candidate in line
    const remaining = scoredFarmers.filter(f => !declinedIds.includes(f.id) && f.id !== farmerId);
    const nextCandidate = remaining[0];

    setWaterfallLog(prev => [
      `[${new Date().toLocaleTimeString()}] ${reason}: ${farmer?.name} (${farmerId}). Time-lock released.`,
      nextCandidate
        ? `Waterfall cascade → Dispatched time-locked offer to #${scoredFarmers.indexOf(nextCandidate) + 1} ${nextCandidate.name} (Score: ${nextCandidate.compositeScore}/100).`
        : 'Waterfall queue exhausted. Automated SOS broadcast required.',
      ...prev,
    ]);
  };

  // Handle accept offer
  const handleAcceptOffer = (farmerId) => {
    setAcceptedId(farmerId);
    setTimerActive(false);
    const farmer = farmers.find(f => f.id === farmerId);
    setWaterfallLog(prev => [
      `[${new Date().toLocaleTimeString()}] ✅ CONTRACT SECURED: ${farmer?.name} locked 450 kg contract! 10% UPI token initiated.`,
      ...prev,
    ]);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#166534', '#F59E0B', '#10B981'],
    });
  };

  const handleReset = () => {
    setDeclinedIds([]);
    setAcceptedId(null);
    setTimeLeft(15 * 60);
    setTimerActive(true);
    setWaterfallLog([
      'Reset simulation. Recalculating rankings with current weight configuration.',
    ]);
  };

  // Format time as MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-earth-darkCard rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 p-6 md:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-400 mb-2">
            <Sliders className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Module 2 Interactive Simulation
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            Directed Algorithmic Dispatch & Time-Locked Waterfall
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Simulate the multi-attribute matching utility function, rank farmer candidates in real-time, and observe the sequential contract waterfall cascade.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-3.5 py-2 self-start sm:self-auto rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Candidates
        </button>
      </div>

      {/* Sliders Configuration Row */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-5 my-6 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-agri-700 dark:text-emerald-400" />
            Match Score Utility Weights (Multi-Criteria Function)
          </span>
          <span className="text-xs font-mono text-slate-500">
            Formula: Score = w₁·Prox + w₂·Trust + w₃·VolFit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Proximity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Proximity Weight (w₁)</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{proximityWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={proximityWeight}
              onChange={(e) => setProximityWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Minimizes road travel km & transit fuel footprint</p>
          </div>

          {/* Trust Tier Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Trust & Reliability (w₂)</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{trustWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={trustWeight}
              onChange={(e) => setTrustWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Historical delivery compliance & e-Crop verification</p>
          </div>

          {/* Volume Fit Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Volume Match Fit (w₃)</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{volumeWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={volumeWeight}
              onChange={(e) => setVolumeWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Precision match to 450 kg bulk requirement</p>
          </div>
        </div>
      </div>

      {/* Candidate Ranking & Active Offer Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ranked Candidate Pool Table (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 pb-1">
            <span>Ranked Candidates (Visakhapatnam Sub-Districts)</span>
            <span className="text-slate-500 font-mono">5 Registered Producers</span>
          </div>

          <div className="space-y-2.5">
            {scoredFarmers.map((farmer, index) => {
              const isDeclined = declinedIds.includes(farmer.id);
              const isAccepted = acceptedId === farmer.id;
              const isActive = activeCandidate?.id === farmer.id && !isAccepted;

              return (
                <div
                  key={farmer.id}
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                    isAccepted
                      ? 'bg-emerald-500/10 border-emerald-500/40 ring-2 ring-emerald-500/30'
                      : isDeclined
                      ? 'bg-slate-100/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-50 grayscale'
                      : isActive
                      ? 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-500/40 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  {/* Rank & Farmer Info */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        isAccepted
                          ? 'bg-emerald-600 text-white'
                          : isDeclined
                          ? 'bg-slate-300 dark:bg-slate-700 text-slate-600'
                          : isActive
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">
                          {farmer.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                          {farmer.id}
                        </span>
                        {farmer.eCropVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" title="e-Crop Satellite Verified" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {farmer.village} ({farmer.distanceKm} km)
                        </span>
                        <span>• Cap: {farmer.dailyCapacityKg} kg</span>
                        <span className="text-amber-600 dark:text-amber-400">{farmer.trustTier}</span>
                      </div>
                    </div>
                  </div>

                  {/* Score & Status Badge */}
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                        {farmer.compositeScore}
                      </span>
                      <span className="text-[10px] text-slate-400">/100</span>
                    </div>

                    {isAccepted ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Contract Locked
                      </span>
                    ) : isDeclined ? (
                      <span className="text-[10px] font-medium text-red-500 mt-0.5">
                        Declined / Expired
                      </span>
                    ) : isActive ? (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        Active Offer
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        In Queue (Standby)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Contract Time-Lock Controller (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-lg relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="font-mono text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                TIME-LOCKED CONTRACT PROTOCOL
              </span>
              <span className="text-slate-400 text-[11px]">Gale-Shapley Variant</span>
            </div>

            {acceptedId ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Contract Successfully Sealed!</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Farmer {farmers.find(f => f.id === acceptedId)?.name} has confirmed 450 kg delivery. 10% UPI token dispatched.
                </p>
              </div>
            ) : activeCandidate ? (
              <div className="py-3 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Current Top Candidate</span>
                    <span className="text-lg font-bold text-white">{activeCandidate.name}</span>
                    <span className="text-xs text-emerald-400 block">{activeCandidate.village}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">15-Min Lock Timer</span>
                    <div className="text-2xl font-mono font-bold text-amber-400">
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-lg p-3 text-xs space-y-1.5 border border-slate-700/50">
                  <div className="flex justify-between text-slate-300">
                    <span>Demand Manifest:</span>
                    <span className="font-semibold text-white">450 kg Tomato (S-12)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Price Collar Guaranteed:</span>
                    <span className="font-semibold text-emerald-400">₹30.00 ±15%/kg</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Delivery Location:</span>
                    <span className="font-semibold text-slate-200">Andhra Univ. Mega Mess</span>
                  </div>
                </div>

                {/* Waterfall Controls */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleAcceptOffer(activeCandidate.id)}
                    className="py-2.5 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-900/30"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Accept Offer
                  </button>

                  <button
                    onClick={() => handleIgnoreOffer(activeCandidate.id, 'Candidate ignored/passed')}
                    className="py-2.5 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-red-950/40 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-800 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
                    Ignore / Waterfall
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">Candidate Queue Depleted</h4>
                <p className="text-xs text-slate-400">
                  All 5 local candidates were passed or timed out. Algorithmic resilience engine initiates secondary zone failover.
                </p>
              </div>
            )}
          </div>

          {/* Real-time Dispatch Execution Log */}
          <div className="bg-slate-50 dark:bg-slate-900/80 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 text-xs flex-1">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">
              Waterfall Execution Event Stream
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px] text-slate-600 dark:text-slate-400">
              {waterfallLog.map((log, idx) => (
                <div key={idx} className="leading-tight py-0.5 border-b border-slate-200/50 dark:border-slate-800/50 last:border-0">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>* Illustrative simulation demonstrating deterministic multi-criteria dispatch over chaotic open bidding.</span>
        <span className="font-mono text-amber-600 dark:text-amber-400">Time-Lock: 15m default (APMC regulation compliant)</span>
      </div>
    </div>
  );
}
