import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Globe,
  Terminal,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import type {
  ViewState,
  LLMConfig,
  Group,
  Keyword,
  RunResult,
  Schedule,
  Competitor,
  CompetitiveAnalysis as CompetitiveAnalysisType,
  CompetitorRunResult
} from './lmsSeoService';
import Sidebar from './Sidebar';
import ActiveRuns from './ActiveRuns';
import KeywordsGroups from './KeywordsGroups';
import ScheduledRuns from './ScheduledRuns';
import CompetitiveAnalysis from './CompetitiveAnalysis';
import Reports from './Reports';
import Settings from './Settings';

// --- Mock Data & Helpers ---
const DEFAULT_GROUPS: Group[] = [
  { id: 'g1', name: 'Core Brand' },
  { id: 'g2', name: 'Competitors' },
  { id: 'g3', name: 'Industry Terms' },
];

const DEFAULT_KEYWORDS: Keyword[] = [
  { id: 'k1', text: 'Best AI Agency India', groupId: 'g1' },
  { id: 'k2', text: 'Rank.ai Reviews', groupId: 'g1' },
  { id: 'k3', text: 'Salesforce vs HubSpot', groupId: 'g2' },
  { id: 'k4', text: 'Enterprise LLM Solutions', groupId: 'g3' },
  { id: 'k5', text: 'Generative SEO Tools', groupId: 'g3' },
];

const DEFAULT_LLMS: LLMConfig[] = [
  { id: 'gemini', name: 'Gemini', model: '1.5 Pro', enabled: true, apiKey: '', icon: <Sparkles size={16} /> },
  { id: 'chatgpt', name: 'ChatGPT', model: 'GPT-4o', enabled: true, apiKey: '', icon: <Zap size={16} /> },
  { id: 'perplexity', name: 'Perplexity', model: 'Sonar', enabled: true, apiKey: '', icon: <Globe size={16} /> },
  { id: 'deepseek', name: 'DeepSeek', model: 'V2', enabled: false, apiKey: '', icon: <Terminal size={16} /> },
];

const generateMockResult = (keyword: string, _modelId: string): Partial<RunResult> => {
  const isFound = Math.random() > 0.4;
  const rank = isFound ? Math.floor(Math.random() * 8) + 1 : undefined;
  const timestamp = new Date().toISOString();

  return {
    timestamp,
    found: isFound,
    rank,
    score: isFound ? 100 - ((rank || 10) * 8) : 10,
    snippet: isFound
      ? `...ranked #${rank} for "${keyword}". The company is mentioned as a leader in...`
      : `The entity was not found in the top citations for "${keyword}".`,
    fullResponse: isFound
      ? `Here are the top results for "${keyword}":\n\n1. TechCorp\n2. Alpha Solutions\n${rank}. TargetCompany\n\nTargetCompany is increasingly recognized for their contributions to open-source LLM evaluations. They have recently partnered with major cloud providers.`
      : `I analyzed the top search results and knowledge graph entities for "${keyword}".\n\nWhile several competitors like TechCorp and Alpha Solutions appear prominently, TargetCompany does not currently rank in the top 20 results. This may be due to a lack of recent high-authority backlinks or specific schema markup.`
  };
};

const generateMockCompetitorResult = (competitorName: string, _modelId: string): Partial<CompetitorRunResult> => {
  const mentionCount = Math.floor(Math.random() * 15) + 1;
  const sentiments: ('positive' | 'neutral' | 'negative')[] = ['positive', 'neutral', 'negative'];
  const sentiment = sentiments[Math.floor(Math.random() * 3)];
  const score = sentiment === 'positive' ? 70 + Math.floor(Math.random() * 30)
    : sentiment === 'neutral' ? 40 + Math.floor(Math.random() * 30)
      : 10 + Math.floor(Math.random() * 30);

  return {
    mentionCount,
    sentiment,
    score,
    snippet: `${competitorName} was mentioned ${mentionCount} times with ${sentiment} sentiment...`,
    fullResponse: `Analysis of ${competitorName}:\n\nMention Count: ${mentionCount}\nOverall Sentiment: ${sentiment}\n\nKey findings:\n- ${competitorName} is frequently mentioned in discussions about AI solutions\n- Their market positioning appears to be ${sentiment === 'positive' ? 'strong' : sentiment === 'neutral' ? 'moderate' : 'weak'}\n- Recommended areas for competitive advantage: content marketing, technical documentation`
  };
};

