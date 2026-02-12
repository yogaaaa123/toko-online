'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlySalesData = [
  { month: 'Jan', sales: 320 },
  { month: 'Feb', sales: 450 },
  { month: 'Mar', sales: 380 },
  { month: 'Apr', sales: 420 },
  { month: 'May', sales: 350 },
  { month: 'Jun', sales: 480 },
  { month: 'Jul', sales: 510 },
  { month: 'Aug', sales: 390 },
  { month: 'Sep', sales: 440 },
  { month: 'Oct', sales: 580 },
  { month: 'Nov', sales: 520 },
  { month: 'Dec', sales: 630 },
];

export default function MonthlySalesChart() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Monthly Sales</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={monthlySalesData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value) => [`$${value}`, 'Sales']}
          />
          <Bar 
            dataKey="sales" 
            fill="url(#colorSales)" 
            radius={[8, 8, 0, 0]}
            maxBarSize={40}
          />
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity={1} />
              <stop offset="100%" stopColor="#6366F1" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
