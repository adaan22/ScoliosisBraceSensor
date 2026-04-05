'use client';

import { Download, Filter } from 'lucide-react';

import { ErrorLog } from './error-log';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function LogsView() {
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
          <p className="text-2xl font-bold text-[#00487C]">24</p>
          <p className="text-sm text-[#00487C]/70 mt-1">Total Events</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">3</p>
          <p className="text-sm text-[#00487C]/70 mt-1">Warnings</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">21</p>
          <p className="text-sm text-[#00487C]/70 mt-1">Info</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">98.5%</p>
          <p className="text-sm text-[#00487C]/70 mt-1">Uptime</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="p-6 h-[600px]">
            <h3 className="font-medium text-[#00487C] mb-4">Event Timeline</h3>
            <div className="space-y-4 overflow-y-auto h-[520px] pr-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="text-xs text-[#00487C]/50 w-32 flex-shrink-0">
                    2026-03-22<br/>
                    {14 - i}:{30 - (i * 2)}:00
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={i % 3 === 0 ? "destructive" : "secondary"}>
                        {i % 3 === 0 ? "Warning" : "Info"}
                      </Badge>
                      <span className="text-sm font-medium text-[#00487C]">
                        {i % 3 === 0 ? "Connection Issue" : "Normal Operation"}
                      </span>
                    </div>
                    <p className="text-sm text-[#00487C]/70">
                      {i % 3 === 0 
                        ? "Bluetooth connection interrupted. Auto-reconnected after 30 seconds." 
                        : "Device sync completed successfully. All data uploaded."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div>
          <ErrorLog />
        </div>
      </div>
    </div>
  );
}
