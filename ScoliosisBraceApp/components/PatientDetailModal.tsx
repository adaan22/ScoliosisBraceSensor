'use client';

import {
  AlertTriangle,
  Calendar,
  Clock,
  Target,
  Zap,
} from 'lucide-react';

import { GoalTracking } from '@/components/GoalTracking';
import { Recommendations } from '@/components/recommendations';
import { TensionOverTimeChart } from '@/components/TensionOverTimeChart';
import { WearPerDayChart } from '@/components/WearPerDayChart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Patient {
  id: string;
  name: string;
  lastSync: string;
  wearTimeToday: number;
  wearTimeWeekly: number;
  avgTension: number;
  tensionStatus: 'optimal' | 'warning' | 'alert';
  complianceRate: number;
  activeAlerts: number;
  weeklyTrend: 'up' | 'down' | 'stable';
}

interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PatientDetailModal({ patient, isOpen, onClose }: PatientDetailModalProps) {
  if (!patient) {
    return null;
  }

  const getTensionBadge = (status: Patient['tensionStatus']) => {
    switch (status) {
      case 'optimal':
        return <Badge className="border-green-300 bg-green-500/20 text-green-700">Optimal</Badge>;
      case 'warning':
        return <Badge className="border-yellow-300 bg-yellow-500/20 text-yellow-700">Warning</Badge>;
      case 'alert':
        return <Badge className="border-red-300 bg-red-500/20 text-red-700">Alert</Badge>;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl text-[#00487C]">{patient.name}</DialogTitle>
              <p className="mt-1 text-sm text-gray-600">Patient ID: {patient.id}</p>
            </div>
            <div className="flex items-center gap-3">
              {getTensionBadge(patient.tensionStatus)}
              <Badge variant="outline" className="border-[#00487C]/30">
                <Clock className="mr-1 h-3 w-3" />
                {patient.lastSync}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-[#00487C]/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Clock className="h-4 w-4" />
                Today&apos;s wear
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00487C]">{patient.wearTimeToday.toFixed(1)}h</div>
              <p className="mt-1 text-xs text-gray-500">of 8 hours goal</p>
            </CardContent>
          </Card>

          <Card className="border-[#00487C]/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Calendar className="h-4 w-4" />
                Weekly total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00487C]">{patient.wearTimeWeekly.toFixed(1)}h</div>
              <p className="mt-1 text-xs text-gray-500">of 56 hours goal</p>
            </CardContent>
          </Card>

          <Card className="border-[#00487C]/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Zap className="h-4 w-4" />
                Avg tension
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  patient.avgTension > 100 ? 'text-red-600' : patient.avgTension > 90 ? 'text-yellow-600' : 'text-green-600'
                }`}
              >
                {patient.avgTension}%
              </div>
              <p className="mt-1 text-xs text-gray-500">Target: 75–90%</p>
            </CardContent>
          </Card>

          <Card className="border-[#00487C]/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Target className="h-4 w-4" />
                Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00487C]">{patient.complianceRate}%</div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full ${
                    patient.complianceRate >= 90 ? 'bg-green-500' : patient.complianceRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${patient.complianceRate}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {patient.activeAlerts > 0 && (
          <Card className="mt-4 border-red-300 bg-red-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">Active alerts ({patient.activeAlerts})</h3>
                  <ul className="mt-2 space-y-1 text-sm text-red-800">
                    {patient.avgTension > 100 && (
                      <li>• Tension exceeds safe threshold (current: {patient.avgTension}%)</li>
                    )}
                    {patient.complianceRate < 80 && <li>• Low compliance — consider follow-up</li>}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tension">Tension analysis</TabsTrigger>
            <TabsTrigger value="goals">Goals &amp; progress</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border-[#00487C]/20">
              <CardHeader>
                <CardTitle className="text-[#00487C]">Weekly wear time</CardTitle>
              </CardHeader>
              <CardContent>
                <WearPerDayChart weeklyWearHours={patient.wearTimeWeekly} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="border-[#00487C]/20">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Device information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Device ID:</span>
                    <span className="font-medium">BRC-{patient.id.split('-')[1]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Battery level:</span>
                    <span className="font-medium text-green-600">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Firmware:</span>
                    <span className="font-medium">v2.4.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last calibration:</span>
                    <span className="font-medium">Apr 28, 2026</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#00487C]/20">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Treatment details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start date:</span>
                    <span className="font-medium">Jan 15, 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">106 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target duration:</span>
                    <span className="font-medium">180 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium text-[#0066A1]">59%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tension" className="space-y-4">
            <Card className="border-[#00487C]/20">
              <CardHeader>
                <CardTitle className="text-[#00487C]">Tension over time</CardTitle>
              </CardHeader>
              <CardContent>
                <TensionOverTimeChart avgTension={patient.avgTension} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="border-[#00487C]/20">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Current tension</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#00487C]">{patient.avgTension}%</div>
                  <p className="mt-1 text-xs text-gray-500">Latest average</p>
                </CardContent>
              </Card>

              <Card className="border-[#00487C]/20">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Peak tension (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{Math.min(patient.avgTension + 15, 120)}%</div>
                  <p className="mt-1 text-xs text-gray-500">Demo peak from average</p>
                </CardContent>
              </Card>

              <Card className="border-[#00487C]/20">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Avg tension (7d)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{Math.max(patient.avgTension - 5, 70)}%</div>
                  <p className="mt-1 text-xs text-gray-500">Demo from average</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <GoalTracking
              wearTimeToday={patient.wearTimeToday}
              wearTimeWeekly={patient.wearTimeWeekly}
              complianceRate={patient.complianceRate}
            />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Recommendations />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
