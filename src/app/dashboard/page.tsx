'use client'

import { useRequireAuth } from '@/hooks/useRequireAuth'
import { AuthLoading } from '@/components/auth/AuthLoading'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { signOut } from 'next-auth/react'

export default function DashboardPage() {
  const { session, loading } = useRequireAuth()

  if (loading || !session) {
    return <AuthLoading />
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
            <span className="text-gray-700">Olá, {session.user.name}!</span>
            <Link href="/marketplace">
              <Button variant="ghost">Marketplace</Button>
            </Link>
            {(session.user as { isSeller?: boolean }).isSeller && (
              <Link href="/vendedor">
                <Button variant="ghost">Vendas</Button>
              </Link>
            )}
            <Button variant="outline" onClick={() => signOut()}>
              Sair
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">📊 Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao seu painel de controle</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>🛒 Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Explore produtos e faça compras</p>
              <Link href="/marketplace">
                <Button className="w-full">Ir para Marketplace</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🌱 Grow Virtual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Gerencie seu cultivo virtual</p>
              <Link href="/grow-virtual">
                <Button className="w-full">Acessar Grow</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📦 Meus Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Acompanhe suas compras</p>
              <Link href="/meus-pedidos">
                <Button className="w-full">Ver Pedidos</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
