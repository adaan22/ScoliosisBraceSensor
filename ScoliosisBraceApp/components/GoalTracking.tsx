'use client';

import { Target, Trophy } from 'lucide-react';

import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { dashboardTestData } from '@/lib/test-data';

interface GoalTrackingProps {
  wearTimeToday?: number;
  wearTimeWeekly?: number;
  complianceRate?: number;
}

export function GoalTracking({
  wearTimeToday = dashboardTestData.wearTimeToday,
  wearTimeWeekly = dashboardTestData.weeklyAverageHours * 7,
  complianceRate = dashboardTestData.complianceRate,
}: GoalTrackingProps) {
  const dailyWearTarget = dashboardTestData.dailyWearGoal;
  const weeklyHoursTarget = 56;

  const goals = [
    {
      name: 'Daily wear time',
      current: wearTimeToday,
      target: dailyWearTarget,
      unit: 'h' as const,
      percentage: Math.min(100, (wearTimeToday / dailyWearTarget) * 100),
    },
    {
      name: 'Weekly wear hours',
      current: wearTimeWeekly,
      target: weeklyHoursTarget,
      unit: 'h' as const,
      percentage: Math.min(100, (wearTimeWeekly / weeklyHoursTarget) * 100),
    },
    {
      name: 'Compliance',
      current: complianceRate,
      target: 100,
      unit: '%' as const,
      percentage: Math.min(100, complianceRate),
    },
  ];

  return (
    <Card className="border-[#00487C]/20 p-6">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-[#00487C]" />
        <h3 className="font-medium text-[#00487C]">Goal progress</h3>
      </div>

      <div className="space-y-6">
        {goals.map((goal) => (
          <div key={goal.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-[#00487C]/60" />
                <span className="text-sm font-medium text-[#00487C]">{goal.name}</span>
              </div>
              <span className="text-sm text-[#00487C]/70">
                {goal.unit === 'h'
                  ? `${goal.current.toFixed(1)} / ${goal.target} ${goal.unit}`
                  : `${Math.round(goal.current)} / ${goal.target}${goal.unit}`}
              </span>
            </div>
            <Progress value={goal.percentage} className="h-2 [&>div]:bg-[#00487C]" />
            <p className="text-right text-xs text-[#00487C]/60">{Math.round(goal.percentage)}% complete</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
