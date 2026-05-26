import { Card } from './ui/card';
import { WeeklyComparison } from './WeeklyComparison';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

import {
  getWeeklySummary,
  weeklyComparisonData,
  weeklyComplianceData,
  weeklyTensionData,
} from '@/lib/test-data';

export function WeeklyView() {
  const weeklySummary = getWeeklySummary();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#00487C] mb-2">Weekly Analysis</h2>
        <p className="text-[#00487C]/70">Comprehensive overview of your past 7 days</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <WeeklyComparison data={weeklyComparisonData} />
        
        <Card className="p-6">
          <h3 className="font-medium text-[#00487C] mb-4">Daily Compliance Rate</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyComplianceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="compliance" 
                stroke="#00487C" 
                strokeWidth={3}
                dot={{ fill: '#00487C', r: 5 }}
                name="Compliance %"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-medium text-[#00487C] mb-4">Weekly Tension Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyTensionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" />
            <YAxis label={{ value: 'Tension Level', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="min" fill="#A8C5DD" name="Minimum" />
            <Bar dataKey="avg" fill="#00487C" name="Average" />
            <Bar dataKey="max" fill="#005A8C" name="Maximum" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <p className="text-sm text-[#00487C]/70 mb-2">Total Hours This Week</p>
          <p className="text-4xl font-bold text-[#00487C]">{weeklySummary.totalHours.toFixed(1)}h</p>
          <p className="text-sm text-green-600 mt-2">
            ↑ {(weeklySummary.totalHours - weeklySummary.lastWeekTotal).toFixed(1)}h from last week
          </p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-sm text-[#00487C]/70 mb-2">Average Daily Wear</p>
          <p className="text-4xl font-bold text-[#00487C]">{weeklySummary.averageDailyWear.toFixed(1)}h</p>
          <p className="text-sm text-green-600 mt-2">↑ {weeklySummary.improvement.toFixed(0)}% improvement</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-sm text-[#00487C]/70 mb-2">Days Goal Met</p>
          <p className="text-4xl font-bold text-[#00487C]">{weeklySummary.daysGoalMet}/7</p>
          <p className="text-sm text-[#00487C]/70 mt-2">{weeklySummary.successRate.toFixed(0)}% success rate</p>
        </Card>
      </div>
    </div>
  );
}
