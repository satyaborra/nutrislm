import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, RefreshCw, Sparkles, PlusCircle } from 'lucide-react';
import type { Meal } from '../../types/diet';
import EvidenceHub from './EvidenceHub';

interface MealRecommendationCardProps {
  title: string;
  meal: Meal;
  iconBg: string;
  onSwap?: () => void;
  onComplete?: () => void;
  isCompleted?: boolean;
}

const MealRecommendationCard: React.FC<MealRecommendationCardProps> = ({ 
  title, 
  meal, 
  iconBg, 
  onSwap, 
  onComplete,
  isCompleted = false
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`p-5 transition-colors border-b border-gray-100 last:border-b-0 ${isCompleted ? 'bg-gray-50/50 opacity-75' : 'hover:bg-gray-50/50'}`}>
      <div className="flex items-start gap-4 flex-col sm:flex-row">
        {/* Left Icon */}
        <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-lg mt-1`}>
          {title.charAt(0)}
        </div>

        {/* Center Content */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-500 uppercase tracking-wider text-xs">{title}</h4>
            <div className="flex items-center gap-2">
              <button 
                onClick={onSwap}
                className="text-gray-400 hover:text-indigo-600 transition-colors p-1.5 rounded-md hover:bg-indigo-50 flex items-center gap-1 text-xs font-medium"
                title="Swap Meal"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Swap</span>
              </button>
              <button 
                onClick={onComplete}
                className={`transition-colors p-1.5 rounded-full ${isCompleted ? 'text-emerald-500 bg-emerald-50' : 'text-gray-300 hover:text-emerald-500 hover:bg-emerald-50'}`}
                title="Mark as completed"
              >
                <CheckCircle2 className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <h3 className={`text-lg font-bold ${isCompleted ? 'text-gray-700 line-through' : 'text-gray-900'} mb-1`}>{meal.name}</h3>
          <p className="text-sm text-gray-500 mb-3">{meal.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4 text-xs font-medium text-gray-600">
            <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">{meal.calories} kcal</span>
            <span className="bg-gray-100 px-2.5 py-1 rounded-md">Pro: {meal.macros.protein}g</span>
            <span className="bg-gray-100 px-2.5 py-1 rounded-md">Carbs: {meal.macros.carbs}g</span>
            <span className="bg-gray-100 px-2.5 py-1 rounded-md">Fat: {meal.macros.fat}g</span>
          </div>

          {/* Disease Impact Pills */}
          {meal.diseaseImpact && (
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(meal.diseaseImpact).map(([metric, impact]) => (
                <div key={metric} className="flex items-center text-[11px] font-medium border border-gray-200 rounded-md overflow-hidden">
                  <span className="bg-gray-50 px-2 py-1 text-gray-600">{metric}</span>
                  <span className={`px-2 py-1 text-white ${
                    impact === 'Good' || impact === 'Excellent' || impact === 'Low' ? 'bg-emerald-500' :
                    impact === 'Moderate' ? 'bg-amber-500' :
                    'bg-rose-500'
                  }`}>
                    {impact}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Explainability Toggle */}
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mt-2"
          >
            <Sparkles className="h-4 w-4" />
            Why This Meal?
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {/* Expandable Section */}
          {expanded && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              {meal.explanation && meal.explanation.length > 0 && (
                <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 mb-4">
                  <ul className="space-y-2">
                    {meal.explanation.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-indigo-900">
                        <PlusCircle className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <EvidenceHub evidence={meal.evidence} status={meal.evidenceStatus} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealRecommendationCard;
