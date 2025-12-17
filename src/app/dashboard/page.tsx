'use client'

import { useRequireAuth } from '@/hooks/useRequireAuth'
import { AuthLoading } from '@/components/auth/AuthLoading'
import { MainDashboard } from '@/components/dashboard/MainDashboard'

export default function DashboardPage() {
  const { session, loading } = useRequireAuth()

  if (loading || !session) {
    return <AuthLoading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <MainDashboard />
      </div>
    </div>
  )
}
