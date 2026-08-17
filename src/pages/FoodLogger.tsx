import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import FoodSearchBar from '../components/FoodSearchBar';
import MealCategoryTabs from '../components/MealCategoryTabs';
import type { MealCategory } from '../components/MealCategoryTabs';
import VoiceInputButton from '../components/VoiceInputButton';
import ImageUpload from '../components/ImageUpload';
import NutritionResultCard from '../components/NutritionResultCard';
import DailyNutritionSummary from '../components/DailyNutritionSummary';
import RecentMealsList from '../components/RecentMealsList';
import type { MealLog, NutritionReport } from '../types/nutrition';
import { analyzeMeal } from '../services/nutritionService';
import { useAI } from '../contexts/AIContext';
import { processingRouter } from '../services/ai/ProcessingRouter';

const FoodLogger: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MealCategory>('Breakfast');
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [latestReport, setLatestReport] = useState<NutritionReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [naturalInput, setNaturalInput] = useState('');

  const targetCalories = 2000;

  const { processingMode, capabilityState } = useAI();

  const handleAnalyze = async (text: string, file?: File) => {
    if (!text.trim() && !file) return;
    setIsAnalyzing(true);
    setLatestReport(null);
    try {
      const response = await processingRouter.process(
        { text, imageFile: file },
        processingMode,
        capabilityState
      );
      
      if (response) {
        setLatestReport(response);
        
        const newLog: MealLog = {
          id: Date.now().toString(),
          query: file ? `Image: ${file.name}` : text,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          category: activeTab,
          report: response
        };
        setLogs([newLog, ...logs]);
        setNaturalInput('');
      }
    } catch (error: any) {
      if (error.message === 'OFFLINE_MODEL_UNAVAILABLE') {
        alert("Offline models are not installed. Please switch to 'Online' or 'Auto' mode in the navigation bar to log food.");
      } else {
        alert("Failed to analyze food. Please try again.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickAdd = (food: string) => {
    handleAnalyze(`1 serving of ${food}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end border-b border-gray-100 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Smart Food Logger</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Log meals using AI, voice, image recognition, or natural language.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Logging Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in-up">
            <h3 className="text-gray-900 font-bold mb-4 text-lg">Log by Searching</h3>
            <FoodSearchBar onSearch={handleAnalyze} />
            
            <div className="mt-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Add</p>
              <div className="flex flex-wrap gap-2.5">
                {['Eggs', 'Milk', 'Rice', 'Chicken', 'Banana', 'Oats'].map(food => (
                  <button 
                    key={food} 
                    onClick={() => handleQuickAdd(food)}
                    className="px-3.5 py-1.5 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg text-sm font-bold transition-all shadow-sm"
                  >
                    + {food}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 md:p-8 rounded-2xl shadow-lg ring-1 ring-black/5 animate-fade-in-up delay-100">
            <h3 className="text-white font-bold mb-5 flex items-center gap-2 text-lg"><Sparkles className="h-5 w-5 text-emerald-200" /> AI Natural Logger</h3>
            <MealCategoryTabs active={activeTab} onChange={setActiveTab} />
            
            <div className="mt-6 relative flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <input 
                  type="text" 
                  value={naturalInput}
                  onChange={e => setNaturalInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnalyze(naturalInput)}
                  placeholder={`Describe your ${activeTab.toLowerCase()}... e.g., "2 eggs and toast"`}
                  className="w-full pl-5 pr-14 py-4 rounded-xl text-gray-900 font-medium focus:ring-4 focus:ring-emerald-400/50 outline-none shadow-inner border-0"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                   <VoiceInputButton onResult={handleAnalyze} />
                </div>
              </div>
              <button 
                onClick={() => handleAnalyze(naturalInput)}
                disabled={isAnalyzing || !naturalInput.trim()}
                className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 shrink-0 shadow-md flex justify-center items-center"
              >
                {isAnalyzing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Log"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-up delay-200">
            <ImageUpload onImageSelect={(f) => handleAnalyze('', f)} />
            <div className={`transition-all duration-500 ${latestReport ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden sm:block'}`}>
               <NutritionResultCard report={latestReport} />
            </div>
          </div>
          
          {/* Mobile only result card to keep flow logical */}
          <div className="sm:hidden block">
             <NutritionResultCard report={latestReport} />
          </div>

        </div>

        {/* Right Column: Summaries and History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="animate-fade-in-up delay-[300ms]">
             <DailyNutritionSummary logs={logs} targetCalories={targetCalories} />
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 animate-fade-in-up delay-[400ms]">
            <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
              <h3 className="text-gray-900 font-bold text-lg">Recent Meals</h3>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md">{logs.length} logged</span>
            </div>
            
            <RecentMealsList logs={logs} onDelete={(id) => setLogs(logs.filter(l => l.id !== id))} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default FoodLogger;
