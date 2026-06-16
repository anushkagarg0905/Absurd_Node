import { MOCK_METRICS, MOCK_AI_SUMMARIES, MOCK_ENTITIES, MOCK_RELATIONSHIPS, RECENT_INVESTIGATIONS } from './data';
import { OSINTEntity, OSINTRelationship, InvestigationCard, DashboardMetrics, AISummary } from './types';

// Helper to normalize queries
const normalizeQuery = (query: string): string => {
  const q = query.toLowerCase().trim();
  if (q.includes('openai')) return 'openai';
  if (q.includes('microsoft')) return 'microsoft';
  if (q.includes('google') || q.includes('deepmind')) return 'google';
  return 'default';
};

export const getMetricsForQuery = (query: string): DashboardMetrics => {
  const key = normalizeQuery(query);
  return MOCK_METRICS[key] || MOCK_METRICS['default'];
};

export const getEntitiesForQuery = (query: string): OSINTEntity[] => {
  const key = normalizeQuery(query);
  return MOCK_ENTITIES[key] || MOCK_ENTITIES['default'];
};

export const getRelationshipsForQuery = (query: string): OSINTRelationship[] => {
  const key = normalizeQuery(query);
  return MOCK_RELATIONSHIPS[key] || MOCK_RELATIONSHIPS['default'];
};

export const getAISummaryForQuery = (query: string): AISummary => {
  const key = normalizeQuery(query);
  const rawSummary = MOCK_AI_SUMMARIES[key] || MOCK_AI_SUMMARIES['default'];
  
  // Customise the target name dynamically to make it feel real
  if (key === 'default' && query.trim() !== '') {
    return {
      target: query.trim(),
      summary: rawSummary.summary.replace('Target Entity', query.trim()),
      keyInsights: rawSummary.keyInsights.map(insight => 
        insight.replace('target', query.trim()).replace('Target', query.trim())
      )
    };
  }
  
  return rawSummary;
};

export const getRecentInvestigations = (): InvestigationCard[] => {
  return RECENT_INVESTIGATIONS;
};
