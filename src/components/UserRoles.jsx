import React, { useState } from 'react';
import { UserCheck, Building2, Home, Store, ShieldAlert, CheckCircle2, Clock, MapPin, QrCode, Key, ArrowRight, Wallet, TrendingUp } from 'lucide-react';

export default function UserRoles() {
  const [activeRole, setActiveRole] = useState('farmer');

  const roles = [
    {
      id: 'farmer',
      name: 'Farmer (Smallholder)',
      badge: 'Produce Supplier',
      icon: UserCheck,
      see: 'Forward demand manifests, time-locked contract offers, ±15% price collar floor/cap, harvest pickup schedule, Dual-OTP key.',
      do: 'Accept/decline sequential dispatch offers, pack tamper-evident QR crates, hand off to carrier with Dual-OTP, receive automated UPI payout.',
    },
    {
      id: 'anchor',
      name: 'Anchor Buyer',
      badge: 'Bulk Institutional',
      icon: Building2,
      see: 'Harvest forward contracts, delivery route tracking, ±15% ceiling savings audit, verified e-Crop satellite farm certifications.',
      do: 'Post forward weekly requirements (e.g. 500 kg), commit 10% UPI pre-authorization token, confirm dock intake via gate pass.',
    },
    {
      id: 'consumer',
      name: 'Household Consumer',
      badge: 'Micro-Order Cluster',
      icon: Home,
      see: 'Cluster piggyback status, near-zero delivery fee savings (₹0.85 vs ₹45), Kirana pickup notifications, farmer origin story.',
      do: 'Place weekly grocery micro-orders (3–8 kg), select neighborhood Kirana hub, collect crate with customer PIN.',
    },
    {
      id: 'kirana',
      name: 'Kirana Hub Owner',
      badge: 'Decentralized Micro-Depot',
      icon: Store,
      see: 'Daily crate intake manifest, Dual-OTP validation prompt, 50/50 commission ledger, ₹500 Earned Security Buffer progress bar.',
      do: 'Scan incoming crates, exchange OTP with transit driver, store crates in 12-slot rack, disburse to consumers.',
    }
  ];

  return (
    <section id="roles" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-400 mb-3">
          <UserCheck className="w-3.5 h-3.5" />
          Stakeholder Personas & Portals
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Role-Based Stakeholder Experience
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
          Five tailored interfaces coordinated by the underlying state machine. Explore what each stakeholder sees and does across the supply chain lifecycle.
        </p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRole(r.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-agri-800 text-white dark:bg-emerald-600 shadow-md scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Persona Showcase Container */}
      <div className="bg-white dark:bg-earth-darkCard rounded-2xl border border-emerald-900/10 dark:border-emerald-500/20 p-6 md:p-8 shadow-xl">
        {/* Role Brief Bar */}
        {(() => {
          const current = roles.find(r => r.id === activeRole);
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1 font-mono">
                  👁️ What They See
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {current.see}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1 font-mono">
                  ⚡ What They Do
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {current.do}
                </p>
              </div>
            </div>
          );
        })()}

        {/* Mock Dashboard Screenshot built with HTML/CSS */}
        <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-white shadow-2xl overflow-hidden">
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-slate-400 font-mono text-[11px] ml-2">
                portal.farmdirect.vizag/{activeRole}/dashboard
              </span>
            </div>
            <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
              Live Mock UI
            </span>
          </div>

          {/* Persona 1: Farmer Dashboard */}
          {activeRole === 'farmer' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block">Welcome,</span>
                  <h3 className="text-base font-bold text-white">Ramesh Varma (Kasimkota Farm, Anakapalli)</h3>
                  <span className="text-xs text-emerald-400">e-Crop ID: AP-VZG-2024-4481 • Tier A+ Producer</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-800 p-2.5 rounded-lg text-right">
                    <span className="text-[10px] text-slate-400 block">Locked Floor Price</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">₹25.50 / kg</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-lg text-right">
                    <span className="text-[10px] text-slate-400 block">Next Harvest</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">Tomorrow 05:30 AM</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Forward Contracts</span>
                  <div className="text-2xl font-bold font-mono text-white">3 Committed</div>
                  <p className="text-[11px] text-slate-400">1,250 kg Tomato, 400 kg Brinjal</p>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Custody Handshake Key</span>
                  <div className="text-2xl font-bold font-mono text-amber-400">5829</div>
                  <p className="text-[11px] text-slate-400">Share with NH-16 Carrier Driver</p>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Escrow Cleared Payout</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400">₹31,875.00</div>
                  <p className="text-[11px] text-slate-400">Direct to Union Bank A/c ...4091</p>
                </div>
              </div>
            </div>
          )}

          {/* Persona 2: Anchor Buyer Dashboard */}
          {activeRole === 'anchor' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block">Institutional Account</span>
                  <h3 className="text-base font-bold text-white">Andhra University Central Student Mega-Mess</h3>
                  <span className="text-xs text-amber-400">Daily Demand: 600 kg Perishables (Hostel Blocks 1–6)</span>
                </div>
                <div className="bg-slate-800 px-3 py-2 rounded-lg text-right">
                  <span className="text-[10px] text-slate-400 block">Collar Protection Savings</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">+₹4,200 this week</span>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">Active Incoming Freight</span>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <div>
                    <span className="font-semibold text-white">Truck #AP-31-TE-9041</span>
                    <span className="text-slate-400 block text-[11px]">450 kg Tomato (S-12) from Kasimkota Hub</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block font-mono">Arriving in 22 mins</span>
                    <span className="text-slate-400 text-[11px]">Piggybacking 52kg MVP Micro-Orders</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Persona 3: Household Consumer Dashboard */}
          {activeRole === 'consumer' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block">Consumer Profile</span>
                  <h3 className="text-base font-bold text-white">Priya S. (MVP Colony Sector 4)</h3>
                  <span className="text-xs text-blue-400">Designated Depot: Sri Lakshmi General Stores (180m away)</span>
                </div>
                <div className="bg-slate-800 px-3 py-2 rounded-lg text-right">
                  <span className="text-[10px] text-slate-400 block">Marginal Delivery Fee</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">₹0.85 (Saved ₹44.15)</span>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Active Piggybacked Basket</span>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-medium">3 kg Farm-Fresh Kasimkota Tomatoes + 2 kg Okra</span>
                    <span className="text-slate-400 block text-[11px]">Harvested today at 06:14 AM • Carbon footprint: -68%</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-mono text-[11px] font-bold">
                    Ready for Pickup after 11:30 AM
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Persona 4: Kirana Hub Owner Dashboard */}
          {activeRole === 'kirana' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block">Kirana Merchant Portal</span>
                  <h3 className="text-base font-bold text-white">Murthy • Sri Lakshmi Stores, MVP Colony</h3>
                  <span className="text-xs text-emerald-400">Micro-Hub Status: 12 Bins Active • Earned Buffer: ₹430/₹500</span>
                </div>
                <div className="bg-slate-800 px-3 py-2 rounded-lg text-right">
                  <span className="text-[10px] text-slate-400 block">Commission Accrued</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">₹430.00 (50/50 Split)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-white block">Pending Driver Intake Verification</span>
                  <p className="text-slate-400 text-[11px]">Driver AP-31-TE-9041 at store door with 4 crate batches.</p>
                  <div className="p-2 bg-slate-950 rounded font-mono text-emerald-400 font-bold flex justify-between">
                    <span>Kirana Agent OTP:</span>
                    <span>9142</span>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-white block">Customer Pickup Queue</span>
                  <p className="text-slate-400 text-[11px]">5 micro-order packets waiting for neighbor collection.</p>
                  <span className="text-amber-400 text-[11px] font-mono block">Zero capital required • 100% asset-light</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
