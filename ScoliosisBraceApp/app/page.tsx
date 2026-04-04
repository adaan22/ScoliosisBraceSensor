'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { DashboardView } from '@/components/dashboard-view';
import { createClient } from '@/lib/supabase/client';
import { WeeklyView } from '@/components/WeeklyView';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [userName, setUserName] = useState<string>('User');
  const [userEmail, setUserEmail] = useState<string>('No email');

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
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'weekly':
        return<WeeklyView/>;
      case 'goals':
      case 'logs':
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
        <div className="max-w-[1400px] mx-auto">
          {renderView()}
        </div>
      </div>
    </div>
  );
}