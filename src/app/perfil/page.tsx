'use client'

import { useRequireAuth } from '@/hooks/useRequireAuth'
import { AuthLoading } from '@/components/auth/AuthLoading'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Calendar, ShoppingBag, Package, Edit, Save, X } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function PerfilPage() {
  const { session, loading } = useRequireAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  })
  
  // Estado para armazenar dados do usuário (sempre atualizado)
  const [userData, setUserData] = useState<{
    name?: string | null
    email?: string | null
    phone?: string | null
    isSeller?: boolean
    createdAt?: string
  } | null>(null)

  // Buscar dados do banco ao carregar
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setUserData({
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            isSeller: session?.user?.isSeller,
            createdAt: session?.user?.createdAt
          })
          setFormData({
            name: data.user.name || '',
            phone: data.user.phone || ''
          })
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }
    }
    
    if (session?.user) {
      fetchUserData()
    }
  }, [session])

  if (loading || !session) {
    return <AuthLoading />
  }

  const user = userData || (session.user as {
    name?: string | null
    email?: string | null
    phone?: string | null
    isSeller?: boolean
    createdAt?: string
  })

  const handleEdit = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || ''
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({ name: '', phone: '' })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log('📤 Enviando dados:', formData)
      
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao atualizar perfil')
      }

      const data = await response.json()
      console.log('📥 Resposta recebida:', data)
      
      // Atualizar state local IMEDIATAMENTE
      setUserData(prev => ({
        ...prev,
        name: data.user.name,
        phone: data.user.phone
      }))
      
      setIsEditing(false)
      setSaving(false)
      
      alert('✅ Perfil atualizado com sucesso!')
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      alert(error instanceof Error ? error.message : 'Erro ao atualizar perfil')
      setSaving(false)
    }
  }

  const handleLogout = () => {
    // Limpar localStorage antes de deslogar
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('cart')
      window.localStorage.removeItem('favorites')
    }
    signOut({ callbackUrl: '/auth/signin' })
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
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </div>
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" disabled={saving}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm" disabled={saving}>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 98765-4321"
                    />
                  </div>

                  <div>
                    <Label className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input value={user.email || ''} disabled className="bg-gray-100" />
                    <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome</label>
                    <p className="text-lg font-semibold">{user.name || 'Não informado'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Telefone</label>
                    <p className="text-lg">{user.phone || 'Não informado'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <p className="text-lg">{user.email || 'Não informado'}</p>
                  </div>
                </>
              )}

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
                  Minhas Compras
                </Button>
              </Link>

              <Link href="/vendedor" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Meus Anúncios
                </Button>
              </Link>

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
