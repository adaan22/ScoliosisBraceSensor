'use client';

import { useEffect, useState } from 'react';

import { DashboardView } from '@/components/dashboard-view';
import { LogsView } from '@/components/logs-view';
import { PatientsView } from '@/components/PatientsView';
import { Sidebar } from '@/components/sidebar';
import { WeeklyView } from '@/components/WeeklyView';
import { createClient } from '@/lib/supabase/client';

interface HomePageClientProps {
  isAdmin: boolean;
  initialUserName: string;
  initialUserEmail: string;
}

export function HomePageClient({ isAdmin, initialUserName, initialUserEmail }: HomePageClientProps) {
  const [activeView, setActiveView] = useState(isAdmin ? 'patients' : 'dashboard');
  const [userName, setUserName] = useState(initialUserName);
  const [userEmail, setUserEmail] = useState(initialUserEmail);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) return;

      const metadataName =
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined);
      const derivedName = metadataName ?? user.email?.split('@')[0] ?? 'User';

      setUserName(derivedName);
      setUserEmail(user.email ?? 'No email');
    };

    void loadUser();
  }, []);

  const renderView = () => {
    if (isAdmin) {
      return <PatientsView />;
    }

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
        mode={isAdmin ? 'admin' : 'default'}
        activeView={activeView}
        onViewChange={setActiveView}
        userName={userName}
        userEmail={userEmail}
      />
      <div className="ml-64 p-8">
        <div className="mx-auto max-w-[1400px]">{renderView()}</div>
      </div>
    </div>
  );
}
