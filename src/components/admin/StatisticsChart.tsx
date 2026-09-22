'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statisticsData = [
  { date: 'Mar 6', value: 190 },
  { date: 'Mar 9', value: 165 },
  { date: 'Mar 12', value: 180 },
  { date: 'Mar 15', value: 175 },
  { date: 'Mar 18', value: 195 },
  { date: 'Mar 21', value: 160 },
  { date: 'Mar 24', value: 170 },
  { date: 'Mar 27', value: 220 },
  { date: 'Mar 30', value: 210 },
  { date: 'Apr 2', value: 240 },
  { date: 'Apr 5', value: 235 },
  { date: 'Apr 8', value: 260 },
];

const tabs = ['Overview', 'Sales', 'Revenue'];

export default function StatisticsChart() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Statistics</h2>
        <div className="flex items-center gap-2 text-sm">
          {tabs.map((tab, idx) => (
            <button 
              key={tab}
              className={`px-3 py-1.5 rounded-lg ${
                idx === 0 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">Target you&apos;ve set for each month</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={statisticsData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#6B7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value) => [`$${value}`, 'Value']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#6366F1" 
            strokeWidth={2}
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
