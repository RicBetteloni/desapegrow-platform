'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        setMessage('❌ Email ou senha incorretos!')
      } else {
        setMessage('🎉 Login realizado! Ganhou +25 CultivoCoins!')
        
        // Redirecionar para dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }
    } catch (error) {
      setMessage('❌ Erro ao fazer login. Tente novamente.')
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
          <p className="mt-2 text-gray-600">Entre e continue cultivando!</p>
        </div>

        {/* Daily Login Bonus */}
        <Card className="bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-semibold text-blue-800">Login Diário</h3>
                <p className="text-sm text-blue-700">Ganhe <strong>25 CultivoCoins</strong> por dia!</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">+25 🪙</Badge>
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
            <CardTitle>Entrar na Conta</CardTitle>
            <CardDescription>Use a conta que você acabou de criar!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={loading}
              >
                {loading ? '⏳ Entrando...' : '🌱 Entrar & Ganhar Pontos'}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              Não tem conta?{' '}
              <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium">
                Cadastre-se grátis
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats Preview */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Sua Jornada Te Espera!</h3>
              <div className="flex justify-center space-x-4 text-sm">
                <div>
                  <div className="font-bold text-green-600">100+</div>
                  <div className="text-gray-500">Pontos</div>
                </div>
                <div>
                  <div className="font-bold text-blue-600">🌱</div>
                  <div className="text-gray-500">Iniciante</div>
                </div>
                <div>
                  <div className="font-bold text-purple-600">0</div>
                  <div className="text-gray-500">Badges</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}