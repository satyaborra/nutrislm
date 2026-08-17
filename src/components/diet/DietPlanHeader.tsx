import React from 'react';
import { Calendar, Target, Activity, CheckSquare, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';
import { useAI } from '../../contexts/AIContext';
import { useHealth } from '../../contexts/HealthContext';

interface DietPlanHeaderProps {
  date: string;
}

const DietPlanHeader: React.FC<DietPlanHeaderProps> = ({ date }) => {
  const { capabilityState } = useAI();
  const { healthData } = useHealth();

  const getConditionName = (condition?: string) => {
    switch (condition) {
      case 'diabetes': return 'Type 2 Diabetes';
      case 'ckd': return 'Chronic Kidney Disease';
      case 'cardiovascular': return 'Cardiovascular Health';
      default: return 'General Nutrition';
    }
  };

  const getAIModeDisplay = () => {
    switch (capabilityState) {
      case 'OFFLINE_READY':
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-medium border border-emerald-100">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>🔒 Offline Processing</span>
          </div>
        );
      case 'OFFLINE_MODEL_MISSING':
        return (
          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs font-medium border border-amber-100">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>⚠️ Offline Preview (Missing Models)</span>
          </div>
        );
      case 'ONLINE_READY':
      default:
        return (
          <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs font-medium border border-blue-100">
            <Cpu className="h-3.5 w-3.5" />
            <span>🌐 Online RAG</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Personalized Diet Plan</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Date</span>
          <span className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Goal</span>
          <span className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
            <Target className="h-4 w-4 text-emerald-500" />
            {healthData?.healthGoal || 'Weight Loss'}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Health Profile</span>
          <span className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-indigo-500" />
            {getConditionName(healthData?.healthCondition)}
          </span>
        </div>

        <div className="flex flex-col gap-1 items-start">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">AI Mode</span>
          {getAIModeDisplay()}
        </div>
      </div>
    </div>
  );
};

export default DietPlanHeader;
