'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Clock, Target, TrendingUp, Zap } from 'lucide-react';

import { ActiveTimer } from './active-timer';
import { DailySummary } from './daily-summary';
import { Recommendations } from './recommendations';
import { StatCard } from './stat-card';
import { TensionMonitor } from './tension-monitor';
import { createClient } from '@/lib/supabase/client';
import { parseTensionMessage } from '@/lib/parse-tension-message';
import { dailyActivityData, dashboardTestData } from '@/lib/test-data';

const TENSION_WS_URL = process.env.NEXT_PUBLIC_TENSION_WS_URL ?? 'ws://192.168.137.193/ws';
const PERSIST_INTERVAL_MS = 2000;

async function saveTensionReading(time: string, tensionValue: number) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return;
  }

  const res = await fetch('/api/tension-readings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ time, tension_value: tensionValue }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Failed to save tension reading:', err);
  }
}

export function DashboardView() {
  const [samples, setSamples] = useState<number[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const lastPersistAt = useRef(0);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: number | undefined;
    let cancelled = false;
    let sessionStart = new Date();

    const connect = () => {
      if (cancelled) {
        return;
      }

      sessionStart = new Date();
      socket = new WebSocket(TENSION_WS_URL);

      socket.onopen = () => {
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        const raw = typeof event.data === 'string' ? event.data : String(event.data);
        const parsed = parseTensionMessage(raw, sessionStart);
        if (!parsed) {
          return;
        }

        setSamples((prev) => {
          const next = [...prev, parsed.tensionValue];
          return next.length > 200 ? next.slice(next.length - 200) : next;
        });

        const now = Date.now();
        if (now - lastPersistAt.current >= PERSIST_INTERVAL_MS) {
          lastPersistAt.current = now;
          void saveTensionReading(parsed.time, parsed.tensionValue);
        }
      };

      socket.onerror = () => {
        setIsConnected(false);
      };

      socket.onclose = () => {
        setIsConnected(false);
        if (!cancelled) {
          reconnectTimer = window.setTimeout(connect, 2000);
        }
      };
    };

    connect();

    return () => {
      cancelled = true;
      setIsConnected(false);
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
      }
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const averageTension = useMemo(() => {
    if (samples.length === 0) {
      return 32;
    }
    const total = samples.reduce((sum, value) => sum + value, 0);
    return total / samples.length;
  }, [samples]);

  const dailyProgress = (dashboardTestData.wearTimeToday / dashboardTestData.dailyWearGoal) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          title="Today's Wear Time"
          value={`${dashboardTestData.wearTimeToday.toFixed(1)}h`}
          subtitle={`of ${dashboardTestData.dailyWearGoal}h goal`}
          icon={Clock}
          trend={{ value: '+0.5h from yesterday', positive: true }}
        />
        <StatCard
          title="Current Tension"
          value={averageTension.toFixed(1)}
          subtitle={
            samples.length > 0
              ? `Live avg · ${samples.length} samples (saved to your account)`
              : 'Waiting for live feed — sign in to save readings'
          }
          icon={Zap}
        />
        <StatCard
          title="Weekly Average"
          value={`${dashboardTestData.weeklyAverageHours.toFixed(1)}h`}
          subtitle="per day"
          icon={TrendingUp}
          trend={{ value: '+12% from last week', positive: true }}
        />
        <StatCard
          title="Compliance Rate"
          value={`${dashboardTestData.complianceRate}%`}
          subtitle="Last 7 days"
          icon={Target}
          trend={{ value: `${Math.round(dailyProgress)}% of today's goal`, positive: dailyProgress >= 80 }}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <DailySummary data={dailyActivityData} />
          <Recommendations />
        </div>
        <div className="space-y-6">
          <ActiveTimer />
          <TensionMonitor
            currentTension={averageTension}
            sampleCount={samples.length}
            isConnected={isConnected}
          />
        </div>
      </div>
    </div>
  );
}
