'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useInvestigation } from '@/lib/context/InvestigationContext';
import { ArrowLeft, Database, Trash2 } from 'lucide-react';

// Dynamically import GraphExplorer to disable SSR, avoiding layout shifts and window errors
const GraphExplorer = dynamic(
  () => import('@/components/GraphExplorer').then((mod) => mod.GraphExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex flex-col items-center justify-center bg-black p-6 text-slate-400">
        <div className="flex flex-col items-center gap-4 border border-zinc-900 bg-[#111111]/30 rounded p-8 shadow-lg max-w-sm w-full text-center">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <div className="font-mono text-xs text-zinc-500 uppercase">
            Resolving Graph Canvas...
          </div>
        </div>
      </div>
    )
  }
);

export default function GraphPage() {
  const router = useRouter();
  const { triggerSearch } = useInvestigation();

  const handleReset = () => {
    triggerSearch('OpenAI');
  };

  return (
    <div className="flex h-screen w-screen bg-black text-white font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR BAR (Vertical icons) */}
      <div className="w-16 bg-black border-r border-zinc-900/60 flex flex-col items-center py-6 gap-8 flex-shrink-0">
        {/* Back Arrow inside Circle */}
        <button
          onClick={() => router.push('/dashboard')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-slate-200 transition-colors cursor-pointer"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Dashboard Link */}
        <button
          onClick={() => router.push('/dashboard')}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
          title="Dashboard View"
        >
          <Database className="w-5 h-5" />
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

      {/* Full-Screen Workspace */}
      <div className="flex-1 flex flex-col min-h-0 w-full relative bg-black">
        <GraphExplorer />
      </div>
    </div>
  );
}
