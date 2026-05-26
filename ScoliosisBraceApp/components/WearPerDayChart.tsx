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

import { buildWearPerDay, type WearPoint } from '@/lib/test-data';

interface WearPerDayChartProps {
  weeklyWearHours?: number;
  data?: WearPoint[];
}

export function WearPerDayChart({ weeklyWearHours = 42, data }: WearPerDayChartProps) {
  const chartData = data ?? buildWearPerDay(weeklyWearHours);

  return (
    <div className="h-[300px] w-full min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
