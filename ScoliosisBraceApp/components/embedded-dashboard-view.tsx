'use client';

import { useState } from 'react';

import { DashboardView } from '@/components/dashboard-view';
import { LogsView } from '@/components/logs-view';
import { LogoutButton } from '@/components/logout-button';
import { Sidebar } from '@/components/sidebar';
import { WeeklyView } from '@/components/WeeklyView';

interface EmbeddedDashboardViewProps {
  userName: string;
  userEmail: string;
}

export function EmbeddedDashboardView({ userName, userEmail }: EmbeddedDashboardViewProps) {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'weekly':
        return <WeeklyView />;
      case 'goals':
        return <DashboardView />;
      case 'logs':
        return <LogsView />;
      case 'settings':
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-white">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        userName={userName}
        userEmail={userEmail}
      />
      <div className="ml-64 p-8">
        <div className="mb-6 flex justify-end">
          <LogoutButton />
        </div>
        <div className="max-w-[1400px]">{renderView()}</div>
      </div>
    </div>
  );
}
