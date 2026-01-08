import React from 'react';

export type ViewState = 'runs' | 'keywords' | 'settings' | 'reports' | 'schedules' | 'competitors';

export interface LLMConfig {
  id: string;
  name: string;
  model: string;
  enabled: boolean;
  apiKey: string;
  icon: React.ReactNode;
}

export interface Group {
  id: string;
  name: string;
}

export interface Keyword {
  id: string;
  text: string;
  groupId: string;
}

export interface RunResult {
  id: string;
  keywordId: string;
  modelId: string;
  timestamp: string;
  status: 'idle' | 'searching' | 'complete' | 'error';
  found: boolean;
  rank?: number;
  snippet?: string;
  fullResponse?: string;
  score: number;
}

export interface Schedule {
  id: string;
  name: string;
  type: 'keyword_audit' | 'competitive_analysis';
  groupId: string | 'all';
  analysisId?: string;
  time: string;
  enabled: boolean;
  lastRun?: string;
  nextRun: string;
}

export interface Competitor {
  id: string;
  name: string;
  domain: string;
  description?: string;
  strengths?: string[];
  weaknesses?: string[];
  keywords?: string[];
  lastAnalyzed?: string;
}

export interface CompetitiveAnalysis {
  id: string;
  name: string;
  mainCompany: string;
  competitors: string[];
  lastRun?: string;
  insights?: string;
  comparisonResults?: any;
  comparisonQuestion?: string;
}

export interface CompetitorRunResult {
  id: string;
  analysisId: string;
  competitorId: string;
  modelId: string;
  timestamp: string;
  status: 'idle' | 'searching' | 'complete' | 'error';
  mentionCount: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  snippet?: string;
  fullResponse?: string;
}
