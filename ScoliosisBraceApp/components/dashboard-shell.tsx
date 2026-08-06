'use client';

import { Suspense, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { DashboardView } from '@/components/dashboard-view';
import { LogoutButton } from '@/components/logout-button';
import { LogsView } from '@/components/logs-view';
import { PatientsView } from '@/components/PatientsView';
import { SettingsView } from '@/components/settings-view';
import { Sidebar } from '@/components/sidebar';
import { WeeklyView } from '@/components/WeeklyView';

const PATIENT_VIEWS = new Set(['dashboard', 'weekly', 'goals', 'logs', 'settings']);

interface DashboardShellProps {
  isAdmin: boolean;
  userName: string;
  userEmail: string;
  showLogout?: boolean;
}

function DashboardShellInner({ isAdmin, userName, userEmail, showLogout = false }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const viewParam = searchParams.get('view') ?? '';
  const activeView = isAdmin
    ? 'patients'
    : PATIENT_VIEWS.has(viewParam)
      ? viewParam
      : 'dashboard';

  const onViewChange = useCallback(
    (view: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (view === 'dashboard') {
        params.delete('view');
      } else {
        params.set('view', view);
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: true });
    },
    [pathname, router, searchParams],
  );

  const renderView = () => {
    if (isAdmin) {
      return <PatientsView />;
    }

    switch (activeView) {
      case 'weekly':
        return <WeeklyView />;
      case 'goals':
        return <DashboardView />;
      case 'logs':
        return <LogsView />;
      case 'settings':
        return <SettingsView />;
      case 'dashboard':
      default:
        return <DashboardView />;
    }
  };

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    weekly: 'Weekly Analysis',
    goals: 'Goals',
    logs: 'System Logs',
    settings: 'Settings',
    patients: 'Patients',
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-white">
      <Sidebar
        mode={isAdmin ? 'admin' : 'default'}
        activeView={activeView}
        onViewChange={onViewChange}
        userName={userName}
        userEmail={userEmail}
      />
      <div className="ml-64 p-8">
        {showLogout && (
          <div className="mb-6 flex justify-end">
            <LogoutButton />
          </div>
        )}
        {!isAdmin && activeView !== 'dashboard' && activeView !== 'goals' && (
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[#00487C]/50">
            {viewTitles[activeView]}
          </p>
        )}
        <div key={activeView} className="mx-auto max-w-[1400px]">
          {renderView()}
        </div>
      </div>
    </div>
  );
}

export function DashboardShell(props: DashboardShellProps) {
  return (
    <Suspense
      fallback={
        <div className="ml-64 flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-8 text-sm text-gray-500">
          Loading dashboard…
        </div>
      }
    >
      <DashboardShellInner {...props} />
    </Suspense>
  );
}
