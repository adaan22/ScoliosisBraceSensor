import { redirect } from 'next/navigation'

import { EmbeddedDashboardView } from '@/components/embedded-dashboard-view'
import { appRoutes, isAdminUser } from '@/lib/app-config'
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect(appRoutes.login)
  }

  const userEmail = user.email ?? 'No email'
  const userName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    userEmail.split('@')[0] ??
    'User'

  const isAdmin = isAdminUser(user.id)

  return <EmbeddedDashboardView userName={userName} userEmail={userEmail} isAdmin={isAdmin} />
}
