export interface ClientCondition {
  sido: string;
  sigungu: string;
  dong?: string;
  lifecycle: string[];
  ageValue?: number;
  household: string[];
  conditions: string[];
  incomeLevel?: string;
  topicFilter?: string;
}

export type ResourceTier = 'CENTRAL' | 'LOCAL' | 'PRIVATE';

export interface ServiceResult {
  id: string;
  name: string;
  provider: string;
  tier: ResourceTier;
  summary: string;
  content: string;
  target: string;
  applyMethod: string;
  documents?: string;
  link?: string;
  urgencyLevel: number;
  topics: string[];
  region: string;
  isActive: boolean;
}
