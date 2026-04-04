import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const data = [
  { day: 'Mon', lastWeek: 8.5, thisWeek: 9.2 },
  { day: 'Tue', lastWeek: 7.8, thisWeek: 9.5 },
  { day: 'Wed', lastWeek: 9.0, thisWeek: 9.8 },
  { day: 'Thu', lastWeek: 8.2, thisWeek: 9.0 },
  { day: 'Fri', lastWeek: 7.5, thisWeek: 8.5 },
  { day: 'Sat', lastWeek: 6.5, thisWeek: 7.8 },
  { day: 'Sun', lastWeek: 6.0, thisWeek: 7.2 },
];

export function WeeklyComparison() {
  const improvement = 12.5; // percentage improvement

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
