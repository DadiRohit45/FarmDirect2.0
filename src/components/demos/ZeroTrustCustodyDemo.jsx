import React, { useState } from 'react';
import { ShieldCheck, QrCode, Key, ArrowRight, CheckCircle2, RotateCcw, Wallet, Store, Lock, Sparkles, Building } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ZeroTrustCustodyDemo() {
  const [activeStep, setActiveStep] = useState(1);
  const [packagesHandled, setPackagesHandled] = useState(215);
  const [securityBuffer, setSecurityBuffer] = useState(430); // ₹430 towards ₹500 threshold
  const [farmerOtp, setFarmerOtp] = useState('5829');
  const [kiranaOtp, setKiranaOtp] = useState('9142');
  const [otpVerified, setOtpVerified] = useState(false);

  const securityThreshold = 500; // ₹500 milestone

  const timelineSteps = [
    {
      step: 1,
      title: '10% UPI e-Mandate Token',
      icon: Wallet,
      desc: 'Buyer bank locks 10% commitment token via NPCI UPI 2.0 API before harvest dispatch.',
      statusText: 'Escrow Pre-Authorized (₹150.00 locked)',
    },
    {
      step: 2,
      title: 'Tamper-Evident QR Batching',
      icon: QrCode,
      desc: 'Farmer crates are sealed with cryptographic QR tags encoding weight, GPS origin, and harvest timestamp.',
      statusText: 'Batch QR: VZG-TMT-2026-904',
    },
    {
      step: 3,
      title: 'Dual-OTP Custody Handshake',
      icon: Key,
      desc: 'Transit driver and Kirana hub merchant exchange dual one-time keys. Custody transitions only upon mutual match.',
      statusText: 'Driver OTP (5829) ⇄ Kirana OTP (9142)',
    },
    {
      step: 4,
      title: 'Zero-Touch Settlement Clearing',
      icon: CheckCircle2,
      desc: 'Platform executes multi-split payout: 90% to Farmer, 5% to 3PL carrier, 5% Kirana handling fee split.',
      statusText: 'Instant IMPS/UPI Payout Cleared in 1.4s',
    },
  ];

  // Process next crate to show 50/50 split and buffer progress
  const handleProcessCrate = () => {
    const newCount = packagesHandled + 1;
    const newBuffer = Math.min(securityThreshold, securityBuffer + 2); // ₹2 added to buffer
    setPackagesHandled(newCount);
    setSecurityBuffer(newBuffer);

    if (newBuffer >= securityThreshold && securityBuffer < securityThreshold) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#166534', '#10B981'],
      });
    }
  };

  const handleVerifyOtp = () => {
    setOtpVerified(true);
    setActiveStep(4);
    handleProcessCrate();
  };

  const handleReset = () => {
    setActiveStep(1);
    setOtpVerified(false);
    setSecurityBuffer(430);
    setPackagesHandled(215);
  };

  const isBufferUnlocked = securityBuffer >= securityThreshold;

  return (
    <div className="bg-white dark:bg-earth-darkCard rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 p-6 md:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Module 4 Interactive Simulation
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            Zero-Trust Custody & Kirana Hub Ledger
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Replace capital-heavy cold chain infrastructure with decentralized neighborhood Kirana micro-depots, governed by Dual-OTP handshakes and Earned Security Buffers.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Custody Flow
        </button>
      </div>

      {/* Step Timeline Navigation Bar */}
      <div className="my-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {timelineSteps.map((item) => {
            const Icon = item.icon;
            const isCurrent = activeStep === item.step;
            const isCompleted = activeStep > item.step || (item.step === 3 && otpVerified);

            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(item.step)}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-agri-800 text-white dark:bg-emerald-700 border-agri-900 shadow-md scale-[1.01]'
                    : isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/30 text-slate-800 dark:text-slate-200'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isCurrent ? 'text-amber-300' : 'text-slate-500'}`}>
                    Stage {item.step}
                  </span>
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-amber-300' : isCompleted ? 'text-emerald-500' : 'text-slate-400'}`} />
                </div>
                <h4 className="text-xs font-bold truncate">{item.title}</h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Interactive Sandbox & Kirana Ledger (12 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stage Interactive View (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                STAGE {activeStep} PROTOCOL VERIFICATION
              </span>
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono">
                {timelineSteps[activeStep - 1].title}
              </span>
            </div>

            <div className="py-5 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                {timelineSteps[activeStep - 1].desc}
              </p>

              {/* Dynamic UI based on active stage */}
              {activeStep === 1 && (
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">NPCI Mandate URN:</span>
                    <span className="font-mono text-amber-400 font-bold">VIZAG2026MANDATE908</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Pre-Auth Commitment:</span>
                    <span className="font-mono text-emerald-400 font-bold">₹150.00 (10% of ₹1,500 Order)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Payer Bank:</span>
                    <span className="text-white">State Bank of India (AU Branch)</span>
                  </div>
                  <div className="p-2 bg-emerald-950/40 border border-emerald-500/20 rounded text-[11px] text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Funds locked in platform escrow until Dual-OTP physical receipt.
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 flex items-center gap-5">
                  <div className="w-24 h-24 bg-white rounded-lg p-1.5 flex items-center justify-center flex-shrink-0 shadow-md">
                    {/* SVG QR Code Simulation */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect width="100" height="100" fill="#fff" />
                      <rect x="10" y="10" width="25" height="25" fill="#000" />
                      <rect x="15" y="15" width="15" height="15" fill="#fff" />
                      <rect x="65" y="10" width="25" height="25" fill="#000" />
                      <rect x="70" y="15" width="15" height="15" fill="#fff" />
                      <rect x="10" y="65" width="25" height="25" fill="#000" />
                      <rect x="15" y="70" width="15" height="15" fill="#fff" />
                      <rect x="45" y="20" width="10" height="20" fill="#000" />
                      <rect x="40" y="55" width="20" height="10" fill="#000" />
                      <rect x="65" y="65" width="25" height="25" fill="#166534" />
                      <circle cx="77" cy="77" r="4" fill="#fff" />
                    </svg>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <span className="font-mono text-amber-400 font-bold block">QR HASH: #4f8a9e21</span>
                    <p className="text-slate-300 text-[11px]">Payload: Kasimkota Farm → Ramesh Varma</p>
                    <p className="text-slate-400 text-[11px]">Certified Net Weight: 450.0 kg ± 0.2kg</p>
                    <p className="text-slate-400 text-[11px]">Timestamp: 06:14 AM IST (Pre-Dawn Harvest)</p>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Farmer/Transit Key</span>
                      <span className="text-xl font-mono font-bold text-amber-400">{farmerOtp}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Kirana Merchant Key</span>
                      <span className="text-xl font-mono font-bold text-emerald-400">{kiranaOtp}</span>
                    </div>
                  </div>

                  {!otpVerified ? (
                    <button
                      onClick={handleVerifyOtp}
                      className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Key className="w-4 h-4" />
                      Validate Dual-OTP Handshake
                    </button>
                  ) : (
                    <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center justify-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Dual-OTP Cryptographically Verified!
                    </div>
                  )}
                </div>
              )}

              {activeStep === 4 && (
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Total Contract Value:</span>
                    <span className="font-mono text-white font-bold">₹1,500.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>Farmer Settlement (90%):</span>
                    <span className="font-mono font-bold">₹1,350.00 (Cleared)</span>
                  </div>
                  <div className="flex justify-between text-xs text-amber-400">
                    <span>3PL Freight Carrier (5%):</span>
                    <span className="font-mono font-bold">₹75.00 (Cleared)</span>
                  </div>
                  <div className="flex justify-between text-xs text-blue-400">
                    <span>Kirana Hub Handling (5%):</span>
                    <span className="font-mono font-bold">₹75.00 (Split Applied)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700 text-[11px] text-slate-400">
                    Latency: 1,420 ms via IMPS Open-Banking Bridge.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <span>Security Standard: ISO 20022 compliant tokenization</span>
            <button
              onClick={() => setActiveStep(prev => (prev < 4 ? prev + 1 : 1))}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
            >
              {activeStep < 4 ? 'Next Stage' : 'Loop to Start'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Kirana Hub Ledger & Earned Buffer (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Kirana Merchant Profile Card */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-agri-700 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Sri Lakshmi General Stores
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
                Active Micro-Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Ward 8, MVP Colony (Pincode 530017) • Asset-Light Storage: 12 crate bins
            </p>

            {/* 50/50 Commission Split Breakdown */}
            <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                50/50 Commission Split Formula
              </span>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Gross Handling Commission:</span>
                <span className="font-mono font-bold">₹4.00 / Crate</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>→ 50% Direct Merchant Payout:</span>
                <span className="font-mono font-bold">₹2.00 / Crate</span>
              </div>
              <div className="flex justify-between text-amber-600 dark:text-amber-400">
                <span>→ 50% Security Buffer Accrual:</span>
                <span className="font-mono font-bold">₹2.00 / Crate</span>
              </div>
            </div>

            {/* Earned Security Buffer Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  Earned Security Buffer
                  {isBufferUnlocked && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ₹{securityBuffer} / ₹{securityThreshold}
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isBufferUnlocked
                      ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: `${(securityBuffer / securityThreshold) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Zero Upfront Staking</span>
                <span className={isBufferUnlocked ? 'text-amber-600 font-bold' : ''}>
                  {isBufferUnlocked ? '₹500 Threshold Met (Unlocked!)' : 'Accruing Collateral'}
                </span>
              </div>
            </div>

            {/* Manual Intake Simulator */}
            <button
              onClick={handleProcessCrate}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              + Simulate Kirana Crate Intake (+₹4 Fee)
            </button>
          </div>

          {/* Ledger Stats Summary */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="block text-[11px] text-slate-500">Crates Handled</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                {packagesHandled}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="block text-[11px] text-slate-500">Merchant Earnings</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                ₹{(packagesHandled * 2).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>* Asset-light Kirana model reduces cold-chain capital expenditure by 94% vs centralized warehouse depots.</span>
        <span className="text-amber-600 dark:text-amber-400 font-mono">Dual-OTP Collision Probability: &lt; 10⁻⁸</span>
      </div>
    </div>
  );
}
