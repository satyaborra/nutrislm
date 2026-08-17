import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Activity, TrendingDown, Heart, 
  Flame, Droplets, Moon, Footprints, Sparkles, Calendar, ChevronRight, Info, BookOpen
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell 
} from 'recharts';
import { useHealth } from '../contexts/HealthContext';
import { diseaseConfigurations, generateClinicalInsight } from '../utils/diseaseConfig';
import type { HealthConditionType } from '../types/user';

// --- MOCK DATA ---
const weightData = [
  { date: 'Week 1', weight: 75.0, goal: 68.0, avg: 74.8 },
  { date: 'Week 2', weight: 74.2, goal: 68.0, avg: 74.2 },
  { date: 'Week 3', weight: 73.8, goal: 68.0, avg: 73.6 },
  { date: 'Week 4', weight: 73.1, goal: 68.0, avg: 73.0 },
  { date: 'Week 5', weight: 72.5, goal: 68.0, avg: 72.4 },
  { date: 'Week 6', weight: 72.0, goal: 68.0, avg: 71.9 },
];

const nutritionData = [
  { name: 'Protein', value: 120, color: '#10b981' }, 
  { name: 'Carbs', value: 200, color: '#3b82f6' }, 
  { name: 'Fat', value: 60, color: '#f59e0b' }, 
];

// --- COMPONENTS ---

