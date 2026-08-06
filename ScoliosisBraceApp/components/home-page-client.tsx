'use client';

import { useEffect, useState } from 'react';

import { DashboardShell } from '@/components/dashboard-shell';
import { createClient } from '@/lib/supabase/client';

interface HomePageClientProps {
  isAdmin: boolean;
  initialUserName: string;
  initialUserEmail: string;
}

export function HomePageClient({ isAdmin, initialUserName, initialUserEmail }: HomePageClientProps) {
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

  return <DashboardShell isAdmin={isAdmin} userName={userName} userEmail={userEmail} />;
}
