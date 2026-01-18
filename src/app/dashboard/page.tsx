'use client'

import { useRequireAuth } from '@/hooks/useRequireAuth'
import { AuthLoading } from '@/components/auth/AuthLoading'
import { MainDashboard } from '@/components/dashboard/MainDashboard'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { session, loading } = useRequireAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && session && !session.user.isAdmin) {
      router.push('/marketplace')
    }
  }, [session, loading, router])

  if (loading || !session) {
    return <AuthLoading />
  }

  if (!session.user.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">🔒 Acesso Restrito</h1>
          <p className="text-gray-600 mb-4">Esta página é exclusiva para administradores.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <MainDashboard />
      </div>
    </div>
  )
}
