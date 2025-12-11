export interface PersonaDetails {
  name: string;
  createdAt: string;
}

export interface PersonaHistory {
  url: string;
  title: string;
  description: string;
  visitedAt: string;
  snapshotPath: string;
}

export interface PersonaInsights {
  insight_summary: string;
  category: string;
  intent: string;
  score: number;
  updated_at: number;
  is_deleted: boolean;
}

export interface Persona {
  persona: PersonaDetails;
  history: PersonaHistory[];
  insights: PersonaInsights[];
}
