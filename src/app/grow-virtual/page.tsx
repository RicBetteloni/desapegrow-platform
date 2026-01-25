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
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 max-w-7xl">
        <GrowVirtualDashboard />
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-white/50 backdrop-blur-sm border-t border-green-100">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 shadow-md">
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">⚠️</div>
                <div className="text-center flex-1">
                  <p className="text-base font-bold text-yellow-900 mb-2">🎮 Grow Virtual - Jogo Educativo e Ilustrativo</p>
                  <p className="text-sm font-semibold text-yellow-800 leading-relaxed">
                    Sistema de gamificação puramente virtual e fictício. Não incentiva, promove ou ensina práticas ilegais. 
                    Todas as recompensas, moedas e itens são exclusivamente virtuais, sem qualquer valor monetário ou benefício real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}