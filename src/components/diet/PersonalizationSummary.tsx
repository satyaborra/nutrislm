import React from 'react';
import { Check } from 'lucide-react';
import { useHealth } from '../../contexts/HealthContext';

const PersonalizationSummary: React.FC = () => {
  const { healthData } = useHealth();
  
  if (!healthData) return null;

  const getConditionName = (condition?: string) => {
    switch (condition) {
      case 'diabetes': return 'Type 2 Diabetes';
      case 'ckd': return 'Chronic Kidney Disease';
      case 'cardiovascular': return 'Cardiovascular Disease';
      default: return null;
    }
  };

  const conditionName = getConditionName(healthData.healthCondition);

  return (
    <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100 mb-6">
      <h3 className="text-sm font-bold text-indigo-900 mb-3 uppercase tracking-wider">Personalized For You</h3>
      <div className="flex flex-wrap gap-2 md:gap-4">
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-indigo-50 shadow-sm">
          <Check className="h-4 w-4 text-emerald-500" />
          {healthData.healthGoal} goal
        </div>
        
        {conditionName && (
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-indigo-50 shadow-sm">
            <Check className="h-4 w-4 text-emerald-500" />
            {conditionName}
          </div>
        )}
        
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-indigo-50 shadow-sm">
          <Check className="h-4 w-4 text-emerald-500" />
          Daily calorie target
        </div>
        
        {healthData.healthCondition === 'diabetes' && (
          <>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-indigo-50 shadow-sm">
              <Check className="h-4 w-4 text-emerald-500" />
              Carbohydrate control
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-indigo-50 shadow-sm">
              <Check className="h-4 w-4 text-emerald-500" />
              High-fiber preference
            </div>
          </>
        )}
        
        {healthData.healthCondition === 'ckd' && (
          <>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-indigo-50 shadow-sm">
              <Check className="h-4 w-4 text-emerald-500" />
              Potassium & Phosphorus limits
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-indigo-50 shadow-sm">
              <Check className="h-4 w-4 text-emerald-500" />
              Protein management
            </div>
          </>
        )}
        
        {healthData.healthCondition === 'cardiovascular' && (
          <>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-indigo-50 shadow-sm">
              <Check className="h-4 w-4 text-emerald-500" />
              Sodium reduction
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 border border-indigo-50 shadow-sm">
              <Check className="h-4 w-4 text-emerald-500" />
              Saturated fat limits
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalizationSummary;
