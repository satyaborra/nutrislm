import React, { useEffect, useState } from 'react';
import { Activity, Flame, Droplets, Target, Plus, Minus, BookOpenText } from 'lucide-react';
import HealthStats from '../components/HealthStats';
import DashboardCard from '../components/DashboardCard';
import NutritionChart from '../components/NutritionChart';
import SafetyAlerts from '../components/SafetyAlerts';
import { getHealthSummary } from '../services/healthService';
import { useHealth } from '../contexts/HealthContext';
import { useEvidence } from '../contexts/EvidenceContext';
import DailyHabits from '../components/DailyHabits';

const Dashboard: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [healthData, setHealthData] = useState<any>(null);
  const { healthData: globalHealth } = useHealth();
  const { latestEvidence } = useEvidence();
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [waterGlasses, setWaterGlasses] = useState(3);
  const waterGoal = 8; // 8 glasses

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:8000/api/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.removeItem("user"); // Clear stale cache
      }
    } catch (e) {
      console.warn("Failed to fetch user profile", e);
    }
  };

  useEffect(() => {
    getHealthSummary().then(setHealthData);
    fetchUserProfile();
  }, []);

  const addWater = () => setWaterGlasses(prev => Math.min(waterGoal, prev + 1));
  const removeWater = () => setWaterGlasses(prev => Math.max(0, prev - 1));

  if (!healthData) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  const safetyWarnings = [
    "Sodium intake is currently 2400mg, which exceeds the daily recommended limit of 2300mg. Try to reduce salty snacks today.",
    "Your sugar intake has reached 90% of your daily limit already."
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back, {user?.name || 'User'}</h1>
          <p className="text-gray-500 mt-1">Here is your health overview for today.</p>
        </div>
        <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-200 transition-colors">
          Download Report
        </button>
      </div>

      <SafetyAlerts warnings={safetyWarnings} type="warning" />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <HealthStats title="Calories Burned" value="1,240" unit="kcal" icon={Flame} color="amber" trend="+12% vs yesterday" />
        <HealthStats title="Current Weight" value={globalHealth?.weight || healthData.weight} unit="kg" icon={Target} color="indigo" trend="-1.2kg this month" />
        <HealthStats title="BMI" value={globalHealth?.weight && globalHealth?.height ? (globalHealth.weight / Math.pow(globalHealth.height/100, 2)).toFixed(1) : healthData.bmi} icon={Activity} color="emerald" trend="Normal Range" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Calories Trend (This Week)">
            <NutritionChart type="line" />
          </DashboardCard>
          
          <DashboardCard title="Weekly Protein Intake">
            <NutritionChart type="bar" />
          </DashboardCard>
        </div>
        
        <div className="space-y-6">
          <DailyHabits />
          <DashboardCard title="Today's Macronutrients">
            <NutritionChart type="pie" data={{ protein: 80, carbs: 120, fat: 45 }} />
            <div className="flex justify-between text-sm text-gray-600 mt-6 px-2">
              <div className="text-center">
                <p className="font-semibold text-emerald-600 text-lg">80g</p>
                <p>Protein</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-blue-500 text-lg">120g</p>
                <p>Carbs</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-amber-500 text-lg">45g</p>
                <p>Fat</p>
              </div>
            </div>
            
            {/* Added Micronutrients Breakdown */}
            <div className="mt-6 pt-5 border-t border-gray-100">
               <h4 className="text-sm font-semibold text-gray-800 mb-4">Micronutrients & Safety Limits</h4>
               <div className="flex justify-between items-center mb-2">
                 <span className="text-gray-500 text-sm font-medium">Sugar</span>
                 <span className="font-bold text-amber-600 text-sm">45g / 50g</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '90%' }}></div>
               </div>
               
               <div className="flex justify-between items-center mb-2 mt-2">
                 <span className="text-gray-500 text-sm font-medium">Sodium</span>
                 <span className="font-bold text-rose-600 text-sm">2400mg / 2300mg</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: '100%' }}></div>
               </div>
            </div>
          </DashboardCard>

          <DashboardCard title="RAG Evidence Hub">
            <div className="space-y-4">
              {latestEvidence.length === 0 ? (
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <BookOpenText className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">No recent evidence.</p>
                  <p className="text-xs text-gray-400 mt-1">Chat with the AI Assistant to see live RAG citations here.</p>
                </div>
              ) : (
                latestEvidence.map((evidence, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${evidence.evidenceType === 'guideline' ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BookOpenText className={`h-4 w-4 ${evidence.evidenceType === 'guideline' ? 'text-emerald-600' : 'text-blue-600'}`} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${evidence.evidenceType === 'guideline' ? 'text-emerald-800' : 'text-blue-800'}`}>
                          {evidence.evidenceType}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full text-gray-600">
                        Rel: {(evidence.relevanceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className={`text-sm font-bold mb-1 ${evidence.evidenceType === 'guideline' ? 'text-emerald-900' : 'text-blue-900'}`}>
                      {evidence.source}
                    </p>
                    <p className={`text-xs font-medium leading-relaxed ${evidence.evidenceType === 'guideline' ? 'text-emerald-700/90' : 'text-blue-700/90'}`}>
                      {evidence.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
