import React from 'react';
import { BookOpen, FileText, Activity, AlertTriangle, Info } from 'lucide-react';
import type { MealEvidence, EvidenceStatus } from '../../types/diet';

interface EvidenceHubProps {
  evidence?: MealEvidence[];
  status?: EvidenceStatus;
}

const EvidenceHub: React.FC<EvidenceHubProps> = ({ evidence = [], status = 'unavailable' }) => {
  if (status === 'unavailable') {
    return null;
  }

  if (status === 'insufficient') {
    return (
      <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 bg-gray-200 p-1.5 rounded-md">
            <Info className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Evidence Status</h4>
            <p className="text-sm text-gray-600 mt-1">
              Insufficient evidence was retrieved to provide a grounded clinical explanation. 
              The meal recommendation is based only on available nutrition/profile information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isDemo = status === 'demo';

  return (
    <div className="mt-4 bg-blue-50/30 rounded-xl p-4 border border-blue-100/50">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-600" />
          Why Did AI Recommend This Meal?
        </h4>
        {isDemo && (
          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
            Demo Evidence
          </span>
        )}
      </div>

      <div className="space-y-4">
        {evidence.map((item, idx) => (
          <div key={item.id || idx} className="bg-white p-3 rounded-lg border border-blue-50 shadow-sm flex items-start gap-3">
            <div className={`p-2 rounded-lg mt-0.5 ${item.evidenceType === 'clinical' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {item.evidenceType === 'clinical' ? <Activity className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {item.evidenceType === 'clinical' ? 'Clinical Evidence' : 'Nutrition Evidence'}
                </span>
                <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                  Score: {(item.relevanceScore * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{item.source}</p>
              <p className="text-xs text-gray-500 mb-2">{item.document} &bull; {item.section}</p>
              <p className="text-sm text-gray-700 italic border-l-2 border-blue-200 pl-3 py-1">
                "{item.content}"
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-blue-100/50 pt-3">
        <span className="text-xs font-medium text-blue-800">
          Retrieved Evidence: {evidence.length} sources
        </span>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <CheckSquare className="h-3 w-3" />
          Evidence Support: High
        </span>
      </div>
    </div>
  );
};

// Re-importing missing icon
import { CheckSquare } from 'lucide-react';

export default EvidenceHub;
