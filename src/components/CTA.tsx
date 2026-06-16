'use client';

import React from 'react';
import Link from 'next/link';
import { Network, ArrowRight } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section id="cta" className="relative py-28 bg-slate-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_60%)] pointer-events-none" />
      
      {/* Visual cyber mesh lines */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          SECURE SANDBOX ENVIRONMENT ACTIVE
        </div>
        
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-6">
          Reveal Hidden Connections. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            De-anonymize Entity Networks.
          </span>
        </h2>
        
        <p className="text-base text-slate-400 font-light max-w-xl mx-auto mb-10 leading-relaxed">
          Map multi-hop dependencies, resolve complex aliases, and generate automated AI reports. Start your first investigation in the sandbox.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold tracking-widest text-slate-950 rounded bg-cyan-400 hover:bg-cyan-300 active:scale-98 transition-all duration-200 shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
          >
            <span className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              START INVESTIGATION
            </span>
          </Link>
          
          <Link
            href="/graph"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold tracking-widest text-white border border-slate-800 rounded bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 active:scale-98 transition-all duration-200"
          >
            <span className="flex items-center gap-1.5">
              EXPLORE GRAPH EXPLORER
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
