import React, { useState, useEffect } from 'react';
import { LogOut, HeartPulse, Edit2, Activity, Scale, CheckCircle, Cpu } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileForm from '../components/profile/ProfileForm';
import { useAuth } from '../contexts/AuthContext';
import { useHealth } from '../contexts/HealthContext';
import { getProfile, updateProfile } from '../services/user';

const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const { healthData, updateHealthData } = useHealth();
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "No Name",
    email: user?.email || "No Email",
    age: user?.age || 28,
    height: healthData?.height || user?.height || 175,
    weight: healthData?.weight || user?.weight || 72,
    goal: healthData?.goal || user?.healthGoal || "Weight loss",
    gender: user?.gender || "Male",
    activityLevel: user?.activityLevel || "Moderately Active"
  });

  useEffect(() => {
    // Fetch profile on mount
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        // Overwrite defaults with fetched data
        setProfileData(prev => ({ ...prev, ...data }));
        updateUser(data); // sync context
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [updateUser]);

  const handleSave = async (data: any) => {
    try {
      const updated = await updateProfile(data);
      setProfileData(updated);
      updateUser(updated);
      
      // Core: Force global sync
      await updateHealthData({
        weight: data.weight,
        height: data.height,
        goal: data.goal,
        target_weight: data.target_weight || data.weight - 5 // example fallback
      });
      
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const currentHeight = Number(healthData?.height || profileData.height) || 175;
  const currentWeight = Number(healthData?.weight || profileData.weight) || 72;
  const bmi = (currentWeight / Math.pow(currentHeight / 100, 2)).toFixed(1);
  const bmr = profileData.gender === 'Female' 
    ? 10 * currentWeight + 6.25 * currentHeight - 5 * Number(profileData.age || 20) - 161
    : 10 * currentWeight + 6.25 * currentHeight - 5 * Number(profileData.age || 20) + 5;
    
  const activityMultiplier = profileData.activityLevel === 'Sedentary' ? 1.2 :
                             profileData.activityLevel === 'Lightly Active' ? 1.375 :
                             profileData.activityLevel === 'Moderately Active' ? 1.55 :
                             profileData.activityLevel === 'Very Active' ? 1.725 : 1.9;
                             
  const tdee = Math.round(bmr * activityMultiplier);

  let bmiCategory = "Normal";
  let bmiColor = "text-emerald-700 bg-emerald-200 border-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300";
  if (Number(bmi) < 18.5) { bmiCategory = "Underweight"; bmiColor = "text-blue-700 bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300"; }
  else if (Number(bmi) >= 25 && Number(bmi) < 30) { bmiCategory = "Overweight"; bmiColor = "text-yellow-700 bg-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300"; }
  else if (Number(bmi) >= 30) { bmiCategory = "Obese"; bmiColor = "text-red-700 bg-red-200 dark:bg-red-900/40 dark:text-red-300"; }

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto">
        <ProfileForm 
          initialData={profileData as any} 
          onSubmit={handleSave} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and health goals.</p>
        </div>
        {successMsg && (
          <div className="px-4 py-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg flex items-center font-medium text-sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            {successMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <DashboardCard title="Account" className="text-center">
            <div className="flex flex-col items-center py-4">
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={profileData.name} 
                  className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg shadow-emerald-200 dark:shadow-none border-4 border-white dark:border-gray-800" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg shadow-emerald-200 dark:shadow-none">
                  {profileData.name.charAt(0)}
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profileData.name || "No Name"}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{profileData.email || "No Email"}</p>
              
              <div className="mt-8 w-full space-y-2">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 transition-colors text-sm font-medium"
                >
                  <Edit2 className="h-4 w-4" /> Edit Profile
                </button>
                <div className="h-px bg-gray-100 dark:bg-gray-700 my-4"></div>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl transition-colors text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProfileCard 
              title="BMI" 
              value={bmi} 
              subtitle={`Category: ${bmiCategory}`}
              icon={<Scale className="w-6 h-6" />}
              colorClass={bmiColor}
            />
            <ProfileCard 
              title="Daily Calories" 
              value={`${tdee} kcal`} 
              subtitle="To maintain weight"
              icon={<Activity className="w-6 h-6" />}
              colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            />
            <ProfileCard 
              title="Health Goal" 
              value={healthData?.goal || profileData.goal} 
              icon={<HeartPulse className="w-6 h-6" />}
              colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            />
          </div>

          <DashboardCard title="Personal Information">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 p-2">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Age</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{profileData.age} <span className="text-sm font-medium text-gray-500">yrs</span></p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Gender</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{profileData.gender}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Height</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{currentHeight} <span className="text-sm font-medium text-gray-500">cm</span></p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Weight</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{currentWeight} <span className="text-sm font-medium text-gray-500">kg</span></p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Activity Level</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{profileData.activityLevel}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white px-6 py-2.5 rounded-xl transition-all shadow-sm font-medium"
              >
                Edit Details
              </button>
            </div>
          </DashboardCard>
          
          <DashboardCard title="AI Model Manager">
            <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 p-3 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">Privacy Protected</p>
                <p className="text-xs">Edge models process data locally. No image upload is required when models are installed.</p>
              </div>
            </div>
            <div className="space-y-3">

              <ModelList />
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

// Extracted component to handle the model list rendering safely
import { aiModels } from '../utils/modelConfig';
import { Download, HardDrive, Database, Brain } from 'lucide-react';

const ModelList = () => {
  return (
    <>
      {aiModels.map((model) => (
        <div key={model.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
          <div className="flex items-start gap-3 mb-3 sm:mb-0">
            <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-gray-100 dark:border-slate-600">
              {model.type === 'VLM' ? <Brain className="w-5 h-5 text-indigo-500" /> : 
               model.type === 'SLM' ? <Cpu className="w-5 h-5 text-blue-500" /> : 
               <Database className="w-5 h-5 text-emerald-500" />}
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">{model.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{model.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                model.status === 'Installed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                model.status === 'Available' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                'bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-gray-400'
              }`}>
                {model.status}
              </span>
              <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <HardDrive className="w-3 h-3" /> {(model.sizeMB / 1024).toFixed(1)} GB
              </span>
            </div>
            {model.status !== 'Installed' && (
              <div className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                Coming Soon
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default Profile;