const GlassCard = ({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-3xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

const ProgressBar = ({ progress, color, label, value, subtext }: { progress: number; color: string; label?: string; value?: string; subtext?: string }) => {
  const bgColorMap: Record<string, string> = {
    'text-emerald-500': 'bg-emerald-500',
    'text-emerald-400': 'bg-emerald-400',
    'text-blue-500': 'bg-blue-500',
    'text-amber-500': 'bg-amber-500',
    'text-amber-400': 'bg-amber-400',
    'text-indigo-500': 'bg-indigo-500',
    'text-rose-500': 'bg-rose-500',
    'text-purple-500': 'bg-purple-500',
    'text-cyan-500': 'bg-cyan-500',
    'text-red-500': 'bg-red-500',
  };
  const bgColor = bgColorMap[color] || 'bg-emerald-500';

  return (
    <div className="w-full">
      {(label || value) && (
        <div className="flex justify-between items-end mb-2">
          <div className="flex flex-col">
            {label && <span className="text-sm font-semibold text-gray-700">{label}</span>}
            {subtext && <span className="text-[10px] font-bold text-gray-400">{subtext}</span>}
          </div>
          {value && <span className={`text-sm font-bold ${color}`}>{value}</span>}
        </div>
      )}
      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className={`h-full rounded-full ${bgColor} bg-gradient-to-r from-current to-white/20`}
        />
      </div>
    </div>
  );
}

const HealthTracker: React.FC = () => {
  const [range, setRange] = useState<'7D' | '30D'>('30D');
  const { healthData } = useHealth();
  
  const currentWeight = healthData?.weight || 72.0;
  const currentHeight = healthData?.height || 175;
  const currentBmi = currentWeight && currentHeight ? (currentWeight / Math.pow(currentHeight / 100, 2)).toFixed(1) : '22.4';
  const targetWeight = healthData?.target_weight || 68.0;

  const conditionId = (healthData?.healthCondition as HealthConditionType) || 'general';
  const config = diseaseConfigurations[conditionId] || diseaseConfigurations['general'];

  // Universal Stats (Always visible)
  const generalStats = [
    { title: 'Health Score', value: '84', unit: '/100', icon: Heart, iconBg: 'bg-rose-100/50', color: 'text-rose-500', trend: '+8% this week', trendColor: 'text-emerald-500' },
    { title: 'Current BMI', value: currentBmi, unit: 'Normal', icon: Activity, iconBg: 'bg-blue-100/50', color: 'text-blue-500', trend: '-0.4 vs last month', trendColor: 'text-emerald-500' },
    { title: 'Avg Weight', value: currentWeight.toString(), unit: 'kg', icon: Target, iconBg: 'bg-emerald-100/50', color: 'text-emerald-500', trend: '-0.5 kg/week', trendColor: 'text-emerald-500' },
    { title: 'Daily Cal.', value: '1,950', unit: 'kcal', icon: Flame, iconBg: 'bg-amber-100/50', color: 'text-amber-500', trend: 'Optimal Range', trendColor: 'text-blue-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700 tracking-tight">Health Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Your universal health and fitness metrics.</p>
        </div>
        <div className="flex bg-white/60 p-1 rounded-xl shadow-sm border border-gray-100 backdrop-blur-md">
          {(['7D', '30D'] as const).map(r => (
            <button 
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${range === r ? 'bg-white shadow-sm text-emerald-600 border border-gray-100/50' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 1. UNIVERSAL HEALTH SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {generalStats.map((stat, i) => (
          <GlassCard key={i} delay={i * 0.1} className="flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.iconBg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-xs font-bold ${stat.trendColor} bg-white/50 px-2 py-1 rounded-full shadow-sm`}>{stat.trend}</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold mb-1">{stat.title}</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-extrabold text-gray-900">{stat.value}</h3>
                <span className="text-sm font-bold text-gray-400">{stat.unit}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT COLUMN (Charts & Insights) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* DISEASE-SPECIFIC CLINICAL DASHBOARD (Only if not General) */}
          {conditionId !== 'general' && (
            <>
              <div className="pt-6 border-t border-gray-200/60 mt-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-rose-500" />
                  {config.displayName} Clinical Insights
                </h2>
                <p className="text-sm text-gray-500 mt-1">{config.description}</p>
              </div>

              {/* DISEASE METRICS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {config.metrics.slice(0,4).map((metric, i) => {
                   // Calculate mock display value
                   let val = 0;
                   if (conditionId === 'ckd' && config.mockData?.currentValues) val = config.mockData.currentValues[metric.id] || 0;
                   else if (conditionId === 'cardiovascular' && config.mockData?.currentValues) val = config.mockData.currentValues[metric.id] || 0;
                   else if (conditionId === 'diabetes') {
                     const mockVal: Record<string, number> = { bloodGlucose: 112, carbs: 145, addedSugar: 18, fiber: 28, glycemicLoad: 42 };
                     val = mockVal[metric.id] || 0;
                   }
                   
                   const isOptimal = metric.isLowerBetter 
                    ? val <= (metric.target?.value || Infinity) 
                    : val >= (metric.target?.value || 0);

                   return (
                    <GlassCard key={i} delay={0.2 + (i*0.1)} className={`!p-4 border-2 ${isOptimal ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{metric.label}</p>
                      <div className="flex items-end gap-1 mb-2">
                        <h4 className="text-xl font-black text-gray-900">{val}</h4>
                        <span className="text-xs font-bold text-gray-400 mb-0.5">{metric.unit}</span>
                      </div>
                      {metric.target && (
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-gray-400">Target: {metric.isLowerBetter ? '<' : '>'}{metric.target.value}</span>
                          <span className={isOptimal ? 'text-emerald-500' : 'text-rose-500'}>{isOptimal ? 'Optimal' : 'Warning'}</span>
                        </div>
                      )}
                    </GlassCard>
                   );
                })}
              </div>

              {/* RAG-READY AI CLINICAL INSIGHTS */}
              <GlassCard delay={0.4} className="bg-gradient-to-br from-indigo-900 to-slate-900 !border-0 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-5">
                    <Sparkles className="w-5 h-5 text-indigo-300" />
                    <h3 className="font-bold text-lg text-indigo-50 tracking-wide">Explainable AI Clinical Insights</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    
                    {config.metrics.slice(0,2).map((metric, idx) => {
                       // Get simulated value
                       let val = 0;
                       if (conditionId === 'ckd') val = config.mockData?.currentValues?.[metric.id] || 0;
                       else if (conditionId === 'cardiovascular') val = config.mockData?.currentValues?.[metric.id] || 0;
                       else if (conditionId === 'diabetes') val = { bloodGlucose: 112, carbs: 145, addedSugar: 18, fiber: 28 }[metric.id] || 0;
                       
                       // Generate insight from RAG-ready logic
                       const insightData = generateClinicalInsight(conditionId, metric.id, val);
                       
                       if (!insightData) return null;

                       return (
                        <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                              <Activity className="w-3 h-3"/> {metric.label} Impact
                            </p>
                            {insightData.evidence?.supportLevel === 'high' && (
                              <span className="bg-indigo-500/30 text-indigo-200 text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                                <BookOpen className="w-2.5 h-2.5" /> High Confidence
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-sm leading-relaxed mb-3">{insightData.insight}</p>
                          
                          {insightData.evidence && (
                            <div className="bg-black/20 rounded-lg p-2.5">
                              <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1">Evidence Sources</p>
                              <div className="flex flex-wrap gap-1.5">
                                {insightData.evidence.sources.map((src: string, sIdx: number) => (
                                  <span key={sIdx} className="text-[10px] bg-white/5 text-white/70 px-2 py-0.5 rounded border border-white/10">
                                    {src}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                       );
                    })}
                  </div>
                </div>
              </GlassCard>

              {/* DISEASE-SPECIFIC CHART */}
              <GlassCard delay={0.5}>
                {conditionId === 'diabetes' ? (
                  <>
                    <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                      <div>
                        <h3 className="text-gray-900 font-bold text-lg mb-1">Glucose & Meal Correlation</h3>
                        <p className="text-sm font-medium text-emerald-600 flex items-center gap-1"><TrendingDown className="w-4 h-4"/> Glucose response to carbohydrate intake.</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></div><span className="text-xs font-bold text-gray-500">Glucose</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400"></div><span className="text-xs font-bold text-gray-500">Carbs</span></div>
                      </div>
                    </div>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={config.mockData.glucoseTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                          <YAxis yAxisId="left" domain={[70, 200]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                          <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} itemStyle={{ fontWeight: 'bold' }} />
                          <Area yAxisId="left" type="monotone" dataKey="glucose" stroke="#f43f5e" strokeWidth={3} fill="#ffe4e6" activeDot={{ r: 6 }} />
                          <Area yAxisId="right" type="monotone" dataKey="carbs" stroke="#60a5fa" strokeWidth={2} fill="none" activeDot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                      <div>
                        <h3 className="text-gray-900 font-bold text-lg mb-1">{config.displayName} Progress Tracker</h3>
                        <p className="text-sm font-medium text-emerald-600">Visualizing your primary clinical goals.</p>
                      </div>
                    </div>
                    <div className="h-80 w-full flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                       <p className="text-gray-400 font-semibold">Clinical chart for {config.displayName} loads here.</p>
                    </div>
                  </>
                )}
              </GlassCard>
            </>
          )}

          {/* GENERAL WEIGHT CHART (Always visible, moved down if disease selected) */}
          <GlassCard delay={0.5}>
            <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-gray-900 font-bold text-lg mb-1">Weight Analytics</h3>
                <p className="text-sm font-medium text-emerald-600 flex items-center gap-1"><TrendingDown className="w-4 h-4"/> You are losing ~0.5 kg/week consistently.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div><span className="text-xs font-bold text-gray-500">Actual</span></div>
                <div className="flex items-center gap-2"><div className="w-8 h-[2px] bg-rose-400 border border-dashed rounded-full"></div><span className="text-xs font-bold text-gray-500">Target</span></div>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} itemStyle={{ fontWeight: 'bold' }} />
                  <ReferenceLine y={targetWeight} stroke="#fb7185" strokeDasharray="5 5" strokeWidth={2} />
                  <Area type="monotone" dataKey="avg" stroke="#93c5fd" strokeWidth={2} fill="none" opacity={0.5} activeDot={false} />
                  <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#weightGrad)" activeDot={{ r: 6, strokeWidth: 0, fill: '#059669' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN (Goals & Habits) */}
        <div className="space-y-6">
          
          {/* NUTRITION TRACKER (Dynamic by Disease) */}
          <GlassCard delay={0.6}>
            <h3 className="text-gray-900 font-bold text-lg mb-6">{config.displayName} Nutrition Focus</h3>
            <div className="space-y-5">
              {config.metrics.filter(m => ['calories', 'protein', 'carbs', 'fat', 'sodium', 'potassium', 'phosphorus', 'saturatedFat', 'fiber'].includes(m.id)).map((metric, idx) => {
                 let progress = 0;
                 let valueLabel = "";
                 
                 // Handle mock data values
                 let val = 0;
                 if (conditionId === 'ckd' && config.mockData?.currentValues) val = config.mockData.currentValues[metric.id] || 0;
                 else if (conditionId === 'cardiovascular' && config.mockData?.currentValues) val = config.mockData.currentValues[metric.id] || 0;
                 else if (conditionId === 'diabetes') val = { carbs: 145, fiber: 28, addedSugar: 18 }[metric.id] || 0;
                 else val = nutritionData.find(n => n.name.toLowerCase() === metric.id)?.value || 0;

                 progress = metric.target ? (val / metric.target.value) * 100 : 60;
                 valueLabel = metric.target ? `${val} / ${metric.target.value} ${metric.unit}` : `${val} ${metric.unit}`;
                 
                 const displayProgress = progress > 100 ? 100 : progress;
                 const targetInfo = metric.target?.type === 'demo' ? '(Demo Target)' : '';
                 
                 return (
                  <ProgressBar 
                    key={idx} 
                    progress={displayProgress} 
                    color={metric.color} 
                    label={metric.label} 
                    value={valueLabel} 
                    subtext={targetInfo}
                  />
                );
              })}
            </div>
          </GlassCard>

          {/* 5. HABIT TRACKER */}
          <GlassCard delay={0.8}>
            <h3 className="text-gray-900 font-bold text-lg mb-6">Daily Habits</h3>
            <div className="space-y-5">
              <div className="group">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-700 flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-500"/> Water</span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">6/8 Glasses</span>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className={`h-8 flex-1 rounded-sm transition-all duration-300 ${i <= 6 ? 'bg-blue-500 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]' : 'bg-gray-100'}`}></div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-700 flex items-center gap-2"><Footprints className="w-4 h-4 text-emerald-500"/> Steps</span>
                  <span className="text-xs font-bold text-emerald-600">8,240 / 10k</span>
                </div>
                <ProgressBar progress={82} color="text-emerald-500" />
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-700 flex items-center gap-2"><Activity className="w-4 h-4 text-rose-500"/> Workout</span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">3 Day Streak!</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 mt-2">
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                     <div key={i} className="flex flex-col items-center gap-1">
                       <span className="text-[10px] font-bold text-gray-400">{d}</span>
                       <div className={`w-full aspect-square rounded-full transition-all duration-500 flex items-center justify-center ${i < 3 ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)] hover:scale-110' : i === 3 ? 'bg-rose-100 border-2 border-rose-300 border-dashed' : 'bg-gray-100'}`}>
                         {i < 3 && <Flame className="w-3 h-3" />}
                       </div>
                     </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* UNOBTRUSIVE CLINICAL DISCLAIMER */}
          {conditionId !== 'general' && (
            <div className="mt-4 flex gap-3 text-gray-400 px-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed">
                Health Information Disclaimer: Nutrition insights are AI-generated and intended for informational purposes only. They do not replace professional medical or dietary advice. Targets shown are Demo Targets.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default HealthTracker;
