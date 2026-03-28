import { redirect } from 'next/navigation'

import { DashboardView } from '@/components/dashboard-view'
import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-svh w-full p-6">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Logged in as <span className="font-medium text-foreground">{data.claims.email}</span>
        </p>
        <LogoutButton />
      </div>
      <DashboardView />
    </div>
  )
}
