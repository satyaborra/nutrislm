import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  Filler
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import type { Macros } from '../types/nutrition';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement, Filler
);

interface NutritionChartProps {
  type: 'pie' | 'line' | 'bar';
  data?: Macros;
  title?: string;
}

const NutritionChart: React.FC<NutritionChartProps> = ({ type, data }) => {
  const { isDark } = useTheme();

  if (type === 'pie' && data) {
    const total = data.protein + data.carbs + data.fat;
    const centerTextPlugin = {
      id: 'centerText',
      beforeDraw: (chart: any) => {
        const { width, height, ctx } = chart;
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = `bold ${fontSize}em sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isDark ? '#f8fafc' : '#065f46';
        const text = total + 'g',
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2.2;
        ctx.fillText(text, textX, textY);
        ctx.font = `bold ${(height / 280).toFixed(2)}em sans-serif`;
        ctx.fillStyle = isDark ? '#94a3b8' : '#6b7280';
        const sub = 'TOTAL',
              subX = Math.round((width - ctx.measureText(sub).width) / 2),
              subY = height / 1.7;
        ctx.fillText(sub, subX, subY);
        ctx.save();
      }
    };

    const pieData = {
      labels: ['Protein', 'Carbs', 'Fat'],
      datasets: [
        {
          data: [data.protein, data.carbs, data.fat],
          backgroundColor: ['#6ee7b7', '#93c5fd', '#fcd34d'], // Pastel Palette
          borderColor: isDark ? ['#1e293b', '#1e293b', '#1e293b'] : ['#fff', '#fff', '#fff'],
          borderWidth: 2,
          hoverOffset: 6,
          cutout: '75%',
        },
      ],
    };
    return (
      <div className="w-full flex justify-center items-center h-48 md:h-64 transition-transform hover:scale-105 duration-300">
        <Doughnut options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} data={pieData} plugins={[centerTextPlugin]} />
      </div>
    );
  }

  if (type === 'line') {
    const lineData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Calories',
          data: [2100, 1950, 2200, 2050, 1800, 2400, 2150],
          borderColor: '#10b981',
          pointBackgroundColor: '#fff',
          pointBorderColor: '#10b981',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true,
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 250);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
            return gradient;
          },
        },
      ],
    };
    return (
      <div className="w-full h-64">
        <Line options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} data={lineData} />
      </div>
    );
  }

  if (type === 'bar') {
    const barData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Protein (g)',
          data: [90, 110, 105, 95, 120, 85, 100],
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
        },
      ]
    };
    return (
      <div className="w-full h-64">
        <Bar options={{ maintainAspectRatio: false }} data={barData} />
      </div>
    );
  }

  return <div className="text-gray-500 text-sm text-center py-8">No data available</div>;
};

export default NutritionChart;
