'use client';

import React from 'react';
import { Eye, ShieldAlert, Network, Clock } from 'lucide-react';

interface ProblemCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ icon, title, description, badge }) => {
  return (
    <div className="relative group overflow-hidden rounded bg-slate-900/40 border border-slate-800 p-6 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,180,212,0.08)]">
      {/* Glow effect */}
      <div className="absolute -inset-px bg-gradient-to-tr from-cyan-500/0 via-cyan-500/0 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-800/20 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-all duration-300">
          {icon}
        </div>
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">{badge}</span>
      </div>
      
      <h3 className="text-base font-semibold text-white mb-2 tracking-wide group-hover:text-cyan-300 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed font-light">
        {description}
      </p>
    </div>
  );
};

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Volume Bottleneck",
      description: "Human analysts are overwhelmed by the sheer volume of RSS feeds, articles, and filings. Critical alerts are missed in the noise.",
      badge: "OSINT-01"
    },
    {
      icon: <ShieldAlert className="w-5 h-5" />,
      title: "Consistency Gaps",
      description: "Analyst interpretations vary, leading to conflicting alias resolution and inconsistent entity mappings across datasets.",
      badge: "OSINT-02"
    },
    {
      icon: <Network className="w-5 h-5" />,
      title: "Flat Data Model",
      description: "Traditional databases and spreadsheets fail to represent multi-hop connections, rendering downstream threats completely invisible.",
      badge: "OSINT-03"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Stale Intelligence",
      description: "Manual compilation makes threat mapping an ad-hoc process. Reports are out of date the minute they are formatted.",
      badge: "OSINT-04"
    }
  ];

  return (
    <section id="problem-section" className="relative py-24 border-y border-slate-900 bg-slate-950/40">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/20 bg-red-950/10 text-red-400 text-xs font-mono tracking-wider mb-4 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Core Inefficiencies
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-4">
            The Analyst's Dilemma
          </h2>
          <p className="text-base text-slate-400 font-light max-w-2xl mx-auto">
            Traditional open-source intelligence relies on slow, manual collation workflows. Absurd Node resolves these systemic bottlenecks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((prob, idx) => (
            <ProblemCard
              key={idx}
              icon={prob.icon}
              title={prob.title}
              description={prob.description}
              badge={prob.badge}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
