'use client';

import { AlertTriangle, Info } from 'lucide-react';

import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

import { systemLogs, type SystemLog } from '@/lib/test-data';

interface ErrorLogProps {
  logs?: SystemLog[];
}

export function ErrorLog({ logs = systemLogs }: ErrorLogProps) {
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
