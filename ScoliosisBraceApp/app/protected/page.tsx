import { redirect } from 'next/navigation'

import { EmbeddedDashboardView } from '@/components/embedded-dashboard-view'
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect('/auth/login')
  }

  const userEmail = data.claims.email ?? 'No email'
  const userName =
    data.claims.user_metadata?.full_name ??
    data.claims.user_metadata?.name ??
    userEmail.split('@')[0] ??
    'User'

  return <EmbeddedDashboardView userName={userName} userEmail={userEmail} />
}
