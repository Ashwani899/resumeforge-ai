export interface ATSBreakdownItem {
  score: number;
  label: string;
  weight: number;
}

export interface ATSResult {
  overall: number;
  breakdown: Record<string, ATSBreakdownItem>;
  tips: Array<{type: string; text: string}>;
}

export interface KeywordMatch {
  keyword: string;
  count: number;
}

export interface KeywordMissing {
  keyword: string;
  importance: 'high' | 'medium' | 'low';
}

export interface KeywordsResult {
  matched: KeywordMatch[];
  missing: KeywordMissing[];
  match_score: number;
}

export interface Suggestion {
  priority: 'high' | 'medium' | 'low';
  category: string;
  text: string;
  example?: string;
}

export interface UploadResponse {
  id: string;
  filename: string;
  ats_score: ATSResult;
  keywords: KeywordsResult;
  parsed_sections: Record<string, string>;
}

export interface AnalysisResponse {
  id: string;
  filename: string;
  overall_score: number;
  breakdown: Record<string, ATSBreakdownItem>;
  keywords: KeywordsResult;
  suggestions?: Suggestion[];
}

export interface TailorRequest {
  resume_id: string;
  job_description: string;
  target_role?: string;
}

export interface TailorResponse {
  tailored_text: string;
  original_text: string;
  match_score: number;
  added_keywords: string[];
  suggestions: string[];
}
