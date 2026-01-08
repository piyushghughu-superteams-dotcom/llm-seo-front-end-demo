import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Bot, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Zap, 
  BarChart3, 
  ArrowRight,
  Loader2,
  Globe,
  Share2,
  TrendingUp,
  BrainCircuit,
  Command,
  Terminal,
  LayoutDashboard,
  FileText,
  Settings,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Trash2,
  Play,
  Key,
  Mail,
  Calendar,
  Eye,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Folder,
  FolderPlus,
  Clock,
  X,
  ChevronDown,
  Filter
} from 'lucide-react';

// --- Types ---
type ViewState = 'runs' | 'keywords' | 'settings' | 'reports' | 'schedules';

interface LLMConfig {
  id: string;
  name: string;
  model: string;
  enabled: boolean;
  apiKey: string;
  icon: React.ReactNode;
}

interface Group {
  id: string;
  name: string;
}

interface Keyword {
  id: string;
  text: string;
  groupId: string;
}

interface RunResult {
  id: string;
  keywordId: string;
  modelId: string;
  timestamp: string; // ISO Date string
  status: 'idle' | 'searching' | 'complete' | 'error';
  found: boolean;
  rank?: number;
  snippet?: string;
  fullResponse?: string;
  score: number;
}

interface Schedule {
  id: string;
  name: string;
  groupId: string | 'all'; // 'all' means run all groups
  time: string; // HH:MM format
  enabled: boolean;
  lastRun?: string; // ISO Date string
  nextRun: string; // ISO Date string
}

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

// Helper to format date YYYY-MM-DD
const formatDateKey = (date: Date) => date.toISOString().split('T')[0];

