import React, { useState } from 'react';
import {
  Search,
  TrendingUp,
  Calendar,
  Filter,
  ChevronDown,
  Play,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type {
  Keyword,
  Group,
  LLMConfig,
  RunResult,
  CompetitorRunResult,
  Competitor,
  CompetitiveAnalysis
} from './types';
import { ResultModal, CompetitorResultModal } from './ResultModal';

const formatDateKey = (date: Date) => date.toISOString().split('T')[0];

interface ActiveRunsProps {
  keywords: Keyword[];
  groups: Group[];
  llms: LLMConfig[];
  isRunning: boolean;
  results: RunResult[];
  competitorResults: CompetitorRunResult[];
  competitors: Competitor[];
  analyses: CompetitiveAnalysis[];
  startRun: (groupId: string | 'all', includeCompetitors: boolean, analysisId?: string) => void;
  progress: number;
}

const ActiveRuns: React.FC<ActiveRunsProps> = ({
  keywords,
  groups,
  llms,
  isRunning,
  results,
  competitorResults,
  competitors,
  analyses,
  startRun,
  progress
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(formatDateKey(new Date()));
  const [filterGroupId, setFilterGroupId] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<RunResult | null>(null);
  const [selectedCompetitorResult, setSelectedCompetitorResult] = useState<CompetitorRunResult | null>(null);
  const [activeTab, setActiveTab] = useState<'keywords' | 'competitors'>('keywords');
  const [includeCompetitors, setIncludeCompetitors] = useState(false);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('');

  const activeLLMs = llms.filter(l => l.enabled);

  const filteredKeywords = filterGroupId === 'all'
    ? keywords
    : keywords.filter(k => k.groupId === filterGroupId);

  const getResult = (kId: string, mId: string) => {
    return results.find(r =>
      r.keywordId === kId &&
      r.modelId === mId &&
      r.timestamp.startsWith(selectedDate)
    );
  };

  const getCompetitorResult = (analysisId: string, competitorId: string, modelId: string) => {
    return competitorResults.find(r =>
      r.analysisId === analysisId &&
      r.competitorId === competitorId &&
      r.modelId === modelId &&
      r.timestamp.startsWith(selectedDate)
    );
  };

  const selectedAnalysis = analyses.find(a => a.id === selectedAnalysisId);
  const analysisCompetitors = selectedAnalysis
    ? competitors.filter(c => selectedAnalysis.competitors.includes(c.id))
    : [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-full flex flex-col">

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-200 mb-6">
        <button
          onClick={() => setActiveTab('keywords')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'keywords' ? 'text-black' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Search size={16} />
            Keyword Audit
          </div>
          {activeTab === 'keywords' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('competitors')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'competitors' ? 'text-black' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={16} />
            Competitor Analysis
          </div>
          {activeTab === 'competitors' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto flex-wrap">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
              <Calendar size={16} />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium outline-none focus:border-black transition-all cursor-pointer"
            />
          </div>

          <div className="h-8 w-px bg-neutral-200"></div>

          {activeTab === 'keywords' && (
            <div className="relative group min-w-[200px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
                <Filter size={16} />
              </div>
              <select
                value={filterGroupId}
                onChange={(e) => setFilterGroupId(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium outline-none focus:border-black transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Groups</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          )}

          {activeTab === 'competitors' && (
            <div className="relative group min-w-[200px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
                <TrendingUp size={16} />
              </div>
              <select
                value={selectedAnalysisId}
                onChange={(e) => setSelectedAnalysisId(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium outline-none focus:border-black transition-all appearance-none cursor-pointer"
              >
                <option value="">Select Analysis</option>
                {analyses.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          )}

          {activeTab === 'keywords' && analyses.length > 0 && (
            <>
              <div className="h-8 w-px bg-neutral-200"></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCompetitors}
                  onChange={(e) => setIncludeCompetitors(e.target.checked)}
                  className="rounded border-neutral-300"
                />
                <span className="text-sm font-medium text-neutral-600">Include Competitor Analysis</span>
              </label>
              {includeCompetitors && (
                <div className="relative group min-w-[180px]">
                  <select
                    value={selectedAnalysisId}
                    onChange={(e) => setSelectedAnalysisId(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium outline-none focus:border-black transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Analysis</option>
                    {analyses.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => {
            if (activeTab === 'keywords') {
              startRun(filterGroupId, includeCompetitors, includeCompetitors ? selectedAnalysisId : undefined);
            } else {
              startRun('all', true, selectedAnalysisId);
            }
          }}
          disabled={isRunning || (activeTab === 'keywords' ? filteredKeywords.length === 0 : !selectedAnalysisId)}
          className="w-full md:w-auto bg-black text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isRunning ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
          <span>
            {activeTab === 'keywords'
              ? `Run Audit ${filterGroupId !== 'all' ? `for ${groups.find(g => g.id === filterGroupId)?.name}` : 'All'}${includeCompetitors ? ' + Competitors' : ''}`
              : 'Run Competitor Analysis'
            }
          </span>
        </button>
      </div>

      {isRunning && (
        <div className="mb-8 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <div className="flex justify-between text-xs font-bold uppercase text-neutral-500 mb-2">
            <span>Processing Batch...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-black transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Results Matrix - Keywords Tab */}
      {activeTab === 'keywords' && (
        <div className="flex-1 overflow-x-auto bg-white rounded-xl border border-neutral-200 shadow-sm">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase w-1/4 sticky left-0 bg-neutral-50 z-10">Keyword Phrase</th>
                {activeLLMs.map(llm => (
                  <th key={llm.id} className="text-center py-4 px-4 text-xs font-bold text-neutral-500 uppercase border-l border-neutral-200">
                    <div className="flex items-center justify-center gap-2">
                      {llm.icon} {llm.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredKeywords.length === 0 && (
                <tr>
                  <td colSpan={activeLLMs.length + 1} className="py-16 text-center text-neutral-400">
                    No keywords found for this selection.
                  </td>
                </tr>
              )}
              {filteredKeywords.map(k => (
                <tr key={k.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="py-4 px-6 font-medium text-sm sticky left-0 bg-white group-hover:bg-neutral-50/50 border-r border-transparent group-hover:border-neutral-200 transition-colors z-10">
                    <div className="flex flex-col">
                      <span>{k.text}</span>
                      <span className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">{groups.find(g => g.id === k.groupId)?.name}</span>
                    </div>
                  </td>
                  {activeLLMs.map(llm => {
                    const res = getResult(k.id, llm.id);

                    return (
                      <td key={llm.id} className="py-3 px-3 border-l border-neutral-100 text-center align-middle">
                        {!res ? (
                          <div className="flex items-center justify-center h-14">
                            <span className="text-neutral-300 text-sm">-</span>
                          </div>
                        ) : res.status === 'searching' ? (
                          <div className="flex items-center justify-center h-14">
                            <div className="flex flex-col items-center gap-1">
                              <Loader2 className="animate-spin text-neutral-400" size={18} />
                              <span className="text-[10px] text-neutral-400">Analyzing...</span>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedResult(res)}
                            className={`w-full min-h-[56px] rounded-xl flex flex-col items-center justify-center
                              transition-all duration-200 ease-out border hover:shadow-md active:scale-[0.97]
                              ${res.found
                                ? 'bg-neutral-700 text-white border-neutral-700 hover:bg-neutral-600'
                                : 'bg-gradient-to-b from-neutral-100 to-neutral-200 text-neutral-600 border-neutral-300 hover:from-neutral-200 hover:to-neutral-300 hover:text-neutral-800'
                              }`}
                          >
                            {res.found ? (
                              <>
                                <div className="flex items-center gap-1.5">
                                  <CheckCircle2 size={14} />
                                  <span className="text-sm font-bold">#{res.rank}</span>
                                </div>
                                <span className="text-[10px] text-neutral-400 mt-0.5">Score: {res.score}</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle size={14} className="mb-0.5" />
                                <span className="text-[11px] font-medium">Not Found</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Results Matrix - Competitors Tab */}
      {activeTab === 'competitors' && (
        <div className="flex-1 overflow-x-auto bg-white rounded-xl border border-neutral-200 shadow-sm">
          {!selectedAnalysisId ? (
            <div className="p-12 text-center text-neutral-400">
              <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">Select a competitive analysis to view results.</p>
              <p className="text-xs mt-2">Create analyses in the Competitive Analysis section.</p>
            </div>
          ) : analysisCompetitors.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">
              <p className="text-sm">No competitors in this analysis.</p>
            </div>
          ) : (
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left py-4 px-6 text-xs font-bold text-neutral-500 uppercase w-1/4 sticky left-0 bg-neutral-50 z-10">Competitor</th>
                  {activeLLMs.map(llm => (
                    <th key={llm.id} className="text-center py-4 px-4 text-xs font-bold text-neutral-500 uppercase border-l border-neutral-200">
                      <div className="flex items-center justify-center gap-2">
                        {llm.icon} {llm.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {analysisCompetitors.map(comp => (
                  <tr key={comp.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="py-4 px-6 font-medium text-sm sticky left-0 bg-white group-hover:bg-neutral-50/50 border-r border-transparent group-hover:border-neutral-200 transition-colors z-10">
                      <div className="flex flex-col">
                        <span>{comp.name}</span>
                        <span className="text-[10px] text-neutral-400 mt-1">{comp.domain}</span>
                      </div>
                    </td>
                    {activeLLMs.map(llm => {
                      const res = getCompetitorResult(selectedAnalysisId, comp.id, llm.id);

                      return (
                        <td key={llm.id} className="py-3 px-3 border-l border-neutral-100 text-center align-middle">
                          {!res ? (
                            <div className="flex items-center justify-center h-14">
                              <span className="text-neutral-300 text-sm">-</span>
                            </div>
                          ) : res.status === 'searching' ? (
                            <div className="flex items-center justify-center h-14">
                              <div className="flex flex-col items-center gap-1">
                                <Loader2 className="animate-spin text-neutral-400" size={18} />
                                <span className="text-[10px] text-neutral-400">Analyzing...</span>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedCompetitorResult(res)}
                              className={`w-full min-h-[56px] rounded-xl flex flex-col items-center justify-center
                                transition-all duration-200 ease-out border hover:shadow-md active:scale-[0.97]
                                ${res.sentiment === 'positive'
                                  ? 'bg-green-600 text-white border-green-600 hover:bg-green-500'
                                  : res.sentiment === 'negative'
                                  ? 'bg-red-600 text-white border-red-600 hover:bg-red-500'
                                  : 'bg-neutral-500 text-white border-neutral-500 hover:bg-neutral-400'
                                }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold">{res.mentionCount} mentions</span>
                              </div>
                              <span className="text-[10px] opacity-80 mt-0.5 capitalize">{res.sentiment} - Score: {res.score}</span>
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal Render - Keyword Result */}
      {selectedResult && (
        <ResultModal
          result={selectedResult}
          keyword={keywords.find(k => k.id === selectedResult.keywordId)?.text || 'Unknown'}
          modelName={llms.find(l => l.id === selectedResult.modelId)?.name || 'Unknown'}
          onClose={() => setSelectedResult(null)}
        />
      )}

      {/* Modal Render - Competitor Result */}
      {selectedCompetitorResult && (
        <CompetitorResultModal
          result={selectedCompetitorResult}
          competitors={competitors}
          llms={llms}
          onClose={() => setSelectedCompetitorResult(null)}
        />
      )}
    </div>
  );
};

export default ActiveRuns;
