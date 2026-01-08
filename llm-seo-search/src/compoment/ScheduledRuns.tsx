import React, { useState } from 'react';
import {
  Clock,
  Play,
  ToggleLeft,
  ToggleRight,
  Trash2
} from 'lucide-react';
import type { Schedule, Group, CompetitiveAnalysis } from './lmsSeoService';

interface ScheduledRunsProps {
  schedules: Schedule[];
  groups: Group[];
  analyses: CompetitiveAnalysis[];
  addSchedule: (schedule: Omit<Schedule, 'id' | 'nextRun'>) => void;
  deleteSchedule: (id: string) => void;
  toggleSchedule: (id: string) => void;
  runNow: (schedule: Schedule) => void;
}

const ScheduledRuns: React.FC<ScheduledRunsProps> = ({
  schedules,
  groups,
  analyses,
  addSchedule,
  deleteSchedule,
  toggleSchedule,
  runNow
}) => {
  const [newSchedule, setNewSchedule] = useState<Omit<Schedule, 'id' | 'nextRun'>>({
    name: '',
    type: 'keyword_audit',
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
        type: 'keyword_audit',
        groupId: 'all',
        time: '09:00',
        enabled: true
      });
    }
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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Name</label>
            <input
              type="text"
              value={newSchedule.name}
              onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
              placeholder="e.g. Daily Morning Audit"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Type</label>
            <select
              value={newSchedule.type}
              onChange={(e) => setNewSchedule({ ...newSchedule, type: e.target.value as 'keyword_audit' | 'competitive_analysis' })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-all"
            >
              <option value="keyword_audit">Keyword Audit</option>
              <option value="competitive_analysis">Competitive Analysis</option>
            </select>
          </div>

          {newSchedule.type === 'keyword_audit' ? (
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Group</label>
              <select
                value={newSchedule.groupId}
                onChange={(e) => setNewSchedule({ ...newSchedule, groupId: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-all"
              >
                <option value="all">All Groups</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Analysis</label>
              <select
                value={newSchedule.analysisId || ''}
                onChange={(e) => setNewSchedule({ ...newSchedule, analysisId: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-all"
              >
                {analyses.map(analysis => (
                  <option key={analysis.id} value={analysis.id}>{analysis.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Time</label>
            <input
              type="time"
              value={newSchedule.time}
              onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
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
              const analysis = analyses.find(a => a.id === schedule.analysisId);
              const nextRunDate = new Date(schedule.nextRun);

              return (
                <div key={schedule.id} className="px-6 py-4 flex items-center justify-between group hover:bg-neutral-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-sm">{schedule.name}</h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${schedule.enabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-neutral-100 text-neutral-500'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${schedule.enabled ? 'bg-green-500' : 'bg-neutral-400'}`} />
                        {schedule.enabled ? 'Active' : 'Inactive'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        {schedule.type === 'keyword_audit' ? 'Keyword Audit' : 'Competitive Analysis'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {schedule.time} daily
                      </span>

                      {schedule.type === 'keyword_audit' ? (
                        <span>
                          Group: {schedule.groupId === 'all' ? 'All Groups' : group?.name || 'Unknown'}
                        </span>
                      ) : (
                        <span>
                          Analysis: {analysis?.name || 'Unknown'}
                        </span>
                      )}

                      <span>
                        Next run: {nextRunDate.toLocaleDateString()} at {nextRunDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => runNow(schedule)}
                      className="p-2 rounded-lg text-black hover:bg-neutral-100"
                      title="Run now"
                    >
                      <Play size={16} />
                    </button>

                    <button
                      onClick={() => toggleSchedule(schedule.id)}
                      className={`p-2 rounded-lg ${schedule.enabled
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

export default ScheduledRuns;
