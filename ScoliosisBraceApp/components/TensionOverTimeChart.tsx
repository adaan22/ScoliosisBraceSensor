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

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function buildTensionSeries(avgTension: number) {
  const jitter = [-4, 2, -2, 5, -3, 1, 0];
  return DAYS.map((day, i) => ({
    day,
    tension: Math.max(0, Math.min(120, Math.round(avgTension + jitter[i]!))),
  }));
}

interface TensionOverTimeChartProps {
  avgTension?: number;
}

export function TensionOverTimeChart({ avgTension = 85 }: TensionOverTimeChartProps) {
  const data = buildTensionSeries(avgTension);

  return (
    <div className="h-[300px] w-full min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
