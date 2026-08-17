import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { MealLog } from '../types/nutrition';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  logs: MealLog[];
  targetCalories: number;
}

const DailyNutritionSummary: React.FC<Props> = ({ logs, targetCalories }) => {
  const { isDark } = useTheme();

  const totalCal = logs.reduce((sum, log) => sum + log.report.calories, 0);
  const totalPro = logs.reduce((sum, log) => sum + log.report.protein, 0);
  const totalCarb = logs.reduce((sum, log) => sum + log.report.carbs, 0);
  const totalFat = logs.reduce((sum, log) => sum + log.report.fat, 0);

  const data = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [totalPro, totalCarb, totalFat],
        backgroundColor: ['#6ee7b7', '#93c5fd', '#fcd34d'], // Pastel
        borderWidth: 2,
        borderColor: isDark ? '#1e293b' : '#ffffff',
        hoverOffset: 6,
        cutout: '80%',
      },
    ],
  };

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart: any) => {
      const { width, height, ctx } = chart;
      ctx.restore();
      const fontSize = (height / 80).toFixed(2);
      ctx.font = `900 ${fontSize}em "Inter", sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isDark ? '#f8fafc' : '#111827';
      const text = totalCal.toString(),
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2.2;
      ctx.fillText(text, textX, textY);
      
      const subRatio = (height / 220).toFixed(2);
      ctx.font = `800 ${subRatio}em "Inter", sans-serif`;
      ctx.fillStyle = isDark ? '#94a3b8' : '#9ca3af';
      const subText = `/ ${targetCalories} KCAL`,
            subTextX = Math.round((width - ctx.measureText(subText).width) / 2),
            subTextY = height / 1.7;
      ctx.fillText(subText, subTextX, subTextY);
      ctx.save();
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 10,
        callbacks: {
          label: (context: any) => ` ${context.label}: ${context.raw}g`
        }
      }
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform h-full flex flex-col justify-center">
      <h3 className="text-gray-900 font-bold mb-6 text-lg">Daily Summary</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-40 h-40 shrink-0 transition-transform duration-500 hover:scale-105">
          <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
        </div>
        
        <div className="flex-1 w-full space-y-4">
          <div>
            <div className="flex justify-between text-sm font-bold mb-1.5">
              <span className="text-emerald-500">Protein</span>
              <span className="text-gray-900">{totalPro}g <span className="text-gray-400 font-medium text-xs">/ 120g</span></span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden flex"><div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (totalPro/120)*100)}%` }}></div></div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-bold mb-1.5">
              <span className="text-blue-500">Carbs</span>
              <span className="text-gray-900">{totalCarb}g <span className="text-gray-400 font-medium text-xs">/ 200g</span></span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden flex"><div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (totalCarb/200)*100)}%` }}></div></div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-bold mb-1.5">
              <span className="text-amber-500">Fat</span>
              <span className="text-gray-900">{totalFat}g <span className="text-gray-400 font-medium text-xs">/ 60g</span></span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden flex"><div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (totalFat/60)*100)}%` }}></div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyNutritionSummary;
