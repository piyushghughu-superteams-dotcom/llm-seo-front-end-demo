import React, { useState } from 'react';
import {
  Plus,
  Folder,
  Trash2
} from 'lucide-react';
import type { Keyword, Group } from './types';

interface KeywordsGroupsProps {
  keywords: Keyword[];
  groups: Group[];
  addKeyword: (text: string, groupId: string) => void;
  removeKeyword: (id: string) => void;
  addGroup: (name: string) => void;
}

const KeywordsGroups: React.FC<KeywordsGroupsProps> = ({
  keywords,
  groups,
  addKeyword,
  removeKeyword,
  addGroup
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

export default KeywordsGroups;
