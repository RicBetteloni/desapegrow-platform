'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { AnalyticsDashboard } from '../../components/dashboard/AnalyticsDashboard'

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect se não estiver logado
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-600">Carregando analytics...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Analytics Content */}
      <div className="container mx-auto p-6">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}