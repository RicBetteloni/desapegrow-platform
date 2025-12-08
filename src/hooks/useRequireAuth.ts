'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useRequireAuth(redirectTo = '/auth/signin') {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Ainda carregando

    if (!session) {
      router.push(redirectTo)
    }
  }, [session, status, router, redirectTo])

  return { session, status, loading: status === 'loading' }
}
