'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Validações básicas
    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ As senhas não coincidem!')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setMessage('❌ A senha deve ter pelo menos 6 caracteres!')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`🎉 Conta criada! Você ganhou ${data.points} CultivoCoins! 🪙`)
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          router.push('/auth/signin')
        }, 2000)
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-green-700">
            <span>🌱</span>
            <span>Desapegrow</span>
          </Link>
          <p className="mt-2 text-gray-600">Junte-se à comunidade de cultivadores!</p>
        </div>

        {/* Bonus Card */}
        <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎁</span>
              <div>
                <h3 className="font-semibold text-green-800">Bônus de Cadastro!</h3>
                <p className="text-sm text-green-700">Ganhe <strong>100 CultivoCoins</strong> ao se cadastrar</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">+100 🪙</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Message */}
        {message && (
          <Card className={message.includes('🎉') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
            <CardContent className="p-4">
              <p className={`text-sm font-medium ${message.includes('🎉') ? 'text-green-800' : 'text-red-800'}`}>
                {message}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>Preencha os dados para começar sua jornada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome Completo</label>
                <Input 
                  type="text" 
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  type="email" 
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <Input 
                  type="password" 
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirmar Senha</label>
                <Input 
                  type="password" 
                  placeholder="Digite novamente sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={loading}
              >
                {loading ? '⏳ Criando conta...' : '🚀 Criar Conta & Ganhar Pontos'}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              Já tem conta?{' '}
              <Link href="/auth/signin" className="text-green-600 hover:text-green-700 font-medium">
                Entrar aqui
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}