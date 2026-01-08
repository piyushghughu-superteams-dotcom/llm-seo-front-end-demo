import React, { useState } from 'react';
import {
  Key,
  Share2,
  Globe,
  FileText,
  Mail,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import type { LLMConfig } from './lmsSeoService';

interface SettingsProps {
  llms: LLMConfig[];
  toggleLLM: (id: string) => void;
  setApiKey: (id: string, key: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ llms, toggleLLM, setApiKey }) => {
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
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'api-keys'
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
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'integrations'
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

export default Settings;
