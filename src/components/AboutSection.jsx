import React, { useState } from 'react';
import { 
  Sprout, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  Store, 
  Clock, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  Layers,
  Award,
  DollarSign,
  QrCode,
  Lock,
  GitCompare,
  HeartHandshake
} from 'lucide-react';

export default function AboutSection() {
  const [activePillar, setActivePillar] = useState(0);
  const [hoveredStep, setHoveredStep] = useState(null);

  const pillars = [
    {
      id: 0,
      title: 'Algorithmic Price Collar',
      subtitle: 'Dynamic ±15% Bounded Volatility',
      icon: TrendingUp,
      tag: 'FinTech Protection',
      description: 'Protects agrarian livelihoods against predatory mandi crashes. When open-market spot prices collapse, FarmDirect 2.0 enforces a contractual floor price backed by a 2% platform risk reserve. When retail prices spike, institutional buyers and households are shielded by an upper ceiling.',
      metrics: ['±15% Fair Market Collar', 'Zero Mandi Commission', 'AP Agmarknet Grounded']
    },
    {
      id: 1,
      title: 'Reverse-Demand Matching',
      subtitle: 'Harvest On-Demand, Never in Speculation',
      icon: Zap,
      tag: 'Gale-Shapley Algorithm',
      description: 'Traditional farming forces smallholders to harvest blindly, transport crops to distant APMC mandis, and accept whatever distress price agents offer. FarmDirect 2.0 reverses the pipeline: consumer micro-orders and institutional forward requisitions are pre-committed before harvest is dispatched.',
      metrics: ['< 15 Min Lock Window', '100% Demand Cleared', 'Zero Speculative Waste']
    },
    {
      id: 2,
      title: 'Zero-Trust Kirana Depots',
      subtitle: 'Asset-Light Decentralized Cold Storage',
      icon: Store,
      tag: 'Hyperlocal Infrastructure',
      description: 'Capital-heavy centralized cold storage is replaced by thousands of neighborhood Kirana grocery shops acting as micro-distribution depots. Kirana merchants earn handling commissions and build an earned ₹500 security buffer with zero upfront capital investment.',
      metrics: ['800m Walking Distance', 'Dual-OTP Verification', '₹500 Collateral Buffer']
    },
    {
      id: 3,
      title: 'Rapid Dawn-to-Fork Logistics',
      subtitle: 'Farm Fresh to Kitchen in < 3 Hours',
      icon: Truck,
      tag: 'Clustered 3PL Routing',
      description: 'Produce harvested at sunrise (04:30 AM) is scanned into tamper-proof QR-coded crates and routed via optimized 3PL vectors. By 07:15 AM, fresh produce is already resting in neighborhood Kirana hubs or delivered to institutional messes.',
      metrics: ['< 3 Hours Total Transit', '35% Spoilage Eliminated', 'PostGIS Clustered Routes']
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      time: '04:30 AM',
      title: 'Harvest & QR Tagging',
      role: 'Smallholder Farmer',
      desc: 'Farmer logs blind yield harvest. System allocates orders and generates tamper-evident batch QR codes.',
      icon: Sprout,
      badge: 'Farm-Gate'
    },
    {
      step: '02',
      time: '05:45 AM',
      title: 'Clustered 3PL Transit',
      role: 'Corridor Logistics',
      desc: 'Optimized freight carriers piggyback institutional anchor loads with residential micro-crates.',
      icon: Truck,
      badge: 'Trunk Haulage'
    },
    {
      step: '03',
      time: '06:30 AM',
      title: 'Kirana Depot Handshake',
      role: 'Kirana Merchant',
      desc: 'Driver & merchant verify crate tamper seals via cryptographic Dual-OTP custody transfer.',
      icon: Lock,
      badge: 'Zero-Trust Intake'
    },
    {
      step: '04',
      time: '07:15 AM',
      title: 'Customer Pickup & Instant UPI',
      role: 'Consumer & Farmer',
      desc: 'Customer inputs pickup OTP at depot. Escrow automatically releases instant UPI payment directly to farmer.',
      icon: DollarSign,
      badge: 'Instant Settlement'
    }
  ];

  return (
    <section 
      id="about" 
      className="py-16 md:py-24 bg-[#F2EBDD] text-[#102F27] relative transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#185844]/15 text-[#185844] border border-[#78947F]/30 mb-4 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#B08A4F]" />
            <span>Architectural Blueprint & Mission</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#102F27]">
            About FarmDirect <span className="text-[#185844]">2.0</span>
          </h2>
          <p className="text-base sm:text-lg text-[#102F27]/80 mt-4 leading-relaxed">
            A reverse-demand agricultural exchange designed to eliminate the extractive 5-tier APMC middleman chain, 
            guaranteeing sustainable floor pricing for farmers and farmgate freshness for urban consumers.
          </p>
        </div>

        {/* Mandi vs FarmDirect 2.0 Comparison Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-16">
          
          {/* Traditional Mandi System Card */}
          <div className="p-7 sm:p-8 rounded-3xl bg-[#FDF3F2] border border-rose-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-rose-700 bg-rose-100/80 px-3 py-1 rounded-full border border-rose-200">
                Legacy Mandi Chain
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-700">
                5+ Middlemen
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#102F27] mb-2.5">
              Traditional Multi-Tier Mandi Exploitation
            </h3>
            
            <p className="text-sm text-[#102F27]/80 leading-relaxed mb-6">
              Smallholders harvest blindly with no price certainty. Produce passes through village aggregators, APMC auction cartels, 
              commission agents, and wholesalers.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-rose-900">
                <span className="w-5 h-5 rounded-full bg-rose-200 flex items-center justify-center font-bold text-[10px] shrink-0">✕</span>
                <span>Farmers lose up to <strong>60% of retail price spread</strong> in commissions.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-rose-900">
                <span className="w-5 h-5 rounded-full bg-rose-200 flex items-center justify-center font-bold text-[10px] shrink-0">✕</span>
                <span><strong>24 to 48 hours transit delay</strong> leads to 35% post-harvest spoilage.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-rose-900">
                <span className="w-5 h-5 rounded-full bg-rose-200 flex items-center justify-center font-bold text-[10px] shrink-0">✕</span>
                <span>Unmitigated price crash risk during harvest gluts.</span>
              </div>
            </div>
          </div>

          {/* FarmDirect 2.0 Solution Card */}
          <div className="p-7 sm:p-8 rounded-3xl bg-[#FAF6EF] border border-[#78947F]/40 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#185844] bg-[#185844]/15 px-3 py-1 rounded-full border border-[#78947F]/30">
                FarmDirect 2.0 Network
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#185844]">
                0 Middlemen
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#102F27] mb-2.5">
              Direct Reverse-Demand Agritech Exchange
            </h3>

            <p className="text-sm text-[#102F27]/80 leading-relaxed mb-6">
              Replaces speculative bidding with forward commitments. Demand is aggregated first, matched to verified smallholders, 
              and delivered through neighborhood Kirana micro-depots.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-[#102F27]">
                <CheckCircle2 className="w-5 h-5 text-[#185844] shrink-0" />
                <span>Farmers receive <strong>80–85% of consumer retail value</strong> via instant UPI.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#102F27]">
                <CheckCircle2 className="w-5 h-5 text-[#185844] shrink-0" />
                <span><strong>Farm-to-kitchen in &lt; 3 hours</strong> preserves nutrient density and eliminates spoilage.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#102F27]">
                <CheckCircle2 className="w-5 h-5 text-[#185844] shrink-0" />
                <span><strong>Dynamic ±15% Price Collar</strong> shields farmers from distress selling.</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Core Technological Pillars (Interactive Selection) */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#102F27]">
              The Four Architectural Pillars
            </h3>
            <p className="text-xs sm:text-sm text-[#78947F] mt-2">
              Explore the algorithmic, financial, and logistics foundations powered by FarmDirect 2.0.
            </p>
          </div>

          {/* Pillar Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              const isActive = activePillar === idx;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePillar(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#185844] text-[#F2EBDD] shadow-sm border border-[#78947F]/40'
                      : 'bg-[#FAF6EF] text-[#102F27]/80 border border-[#78947F]/30 hover:bg-[#F2EBDD]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{p.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Showcase Card */}
          {(() => {
            const p = pillars[activePillar];
            const Icon = p.icon;
            return (
              <div className="p-7 sm:p-9 rounded-3xl bg-[#FAF6EF] border border-[#78947F]/40 shadow-sm transition-all duration-150">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#102F27] text-[#B08A4F] flex items-center justify-center shadow-xs border border-[#78947F]/30">
                      <Icon className="w-6 h-6 text-[#B08A4F]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#185844]">
                        {p.tag}
                      </span>
                      <h4 className="text-xl sm:text-2xl font-black text-[#102F27]">
                        {p.title}
                      </h4>
                      <p className="text-xs text-[#78947F]">
                        {p.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {p.metrics.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="px-3 py-1 rounded-lg text-xs font-bold font-mono bg-[#F2EBDD] text-[#102F27] border border-[#78947F]/35"
                      >
                        ✓ {m}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#102F27]/85 leading-relaxed max-w-4xl">
                  {p.description}
                </p>
              </div>
            );
          })()}
        </div>

        {/* 4-Step Dawn-to-Fork Workflow */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#102F27]">
              The Dawn-to-Fork 3-Hour Journey
            </h3>
            <p className="text-xs sm:text-sm text-[#78947F] mt-2">
              Cryptographic custody verification and clustered logistics from farmgate to consumer pickup.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              const isHovered = hoveredStep === idx;

              return (
                <div
                  key={step.step}
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`p-6 rounded-2xl transition-all duration-150 border flex flex-col justify-between cursor-pointer ${
                    isHovered
                      ? 'border-[#185844] shadow-md bg-[#FAF6EF]'
                      : 'border-[#78947F]/30 bg-[#FAF6EF]/70 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Step Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black font-mono text-[#185844]">
                        {step.step}
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#185844]/15 text-[#185844] border border-[#78947F]/30">
                        {step.time}
                      </span>
                    </div>

                    <div className="w-9 h-9 rounded-lg bg-[#185844]/10 text-[#185844] flex items-center justify-center mb-3 border border-[#78947F]/20">
                      <Icon className="w-4 h-4 text-[#185844]" />
                    </div>

                    <h4 className="text-base font-bold text-[#102F27] mb-1">
                      {step.title}
                    </h4>

                    <span className="text-[11px] font-semibold text-[#B08A4F] block mb-2.5">
                      Role: {step.role}
                    </span>

                    <p className="text-xs text-[#102F27]/80 leading-relaxed mb-4">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#78947F]/25 flex items-center justify-between text-[11px] font-mono text-[#78947F]">
                    <span>Milestone</span>
                    <span className="font-bold text-[#102F27]">{step.badge}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
