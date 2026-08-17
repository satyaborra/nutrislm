import React, { useState } from 'react';
import { Droplets, Footprints, Activity, Star } from 'lucide-react';

const DailyHabits: React.FC = () => {
  const [water, setWater] = useState(6);
  const waterGoal = 8;
  
  const [steps, setSteps] = useState(8240);
  const stepsGoal = 10000;
  
  const [workoutDays, setWorkoutDays] = useState([true, true, true, false, false, false, false]);
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const currentDayIndex = 3; // Example: Thursday

  const toggleWorkout = (index: number) => {
    const newWorkoutDays = [...workoutDays];
    newWorkoutDays[index] = !newWorkoutDays[index];
    setWorkoutDays(newWorkoutDays);
  };

  const streak = workoutDays.reduce((acc, curr) => curr ? acc + 1 : 0, 0);

  return (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col gap-6">
      <h3 className="text-xl font-bold text-gray-900">Daily Habits</h3>

      {/* Water Section */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <span className="font-bold text-gray-700">Water</span>
          </div>
          <div className="bg-blue-50 px-2.5 py-1 rounded-md">
            <span className="text-sm font-bold text-blue-600">{water}/{waterGoal} Glasses</span>
          </div>
        </div>
        <div className="flex gap-1.5 h-12">
          {Array.from({ length: waterGoal }).map((_, i) => (
            <button
              key={i}
              onClick={() => setWater(i + 1)}
              className={`flex-1 rounded-lg transition-colors ${
                i < water ? 'bg-blue-500' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Steps Section */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Footprints className="h-5 w-5 text-emerald-500" />
            <span className="font-bold text-gray-700">Steps</span>
          </div>
          <span className="text-sm font-bold text-emerald-600">
            {steps.toLocaleString()} / {stepsGoal / 1000}k
          </span>
        </div>
        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden cursor-pointer" 
             onClick={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
               setSteps(Math.round(percent * stepsGoal));
             }}>
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-900 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${(steps / stepsGoal) * 100}%` }}
          />
        </div>
      </div>

      {/* Workout Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-rose-500" />
            <span className="font-bold text-gray-700">Workout</span>
          </div>
          <div className="bg-rose-50 px-2.5 py-1 rounded-md">
            <span className="text-sm font-bold text-rose-600">{streak} Day Streak!</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center px-1">
          {daysOfWeek.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-gray-400">{day}</span>
              <button
                onClick={() => toggleWorkout(i)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  workoutDays[i] 
                    ? 'bg-rose-500 text-white shadow-[0_4px_12px_rgba(244,63,94,0.4)]' 
                    : i === currentDayIndex
                      ? 'bg-rose-50 border-2 border-dashed border-rose-300'
                      : 'bg-gray-100'
                }`}
              >
                {workoutDays[i] && <Star className="h-4 w-4 fill-current" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyHabits;
