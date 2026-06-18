/**
 * Data service layer.
 *
 * When NEXT_PUBLIC_API_URL is set the functions call the FastAPI backend.
 * If the env var is missing, or a fetch fails, they fall back to the
 * inline mock data — so the UI always works even without a running backend.
 *
 * No other file needs to change to switch between mock and live mode.
 */

import {
  MOCK_METRICS,
  MOCK_AI_SUMMARIES,
  MOCK_ENTITIES,
  MOCK_RELATIONSHIPS,
  RECENT_INVESTIGATIONS,
} from './data';
import { OSINTEntity, OSINTRelationship, InvestigationCard, DashboardMetrics, AISummary } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

// ── Internal helpers ──────────────────────────────────────────────────────────

const normalizeQuery = (query: string): string => {
  const q = query.toLowerCase().trim();
  if (q.includes('openai')) return 'openai';
  if (q.includes('microsoft')) return 'microsoft';
  if (q.includes('google') || q.includes('deepmind')) return 'google';
  return 'default';
};

/** Fetch from backend; returns null on any error so callers can fallback. */
async function apiFetch<T>(path: string): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ── Inline mock helpers (unchanged from original) ─────────────────────────────

const getMockMetrics = (query: string): DashboardMetrics => {
  const key = normalizeQuery(query);
  return MOCK_METRICS[key] ?? MOCK_METRICS['default'];
};

const getMockEntities = (query: string): OSINTEntity[] => {
  const key = normalizeQuery(query);
  return MOCK_ENTITIES[key] ?? MOCK_ENTITIES['default'];
};

const getMockRelationships = (query: string): OSINTRelationship[] => {
  const key = normalizeQuery(query);
  return MOCK_RELATIONSHIPS[key] ?? MOCK_RELATIONSHIPS['default'];
};

const getMockAISummary = (query: string): AISummary => {
  const key = normalizeQuery(query);
  const raw = MOCK_AI_SUMMARIES[key] ?? MOCK_AI_SUMMARIES['default'];
  if (key === 'default' && query.trim() !== '') {
    return {
      target: query.trim(),
      summary: raw.summary.replace('Target Entity', query.trim()),
      keyInsights: raw.keyInsights.map((insight: string) =>
        insight.replace('target', query.trim()).replace('Target', query.trim())
      ),
    };
  }
  return raw;
};

// ── Public API (same signatures as before) ────────────────────────────────────

export const getMetricsForQuery = (query: string): DashboardMetrics =>
  getMockMetrics(query);

export const getEntitiesForQuery = (query: string): OSINTEntity[] =>
  getMockEntities(query);

export const getRelationshipsForQuery = (query: string): OSINTRelationship[] =>
  getMockRelationships(query);

export const getAISummaryForQuery = (query: string): AISummary =>
  getMockAISummary(query);

export const getRecentInvestigations = (): InvestigationCard[] =>
  RECENT_INVESTIGATIONS;

// ── Async variants that hit the backend (used by pages that opt-in) ───────────

interface DashboardPayload {
  metrics: DashboardMetrics;
  relationships: OSINTRelationship[];
  aiSummary: AISummary;
  recentInvestigations: InvestigationCard[];
}

/**
 * Fetch all dashboard data in a single backend call.
 * Falls back to synchronous mock helpers if the backend is unreachable.
 */
export async function fetchDashboardData(query: string): Promise<DashboardPayload> {
  const data = await apiFetch<DashboardPayload>(
    `/api/v1/dashboard?q=${encodeURIComponent(query)}`
  );

  if (data) return data;

  // Fallback — identical to what the dashboard page used to call directly
  return {
    metrics: getMockMetrics(query),
    relationships: getMockRelationships(query),
    aiSummary: getMockAISummary(query),
    recentInvestigations: RECENT_INVESTIGATIONS,
  };
}

interface SubgraphPayload {
  nodes: OSINTEntity[];
  edges: OSINTRelationship[];
}

/**
 * Fetch graph subgraph for React Flow.
 * Falls back to mock entity + relationship data if the backend is unreachable.
 */
export async function fetchSubgraph(query: string): Promise<SubgraphPayload> {
  const data = await apiFetch<SubgraphPayload>(
    `/api/v1/graph/search`,
    // POST body via separate helper below
  );
  // apiFetch only does GET — use the POST version
  return fetchSubgraphPost(query);
}

async function fetchSubgraphPost(query: string): Promise<SubgraphPayload> {
  if (!API_URL) return buildMockSubgraph(query);
  try {
    const res = await fetch(`${API_URL}/api/v1/graph/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query }),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('bad status');
    return res.json();
  } catch {
    return buildMockSubgraph(query);
  }
}

function buildMockSubgraph(query: string): SubgraphPayload {
  const entities = getMockEntities(query);
  const relationships = getMockRelationships(query);
  const nameToId = Object.fromEntries(entities.map((e) => [e.name.toLowerCase(), e.id]));
  const edges = relationships.filter(
    (r) => nameToId[r.source.toLowerCase()] && nameToId[r.target.toLowerCase()]
  );
  return { nodes: entities, edges };
}
