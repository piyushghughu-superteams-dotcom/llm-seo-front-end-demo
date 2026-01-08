import React from 'react';
import {
  Calendar,
  Mail,
  Eye
} from 'lucide-react';

const Reports: React.FC = () => {
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
                <p className="text-sm text-neutral-500">Checked {r.keywords} keywords - Avg Rank #{r.avgRank}</p>
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

export default Reports;
