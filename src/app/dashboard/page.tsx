'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

interface GameProfile {
  totalPoints: number
  availablePoints: number
  currentLevel: string
  loginStreak: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [gameProfile, setGameProfile] = useState<GameProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (status === 'loading') return // Ainda carregando
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  // Carregar perfil do usuário
  useEffect(() => {
    if (session?.user?.id) {
      fetchGameProfile()
    }
  }, [session])

  const fetchGameProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setGameProfile(data.gameProfile)
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌱</div>
          <p className="text-gray-600">Carregando seu perfil...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Vai redirecionar
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'INICIANTE': return '🌱'
      case 'JARDINEIRO': return '🌿'
      case 'ESPECIALISTA': return '🌳'
      case 'MESTRE': return '🏆'
      default: return '🌱'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INICIANTE': return 'bg-green-100 text-green-800'
      case 'JARDINEIRO': return 'bg-blue-100 text-blue-800'
      case 'ESPECIALISTA': return 'bg-purple-100 text-purple-800'
      case 'MESTRE': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-green-700">
            <span>🌱</span>
            <span>Desapegrow</span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Olá,</span>
              <span className="font-semibold">{session.user.name}</span>
            </div>
            <Button variant="outline" onClick={() => signOut()}>
              Sair
            </Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">🎮 Seu Dashboard Gamificado</h1>
          <p className="text-gray-600">Acompanhe seus pontos, nível e conquistas!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Pontos */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <span className="text-3xl">🪙</span>
                <span>CultivoCoins</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                {gameProfile?.totalPoints || 0}
              </div>
              <p className="text-sm text-gray-600">
                {gameProfile?.availablePoints || 0} disponíveis para usar
              </p>
            </CardContent>
          </Card>

          {/* Nível */}
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <span className="text-3xl">{getLevelIcon(gameProfile?.currentLevel || 'INICIANTE')}</span>
                <span>Nível Atual</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Badge className={`text-lg px-4 py-2 ${getLevelColor(gameProfile?.currentLevel || 'INICIANTE')}`}>
                {gameProfile?.currentLevel || 'INICIANTE'}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                Continue comprando para subir de nível!
              </p>
            </CardContent>
          </Card>

          {/* Streak */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <span className="text-3xl">🔥</span>
                <span>Sequência</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {gameProfile?.loginStreak || 0}
              </div>
              <p className="text-sm text-gray-600">
                dias consecutivos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Próximos Passos</CardTitle>
            <CardDescription>Continue sua jornada no Desapegrow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <Button size="lg" className="h-16" asChild>
                <Link href="/marketplace">
                  <div className="text-center">
                    <div className="text-xl mb-1">🛒</div>
                    <div>Ver Produtos</div>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" size="lg" className="h-16" asChild>
                <Link href="/profile">
                  <div className="text-center">
                    <div className="text-xl mb-1">👤</div>
                    <div>Meu Perfil</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conquistas Preview */}
        <Card>
          <CardHeader>
            <CardTitle>🏆 Suas Conquistas</CardTitle>
            <CardDescription>Badges que você já ganhou</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🎯</div>
              <p>Você ainda não tem badges!</p>
              <p className="text-sm">Faça sua primeira compra para desbloquear conquistas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}