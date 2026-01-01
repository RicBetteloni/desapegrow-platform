'use client'

import { useRequireAuth } from '@/hooks/useRequireAuth'
import { AuthLoading } from '@/components/auth/AuthLoading'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Calendar, ShoppingBag, Package } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function PerfilPage() {
  const { session, loading } = useRequireAuth()

  if (loading || !session) {
    return <AuthLoading />
  }

  const handleLogout = () => {
    // Limpar localStorage antes de deslogar
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('cart')
      window.localStorage.removeItem('favorites')
    }
    signOut({ callbackUrl: '/auth/signin' })
  }

  const user = session.user as {
    name?: string | null
    email?: string | null
    isSeller?: boolean
    createdAt?: string
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">👤 Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>

        <div className="grid gap-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nome</label>
                <p className="text-lg font-semibold">{user.name || 'Não informado'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-lg">{user.email || 'Não informado'}</p>
              </div>

              {user.createdAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Membro desde
                  </label>
                  <p className="text-lg">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {user.isSeller && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-semibold text-green-800 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Conta de Vendedor Ativa
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Você pode vender produtos no marketplace
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>⚡ Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/meus-pedidos" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Meus Pedidos
                </Button>
              </Link>

              {user.isSeller && (
                <Link href="/vendedor" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    Painel de Vendas
                  </Button>
                </Link>
              )}

              <Link href="/grow-virtual" className="block">
                <Button variant="outline" className="w-full justify-start">
                  🌱 Grow Virtual
                </Button>
              </Link>

              <Link href="/gamification" className="block">
                <Button variant="outline" className="w-full justify-start">
                  🏆 Gamificação
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card>
            <CardHeader>
              <CardTitle>⚙️ Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                Sair da Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
