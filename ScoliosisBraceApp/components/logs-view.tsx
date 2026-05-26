'use client';

import { Download, Filter } from 'lucide-react';

import { ErrorLog } from './error-log';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { systemLogs } from '@/lib/test-data';

export function LogsView() {
  const warningCount = systemLogs.filter((log) => log.type === 'warning').length;
  const infoCount = systemLogs.filter((log) => log.type === 'info').length;
  const uptime = systemLogs.length > 0 ? Math.max(0, 100 - warningCount * 0.5) : 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#00487C] mb-2">System Logs</h2>
          <p className="text-[#00487C]/70">Monitor device performance and troubleshoot issues</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-[#00487C] text-[#00487C]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#00487C] hover:bg-[#005A8C]">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-[#00487C]">{systemLogs.length}</p>
          <p className="text-sm text-[#00487C]/70 mt-1">Total Events</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">{warningCount}</p>
          <p className="text-sm text-[#00487C]/70 mt-1">Warnings</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{infoCount}</p>
          <p className="text-sm text-[#00487C]/70 mt-1">Info</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{uptime.toFixed(1)}%</p>
          <p className="text-sm text-[#00487C]/70 mt-1">Uptime</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="p-6 h-[600px]">
            <h3 className="font-medium text-[#00487C] mb-4">Event Timeline</h3>
            <div className="space-y-4 overflow-y-auto h-[520px] pr-2">
              {systemLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="text-xs text-[#00487C]/50 w-32 flex-shrink-0">
                    {log.timestamp.split(' ')[0]}<br/>
                    {log.timestamp.split(' ')[1]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={log.type === 'warning' ? "destructive" : "secondary"}>
                        {log.type === 'warning' ? "Warning" : "Info"}
                      </Badge>
                      <span className="text-sm font-medium text-[#00487C]">
                        {log.title}
                      </span>
                    </div>
                    <p className="text-sm text-[#00487C]/70">
                      {log.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div>
          <ErrorLog logs={systemLogs} />
        </div>
      </div>
    </div>
  );
}
