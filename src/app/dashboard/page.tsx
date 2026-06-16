'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useInvestigation } from '@/lib/context/InvestigationContext';
import {
  getMetricsForQuery,
  getRelationshipsForQuery,
  getAISummaryForQuery,
  getRecentInvestigations
} from '@/lib/mock-data/service';
import {
  ArrowLeft,
  Network,
  Trash2
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { searchQuery, status, triggerSearch } = useInvestigation();
  const [inputVal, setInputVal] = useState(searchQuery);
  const [animatedMetrics, setAnimatedMetrics] = useState({
    totalEntities: 0,
    relationshipsFound: 0,
    sourcesAnalyzed: 0,
    confidenceScore: 0
  });

  // Sync state if searchQuery updates externally
  useEffect(() => {
    setInputVal(searchQuery);
  }, [searchQuery]);

  const metrics = getMetricsForQuery(searchQuery);
  const relationships = getRelationshipsForQuery(searchQuery);
  const summary = getAISummaryForQuery(searchQuery);
  const recent = getRecentInvestigations();

  // Animate metrics rolling up on target resolve
  useEffect(() => {
    if (status === 'Analyzing') {
      const interval = setInterval(() => {
        setAnimatedMetrics({
          totalEntities: Math.floor(Math.random() * 500),
          relationshipsFound: Math.floor(Math.random() * 500),
          sourcesAnalyzed: Math.floor(Math.random() * 500),
          confidenceScore: Math.floor(Math.random() * 100),
        });
      }, 80);
      return () => clearInterval(interval);
    } else {
      setAnimatedMetrics({
        totalEntities: metrics.totalEntities,
        relationshipsFound: metrics.relationshipsFound,
        sourcesAnalyzed: metrics.sourcesAnalyzed,
        confidenceScore: metrics.confidenceScore,
      });
    }
  }, [status, searchQuery, metrics]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      triggerSearch(inputVal);
    }
  };

  const handleReset = () => {
    setInputVal('OpenAI');
    triggerSearch('OpenAI');
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR BAR (Vertical icons) */}
      <div className="w-16 bg-black border-r border-zinc-900/60 flex flex-col items-center py-6 gap-8 flex-shrink-0">
        {/* Back Arrow inside Circle */}
        <button
          onClick={() => router.push('/')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Graph Explorer Link */}
        <button
          onClick={() => router.push('/graph')}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          <Network className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        {/* Reset Trash Can */}
        <button
          onClick={handleReset}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
          title="Reset Sandbox"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 bg-black p-8 flex flex-col gap-8 overflow-y-auto">
        
        {/* Search bar & status info */}
        <div className="flex items-center gap-6">
          <form onSubmit={handleSearch} className="w-full max-w-xl">
            <input
              type="text"
              placeholder="Search company/person/product..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-[#1c1c1e] text-white placeholder-zinc-500 text-sm px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-zinc-700"
            />
          </form>
          <span className={`text-xs font-mono tracking-widest uppercase transition-all duration-300 ${
            status === 'Analyzing' ? 'text-cyan-400 animate-pulse font-bold' : 'text-zinc-500'
          }`}>
            {status === 'Analyzing' ? 'Extracting...' : 'Ready'}
          </span>
        </div>

        {/* Grid of 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-[#d9d9d9] rounded-2xl p-6 text-black flex flex-col justify-between aspect-[8/5] sm:aspect-auto">
            <span className="text-[11px] font-sans font-semibold text-zinc-600 uppercase tracking-wider">Total Entities Found</span>
            <span className={`text-4xl font-extrabold mt-4 font-sans tracking-tight transition-all ${
              status === 'Analyzing' ? 'scale-95 opacity-80' : ''
            }`}>
              {animatedMetrics.totalEntities}
            </span>
          </div>

          <div className="bg-[#d9d9d9] rounded-2xl p-6 text-black flex flex-col justify-between">
            <span className="text-[11px] font-sans font-semibold text-zinc-600 uppercase tracking-wider">Relationships Found</span>
            <span className={`text-4xl font-extrabold mt-4 font-sans tracking-tight transition-all ${
              status === 'Analyzing' ? 'scale-95 opacity-80' : ''
            }`}>
              {animatedMetrics.relationshipsFound}
            </span>
          </div>

          <div className="bg-[#d9d9d9] rounded-2xl p-6 text-black flex flex-col justify-between">
            <span className="text-[11px] font-sans font-semibold text-zinc-600 uppercase tracking-wider">Sources Analyzed</span>
            <span className={`text-4xl font-extrabold mt-4 font-sans tracking-tight transition-all ${
              status === 'Analyzing' ? 'scale-95 opacity-80' : ''
            }`}>
              {animatedMetrics.sourcesAnalyzed}
            </span>
          </div>

          <div className="bg-[#d9d9d9] rounded-2xl p-6 text-black flex flex-col justify-between">
            <span className="text-[11px] font-sans font-semibold text-zinc-600 uppercase tracking-wider">Confidence Score</span>
            <span className={`text-4xl font-extrabold mt-4 font-sans tracking-tight transition-all ${
              status === 'Analyzing' ? 'scale-95 opacity-80 text-cyan-700' : ''
            }`}>
              {animatedMetrics.confidenceScore}
            </span>
          </div>
        </div>

        {/* Columns: Key Relationships Table & Recents/AI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
          
          {/* Key Relationships (Left Side) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="font-serif text-lg text-white font-normal tracking-wide">Key Relationships...</h3>
            <div className="bg-[#111111] border border-zinc-900 rounded-lg p-6 min-h-[350px]">
              {status === 'Analyzing' ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest animate-pulse">Running Entity Resolution...</span>
                </div>
              ) : relationships.length === 0 ? (
                <div className="py-20 text-center text-xs font-mono text-zinc-600">
                  NO DATA LOGGED FOR TARGET
                </div>
              ) : (
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-zinc-900 pb-2">
                      <th className="text-green-500 underline font-normal pb-3 text-sm">Source</th>
                      <th className="text-yellow-500 underline font-normal pb-3 text-center text-sm">Relationship</th>
                      <th className="text-red-500 underline font-normal pb-3 text-right text-sm">Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/40">
                    {relationships.map((rel) => (
                      <tr key={rel.id} className="hover:bg-zinc-950 transition-colors">
                        <td className="py-3.5 font-medium text-white">{rel.source}</td>
                        <td className="py-3.5 text-center font-mono text-zinc-400">{rel.relationship}</td>
                        <td className="py-3.5 text-right font-medium text-white">{rel.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Recents, AI and Show Graph Button (Right Side) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Recent Investigations */}
            <div className="flex flex-col gap-3">
              <h3 className="font-serif text-lg text-white font-normal tracking-wide">Recent Investigations...</h3>
              <div className="flex flex-col gap-3">
                {recent.slice(0, 2).map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => triggerSearch(inv.searchTerm)}
                    className="w-full flex justify-between items-center bg-[#d9d9d9] hover:bg-[#c8c8c8] text-black rounded px-4 py-3 text-xs transition-colors cursor-pointer"
                  >
                    <span className="font-bold">{inv.title}</span>
                    <span className="text-zinc-600 font-mono text-[10px] flex-shrink-0 ml-4">{inv.timestamp}</span>
                  </button>
                ))}
                {/* Visual empty box representation from mockup */}
                <div className="w-full h-12 bg-zinc-800/10 border border-zinc-900 rounded" />
              </div>
            </div>

            {/* AI Summary */}
            <div className="flex flex-col gap-3">
              <h3 className="font-serif text-lg text-white font-normal tracking-wide">AI summary...</h3>
              <div className={`bg-[#d9d9d9] text-black rounded-lg p-6 min-h-[200px] flex flex-col justify-between transition-opacity ${
                status === 'Analyzing' ? 'opacity-40 animate-pulse' : 'opacity-100'
              }`}>
                <p className="text-xs leading-relaxed font-light mb-4">{summary.summary}</p>
                <ul className="space-y-1 text-[11px] text-zinc-700 font-light">
                  {summary.keyInsights.slice(0, 2).map((insight, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span>•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Show Graph Button */}
            <div className="flex justify-end mt-4">
              <Link
                href="/graph"
                className="px-10 py-3 text-xs tracking-widest font-semibold uppercase rounded bg-[#0000ff] hover:bg-blue-800 text-white active:scale-95 transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                Show Graph
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
