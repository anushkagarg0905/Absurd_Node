'use client';

import React, { useState } from 'react';
import { Database, Cpu, Merge, Network } from 'lucide-react';

interface Step {
  num: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  desc: string;
  snippet: string;
}

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps: Step[] = [
    {
      num: "01",
      icon: <Database className="w-5 h-5" />,
      title: "Data Ingestion",
      subtitle: "Multi-Source Harvester",
      desc: "Polls RSS feeds, queries News APIs, crawls Wikipedia entities, and extracts content from whitelisted corporate domains asynchronously, computing SHA-256 checksums to filter duplicate text.",
      snippet: `class RSSCollector(CollectorBase):
  async def collect(self) -> List[RawDocument]:
    feeds = await fetch_all_feeds()
    # Strips boilerplate HTML
    return [normalize(f) for f in feeds]`
    },
    {
      num: "02",
      icon: <Cpu className="w-5 h-5" />,
      title: "NLP & Entity Extraction",
      subtitle: "Transformer-Backed NER",
      desc: "Applies a transformer-powered spaCy NLP model to identify ORGANIZATION, PERSON, PRODUCT, and LOCATION entities. Co-occurring entities in sentence pairs are processed via Gemini for zero-shot relationship extraction.",
      snippet: `RELATION_EXTRACTION_PROMPT = """
Given the sentence and named entities,
extract semantic relationship pairs.
Return predicate, confidence, & evidence snippet.
"""`
    },
    {
      num: "03",
      icon: <Merge className="w-5 h-5" />,
      title: "Entity Resolution",
      subtitle: "Deterministic Alias Merging",
      desc: "Runs exact matches against a lookup table, followed by phonetic encoding. If unresolved, calculates cosine similarity using the sentence-transformers all-MiniLM-L6-v2 embedding model to merge distinct aliases into canonical nodes.",
      snippet: `def are_same_entity(name_a, name_b):
  embeddings = model.encode([name_a, name_b])
  sim = cosine_similarity(embeddings[0], embeddings[1])
  return sim >= 0.88 # Threshold limit`
    },
    {
      num: "04",
      icon: <Network className="w-5 h-5" />,
      title: "Graph Traversal",
      subtitle: "Neo4j AuraDB Injection",
      desc: "Upserts canonical entities and relationships into Neo4j using Cypher MERGE commands. The graph updates incrementally in real-time, making multi-hop relationships instantly queryable.",
      snippet: `MERGE (o:Organization {canonical_id: $id})
ON CREATE SET o.name = $name, o.mention_count = 1
ON MATCH SET o.mention_count = o.mention_count + 1
RETURN o`
    }
  ];

  return (
    <section id="how-it-works" className="relative py-24 border-b border-slate-900 bg-slate-950">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/10 text-cyan-400 text-xs font-mono tracking-wider mb-4 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Platform Engine
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-4">
            How The Pipeline Operates
          </h2>
          <p className="text-base text-slate-400 font-light max-w-2xl mx-auto">
            Our automated pipeline continuously ingests unstructured feeds, isolates key intelligence data points, and parses them into a visual map.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Timeline Selector */}
          <div className="lg:col-span-5 space-y-4">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left flex gap-4 p-4 rounded border transition-all duration-300 relative overflow-hidden group ${
                    isActive
                      ? 'bg-slate-900 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                      : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/20'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded border flex items-center justify-center transition-colors duration-300 ${
                    isActive
                      ? 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 group-hover:text-slate-300'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-cyan-500 font-medium tracking-wide uppercase">
                        {step.subtitle}
                      </span>
                      <span className={`text-xs font-mono ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      {step.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details Pane */}
          <div className="lg:col-span-7 bg-slate-900/30 border border-slate-800/80 rounded p-6 sm:p-8 flex flex-col h-full min-h-[360px] justify-between relative">
            {/* Absolute indicator */}
            <div className="absolute top-4 right-4 text-xs font-mono text-slate-700 bg-slate-950 border border-slate-800/60 px-2 py-1 rounded">
              MODULE_STATUS: ACTIVE
            </div>

            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-cyan-950/20 border border-cyan-800/20 text-cyan-400 mb-6">
                {steps[activeStep].icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide">
                {steps[activeStep].title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light mb-6">
                {steps[activeStep].desc}
              </p>
            </div>

            {/* Code Snippet Box */}
            <div className="rounded border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Pipeline Code Implementation</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/60 animate-ping" />
              </div>
              <pre className="text-cyan-300/90 leading-5">
                <code>{steps[activeStep].snippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
