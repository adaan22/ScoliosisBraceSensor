import { HomePageClient } from '@/components/home-page-client';
import { isAdminUser } from '@/lib/app-config';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = isAdminUser(user?.id);

  const userEmail = user?.email ?? 'No email';
  const metadataName = user?.user_metadata?.full_name ?? user?.user_metadata?.name;
  const userName =
    (typeof metadataName === 'string' ? metadataName : undefined) ??
    (userEmail.includes('@') ? userEmail.split('@')[0] : userEmail) ??
    'User';

  return <HomePageClient isAdmin={isAdmin} initialUserName={userName} initialUserEmail={userEmail} />;
}
