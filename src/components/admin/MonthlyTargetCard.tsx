'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface MonthlyTargetCardProps {
  target: number;
  current: number;
  todayEarning: number;
  lastMonthEarning: number;
}

export default function MonthlyTargetCard({
  target = 20000,
  current = 15110,
  todayEarning = 3287,
}: MonthlyTargetCardProps) {
  const percentage = ((current / target) * 100).toFixed(2);
  const percentageNum = parseFloat(percentage);
  
  // Calculate circle progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentageNum / 100) * circumference;

  // const todayChange = todayEarning - lastMonthEarning;
  // const todayChangePercent = ((todayChange / lastMonthEarning) * 100).toFixed(0);
  // const isPositive = todayChange > 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Monthly Target</h3>
          <p className="text-xs text-gray-500">Target you&apos;ve set for each month</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90 w-48 h-48">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="#E5E7EB"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-900">{percentage}%</div>
            <div className="text-xs text-gray-500 mt-1">
              {percentageNum > 100 ? '+' : ''}{(percentageNum - 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 mb-1">
          You earn <span className="font-bold text-gray-900">${todayEarning.toLocaleString()}</span> today,
        </p>
        <p className="text-sm text-gray-600">
          it&apos;s higher than last month. Keep up your good work!
        </p>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-center flex-1">
          <p className="text-xs text-gray-500 mb-1">Target</p>
          <div className="flex items-center justify-center gap-1">
            <p className="text-sm font-bold text-gray-900">${(target / 1000).toFixed(0)}K</p>
            <TrendingDown className="w-3 h-3 text-red-500" />
          </div>
        </div>
        <div className="text-center flex-1 border-l border-r border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Revenue</p>
          <div className="flex items-center justify-center gap-1">
            <p className="text-sm font-bold text-gray-900">${(current / 1000).toFixed(0)}K</p>
            <TrendingUp className="w-3 h-3 text-green-500" />
          </div>
        </div>
        <div className="text-center flex-1">
          <p className="text-xs text-gray-500 mb-1">Today</p>
          <div className="flex items-center justify-center gap-1">
            <p className="text-sm font-bold text-gray-900">${(todayEarning / 1000).toFixed(0)}K</p>
            <TrendingUp className="w-3 h-3 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
