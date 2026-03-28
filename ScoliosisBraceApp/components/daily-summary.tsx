import { Card } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { hour: '8am', tension: 28, wear: 1 },
  { hour: '10am', tension: 30, wear: 1 },
  { hour: '12pm', tension: 32, wear: 1 },
  { hour: '2pm', tension: 31, wear: 0 },
  { hour: '4pm', tension: 29, wear: 1 },
  { hour: '6pm', tension: 33, wear: 1 },
];

export function DailySummary() {
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
          <p className="text-2xl font-bold text-[#00487C]">6.5h</p>
          <p className="text-xs text-[#00487C]/60">Worn Today</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#00487C]">31</p>
          <p className="text-xs text-[#00487C]/60">Avg Tension</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#00487C]">95%</p>
          <p className="text-xs text-[#00487C]/60">Compliance</p>
        </div>
      </div>
    </Card>
  );
}
