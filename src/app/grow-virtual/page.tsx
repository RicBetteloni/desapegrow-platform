'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
// IMPORT CORRETO - caminho relativo ao arquivo page.tsx
import { GrowVirtualDashboard } from '../../components/grow-virtual/GrowVirtualDashboard'

// resto do código permanece igual...
export default function GrowVirtualPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

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
          <div className="text-6xl mb-4">🌱</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando Grow Virtual...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <GrowVirtualDashboard />
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-white/50 backdrop-blur-sm border-t border-green-100">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>🌱 Grow Virtual - Sistema de Gamificação Desapegrow</p>
            <p className="mt-1 text-xs">Cultive, colecione e evolua no mundo virtual do cultivo!</p>
          </div>
        </div>
      </footer>
    </div>
  )
}