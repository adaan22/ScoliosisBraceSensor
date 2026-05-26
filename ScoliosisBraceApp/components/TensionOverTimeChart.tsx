'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { buildTensionSeries, type TensionPoint } from '@/lib/test-data';

interface TensionOverTimeChartProps {
  avgTension?: number;
  data?: TensionPoint[];
}

export function TensionOverTimeChart({ avgTension = 85, data }: TensionOverTimeChartProps) {
  const chartData = data ?? buildTensionSeries(avgTension);

  return (
    <div className="h-[300px] w-full min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" tick={{ fill: '#00487C', fontSize: 12 }} />
          <YAxis tick={{ fill: '#00487C', fontSize: 12 }} domain={[0, 120]} />
          <Tooltip contentStyle={{ borderColor: '#00487C33' }} />
          <Line
            type="monotone"
            dataKey="tension"
            stroke="#00487C"
            strokeWidth={2}
            dot={{ fill: '#00487C', r: 4 }}
            name="Tension"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
