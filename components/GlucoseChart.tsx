import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlucoseRecord } from '../types';

interface GlucoseChartProps {
  data: GlucoseRecord[];
}

export const GlucoseChart: React.FC<GlucoseChartProps> = ({ data }) => {
  // Format data for chart
  const chartData = data
    .slice()
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(record => ({
      day: new Date(record.timestamp).toLocaleDateString('zh-CN', { weekday: 'short' }).replace('周', ''),
      fullDay: new Date(record.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      value: record.value,
    }));

  return (
    <div className="w-full h-48 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            hide={false}
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            domain={['dataMin - 1', 'dataMax + 1']}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            cursor={{ stroke: '#0d9488', strokeWidth: 1, strokeDasharray: '5 5' }}
            labelFormatter={(label, payload) => payload[0]?.payload.fullDay || label}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#0d9488" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorValue)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};