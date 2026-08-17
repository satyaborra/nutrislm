import React from 'react';
import { Trash2, Edit2, Clock } from 'lucide-react';
import type { MealLog } from '../types/nutrition';

interface Props {
  logs: MealLog[];
  onDelete: (id: string) => void;
}

const RecentMealsList: React.FC<Props> = ({ logs, onDelete }) => {
  if (logs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
        <p className="font-semibold text-sm">No meals logged today. Use the search or natural language input above to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map(log => (
        <div key={log.id} className="bg-white hover:bg-emerald-50/40 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 shadow-sm hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 transform group gap-4 sm:gap-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex flex-col items-center justify-center font-bold border border-emerald-100">
              <span className="text-lg leading-none">{log.report.calories}</span>
              <span className="text-[9px] uppercase tracking-widest leading-none mt-0.5">kcal</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 capitalize leading-tight mb-1.5 line-clamp-2">{log.query}</p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-gray-500">
                <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">{log.category}</span>
                <span className="flex items-center gap-1 text-gray-400"><Clock className="w-3.5 h-3.5" /> {log.time}</span>
                <span className="ml-auto sm:ml-0 border-l sm:border-l-0 pl-3 sm:pl-0 border-gray-200">Pro: {log.report.protein}g</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => onDelete(log.id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentMealsList;
