export interface Patient {
  id: string
  name: string
  lastSync: string
  wearTimeToday: number
  wearTimeWeekly: number
  avgTension: number
  tensionStatus: 'optimal' | 'warning' | 'alert'
  complianceRate: number
  activeAlerts: number
  weeklyTrend: 'up' | 'down' | 'stable'
}

export interface DailyActivityPoint {
  hour: string
  tension: number
  wear: number
}

export interface WeeklyComparisonPoint {
  day: string
  lastWeek: number
  thisWeek: number
}

export interface CompliancePoint {
  day: string
  compliance: number
}

export interface TensionTrendPoint {
  day: string
  avg: number
  min: number
  max: number
}

export interface WearPoint {
  day: string
  hours: number
}

export interface TensionPoint {
  day: string
  tension: number
}

export interface SystemLog {
  id: number
  timestamp: string
  type: 'warning' | 'info'
  title: string
  message: string
}

export interface Recommendation {
  id: number
  type: 'tension' | 'duration' | 'consistency'
  message: string
  priority: 'high' | 'medium' | 'low'
}

export const dashboardTestData = {
  wearTimeToday: 3.4,
  dailyWearGoal: 10,
  weeklyAverageHours: 6.1,
  complianceRate: 68,
}

export const dailyActivityData: DailyActivityPoint[] = [
  { hour: '8am', tension: 18, wear: 1 },
  { hour: '10am', tension: 22, wear: 0 },
  { hour: '12pm', tension: 41, wear: 1 },
  { hour: '2pm', tension: 46, wear: 0 },
  { hour: '4pm', tension: 38, wear: 0 },
  { hour: '6pm', tension: 27, wear: 1 },
]

export const weeklyComparisonData: WeeklyComparisonPoint[] = [
  { day: 'Mon', lastWeek: 8.5, thisWeek: 5.1 },
  { day: 'Tue', lastWeek: 7.8, thisWeek: 6.4 },
  { day: 'Wed', lastWeek: 9.0, thisWeek: 4.8 },
  { day: 'Thu', lastWeek: 8.2, thisWeek: 7.0 },
  { day: 'Fri', lastWeek: 7.5, thisWeek: 6.2 },
  { day: 'Sat', lastWeek: 6.5, thisWeek: 3.9 },
  { day: 'Sun', lastWeek: 6.0, thisWeek: 4.4 },
]

export const weeklyComplianceData: CompliancePoint[] = [
  { day: 'Mon', compliance: 62 },
  { day: 'Tue', compliance: 74 },
  { day: 'Wed', compliance: 55 },
  { day: 'Thu', compliance: 70 },
  { day: 'Fri', compliance: 68 },
  { day: 'Sat', compliance: 42 },
  { day: 'Sun', compliance: 49 },
]

export const weeklyTensionData: TensionTrendPoint[] = [
  { day: 'Mon', avg: 30, min: 25, max: 35 },
  { day: 'Tue', avg: 31, min: 28, max: 34 },
  { day: 'Wed', avg: 32, min: 29, max: 36 },
  { day: 'Thu', avg: 30, min: 27, max: 33 },
  { day: 'Fri', avg: 29, min: 26, max: 32 },
  { day: 'Sat', avg: 31, min: 28, max: 35 },
  { day: 'Sun', avg: 30, min: 27, max: 34 },
]

export const patientTestData: Patient[] = [
  {
    id: 'P-2847',
    name: 'Sarah Johnson',
    lastSync: '5 min ago',
    wearTimeToday: 2.9,
    wearTimeWeekly: 24.6,
    avgTension: 108,
    tensionStatus: 'alert',
    complianceRate: 54,
    activeAlerts: 3,
    weeklyTrend: 'down',
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
]

export const systemLogs: SystemLog[] = [
  {
    id: 1,
    timestamp: '2026-03-22 14:32',
    type: 'warning',
    title: 'Connection Issue',
    message: 'Tension sensor reading spike detected (45 -> 12)',
  },
  {
    id: 2,
    timestamp: '2026-03-22 12:15',
    type: 'info',
    title: 'Normal Operation',
    message: 'Device reconnected successfully',
  },
  {
    id: 3,
    timestamp: '2026-03-22 09:44',
    type: 'warning',
    title: 'Connection Issue',
    message: 'Bluetooth connection lost for 2 minutes',
  },
  {
    id: 4,
    timestamp: '2026-03-21 18:23',
    type: 'info',
    title: 'Normal Operation',
    message: 'Daily sync completed',
  },
]

export const recommendations: Recommendation[] = [
  {
    id: 1,
    type: 'tension',
    message: 'Increase tension by 3 units for optimal support',
    priority: 'high',
  },
  {
    id: 2,
    type: 'duration',
    message: 'Try to wear brace for 10 total hours per day',
    priority: 'medium',
  },
  {
    id: 3,
    type: 'consistency',
    message: 'Great progress! Keep maintaining your current schedule',
    priority: 'low',
  },
]

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function buildWearPerDay(weeklyTotalHours: number): WearPoint[] {
  const base = weeklyTotalHours / days.length
  const multipliers = [0.9, 1.05, 0.95, 1.1, 0.85, 1.0, 0.92]

  return days.map((day, index) => ({
    day,
    hours: Math.round((base * multipliers[index]!) * 10) / 10,
  }))
}

export function buildTensionSeries(avgTension: number): TensionPoint[] {
  const offsets = [-4, 2, -2, 5, -3, 1, 0]

  return days.map((day, index) => ({
    day,
    tension: Math.max(0, Math.min(120, Math.round(avgTension + offsets[index]!))),
  }))
}

export function getWeeklySummary() {
  const totalHours = weeklyComparisonData.reduce((sum, point) => sum + point.thisWeek, 0)
  const lastWeekTotal = weeklyComparisonData.reduce((sum, point) => sum + point.lastWeek, 0)
  const averageDailyWear = totalHours / weeklyComparisonData.length
  const daysGoalMet = weeklyComparisonData.filter((point) => point.thisWeek >= 8).length
  const improvement = lastWeekTotal > 0 ? ((totalHours - lastWeekTotal) / lastWeekTotal) * 100 : 0

  return {
    totalHours,
    lastWeekTotal,
    averageDailyWear,
    daysGoalMet,
    successRate: (daysGoalMet / weeklyComparisonData.length) * 100,
    improvement,
  }
}
