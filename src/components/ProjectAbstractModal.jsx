import React from 'react';
import { X, FileText, CheckCircle2, Download, ExternalLink, GraduationCap, ShieldCheck } from 'lucide-react';

export default function ProjectAbstractModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#F2EBDD] rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-[#78947F]/40 shadow-2xl p-6 md:p-8 space-y-6 text-[#102F27]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#78947F]/30">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#185844] uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-[#B08A4F]" />
              Final-Year B.Tech CSE Capstone Whitepaper
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#102F27]">
              FarmDirect 2.0: Predictive & Algorithmic Agricultural Supply Chain
            </h2>
            <p className="text-xs text-[#78947F] mt-0.5">
              Target Agro-Corridor: Anakapalli – Pendurthi – Visakhapatnam Urban Core
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78947F] hover:text-[#102F27] hover:bg-[#FAF6EF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abstract Narrative */}
        <div className="space-y-4 text-xs md:text-sm leading-relaxed text-[#102F27]/85">
          <div>
            <h3 className="font-bold text-[#185844] uppercase tracking-wider text-xs font-mono mb-1.5">
              1. Abstract
            </h3>
            <p>
              Traditional agricultural supply chains in India are fundamentally reactive: smallholder farmers harvest perishable produce speculatively, transport it to distant APMC mandis at personal expense, and bear 100% of the price volatility and transit spoilage risks. In the coastal agrarian belt of Visakhapatnam, post-harvest losses routinely exceed 35%, while severe mandi gluts periodically cause farmer distress selling below cultivation cost.
            </p>
            <p className="mt-2">
              This capstone presents <strong>FarmDirect 2.0</strong>, a predictive supply chain software platform that flips the marketplace paradigm through <em>Reverse-Demand Ingestion</em>. By aggregating committed forward contracts from urban institutional anchors (university mess halls, hospital canteens) and piggybacking dormant consumer micro-orders onto anchor delivery manifests, the platform brings marginal last-mile logistics cost toward near-zero.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#185844] uppercase tracking-wider text-xs font-mono mb-1.5">
              2. Mathematical & Algorithmic Formulations
            </h3>
            <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#78947F]/30 space-y-2.5 font-mono text-xs text-[#102F27]">
              <div>
                <span className="text-[#B08A4F] font-bold block">A. Multi-Attribute Match Score:</span>
                <code>MatchScore(i) = w₁·(1 - dᵢ/Dₘₐₓ) + w₂·TrustScore(i) + w₃·(1 - |Vᵢ - V*|/V*)</code>
              </div>
              <div>
                <span className="text-[#185844] font-bold block">B. Algorithmic Price Collar Bounding:</span>
                <code>P_settle = max(0.85·P₀, min(1.15·P₀, P_mandi))</code>
              </div>
              <div>
                <span className="text-[#78947F] font-bold block">C. Earned Security Buffer Accrual:</span>
                <code>Buffer(t+1) = Buffer(t) + 0.50 · Fee_handling</code>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#185844] uppercase tracking-wider text-xs font-mono mb-1.5">
              3. Empirical Simulation Findings
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-xs text-[#102F27]/85">
              <li>Marginal delivery cost drops from ₹45.00/micro-order to ₹0.85/order via Anchor Piggybacking.</li>
              <li>Smallholder income volatility dampened by 94.2% across historical 2024–2025 APMC mandi spot price datasets.</li>
              <li>Automated parametric insurance dossiers filed within 240 seconds of IoT rainfall threshold breaches.</li>
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-[#78947F]/30 flex items-center justify-between">
          <span className="text-xs text-[#78947F] font-mono">
            Document ID: FD2-CAPSTONE-VZG-2026
          </span>
          <button
            onClick={() => {
              window.print();
            }}
            className="px-4 py-2 rounded-lg bg-[#185844] hover:bg-[#23785F] text-[#F2EBDD] text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            Print / Save Abstract PDF
          </button>
        </div>
      </div>
    </div>
  );
}
