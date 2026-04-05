'use client';

import { AlertTriangle, Info } from 'lucide-react';

import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

const logs = [
  { id: 1, timestamp: '2026-03-22 14:32', type: 'warning', message: 'Tension sensor reading spike detected (45 -> 12)' },
  { id: 2, timestamp: '2026-03-22 12:15', type: 'info', message: 'Device reconnected successfully' },
  { id: 3, timestamp: '2026-03-22 09:44', type: 'warning', message: 'Bluetooth connection lost for 2 minutes' },
  { id: 4, timestamp: '2026-03-21 18:23', type: 'info', message: 'Daily sync completed' },
];

export function ErrorLog() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium text-[#00487C]">System Log</h3>
        <Badge variant="outline" className="text-xs">
          Last 24h
        </Badge>
      </div>

      <ScrollArea className="h-[200px]">
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0"
            >
              {log.type === 'warning' ? (
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
              ) : (
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[#00487C]">{log.message}</p>
                <p className="mt-1 text-xs text-[#00487C]/50">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
