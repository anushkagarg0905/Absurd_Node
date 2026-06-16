'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useInvestigation } from '@/lib/context/InvestigationContext';
import { getEntitiesForQuery, getRelationshipsForQuery } from '@/lib/mock-data/service';
import { OSINTEntity } from '@/lib/mock-data/types';
import { Info, HelpCircle } from 'lucide-react';

export const GraphExplorer: React.FC = () => {
  const router = useRouter();
  const { searchQuery, triggerSearch } = useInvestigation();

  const [hoveredEntity, setHoveredEntity] = useState<OSINTEntity | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Fetch entities and relationships based on current search term
  const entities = getEntitiesForQuery(searchQuery);
  const relationships = getRelationshipsForQuery(searchQuery);

  // Generate initial nodes and layout them programmatically in a circle
  const getInitialNodes = () => {
    return entities.map((entity, idx) => {
      const isSearchTarget = entity.name.toLowerCase() === searchQuery.toLowerCase();
      
      // Compute coordinates around (0,0) center
      let x = 0;
      let y = 0;
      if (!isSearchTarget) {
        const angle = (idx / (entities.length - 1 || 1)) * 2 * Math.PI;
        const radius = idx % 2 === 0 ? 200 : 320;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
      }

      let borderColor = 'border-slate-800';
      let tagColor = 'bg-slate-800 text-slate-400';
      switch (entity.type) {
        case 'Company':
          borderColor = 'border-cyan-500/60 hover:border-cyan-400';
          tagColor = 'bg-cyan-950/40 text-cyan-400';
          break;
        case 'Person':
          borderColor = 'border-amber-500/60 hover:border-amber-400';
          tagColor = 'bg-amber-950/40 text-amber-400';
          break;
        case 'Product':
          borderColor = 'border-purple-500/60 hover:border-purple-400';
          tagColor = 'bg-purple-950/40 text-purple-400';
          break;
        case 'Location':
          borderColor = 'border-emerald-500/60 hover:border-emerald-400';
          tagColor = 'bg-emerald-950/40 text-emerald-400';
          break;
        case 'Organization':
          borderColor = 'border-rose-500/60 hover:border-rose-400';
          tagColor = 'bg-rose-950/40 text-rose-400';
          break;
        case 'Event':
          borderColor = 'border-blue-500/60 hover:border-blue-400';
          tagColor = 'bg-blue-950/40 text-blue-400';
          break;
      }

      const activeBorder = isSearchTarget
        ? 'border-2 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.25)] scale-105'
        : `border ${borderColor}`;

      return {
        id: entity.id,
        type: 'default',
        data: {
          label: (
            <div className="flex flex-col gap-1 items-start text-left select-none pointer-events-none">
              <div className="flex items-center justify-between w-full gap-2">
                <span className="text-[11px] font-bold text-white tracking-wide truncate max-w-[110px]">{entity.name}</span>
                <span className={`text-[8px] font-mono px-1 rounded uppercase ${tagColor}`}>
                  {entity.type}
                </span>
              </div>
              {entity.description && (
                <span className="text-[9px] text-slate-400 line-clamp-1 max-w-[170px] font-light">
                  {entity.description}
                </span>
              )}
            </div>
          ),
          entity
        },
        position: { x, y },
        className: `p-2.5 rounded bg-slate-900/95 text-slate-100 ${activeBorder} w-[180px] transition-all duration-200 cursor-pointer shadow-lg hover:bg-slate-900`,
      };
    });
  };

  const getInitialEdges = () => {
    const edgeList: any[] = [];
    relationships.forEach((rel) => {
      const sourceNode = entities.find(e => e.name.toLowerCase() === rel.source.toLowerCase());
      const targetNode = entities.find(e => e.name.toLowerCase() === rel.target.toLowerCase());
      
      if (sourceNode && targetNode) {
        edgeList.push({
          id: rel.id,
          source: sourceNode.id,
          target: targetNode.id,
          label: rel.relationship,
          labelStyle: { fill: '#64748b', fontSize: '8px', fontFamily: 'monospace', fontWeight: '500' },
          labelBgPadding: 3,
          labelBgBorderRadius: 2,
          labelBgStyle: { fill: '#000000', fillOpacity: 0.9, stroke: '#1e293b', strokeWidth: 0.5 },
          style: { stroke: '#334155', strokeWidth: 1.2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: '#334155'
          },
          animated: true,
        });
      }
    });
    return edgeList;
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges());

  // Reload nodes/edges if searchQuery changes
  useEffect(() => {
    setNodes(getInitialNodes());
    setEdges(getInitialEdges());
  }, [searchQuery]);

  // Click redirects to dashboard and updates search term
  const onNodeClick = (_event: React.MouseEvent, node: any) => {
    const entity = node.data?.entity as OSINTEntity;
    if (entity) {
      triggerSearch(entity.name);
      router.push('/dashboard');
    }
  };

  // Tooltip tracking functions
  const onNodeMouseEnter = (event: React.MouseEvent, node: any) => {
    const entity = node.data?.entity as OSINTEntity;
    if (entity) {
      setHoveredEntity(entity);
      setTooltipPos({ x: event.clientX, y: event.clientY });
    }
  };

  const onNodeMouseLeave = () => {
    setHoveredEntity(null);
    setTooltipPos(null);
  };

  const onNodeMouseMove = (event: React.MouseEvent) => {
    if (hoveredEntity) {
      setTooltipPos({ x: event.clientX, y: event.clientY });
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] flex-1 bg-black relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodeMouseMove={onNodeMouseMove}
        fitView
        className="w-full h-full"
      >
        <Background color="#1e293b" gap={16} size={1} />
        <Controls className="bg-slate-900 border border-slate-800 text-white fill-white [&>button]:border-slate-800 [&>button]:bg-slate-900 [&>button]:text-white [&>button:hover]:bg-slate-800" />
      </ReactFlow>

      {/* Interactive Helper Banner */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded px-4 py-2.5 max-w-xs flex gap-2">
        <HelpCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="text-[10px] font-mono leading-relaxed text-slate-400">
          <span className="font-bold text-white uppercase block mb-1">Graph Explorer Help</span>
          Hover nodes to view metadata tooltip. <br />
          Click node to inspect its dashboard analytics. <br />
          Scroll to zoom. Drag to pan.
        </div>
      </div>

      {/* Absolute Tooltip rendering on node hover */}
      {hoveredEntity && tooltipPos && (
        <div
          className="fixed z-50 pointer-events-none bg-slate-900 border border-cyan-500/40 rounded p-4 shadow-xl max-w-sm flex flex-col gap-2 font-sans text-xs"
          style={{
            top: tooltipPos.y + 12,
            left: tooltipPos.x + 12,
          }}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-sm">{hoveredEntity.name}</span>
            <span className="text-[9px] font-mono bg-cyan-950/40 text-cyan-400 border border-cyan-900/20 px-1.5 py-0.5 rounded uppercase">
              {hoveredEntity.type}
            </span>
          </div>

          <p className="text-slate-300 font-light leading-relaxed">{hoveredEntity.description}</p>
          
          <div className="flex items-center gap-4 mt-1 border-t border-slate-800/50 pt-2 text-[10px] font-mono text-slate-400">
            <span>CONFIDENCE: <strong className="text-cyan-400">{hoveredEntity.confidenceScore}%</strong></span>
          </div>

          {hoveredEntity.tags && hoveredEntity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {hoveredEntity.tags.map((t, idx) => (
                <span key={idx} className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1 py-0.5 rounded">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GraphExplorer;
