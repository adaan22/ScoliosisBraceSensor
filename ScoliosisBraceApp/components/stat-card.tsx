import { Card } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#00487C]/70 mb-1">{title}</p>
          <p className="text-3xl font-bold text-[#00487C] mb-1">{value}</p>
          {subtitle && <p className="text-xs text-[#00487C]/60">{subtitle}</p>}
          {trend && (
            <p className={`text-sm mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-[#00487C]/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#00487C]" />
        </div>
      </div>
    </Card>
  );
}
