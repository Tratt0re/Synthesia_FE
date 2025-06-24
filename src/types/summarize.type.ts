export interface AnalyzeRequest {
  model: string;
  language?: string;
  text?: string; // for analyzeText only
  entities?: string[];
}

export interface AnalyzeResponse {
  summary: string;
  entities: Record<string, any>;
  result_id: string;
}

export interface LLMModel {
  model: string;
  [key: string]: any;
}
