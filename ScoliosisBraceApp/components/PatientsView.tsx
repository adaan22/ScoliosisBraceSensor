'use client';

import { useState } from 'react';
import { Activity, AlertTriangle, Clock, Search, TrendingDown, TrendingUp, Users } from 'lucide-react';

import { PatientDetailModal } from '@/components/PatientDetailModal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

// Mock patient data
const mockPatients: Patient[] = [
  {
    id: 'P-2847',
    name: 'Sarah Johnson',
    lastSync: '5 min ago',
    wearTimeToday: 6.5,
    wearTimeWeekly: 42.3,
    avgTension: 85,
    tensionStatus: 'optimal',
    complianceRate: 92,
    activeAlerts: 0,
    weeklyTrend: 'up',
  },
  {
    id: 'P-3102',
    name: 'Michael Chen',
    lastSync: '12 min ago',
    wearTimeToday: 4.2,
    wearTimeWeekly: 38.7,
    avgTension: 92,
    tensionStatus: 'warning',
    complianceRate: 78,
    activeAlerts: 1,
    weeklyTrend: 'stable',
  },
  {
    id: 'P-2956',
    name: 'Emily Rodriguez',
    lastSync: '1 hour ago',
    wearTimeToday: 7.8,
    wearTimeWeekly: 51.2,
    avgTension: 78,
    tensionStatus: 'optimal',
    complianceRate: 95,
    activeAlerts: 0,
    weeklyTrend: 'up',
  },
  {
    id: 'P-3245',
    name: 'David Thompson',
    lastSync: '3 min ago',
    wearTimeToday: 3.1,
    wearTimeWeekly: 28.4,
    avgTension: 105,
    tensionStatus: 'alert',
    complianceRate: 65,
    activeAlerts: 2,
    weeklyTrend: 'down',
  },
  {
    id: 'P-2789',
    name: 'Lisa Martinez',
    lastSync: '8 min ago',
    wearTimeToday: 5.5,
    wearTimeWeekly: 44.8,
    avgTension: 88,
    tensionStatus: 'optimal',
    complianceRate: 89,
    activeAlerts: 0,
    weeklyTrend: 'stable',
  },
  {
    id: 'P-3421',
    name: 'James Wilson',
    lastSync: '25 min ago',
    wearTimeToday: 2.8,
    wearTimeWeekly: 32.1,
    avgTension: 98,
    tensionStatus: 'warning',
    complianceRate: 71,
    activeAlerts: 1,
    weeklyTrend: 'down',
  },
  {
    id: 'P-2634',
    name: 'Amanda Foster',
    lastSync: '2 min ago',
    wearTimeToday: 8.2,
    wearTimeWeekly: 55.6,
    avgTension: 82,
    tensionStatus: 'optimal',
    complianceRate: 98,
    activeAlerts: 0,
    weeklyTrend: 'up',
  },
  {
    id: 'P-3087',
    name: 'Robert Kim',
    lastSync: '45 min ago',
    wearTimeToday: 4.7,
    wearTimeWeekly: 36.9,
    avgTension: 91,
    tensionStatus: 'warning',
    complianceRate: 74,
    activeAlerts: 0,
    weeklyTrend: 'stable',
  },
];

export function PatientsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const getTensionBadge = (status: Patient['tensionStatus']) => {
    switch (status) {
      case 'optimal':
        return <Badge className="bg-green-500/20 text-green-700 border-green-300">Optimal</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-300">Warning</Badge>;
      case 'alert':
        return <Badge className="bg-red-500/20 text-red-700 border-red-300">Alert</Badge>;
    }
  };

  const getTrendIcon = (trend: Patient['weeklyTrend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const avgCompliance = Math.round(
    mockPatients.reduce((sum, p) => sum + p.complianceRate, 0) / mockPatients.length
  );
  const totalAlerts = mockPatients.reduce((sum, p) => sum + p.activeAlerts, 0);
  const patientsNeedingAttention = mockPatients.filter(
    (p) => p.complianceRate < 80 || p.activeAlerts > 0
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#00487C]">Patient Overview</h2>
        <p className="text-gray-600 mt-1">Monitor all your patients in one place</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#00487C]/20 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-[#00487C]">{mockPatients.length}</div>
              <Users className="w-8 h-8 text-[#0066A1]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#00487C]/20 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-[#00487C]">{avgCompliance}%</div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#00487C]/20 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-red-600">{totalAlerts}</div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#00487C]/20 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Need Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-yellow-600">{patientsNeedingAttention}</div>
              <Activity className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#00487C]/20 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#00487C]">Patient List</CardTitle>
              <CardDescription>View and monitor all patient metrics</CardDescription>
            </div>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#00487C]/20"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Today's Wear</TableHead>
                <TableHead>Weekly Wear</TableHead>
                <TableHead>Avg Tension</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Alerts</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow
                  key={patient.id}
                  onClick={() => handlePatientClick(patient)}
                  className="hover:bg-[#B8D4E8]/20 cursor-pointer transition-colors"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium text-[#00487C]">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {patient.lastSync}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{patient.wearTimeToday.toFixed(1)}h</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{patient.wearTimeWeekly.toFixed(1)}h</span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        patient.avgTension > 100
                          ? 'text-red-600'
                          : patient.avgTension > 90
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {patient.avgTension}%
                    </span>
                  </TableCell>
                  <TableCell>{getTensionBadge(patient.tensionStatus)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            patient.complianceRate >= 90
                              ? 'bg-green-500'
                              : patient.complianceRate >= 75
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${patient.complianceRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{patient.complianceRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.activeAlerts > 0 ? (
                      <Badge className="bg-red-500/20 text-red-700 border-red-300">
                        {patient.activeAlerts}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-500">None</span>
                    )}
                  </TableCell>
                  <TableCell>{getTrendIcon(patient.weeklyTrend)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No patients found matching your search</p>
            </div>
          )}
        </CardContent>
      </Card>

      <PatientDetailModal
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
