export interface ServiceResult {
  id: string;
  name: string;
  provider: string;
  tier: 'CENTRAL' | 'LOCAL' | 'PRIVATE';
  summary: string;
  content: string;
  target: string;
  applyMethod: string;
  documents?: string;
  link?: string;
  urgencyLevel: number;
  topics: string[];
  region: string;
}

export interface ResultsState {
  central: ServiceResult[];
  local: ServiceResult[];
  private: ServiceResult[];
}