// --- Main App ---
const LLMSeoAgent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('runs');
  const [keywords, setKeywords] = useState<Keyword[]>(DEFAULT_KEYWORDS);
  const [groups, setGroups] = useState<Group[]>(DEFAULT_GROUPS);
  const [llms, setLlms] = useState<LLMConfig[]>(DEFAULT_LLMS);
  const [results, setResults] = useState<RunResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [analyses, setAnalyses] = useState<CompetitiveAnalysisType[]>([]);
  const [competitorResults, setCompetitorResults] = useState<CompetitorRunResult[]>([]);

  // Initialize with some mock history for the graph/table to show
  useEffect(() => {
    const mockHistory: RunResult[] = [];
    const today = new Date().toISOString();

    keywords.slice(0, 3).forEach(k => {
      llms.filter(l => l.enabled).forEach(l => {
        const res = generateMockResult(k.text, l.id);
        mockHistory.push({
          id: Math.random().toString(),
          keywordId: k.id,
          modelId: l.id,
          timestamp: today,
          status: 'complete',
          found: res.found!,
          rank: res.rank,
          snippet: res.snippet,
          fullResponse: res.fullResponse,
          score: res.score!
        });
      });
    });
    setResults(mockHistory);
  }, []);

  // Add a new competitor
  const addCompetitor = (competitorData: Omit<Competitor, 'id'>) => {
    const newCompetitor: Competitor = {
      ...competitorData,
      id: Date.now().toString()
    };
    setCompetitors([...competitors, newCompetitor]);
  };

  // Delete a competitor
  const deleteCompetitor = (id: string) => {
    setCompetitors(competitors.filter(c => c.id !== id));
  };

  // Add a new competitive analysis
  const addAnalysis = (analysisData: Omit<CompetitiveAnalysisType, 'id' | 'lastRun'>) => {
    const newAnalysis: CompetitiveAnalysisType = {
      ...analysisData,
      id: Date.now().toString(),
      lastRun: undefined
    };
    setAnalyses([...analyses, newAnalysis]);
  };

  // Run a competitive analysis
  const runAnalysis = (analysisId: string) => {
    console.log(`Running competitive analysis: ${analysisId}`);

    setAnalyses(analyses.map(analysis => {
      if (analysis.id === analysisId) {
        const mockInsights = `Based on the analysis, ${analysis.mainCompany} performs well in technical capabilities compared to competitors. However, competitors like ${competitors.find(c => c.id === analysis.competitors[0])?.name || 'other companies'} show stronger market positioning in certain areas. Recommendations include focusing on unique value propositions and improving content marketing strategies.`;

        return {
          ...analysis,
          lastRun: new Date().toISOString(),
          insights: mockInsights
        };
      }
      return analysis;
    }));
  };

  // Calculate next run time for a schedule
  const calculateNextRun = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);

    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    return nextRun.toISOString();
  };

  // Add a new schedule
  const addSchedule = (scheduleData: Omit<Schedule, 'id' | 'nextRun'>) => {
    const newSchedule: Schedule = {
      ...scheduleData,
      id: Date.now().toString(),
      nextRun: calculateNextRun(scheduleData.time)
    };
    setSchedules([...schedules, newSchedule]);
  };

  // Update a schedule
  const updateSchedule = (id: string, updates: Partial<Schedule>) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === id
        ? { ...schedule, ...updates }
        : schedule
    ));
  };

  // Delete a schedule
  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  // Toggle schedule enabled/disabled
  const toggleSchedule = (id: string) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === id
        ? { ...schedule, enabled: !schedule.enabled, nextRun: calculateNextRun(schedule.time) }
        : schedule
    ));
  };

  // Function to run a scheduled audit
  const runScheduledAudit = (schedule: Schedule) => {
    if (!schedule.enabled) return;

    console.log(`Running scheduled ${schedule.type}: ${schedule.name}`);

    if (schedule.type === 'keyword_audit') {
      startRun(schedule.groupId, false);
    } else if (schedule.type === 'competitive_analysis' && schedule.analysisId) {
      startRun('all', true, schedule.analysisId);
    }

    updateSchedule(schedule.id, {
      lastRun: new Date().toISOString(),
      nextRun: calculateNextRun(schedule.time)
    });
  };

  // Timer logic for scheduled runs
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      schedules.forEach(schedule => {
        if (schedule.enabled && schedule.time === currentTimeStr) {
          const nextRunTime = new Date(schedule.nextRun);
          if (
            now.getDate() === nextRunTime.getDate() &&
            now.getMonth() === nextRunTime.getMonth() &&
            now.getFullYear() === nextRunTime.getFullYear() &&
            now.getHours() === nextRunTime.getHours() &&
            now.getMinutes() === nextRunTime.getMinutes()
          ) {
            runScheduledAudit(schedule);
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [schedules]);

  // Actions
  const addKeyword = (text: string, groupId: string) => {
    const newK: Keyword = { id: Date.now().toString(), text, groupId };
    setKeywords([...keywords, newK]);
  };

  const removeKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
  };

  const addGroup = (name: string) => {
    const newG: Group = { id: Date.now().toString(), name };
    setGroups([...groups, newG]);
  };

  const toggleLLM = (id: string) => {
    setLlms(llms.map(l => l.id === id ? { ...l, enabled: !l.enabled } : l));
  };

  const setApiKey = (id: string, key: string) => {
    setLlms(llms.map(l => l.id === id ? { ...l, apiKey: key } : l));
  };

  const startRun = async (groupId: string | 'all', includeCompetitors: boolean = false, analysisId?: string) => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);

    const activeLLMs = llms.filter(l => l.enabled);
    const targetKeywords = groupId === 'all'
      ? keywords
      : keywords.filter(k => k.groupId === groupId);

    const targetAnalysis = analysisId ? analyses.find(a => a.id === analysisId) : null;
    const targetCompetitors = targetAnalysis
      ? competitors.filter(c => targetAnalysis.competitors.includes(c.id))
      : [];

    const keywordOps = targetKeywords.length * activeLLMs.length;
    const competitorOps = includeCompetitors && targetCompetitors.length > 0
      ? targetCompetitors.length * activeLLMs.length
      : 0;
    const totalOps = keywordOps + competitorOps;
    let completedOps = 0;

    const runTimestamp = new Date().toISOString();

    // Keyword results placeholders
    if (targetKeywords.length > 0) {
      const newResults: RunResult[] = targetKeywords.flatMap(k =>
        activeLLMs.map(l => ({
          id: Math.random().toString(),
          keywordId: k.id,
          modelId: l.id,
          timestamp: runTimestamp,
          status: 'searching' as const,
          found: false,
          score: 0
        }))
      );
      setResults(prev => [...prev, ...newResults]);
    }

    // Competitor results placeholders
    if (includeCompetitors && targetCompetitors.length > 0 && analysisId) {
      const newCompResults: CompetitorRunResult[] = targetCompetitors.flatMap(c =>
        activeLLMs.map(l => ({
          id: Math.random().toString(),
          analysisId: analysisId,
          competitorId: c.id,
          modelId: l.id,
          timestamp: runTimestamp,
          status: 'searching' as const,
          mentionCount: 0,
          sentiment: 'neutral' as const,
          score: 0
        }))
      );
      setCompetitorResults(prev => [...prev, ...newCompResults]);
    }

    // Process Keywords
    for (const k of targetKeywords) {
      for (const l of activeLLMs) {
        await new Promise(r => setTimeout(r, Math.random() * 400 + 100));

        const resData = generateMockResult(k.text, l.id);

        setResults(prev => prev.map(r => {
          if (r.keywordId === k.id && r.modelId === l.id && r.timestamp === runTimestamp) {
            return {
              ...r,
              status: 'complete',
              found: resData.found || false,
              rank: resData.rank,
              score: resData.score || 0,
              snippet: resData.snippet,
              fullResponse: resData.fullResponse
            };
          }
          return r;
        }));

        completedOps++;
        setProgress((completedOps / totalOps) * 100);
      }
    }

    // Process Competitors
    if (includeCompetitors && targetCompetitors.length > 0 && analysisId) {
      for (const c of targetCompetitors) {
        for (const l of activeLLMs) {
          await new Promise(r => setTimeout(r, Math.random() * 400 + 100));

          const resData = generateMockCompetitorResult(c.name, l.id);

          setCompetitorResults(prev => prev.map(r => {
            if (r.competitorId === c.id && r.modelId === l.id && r.timestamp === runTimestamp && r.analysisId === analysisId) {
              return {
                ...r,
                status: 'complete',
                mentionCount: resData.mentionCount || 0,
                sentiment: resData.sentiment || 'neutral',
                score: resData.score || 0,
                snippet: resData.snippet,
                fullResponse: resData.fullResponse
              };
            }
            return r;
          }));

          completedOps++;
          setProgress((completedOps / totalOps) * 100);
        }
      }

      setAnalyses(prev => prev.map(a =>
        a.id === analysisId ? { ...a, lastRun: runTimestamp } : a
      ));
    }

    setIsRunning(false);
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 text-black font-sans selection:bg-black selection:text-white">
      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        groups={groups}
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-neutral-200 px-8 py-4 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="uppercase font-bold text-xs tracking-wider">Rank.ai</span>
            <ChevronRight size={14} />
            <span className="text-black font-bold capitalize">{currentView}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold bg-neutral-100 px-3 py-1.5 rounded-full text-neutral-600">
              <RefreshCw size={12} /> Auto-Save On
            </div>
            <div className="h-4 w-px bg-neutral-200"></div>
            <button className="text-sm font-bold hover:text-neutral-600 transition-colors">Help</button>
          </div>
        </header>

        <main className="flex-1 p-8 w-full">
          {currentView === 'runs' && (
            <ActiveRuns
              keywords={keywords}
              groups={groups}
              llms={llms}
              isRunning={isRunning}
              startRun={startRun}
              results={results}
              competitorResults={competitorResults}
              competitors={competitors}
              analyses={analyses}
              progress={progress}
            />
          )}
          {currentView === 'keywords' && (
            <KeywordsGroups
              keywords={keywords}
              groups={groups}
              addKeyword={addKeyword}
              removeKeyword={removeKeyword}
              addGroup={addGroup}
            />
          )}
          {currentView === 'settings' && (
            <Settings llms={llms} toggleLLM={toggleLLM} setApiKey={setApiKey} />
          )}
          {currentView === 'reports' && (
            <Reports />
          )}
          {currentView === 'schedules' && (
            <ScheduledRuns
              schedules={schedules}
              groups={groups}
              analyses={analyses}
              addSchedule={addSchedule}
              deleteSchedule={deleteSchedule}
              toggleSchedule={toggleSchedule}
              runNow={runScheduledAudit}
            />
          )}
          {currentView === 'competitors' && (
            <CompetitiveAnalysis
              competitors={competitors}
              analyses={analyses}
              addCompetitor={addCompetitor}
              deleteCompetitor={deleteCompetitor}
              addAnalysis={addAnalysis}
              runAnalysis={runAnalysis}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default LLMSeoAgent;
