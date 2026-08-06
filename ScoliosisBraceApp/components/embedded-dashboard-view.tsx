'use client';

import { DashboardShell } from '@/components/dashboard-shell';

interface EmbeddedDashboardViewProps {
  userName: string;
  userEmail: string;
  isAdmin?: boolean;
}

export function EmbeddedDashboardView({ userName, userEmail, isAdmin = false }: EmbeddedDashboardViewProps) {
  return (
    <DashboardShell
      isAdmin={isAdmin}
      userName={userName}
      userEmail={userEmail}
      showLogout
    />
  );
}
