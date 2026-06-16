'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import { NetworkBackground } from '@/components/NetworkBackground';

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      {/* Interactive background constellation floating behind */}
      <NetworkBackground />

      {/* Centered Top Nav */}
      <Header />

      <main className="flex-1 relative z-10 flex flex-col items-center">
        
        {/* SECTION 1: HERO */}
        <section className="min-h-[90vh] w-full max-w-5xl px-4 flex flex-col items-center justify-center text-center py-12">
          {/* Logo */}
          <div className="relative w-32 h-32 mb-8">
            <Image
              src="/logo.png"
              alt="Absurd Node Logo"
              fill
              className="object-contain invert brightness-200"
              priority
            />
          </div>

          {/* Title & Subtitle */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide text-white mb-2 uppercase">
            ABSURD NODE
          </h1>
          <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-light tracking-wide text-slate-200 mb-10">
            AI-Powered OSINT Knowledge Graph Platform
          </h2>

          {/* Buttons */}
          <div className="flex flex-row items-center gap-6 mb-24">
            <button
              onClick={handleStart}
              className="px-8 py-3 text-xs tracking-widest font-semibold border border-white text-white bg-transparent hover:bg-white/10 active:scale-95 transition-all duration-200"
            >
              View Demo
            </button>
            <button
              onClick={handleStart}
              className="px-8 py-3 text-xs tracking-widest font-semibold border border-white text-black bg-white hover:bg-slate-200 active:scale-95 transition-all duration-200"
            >
              Start Investigation
            </button>
          </div>

          {/* Descriptive text at bottom of hero */}
          <p className="font-serif text-sm sm:text-base text-slate-300 font-light max-w-2xl leading-relaxed">
            An automated OSINT knowledge graph builder that transforms unstructured news, web, and profile chaos into an interactive, Neo4j-powered web of intelligence.
          </p>
        </section>

        {/* SECTION 2: PROBLEMS WITH ARCH CONNECTIONS */}
        <section className="w-full max-w-5xl px-4 py-24 flex flex-col items-center">
          
          <div className="w-full relative flex flex-col gap-16">
            
            {/* Row 1: Scattered Info (Left) -> Glow Dot (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 text-left">
                <h3 className="font-serif text-2xl text-white mb-3">Scattered Information</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">
                  Data is spread everywhere. News articles, corporate websites, and public profiles are isolated. Investigators waste hours opening tabs just to connect the dots manually.
                </p>
              </div>
              <div className="md:col-span-7 relative h-36 hidden md:block">
                <svg className="w-full h-full" viewBox="0 0 400 150" fill="none">
                  {/* Arc bending downwards and right */}
                  <path
                    d="M 10 20 Q 200 130 380 130"
                    stroke="url(#gradient-cyan-1)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="opacity-75"
                  />
                  <circle cx="380" cy="130" r="4" fill="#22d3ee" className="animate-ping" />
                  <circle cx="380" cy="130" r="3" fill="#ffffff" />
                  <defs>
                    <linearGradient id="gradient-cyan-1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Row 2: Glow Dot (Left) -> Hidden Connections (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 relative h-36 hidden md:block">
                <svg className="w-full h-full" viewBox="0 0 400 150" fill="none">
                  {/* Arc bending downwards and left */}
                  <path
                    d="M 390 20 Q 200 130 20 130"
                    stroke="url(#gradient-cyan-2)"
                    strokeWidth="1.5"
                    className="opacity-75"
                  />
                  <circle cx="20" cy="130" r="4" fill="#22d3ee" className="animate-ping" />
                  <circle cx="20" cy="130" r="3" fill="#ffffff" />
                  <defs>
                    <linearGradient id="gradient-cyan-2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="md:col-span-5 text-right">
                <h3 className="font-serif text-2xl text-white mb-3">Hidden Connections</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">
                  Bad actors and shell companies hide their tracks on purpose. Without proper mapping, separate data points look unrelated, keeping complex networks hidden from standard search engines.
                </p>
              </div>
            </div>

            {/* Row 3: Manual Tracking is Slow (Left) -> Glow Dot (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 text-left">
                <h3 className="font-serif text-2xl text-white mb-3">Manual Tracking is Slow</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">
                  Copying names, saving links, and drawing charts by hand kills your momentum. You spend most of your time gathering data instead of analyzing it.
                </p>
              </div>
              <div className="md:col-span-7 relative h-36 hidden md:block">
                <svg className="w-full h-full" viewBox="0 0 400 150" fill="none">
                  <path
                    d="M 10 20 Q 200 130 380 130"
                    stroke="url(#gradient-cyan-3)"
                    strokeWidth="1.5"
                    className="opacity-75"
                  />
                  <circle cx="380" cy="130" r="4" fill="#22d3ee" className="animate-ping" />
                  <circle cx="380" cy="130" r="3" fill="#ffffff" />
                  <defs>
                    <linearGradient id="gradient-cyan-3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Row 4: Glow Dot (Left) -> Outdated Reports (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 relative h-36 hidden md:block">
                <svg className="w-full h-full" viewBox="0 0 400 150" fill="none">
                  <path
                    d="M 390 20 Q 200 130 20 130"
                    stroke="url(#gradient-cyan-4)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="opacity-75"
                  />
                  <circle cx="20" cy="130" r="4" fill="#22d3ee" className="animate-ping" />
                  <circle cx="20" cy="130" r="3" fill="#ffffff" />
                  <defs>
                    <linearGradient id="gradient-cyan-4" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="md:col-span-5 text-right">
                <h3 className="font-serif text-2xl text-white mb-3">Outdated Reports</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">
                  The web moves fast. By the time you finish drawing a link chart by hand, companies change names, websites go down, and your intelligence is already old.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: FROM RAW DATA TO GRAPHS */}
        <section className="w-full max-w-5xl px-4 py-24 flex flex-col items-center">
          <h2 className="font-serif text-2xl tracking-widest text-slate-100 mb-12 uppercase text-center">
            FROM RAW DATA TO GRAPHS
          </h2>

          {/* Large grey placeholder representing visual mock */}
          <div className="w-full aspect-video md:h-[450px] bg-zinc-800/40 border border-zinc-700/60 rounded flex items-center justify-center text-zinc-500 font-mono text-xs shadow-2xl relative mb-12">
            <span className="animate-pulse">GRAPH VISUALIZATION ACTIVE STREAM</span>
            {/* Simple decoration to look realistic */}
            <div className="absolute top-3 left-3 flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
          </div>

          {/* Horizontal Divider Line */}
          <div className="w-full h-px bg-zinc-800 mb-8" />

          {/* 5 Spaced Out Steps */}
          <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-serif text-slate-100">Search Target</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-serif text-slate-100">Collect Data</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-serif text-slate-100">Extract Entities</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-serif text-slate-100">Generate Report</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-serif text-slate-100">Build the Graph</span>
            </div>
          </div>
        </section>

        {/* SECTION 4: FINAL CTA */}
        <section className="w-full max-w-3xl px-4 py-28 text-center flex flex-col items-center">
          <p className="font-serif text-lg sm:text-xl md:text-2xl text-slate-200 font-light leading-relaxed mb-12">
            Stop wasting time on spreadsheets. Build your first interactive target map and find the connections you are missing.
          </p>
          <button
            onClick={handleStart}
            className="px-8 py-3.5 text-xs font-semibold tracking-widest text-black bg-white hover:bg-slate-200 active:scale-95 transition-all duration-200 rounded-sm"
          >
            Start Now
          </button>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-10 text-center relative z-10 text-[10px] font-mono text-slate-600">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>ABSURD NODE © 2026.</span>
          <span>CLASSIFICATION: CONFIDENTIAL / SANDBOX</span>
        </div>
      </footer>
    </div>
  );
}
