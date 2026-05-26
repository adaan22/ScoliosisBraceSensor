import { Card } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { dailyActivityData, dashboardTestData, type DailyActivityPoint } from '@/lib/test-data';

interface DailySummaryProps {
  data?: DailyActivityPoint[];
}

export function DailySummary({ data = dailyActivityData }: DailySummaryProps) {
  const wornToday = data.reduce((sum, point) => sum + point.wear * 2, 0);
  const avgTension =
    data.length > 0
      ? data.reduce((sum, point) => sum + point.tension, 0) / data.length
      : 0;
  const compliance = Math.min(100, (wornToday / dashboardTestData.dailyWearGoal) * 100);

  return (
    <Card className="p-6">
      <h3 className="font-medium text-[#00487C] mb-4">Today's Activity</h3>
      
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="hour" />
          <YAxis yAxisId="left" label={{ value: 'Tension', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="tension" 
            stroke="#00487C" 
            strokeWidth={2}
            dot={{ fill: '#00487C', r: 4 }}
            name="Tension Level"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#00487C]">{wornToday.toFixed(1)}h</p>
          <p className="text-xs text-[#00487C]/60">Worn Today</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#00487C]">{avgTension.toFixed(0)}</p>
          <p className="text-xs text-[#00487C]/60">Avg Tension</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#00487C]">{Math.round(compliance)}%</p>
          <p className="text-xs text-[#00487C]/60">Compliance</p>
        </div>
      </div>
    </Card>
  );
}
