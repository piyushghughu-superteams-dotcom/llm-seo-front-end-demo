import React from 'react';
import {
  Bot,
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import type { RunResult, CompetitorRunResult, Competitor, LLMConfig } from './lmsSeoService';

interface ResultModalProps {
  result: RunResult;
  keyword: string;
  modelName: string;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, keyword, modelName, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <div className="p-6 border-b border-neutral-200 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold mb-1">{keyword}</h3>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span className="flex items-center gap-1"><Bot size={14} /> {modelName}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {new Date(result.timestamp).toLocaleString()}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
          <X size={20} className="text-neutral-500" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto bg-neutral-50 flex-1">
        <div className="mb-6">
          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Status</h4>
          <div className="flex items-center gap-4">
            {result.found ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold bg-black text-white">
                <CheckCircle2 size={16} /> Ranked #{result.rank}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold bg-white border border-neutral-200 text-neutral-500">
                <AlertCircle size={16} /> Not Found
              </span>
            )}
            <div className="h-8 w-px bg-neutral-200"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">Visibility Score</span>
              <span className="text-lg font-bold">{result.score}/100</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileText size={14} /> Full AI Response
          </h4>
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-neutral-700">
            {result.fullResponse}
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-neutral-200 bg-white flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg">Close</button>
        <button className="px-4 py-2 text-sm font-bold bg-black text-white rounded-lg hover:bg-neutral-800">Export PDF</button>
      </div>
    </div>
  </div>
);

interface CompetitorResultModalProps {
  result: CompetitorRunResult;
  competitors: Competitor[];
  llms: LLMConfig[];
  onClose: () => void;
}

export const CompetitorResultModal: React.FC<CompetitorResultModalProps> = ({ result, competitors, llms, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <div className="p-6 border-b border-neutral-200 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold mb-1">
            {competitors.find(c => c.id === result.competitorId)?.name || 'Unknown Competitor'}
          </h3>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span className="flex items-center gap-1"><Bot size={14} /> {llms.find(l => l.id === result.modelId)?.name}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {new Date(result.timestamp).toLocaleString()}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
          <X size={20} className="text-neutral-500" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto bg-neutral-50 flex-1">
        <div className="mb-6">
          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Analysis Summary</h4>
          <div className="flex items-center gap-4">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${
              result.sentiment === 'positive' ? 'bg-green-600 text-white' :
              result.sentiment === 'negative' ? 'bg-red-600 text-white' :
              'bg-neutral-500 text-white'
            }`}>
              {result.mentionCount} Mentions - {result.sentiment}
            </span>
            <div className="h-8 w-px bg-neutral-200"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">Visibility Score</span>
              <span className="text-lg font-bold">{result.score}/100</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileText size={14} /> Full AI Response
          </h4>
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-neutral-700">
            {result.fullResponse}
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-neutral-200 bg-white flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg">Close</button>
        <button className="px-4 py-2 text-sm font-bold bg-black text-white rounded-lg hover:bg-neutral-800">Export PDF</button>
      </div>
    </div>
  </div>
);

export default ResultModal;
