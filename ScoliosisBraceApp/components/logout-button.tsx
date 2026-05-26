'use client'

import { useRouter } from 'next/navigation'

import { appRoutes } from '@/lib/app-config'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(appRoutes.login)
  }

  return <Button onClick={logout}>Logout</Button>
}
