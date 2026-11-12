import React from 'react';
import { Mail, ExternalLink, GraduationCap, Award, Heart, Sprout, ArrowUpRight, Code2 } from 'lucide-react';

function GithubIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.54a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24" />
    </svg>
  );
}

export default function TeamFooter({ onOpenAbstract }) {
  const teamMembers = [
    {
      name: 'P. Mrudula',
      role: 'Project Lead & Algorithmic Architect',
      specialty: 'Reverse-Demand Optimization & Gale-Shapley Matching',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    {
      name: 'Team Member 2',
      role: 'Full-Stack & Spatial Routing Engineer',
      specialty: 'PostGIS Geo-Clustering & OSRM Split-Node Graphs',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    {
      name: 'Team Member 3',
      role: 'FinTech & Zero-Trust Custody Lead',
      specialty: 'Price Collar Mathematics & UPI 2.0 e-Mandate Tokens',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    {
      name: 'Team Member 4',
      role: 'InsurTech & Telemetry Systems Specialist',
      specialty: 'RWBCIS Parametric Triggers & IoT Weather Integration',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  ];

  return (
    <footer id="team" className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mentor & Institutional Attribution Box */}
        <div className="bg-slate-900/90 rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                Academic Capstone Affiliation
              </div>
              <h3 className="text-xl font-bold text-white">
                Department of Computer Science & Engineering
              </h3>
              <p className="text-xs text-slate-400">
                Andhra University College of Engineering (A) • Visakhapatnam, Andhra Pradesh, India
              </p>
            </div>

            {/* Faculty Guide Card */}
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 max-w-sm w-full">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Faculty Project Mentor
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-agri-800 text-amber-300 font-bold flex items-center justify-center font-mono text-sm border border-amber-400/30">
                  DR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dr. K. S. Narayana, Ph.D.</h4>
                  <p className="text-[11px] text-slate-400">Professor & Head, Distributed Systems Lab</p>
                </div>
              </div>
            </div>
          </div>

          {/* Student Team Grid */}
          <div className="pt-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-4">
              Capstone Student Engineering Team (2025–2026)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">{member.name}</h4>
                    <span className="text-xs font-medium text-emerald-400 block mb-2">{member.role}</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                      {member.specialty}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors"
                      title="GitHub Profile"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-blue-400 transition-colors"
                      title="LinkedIn Profile"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-slate-500 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-400 font-semibold">FarmDirect 2.0</span>
            <span>• Visakhapatnam Regional Agritech Capstone</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAbstract}
              className="text-slate-400 hover:text-white transition-colors underline underline-offset-4"
            >
              Academic Whitepaper Abstract
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors flex items-center gap-1.5"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-600 mt-6 font-mono">
          © 2026 FarmDirect 2.0. Built with React 19 & Tailwind CSS for CSE Capstone Evaluation.
        </div>
      </div>
    </footer>
  );
}
