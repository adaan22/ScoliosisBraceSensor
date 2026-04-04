import { Card } from './ui/card';
import { WeeklyComparison } from './WeeklyComparison';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const complianceData = [
  { day: 'Mon', compliance: 92 },
  { day: 'Tue', compliance: 95 },
  { day: 'Wed', compliance: 98 },
  { day: 'Thu', compliance: 90 },
  { day: 'Fri', compliance: 85 },
  { day: 'Sat', compliance: 78 },
  { day: 'Sun', compliance: 72 },
];

const tensionData = [
  { day: 'Mon', avg: 30, min: 25, max: 35 },
  { day: 'Tue', avg: 31, min: 28, max: 34 },
  { day: 'Wed', avg: 32, min: 29, max: 36 },
  { day: 'Thu', avg: 30, min: 27, max: 33 },
  { day: 'Fri', avg: 29, min: 26, max: 32 },
  { day: 'Sat', avg: 31, min: 28, max: 35 },
  { day: 'Sun', avg: 30, min: 27, max: 34 },
];

export function WeeklyView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#00487C] mb-2">Weekly Analysis</h2>
        <p className="text-[#00487C]/70">Comprehensive overview of your past 7 days</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <WeeklyComparison />
        
        <Card className="p-6">
          <h3 className="font-medium text-[#00487C] mb-4">Daily Compliance Rate</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={complianceData}>
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
          <BarChart data={tensionData}>
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
          <p className="text-4xl font-bold text-[#00487C]">57.5h</p>
          <p className="text-sm text-green-600 mt-2">↑ 6.5h from last week</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-sm text-[#00487C]/70 mb-2">Average Daily Wear</p>
          <p className="text-4xl font-bold text-[#00487C]">8.2h</p>
          <p className="text-sm text-green-600 mt-2">↑ 12% improvement</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-sm text-[#00487C]/70 mb-2">Days Goal Met</p>
          <p className="text-4xl font-bold text-[#00487C]">5/7</p>
          <p className="text-sm text-[#00487C]/70 mt-2">71% success rate</p>
        </Card>
      </div>
    </div>
  );
}
