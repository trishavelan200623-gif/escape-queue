import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { HourlyData } from '../types';

interface PredictionChartProps {
  data: HourlyData[];
  capacity: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold text-slate-300 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-400 capitalize">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PredictionChart: React.FC<PredictionChartProps> = ({ data, capacity }) => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
        <XAxis
          dataKey="hour"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={{ stroke: '#334155' }}
          tickLine={false}
          interval={2}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={[0, capacity]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '12px' }}
        />
        <Area
          type="monotone"
          dataKey="count"
          name="Actual"
          stroke="#14b8a6"
          strokeWidth={2}
          fill="url(#colorCount)"
          dot={false}
          activeDot={{ r: 4, fill: '#14b8a6' }}
        />
        <Area
          type="monotone"
          dataKey="predicted"
          name="Predicted"
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="5 5"
          fill="url(#colorPredicted)"
          dot={false}
          activeDot={{ r: 4, fill: '#f59e0b' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PredictionChart;