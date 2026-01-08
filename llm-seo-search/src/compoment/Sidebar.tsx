import React from 'react';
import {
  BrainCircuit,
  Play,
  LayoutDashboard,
  Clock,
  TrendingUp,
  FileText,
  Settings,
  Folder,
  MoreHorizontal
} from 'lucide-react';
import type { ViewState, Group } from './lmsSeoService';

interface SidebarProps {
  currentView: ViewState;
  setView: (v: ViewState) => void;
  groups: Group[];
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, groups }) => (
  <div className="w-64 border-r border-neutral-200 bg-neutral-50 hidden lg:flex flex-col h-screen sticky top-0">
    <div className="p-6 border-b border-neutral-200 bg-white">
      <div className="flex items-center gap-2.5">
        <div className="bg-black p-1.5 rounded text-white">
          <BrainCircuit size={20} />
        </div>
        <span className="font-bold tracking-tight text-lg">SUPERTEAMS.AI</span>
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
          onClick={() => setView('competitors')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'competitors' ? 'bg-white border border-neutral-200 text-black shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'}`}
        >
          <TrendingUp size={18} />
          <span className="text-sm font-medium">Competitive Analysis</span>
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

export default Sidebar;
