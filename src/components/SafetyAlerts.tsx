import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface SafetyAlertsProps {
  warnings: string[];
  type?: 'warning' | 'info';
}

const SafetyAlerts: React.FC<SafetyAlertsProps> = ({ warnings, type = 'warning' }) => {
  if (!warnings || warnings.length === 0) return null;

  const isWarning = type === 'warning';
  
  return (
    <div className={`p-5 rounded-3xl border flex items-start gap-4 mb-6 shadow-sm ${
      isWarning 
        ? 'bg-rose-50 border-rose-100 text-rose-800' 
        : 'bg-indigo-50 border-indigo-100 text-indigo-800'
    }`}>
      <div className={`p-2.5 rounded-xl mt-0.5 ${
        isWarning ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
      }`}>
        {isWarning ? <AlertTriangle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
      </div>
      <div>
        <h4 className="font-bold mb-1 text-lg">
          {isWarning ? 'Safety Alert' : 'Health Insight'}
        </h4>
        <ul className="list-disc pl-5 space-y-1.5 text-sm/relaxed opacity-90 font-medium">
          {warnings.map((warn, idx) => (
            <li key={idx}>{warn}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SafetyAlerts;