const generateMockResult = (keyword: string, modelId: string): Partial<RunResult> => {
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

// --- Components ---

const Sidebar = ({ 
  currentView, 
  setView, 
  keywords,
  groups
}: { 
  currentView: ViewState, 
  setView: (v: ViewState) => void,
  keywords: Keyword[],
  groups: Group[]
}) => (
  <div className="w-64 border-r border-neutral-200 bg-neutral-50 hidden lg:flex flex-col h-screen sticky top-0">
    <div className="p-6 border-b border-neutral-200 bg-white">
      <div className="flex items-center gap-2.5">
        <div className="bg-black p-1.5 rounded text-white">
          <BrainCircuit size={20} />
        </div>
        <span className="font-bold tracking-tight text-lg">RANK.AI</span>
      </div>
    </div>
    
    <div className="flex-1 overflow-y-auto">
      <nav className="p-4 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Workspace</div>
        <button
          onClick={() => setView('runs')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'runs' ? 'bg-white border border-neutral-200 text-black shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'}`}
        >
          <Play size={18} />
          <span className="text-sm font-medium">Active Runs</span>
        </button>
        <button
          onClick={() => setView('keywords')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'keywords' ? 'bg-white border border-neutral-200 text-black shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'}`}
        >
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">Keywords & Groups</span>
        </button>
        <button
          onClick={() => setView('schedules')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'schedules' ? 'bg-white border border-neutral-200 text-black shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'}`}
        >
          <Clock size={18} />
          <span className="text-sm font-medium">Scheduled Runs</span>
        </button>
        <button
          onClick={() => setView('reports')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'reports' ? 'bg-white border border-neutral-200 text-black shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'}`}
        >
          <FileText size={18} />
          <span className="text-sm font-medium">Reports</span>
        </button>
        <button
          onClick={() => setView('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'settings' ? 'bg-white border border-neutral-200 text-black shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'}`}
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </nav>

      <div className="px-7 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Your Groups</span>
          <span className="text-xs bg-neutral-200 px-1.5 py-0.5 rounded text-neutral-600">{groups.length}</span>
        </div>
        <ul className="space-y-2">
          {groups.map(g => (
            <li key={g.id} className="flex items-center gap-2 text-sm text-neutral-600 group cursor-default py-1">
              <Folder size={14} className="text-neutral-400 group-hover:text-black" />
              <span className="line-clamp-1">{g.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="p-4 border-t border-neutral-200 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold">
          US
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-black">Enterprise</p>
          <p className="text-[10px] text-neutral-500">admin@rank.ai</p>
        </div>
        <MoreHorizontal size={16} className="text-neutral-400" />
      </div>
    </div>
  </div>
);

// --- Detail Modal ---
const ResultModal = ({ result, keyword, modelName, onClose }: { result: RunResult, keyword: string, modelName: string, onClose: () => void }) => (
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

const SettingsView = ({ llms, toggleLLM, setApiKey }: { llms: LLMConfig[], toggleLLM: (id: string) => void, setApiKey: (id: string, key: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'api-keys' | 'integrations'>('api-keys');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-neutral-500">Manage your API keys and integrations.</p>
      </div>

      {/* Subtabs */}
      <div className="flex gap-1 border-b border-neutral-200 mb-8">
        <button
          onClick={() => setActiveTab('api-keys')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'api-keys'
              ? 'text-black'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Key size={16} />
            API Keys
          </div>
          {activeTab === 'api-keys' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'integrations'
              ? 'text-black'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Share2 size={16} />
            Integrations
          </div>
          {activeTab === 'integrations' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
      </div>

      {/* API Keys Tab */}
      {activeTab === 'api-keys' && (
        <div className="grid gap-6">
          {llms.map(llm => (
            <div key={llm.id} className={`p-6 rounded-xl border transition-all duration-300 ${llm.enabled ? 'bg-white border-neutral-200 shadow-sm' : 'bg-neutral-50 border-neutral-100 opacity-75'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg ${llm.enabled ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-400'}`}>
                    {llm.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{llm.name}</h3>
                    <p className="text-xs text-neutral-500 font-mono uppercase">Model: {llm.model}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleLLM(llm.id)}
                  className="text-neutral-400 hover:text-black transition-colors"
                >
                  {llm.enabled ? <ToggleRight size={40} className="text-black" /> : <ToggleLeft size={40} />}
                </button>
              </div>

              {llm.enabled && (
                <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-lg border border-neutral-200 focus-within:border-black focus-within:bg-white transition-all">
                  <Key size={16} className="text-neutral-400 ml-2" />
                  <input
                    type="password"
                    placeholder={`Enter ${llm.name} API Key`}
                    value={llm.apiKey}
                    onChange={(e) => setApiKey(llm.id, e.target.value)}
                    className="bg-transparent w-full text-sm outline-none placeholder-neutral-400 py-1"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="grid gap-6">
          {/* Webhooks Section */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-black text-white">
                <Globe size={16} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Webhooks</h3>
                <p className="text-xs text-neutral-500">Send notifications to external services</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-lg border border-neutral-200 focus-within:border-black focus-within:bg-white transition-all">
              <Globe size={16} className="text-neutral-400 ml-2" />
              <input
                type="url"
                placeholder="Enter webhook URL..."
                className="bg-transparent w-full text-sm outline-none placeholder-neutral-400 py-1"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input type="checkbox" className="rounded" />
                On run complete
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input type="checkbox" className="rounded" />
                Daily summary
              </label>
            </div>
          </div>

          {/* Export Settings Section */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-black text-white">
                <FileText size={16} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Export Settings</h3>
                <p className="text-xs text-neutral-500">Configure default export format</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg">PDF</button>
              <button className="px-4 py-2 text-sm font-medium bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors">CSV</button>
              <button className="px-4 py-2 text-sm font-medium bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors">JSON</button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-black text-white">
                <Mail size={16} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Email Notifications</h3>
                <p className="text-xs text-neutral-500">Manage email alerts</p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Daily report emails</span>
                <ToggleRight size={32} className="text-black cursor-pointer" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Alert on rank changes</span>
                <ToggleLeft size={32} className="text-neutral-400 cursor-pointer" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const KeywordsView = ({ 
  keywords, 
  groups,
  addKeyword, 
  removeKeyword,
  addGroup
}: { 
  keywords: Keyword[], 
  groups: Group[],
  addKeyword: (t: string, gId: string) => void, 
  removeKeyword: (id: string) => void,
  addGroup: (n: string) => void
}) => {
  const [newTerm, setNewTerm] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || '');
  const [newGroupName, setNewGroupName] = useState('');

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTerm.trim() && selectedGroupId) {
      addKeyword(newTerm, selectedGroupId);
      setNewTerm('');
    }
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      addGroup(newGroupName);
      setNewGroupName('');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-8 border-b border-neutral-200 pb-6">
        <h2 className="text-2xl font-bold mb-2">Tracking Strategy</h2>
        <p className="text-neutral-500">Organize your keywords into logical groups.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col: Group Management */}
        <div className="md:col-span-1 space-y-6">
           <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
             <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Create Group</h3>
             <form onSubmit={handleAddGroup} className="flex gap-2 mb-6">
               <input 
                 value={newGroupName}
                 onChange={(e) => setNewGroupName(e.target.value)}
                 placeholder="e.g. BFSI"
                 className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-all"
               />
               <button type="submit" className="bg-neutral-100 text-black p-2 rounded-lg hover:bg-neutral-200 transition-colors">
                 <Plus size={18} />
               </button>
             </form>
             
             <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-3">Your Groups</h3>
             <div className="space-y-2">
               {groups.map(g => (
                 <div 
                  key={g.id} 
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${selectedGroupId === g.id ? 'bg-black text-white shadow-md' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600'}`}
                 >
                   <div className="flex items-center gap-3">
                     <Folder size={16} />
                     <span className="font-medium text-sm">{g.name}</span>
                   </div>
                   <span className={`text-xs px-2 py-0.5 rounded-full ${selectedGroupId === g.id ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                     {keywords.filter(k => k.groupId === g.id).length}
                   </span>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Right Col: Keyword Management */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4">
              Add Keywords to <span className="text-black bg-neutral-100 px-2 py-0.5 rounded ml-1">{groups.find(g => g.id === selectedGroupId)?.name}</span>
            </h3>
            <form onSubmit={handleAddKeyword} className="flex gap-3">
              <input 
                type="text" 
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                placeholder="Enter a new keyword phrase..."
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 outline-none focus:border-black focus:bg-white transition-all"
              />
              <button type="submit" className="bg-black text-white px-6 rounded-lg font-bold text-sm hover:bg-neutral-800 transition-colors flex items-center gap-2">
                <Plus size={16} /> Add
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden min-h-[400px]">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <span className="text-xs font-bold text-neutral-500 uppercase">
                Active Keywords ({keywords.filter(k => k.groupId === selectedGroupId).length})
              </span>
            </div>
            <div className="divide-y divide-neutral-100">
              {keywords.filter(k => k.groupId === selectedGroupId).map(k => (
                <div key={k.id} className="px-6 py-4 flex items-center justify-between group hover:bg-neutral-50 transition-colors">
                  <span className="font-medium text-sm">{k.text}</span>
                  <button 
                    onClick={() => removeKeyword(k.id)}
                    className="text-neutral-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {keywords.filter(k => k.groupId === selectedGroupId).length === 0 && (
                <div className="p-12 text-center text-neutral-400 text-sm">
                  This group is empty. Add keywords above.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RunsView = ({ 
  keywords, 
  groups,
  llms, 
  isRunning, 
  results, 
  startRun, 
  progress 
}: { 
  keywords: Keyword[], 
  groups: Group[],
  llms: LLMConfig[], 
  isRunning: boolean, 
  results: RunResult[], 
  startRun: (groupId: string | 'all') => void,
  progress: number 
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(formatDateKey(new Date()));
  const [filterGroupId, setFilterGroupId] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<RunResult | null>(null);

  const activeLLMs = llms.filter(l => l.enabled);

  // Filter Logic: Match Date and Group
  const filteredKeywords = filterGroupId === 'all' 
    ? keywords 
    : keywords.filter(k => k.groupId === filterGroupId);

  const getResult = (kId: string, mId: string) => {
    // Find result matching keyword, model, and date
    return results.find(r => 
      r.keywordId === kId && 
      r.modelId === mId && 
      r.timestamp.startsWith(selectedDate)
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-full flex flex-col">
      
      {/* Filters & Controls */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
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
        </div>

        <button 
          onClick={() => startRun(filterGroupId)}
          disabled={isRunning || filteredKeywords.length === 0}
          className="w-full md:w-auto bg-black text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isRunning ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
          <span>Run Audit {filterGroupId !== 'all' ? `for ${groups.find(g => g.id === filterGroupId)?.name}` : 'All'}</span>
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

      {/* Results Matrix */}
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
                          <span className="text-neutral-300 text-sm">—</span>
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
    transition-all duration-200 ease-out
    border
    hover:shadow-md active:scale-[0.97]
    ${
      res.found
        ? `
          bg-neutral-700
          text-white
          border-neutral-700
          hover:bg-neutral-600
        `
        : `
          bg-gradient-to-b from-neutral-100 to-neutral-200
          text-neutral-600
          border-neutral-300
          hover:from-neutral-200 hover:to-neutral-300
          hover:text-neutral-800
        `
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

      {/* Modal Render */}
      {selectedResult && (
        <ResultModal 
          result={selectedResult} 
          keyword={keywords.find(k => k.id === selectedResult.keywordId)?.text || 'Unknown'}
          modelName={llms.find(l => l.id === selectedResult.modelId)?.name || 'Unknown'}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
};

const ReportsView = () => {
  const reports = [
    { id: 1, date: 'Oct 24, 2025', keywords: 12, avgRank: 3.4, status: 'Sent' },
    { id: 2, date: 'Oct 23, 2025', keywords: 12, avgRank: 3.8, status: 'Sent' },
    { id: 3, date: 'Oct 22, 2025', keywords: 10, avgRank: 4.1, status: 'Draft' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-8 border-b border-neutral-200 pb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold mb-2">Daily Reports</h2>
          <p className="text-neutral-500">Archive of automated SEO audits.</p>
        </div>
        <button className="text-black font-bold text-sm hover:underline flex items-center gap-2">
          <Mail size={16} /> Configure Recipients
        </button>
      </div>

      <div className="grid gap-4">
        {reports.map(r => (
          <div key={r.id} className="bg-white p-6 rounded-xl border border-neutral-200 flex items-center justify-between hover:border-black transition-colors group">
            <div className="flex items-center gap-6">
              <div className="bg-neutral-100 p-3 rounded-lg text-neutral-500 group-hover:text-black group-hover:bg-neutral-200 transition-colors">
                <Calendar size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg">Daily Audit: {r.date}</h4>
                <p className="text-sm text-neutral-500">Checked {r.keywords} keywords • Avg Rank #{r.avgRank}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${r.status === 'Sent' ? 'bg-neutral-100 text-neutral-600' : 'bg-amber-100 text-amber-700'}`}>
                {r.status}
              </span>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors" title="View Report">
                <Eye size={18} className="text-neutral-400 hover:text-black" />
              </button>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors" title="Email Report">
                <Mail size={18} className="text-neutral-400 hover:text-black" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SchedulesView = ({
  schedules,
  groups,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  toggleSchedule
}: {
  schedules: Schedule[];
  groups: Group[];
  addSchedule: (schedule: Omit<Schedule, 'id' | 'nextRun'>) => void;
  updateSchedule: (id: string, schedule: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  toggleSchedule: (id: string) => void;
}) => {
  const [newSchedule, setNewSchedule] = useState<Omit<Schedule, 'id' | 'nextRun'>>({
    name: '',
    groupId: 'all',
    time: '09:00',
    enabled: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSchedule.name.trim()) {
      addSchedule(newSchedule);
      setNewSchedule({
        name: '',
        groupId: 'all',
        time: '09:00',
        enabled: true
      });
    }
  };

  const calculateNextRun = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, set it for tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    return nextRun.toISOString();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-8 border-b border-neutral-200 pb-6">
        <h2 className="text-2xl font-bold mb-2">Scheduled Runs</h2>
        <p className="text-neutral-500">Automate your SEO audits with scheduled runs.</p>
      </div>

      {/* Add New Schedule */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm mb-8">
        <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Create New Schedule</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Name</label>
            <input
              type="text"
              value={newSchedule.name}
              onChange={(e) => setNewSchedule({...newSchedule, name: e.target.value})}
              placeholder="e.g. Daily Morning Audit"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Group</label>
            <select
              value={newSchedule.groupId}
              onChange={(e) => setNewSchedule({...newSchedule, groupId: e.target.value})}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-all"
            >
              <option value="all">All Groups</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Time</label>
            <input
              type="time"
              value={newSchedule.time}
              onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-all"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-black text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-neutral-800 transition-colors"
            >
              Add Schedule
            </button>
          </div>
        </form>
      </div>

      {/* Scheduled Runs List */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <span className="text-xs font-bold text-neutral-500 uppercase">
            Active Schedules ({schedules.length})
          </span>
        </div>

        {schedules.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 text-sm">
            No scheduled runs. Create one above to automate your SEO audits.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {schedules.map(schedule => {
              const group = groups.find(g => g.id === schedule.groupId);
              const nextRunDate = new Date(schedule.nextRun);

              return (
                <div key={schedule.id} className="px-6 py-4 flex items-center justify-between group hover:bg-neutral-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-sm">{schedule.name}</h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                        schedule.enabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${schedule.enabled ? 'bg-green-500' : 'bg-neutral-400'}`} />
                        {schedule.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {schedule.time} daily
                      </span>

                      <span>
                        Group: {schedule.groupId === 'all' ? 'All Groups' : group?.name || 'Unknown'}
                      </span>

                      <span>
                        Next run: {nextRunDate.toLocaleDateString()} at {nextRunDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSchedule(schedule.id)}
                      className={`p-2 rounded-lg ${
                        schedule.enabled
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={schedule.enabled ? 'Disable schedule' : 'Enable schedule'}
                    >
                      {schedule.enabled ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
                    </button>

                    <button
                      onClick={() => deleteSchedule(schedule.id)}
                      className="text-neutral-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                      title="Delete schedule"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('runs');
  const [keywords, setKeywords] = useState<Keyword[]>(DEFAULT_KEYWORDS);
  const [groups, setGroups] = useState<Group[]>(DEFAULT_GROUPS);
  const [llms, setLlms] = useState<LLMConfig[]>(DEFAULT_LLMS);
  const [results, setResults] = useState<RunResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // Initialize with some mock history for the graph/table to show
  React.useEffect(() => {
    // Generate some mock history for today
    const mockHistory: RunResult[] = [];
    const today = new Date().toISOString();

    // Only generate for first 3 keywords to simulate partial run
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
  }, []); // Run once on mount

  // Calculate next run time for a schedule
  const calculateNextRun = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, set it for tomorrow
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

    console.log(`Running scheduled audit: ${schedule.name}`);
    startRun(schedule.groupId);

    // Update the last run time
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
          // Check if it's the same minute as the next scheduled run
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
    }, 60000); // Check every minute

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

  const startRun = async (groupId: string | 'all') => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);

    const activeLLMs = llms.filter(l => l.enabled);
    const targetKeywords = groupId === 'all' 
      ? keywords 
      : keywords.filter(k => k.groupId === groupId);

    const totalOps = targetKeywords.length * activeLLMs.length;
    let completedOps = 0;

    // Create placeholders for the NEW run (with current timestamp)
    const runTimestamp = new Date().toISOString();
    const newRunIds: string[] = [];

    const newResults: RunResult[] = targetKeywords.flatMap(k => 
      activeLLMs.map(l => {
        const id = Math.random().toString();
        newRunIds.push(id);
        return {
          id,
          keywordId: k.id,
          modelId: l.id,
          timestamp: runTimestamp,
          status: 'searching',
          found: false,
          score: 0
        };
      })
    );

    // Merge new placeholders with existing history
    setResults(prev => [...prev, ...newResults]);

    // Simulate Processing
    for (const k of targetKeywords) {
      for (const l of activeLLMs) {
        await new Promise(r => setTimeout(r, Math.random() * 400 + 100)); // Random delay
        
        const resData = generateMockResult(k.text, l.id);
        
        // Update the specific result in history
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

    setIsRunning(false);
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 text-black font-sans selection:bg-black selection:text-white">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        keywords={keywords} 
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
            <RunsView 
              keywords={keywords} 
              groups={groups}
              llms={llms} 
              isRunning={isRunning} 
              startRun={startRun} 
              results={results} 
              progress={progress}
            />
          )}
          {currentView === 'keywords' && (
            <KeywordsView 
              keywords={keywords} 
              groups={groups}
              addKeyword={addKeyword} 
              removeKeyword={removeKeyword}
              addGroup={addGroup}
            />
          )}
          {currentView === 'settings' && (
            <SettingsView llms={llms} toggleLLM={toggleLLM} setApiKey={setApiKey} />
          )}
          {currentView === 'reports' && (
            <ReportsView />
          )}
          {currentView === 'schedules' && (
            <SchedulesView
              schedules={schedules}
              groups={groups}
              addSchedule={addSchedule}
              updateSchedule={updateSchedule}
              deleteSchedule={deleteSchedule}
              toggleSchedule={toggleSchedule}
            />
          )}
        </main>
      </div>
    </div>
  );
}