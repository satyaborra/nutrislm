import React from 'react';
import { CheckCircle2, AlertTriangle, Info, ShieldAlert, Activity } from 'lucide-react';
import type { NutritionReport } from '../types/nutrition';
import { useHealth } from '../contexts/HealthContext';
import { diseaseConfigurations } from '../utils/diseaseConfig';
import type { HealthConditionType } from '../types/user';

interface Props {
  report: NutritionReport | null;
}

const NutritionResultCard: React.FC<Props> = ({ report }) => {
  const { healthData } = useHealth();
  const conditionId = (healthData?.healthCondition as HealthConditionType) || 'general';
  const config = diseaseConfigurations[conditionId] || diseaseConfigurations['general'];
  
  if (!report) return null;

  const hasAlert = report.suggestion && (report.suggestion.toLowerCase().includes('protein') || report.suggestion.toLowerCase().includes('fiber') || report.suggestion.toLowerCase().includes('missing'));

  // Calculate mock clinical impact
  let clinicalImpacts: Array<{ nutrient: string; status: 'High' | 'Moderate' | 'Low' | 'Good'; color: string }> = [];
  let overallImpact: 'High' | 'Moderate' | 'Low' | 'Good' = 'Good';
  let overallColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  
  if (conditionId === 'diabetes') {
    clinicalImpacts = [
      { nutrient: 'Carbohydrates', status: report.carbs > 50 ? 'High' : 'Moderate', color: report.carbs > 50 ? 'text-rose-500' : 'text-amber-500' },
      { nutrient: 'Glycemic Load', status: 'Moderate', color: 'text-amber-500' },
      { nutrient: 'Fiber', status: (report.fiber || 0) > 5 ? 'Good' : 'Low', color: (report.fiber || 0) > 5 ? 'text-emerald-500' : 'text-rose-500' },
      { nutrient: 'Added Sugar', status: 'Low', color: 'text-emerald-500' }
    ];
    if (report.carbs > 50) { overallImpact = 'High'; overallColor = 'text-rose-700 bg-rose-50 border-rose-200'; }
    else { overallImpact = 'Moderate'; overallColor = 'text-amber-700 bg-amber-50 border-amber-200'; }
  } else if (conditionId === 'ckd') {
    clinicalImpacts = [
      { nutrient: 'Potassium', status: 'High', color: 'text-rose-500' },
      { nutrient: 'Phosphorus', status: 'Moderate', color: 'text-amber-500' },
      { nutrient: 'Sodium', status: 'Low', color: 'text-emerald-500' },
      { nutrient: 'Protein', status: report.protein > 20 ? 'High' : 'Moderate', color: report.protein > 20 ? 'text-rose-500' : 'text-amber-500' }
    ];
    if (report.protein > 20) { overallImpact = 'High'; overallColor = 'text-rose-700 bg-rose-50 border-rose-200'; }
    else { overallImpact = 'Moderate'; overallColor = 'text-amber-700 bg-amber-50 border-amber-200'; }
  } else if (conditionId === 'cardiovascular') {
    clinicalImpacts = [
      { nutrient: 'Sodium', status: 'Moderate', color: 'text-amber-500' },
      { nutrient: 'Saturated Fat', status: report.fat > 15 ? 'High' : 'Good', color: report.fat > 15 ? 'text-rose-500' : 'text-emerald-500' },
      { nutrient: 'Fiber', status: (report.fiber || 0) > 5 ? 'Good' : 'Low', color: (report.fiber || 0) > 5 ? 'text-emerald-500' : 'text-rose-500' },
      { nutrient: 'Omega-3', status: 'Good', color: 'text-emerald-500' }
    ];
    if (report.fat > 15) { overallImpact = 'High'; overallColor = 'text-rose-700 bg-rose-50 border-rose-200'; }
    else { overallImpact = 'Moderate'; overallColor = 'text-amber-700 bg-amber-50 border-amber-200'; }
  }

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in-up mt-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> AI Analysis Complete
          </h4>
        </div>
        <div className="text-right shrink-0 ml-4">
          <p className="text-4xl font-extrabold text-emerald-600 tracking-tight leading-none">{report.calories}</p>
          <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Kcal</p>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 sm:gap-4 bg-gray-50 p-2 sm:p-3 rounded-xl mb-6">
        <div className="text-center p-2 sm:py-3 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="font-extrabold text-gray-900 text-sm sm:text-base">{report.protein}g</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Protein</p>
        </div>
        <div className="text-center p-2 sm:py-3 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="font-extrabold text-gray-900 text-sm sm:text-base">{report.carbs}g</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Carbs</p>
        </div>
        <div className="text-center p-2 sm:py-3 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="font-extrabold text-gray-900 text-sm sm:text-base">{report.fat}g</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Fat</p>
        </div>
        <div className="text-center p-2 sm:py-3 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="font-extrabold text-gray-900 text-sm sm:text-base">{report.fiber || 0}g</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Fiber</p>
        </div>
      </div>

      {conditionId !== 'general' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><Activity className="w-3.5 h-3.5"/> Structured Clinical Impact</span>
            <div className="h-px bg-gray-200 flex-1 ml-3"></div>
          </div>
          
          <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-2 border-b border-gray-200 bg-gray-100/50">
              <span>{config.displayName} Nutrient</span>
              <span className="text-right">Impact Level</span>
            </div>
            
            <div className="divide-y divide-gray-100">
              {clinicalImpacts.map((impact, idx) => (
                <div key={idx} className="grid grid-cols-2 px-4 py-2.5 items-center bg-white hover:bg-gray-50/50 transition-colors">
                  <span className="text-sm font-semibold text-gray-700">{impact.nutrient}</span>
                  <span className={`text-xs font-bold text-right ${impact.color}`}>{impact.status}</span>
                </div>
              ))}
            </div>
            
            <div className={`px-4 py-3 flex justify-between items-center border-t border-gray-200 ${overallColor}`}>
              <span className="text-sm font-bold">Overall Clinical Impact</span>
              <span className="text-sm font-black uppercase tracking-wide">{overallImpact}</span>
            </div>
          </div>
        </div>
      )}

      {report.suggestion && (
        <div className={`p-4 md:p-5 flex gap-3 items-start rounded-xl ${hasAlert ? 'bg-amber-50 text-amber-900 border border-amber-200/60' : 'bg-blue-50 text-blue-900 border border-blue-200/60'}`}>
          {hasAlert ? <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" /> : <Info className="w-5 h-5 shrink-0 mt-0.5" />}
          <div>
            <p className="text-sm font-bold mb-1">Smart AI Suggestion</p>
            <p className={`text-sm font-medium leading-relaxed ${hasAlert ? 'text-amber-800' : 'text-blue-800'}`}>{report.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionResultCard;
