export type EntityType = 'Company' | 'Person' | 'Product' | 'Organization' | 'Location' | 'Event';

export interface OSINTEntity {
  id: string;
  name: string;
  type: EntityType;
  description: string;
  confidenceScore: number;
  tags?: string[];
}

export interface OSINTRelationship {
  id: string;
  source: string;
  sourceType: EntityType;
  relationship: string;
  target: string;
  targetType: EntityType;
  confidenceScore: number;
}

export interface InvestigationCard {
  id: string;
  title: string;
  searchTerm: string;
  timestamp: string;
  status: 'Completed' | 'Analyzing' | 'Failed';
  entityCount: number;
  relationshipCount: number;
}

export interface DashboardMetrics {
  totalEntities: number;
  relationshipsFound: number;
  sourcesAnalyzed: number;
  confidenceScore: number;
}

export interface AISummary {
  target: string;
  summary: string;
  keyInsights: string[];
}
