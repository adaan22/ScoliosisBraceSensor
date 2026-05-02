'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function buildWearPerDay(weeklyTotalHours: number) {
  const base = weeklyTotalHours / 7;
  const jitter = [0.9, 1.05, 0.95, 1.1, 0.85, 1.0, 0.92];
  return DAYS.map((day, i) => ({
    day,
    hours: Math.round((base * jitter[i]!) * 10) / 10,
  }));
}

interface WearPerDayChartProps {
  /** Used to shape demo bars around this patient's weekly total */
  weeklyWearHours?: number;
}

export function WearPerDayChart({ weeklyWearHours = 42 }: WearPerDayChartProps) {
  const data = buildWearPerDay(weeklyWearHours);

  return (
    <div className="h-[300px] w-full min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" tick={{ fill: '#00487C', fontSize: 12 }} />
          <YAxis tick={{ fill: '#00487C', fontSize: 12 }} label={{ value: 'h', angle: 0, position: 'insideTopLeft', fill: '#00487C' }} />
          <Tooltip contentStyle={{ borderColor: '#00487C33' }} />
          <Legend />
          <Bar dataKey="hours" name="Wear (hours)" fill="#00487C" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
