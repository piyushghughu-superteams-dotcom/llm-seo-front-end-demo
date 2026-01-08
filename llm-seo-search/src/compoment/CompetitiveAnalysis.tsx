import React, { useState } from 'react';
import {
  Trash2,
  Zap
} from 'lucide-react';
import type { Competitor, CompetitiveAnalysis as CompetitiveAnalysisType } from './lmsSeoService';

interface CompetitiveAnalysisProps {
  competitors: Competitor[];
  analyses: CompetitiveAnalysisType[];
  addCompetitor: (competitor: Omit<Competitor, 'id'>) => void;
  deleteCompetitor: (id: string) => void;
  addAnalysis: (analysis: Omit<CompetitiveAnalysisType, 'id' | 'lastRun'>) => void;
  runAnalysis: (analysisId: string) => void;
}

const CompetitiveAnalysis: React.FC<CompetitiveAnalysisProps> = ({
  competitors,
  analyses,
  addCompetitor,
  deleteCompetitor,
  addAnalysis,
  runAnalysis
}) => {
  const [newCompetitor, setNewCompetitor] = useState<Omit<Competitor, 'id'>>({
    name: '',
    domain: '',
    description: ''
  });

  const [newAnalysis, setNewAnalysis] = useState<Omit<CompetitiveAnalysisType, 'id' | 'lastRun'>>({
    name: '',
    mainCompany: '',
    competitors: []
  });

  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompetitor.name.trim() && newCompetitor.domain.trim()) {
      addCompetitor(newCompetitor);
      setNewCompetitor({
        name: '',
        domain: '',
        description: ''
      });
    }
  };

  const handleAddAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnalysis.name.trim() && newAnalysis.mainCompany.trim()) {
      addAnalysis({
        ...newAnalysis,
        competitors: selectedCompetitors
      });
      setNewAnalysis({
        name: '',
        mainCompany: '',
        competitors: []
      });
      setSelectedCompetitors([]);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-8 border-b border-neutral-200 pb-6">
        <h2 className="text-2xl font-bold mb-2">Competitive Analysis</h2>
        <p className="text-neutral-500">Compare your company against competitors using AI-powered insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Add Competitor Card */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Add Competitor</h3>
          <form onSubmit={handleAddCompetitor}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Company Name</label>
                <input
                  type="text"
                  value={newCompetitor.name}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                  placeholder="e.g. OpenAI"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Domain</label>
                <input
                  type="text"
                  value={newCompetitor.domain}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, domain: e.target.value })}
                  placeholder="e.g. openai.com"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Description (Optional)</label>
                <textarea
                  value={newCompetitor.description || ''}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, description: e.target.value })}
                  placeholder="Brief description of the competitor..."
                  rows={2}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-neutral-800 transition-colors"
              >
                Add Competitor
              </button>
            </div>
          </form>

          {/* List of Added Competitors */}
          {competitors.length > 0 && (
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3">Added Competitors ({competitors.length})</h4>
              <div className="space-y-2">
                {competitors.map(comp => (
                  <div key={comp.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <span className="font-medium text-sm">{comp.name}</span>
                      <span className="text-xs text-neutral-500 ml-2">{comp.domain}</span>
                    </div>
                    <button
                      onClick={() => deleteCompetitor(comp.id)}
                      className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create Analysis Card */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Create Competitive Analysis</h3>
          <form onSubmit={handleAddAnalysis}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Analysis Name</label>
                <input
                  type="text"
                  value={newAnalysis.name}
                  onChange={(e) => setNewAnalysis({ ...newAnalysis, name: e.target.value })}
                  placeholder="e.g. Q3 AI Company Comparison"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Main Company</label>
                <input
                  type="text"
                  value={newAnalysis.mainCompany}
                  onChange={(e) => setNewAnalysis({ ...newAnalysis, mainCompany: e.target.value })}
                  placeholder="Your company name"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Select Competitors</label>
                <div className="max-h-32 overflow-y-auto border border-neutral-200 rounded-lg bg-neutral-50 p-2">
                  {competitors.length === 0 ? (
                    <p className="text-xs text-neutral-400 py-2">No competitors added yet</p>
                  ) : (
                    competitors.map(comp => (
                      <label key={comp.id} className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCompetitors.includes(comp.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCompetitors([...selectedCompetitors, comp.id]);
                            } else {
                              setSelectedCompetitors(selectedCompetitors.filter(id => id !== comp.id));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{comp.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Main Question *</label>
                <textarea
                  value={newAnalysis.comparisonQuestion || ''}
                  onChange={(e) => setNewAnalysis({ ...newAnalysis, comparisonQuestion: e.target.value })}
                  placeholder="e.g. Which company provides better AI solutions for enterprise?"
                  rows={2}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-all"
                  required
                />
                <p className="text-xs text-neutral-400 mt-1">The comparison will be based on this question</p>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-neutral-800 transition-colors"
              >
                Create Analysis
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Existing Analyses */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <span className="text-xs font-bold text-neutral-500 uppercase">
            Competitive Analyses ({analyses.length})
          </span>
        </div>

        {analyses.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 text-sm">
            No competitive analyses created yet. Create one above to compare companies.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {analyses.map(analysis => (
              <div key={analysis.id} className="px-6 py-4 flex items-center justify-between group hover:bg-neutral-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-sm">{analysis.name}</h4>
                    {analysis.lastRun && (
                      <span className="text-xs text-neutral-500">
                        Last run: {new Date(analysis.lastRun).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>Main company: {analysis.mainCompany}</span>
                    <span>Competitors: {analysis.competitors.length}</span>
                  </div>

                  {analysis.insights && (
                    <div className="mt-2 text-xs bg-blue-50 p-2 rounded border border-blue-100">
                      <span className="font-bold text-blue-700">AI Insight:</span> {analysis.insights.substring(0, 100)}...
                    </div>
                  )}
                </div>

                <button
                  onClick={() => runAnalysis(analysis.id)}
                  className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center gap-1"
                >
                  <Zap size={12} /> Run Analysis
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitiveAnalysis;
