export interface HistoryEntry {
  value: string | Record<string, any>;
  model: string;
  timestamp: string;
}

export interface ProcessedResult {
  id?: string; // "_id" is mapped to "id"
  user_id: string;
  source_hash: string;
  input_type: "text" | "file";
  filename?: string;

  model: string;
  language?: string;
  entities_requested?: string[];

  summary?: string;
  extracted_entities?: Record<string, any>;

  summary_history?: HistoryEntry[];
  entities_history?: HistoryEntry[];

  created_at: string;
  updated_at: string;
}
