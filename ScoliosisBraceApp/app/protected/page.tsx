import { redirect } from 'next/navigation'

import { EmbeddedDashboardView } from '@/components/embedded-dashboard-view'
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/auth/login')
  }

  const userEmail = user.email ?? 'No email'
  const userName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    userEmail.split('@')[0] ??
    'User'

  const adminId = process.env.ADMIN_ID ?? ''
  const isAdmin = Boolean(adminId && user.id === adminId)

  return <EmbeddedDashboardView userName={userName} userEmail={userEmail} isAdmin={isAdmin} />
}
