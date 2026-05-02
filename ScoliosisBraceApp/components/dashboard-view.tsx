'use client';

import { useEffect, useMemo, useState } from 'react';

import { StatCard } from './stat-card';
import { ActiveTimer } from './active-timer';
import { TensionMonitor } from './tension-monitor';
import { DailySummary } from './daily-summary';
import { Recommendations } from './recommendations';
import { Clock, Zap, TrendingUp, Target } from 'lucide-react';

const TENSION_WS_URL = process.env.NEXT_PUBLIC_TENSION_WS_URL ?? 'ws://192.168.137.193/ws';

function getTensionValue(payload: unknown): number | null {
  if (typeof payload === 'number' && Number.isFinite(payload)) {
    return payload;
  }

  if (typeof payload === 'object' && payload !== null) {
    const possibleKeys = ['tension', 'value', 'reading', 'sensor', 'data'];
    for (const key of possibleKeys) {
      const nested = (payload as Record<string, unknown>)[key];
      const parsed = getTensionValue(nested);
      if (parsed !== null) {
        return parsed;
      }
    }
  }

  if (typeof payload === 'string') {
    try {
      const parsedJson = JSON.parse(payload);
      const jsonValue = getTensionValue(parsedJson);
      if (jsonValue !== null) {
        return jsonValue;
      }
    } catch {
      // Non-JSON string from device; fall back to number extraction.
    }

    const match = payload.match(/-?\d+(\.\d+)?/);
    if (match) {
      const numeric = Number(match[0]);
      return Number.isFinite(numeric) ? numeric : null;
    }
  }

  return null;
}

export function DashboardView() {
  const [samples, setSamples] = useState<number[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: number | undefined;
    let cancelled = false;

    const connect = () => {
      if (cancelled) {
        return;
      }

      socket = new WebSocket(TENSION_WS_URL);

      socket.onopen = () => {
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        const reading = getTensionValue(event.data);
        if (reading === null) {
          return;
        }

        setSamples((prev) => {
          const next = [...prev, reading];
          return next.length > 200 ? next.slice(next.length - 200) : next;
        });
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
          value={averageTension.toFixed(1)}
          subtitle={samples.length > 0 ? `Avg from ${samples.length} readings` : 'Waiting for live feed'}
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
