'use client';

import { StatCard } from './stat-card';
import { ActiveTimer } from './active-timer';
import { TensionMonitor } from './tension-monitor';
import { DailySummary } from './daily-summary';
import { Recommendations } from './recommendations';
import { Clock, Zap, TrendingUp, Target } from 'lucide-react';

export function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          title="Today's Wear Time"
          value="6.5h"
          subtitle="of 10h goal"
          icon={Clock}
          trend={{ value: "+0.5h from yesterday", positive: true }}
        />
        <StatCard
          title="Current Tension"
          value="32"
          subtitle="Optimal range"
          icon={Zap}
        />
        <StatCard
          title="Weekly Average"
          value="8.2h"
          subtitle="per day"
          icon={TrendingUp}
          trend={{ value: "+12% from last week", positive: true }}
        />
        <StatCard
          title="Compliance Rate"
          value="95%"
          subtitle="Last 7 days"
          icon={Target}
          trend={{ value: "+5% improvement", positive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <DailySummary />
          <Recommendations />
        </div>
        <div className="space-y-6">
          <ActiveTimer />
          <TensionMonitor />
        </div>
      </div>
    </div>
  );
}
