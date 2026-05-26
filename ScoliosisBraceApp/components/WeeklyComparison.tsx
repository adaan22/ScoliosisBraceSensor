import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

import { getWeeklySummary, weeklyComparisonData, type WeeklyComparisonPoint } from '@/lib/test-data';

interface WeeklyComparisonProps {
  data?: WeeklyComparisonPoint[];
}

export function WeeklyComparison({ data = weeklyComparisonData }: WeeklyComparisonProps) {
  const lastWeekTotal = data.reduce((sum, point) => sum + point.lastWeek, 0);
  const thisWeekTotal = data.reduce((sum, point) => sum + point.thisWeek, 0);
  const improvement =
    data === weeklyComparisonData ? getWeeklySummary().improvement : ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-[#00487C]">Weekly Comparison</h3>
        <div className="flex items-center gap-2 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+{improvement}% improvement</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" />
          <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="lastWeek" fill="#A8C5DD" name="Last Week" radius={[4, 4, 0, 0]} />
          <Bar dataKey="thisWeek" fill="#00487C" name="This Week" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
