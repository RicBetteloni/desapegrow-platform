'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Package, Sparkles } from 'lucide-react'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl mb-2">🎉 Pagamento Aprovado!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Package className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Pedido Confirmado!
                </h3>
                <p className="text-sm text-blue-800">
                  Seu pedido <strong>#{orderId?.slice(0, 8)}</strong> foi confirmado e está sendo processado.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">
                  🎁 Itens Virtuais Desbloqueados!
                </h3>
                <p className="text-sm text-purple-800 mb-2">
                  Você ganhou recompensas exclusivas:
                </p>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>✨ Itens raros para seu Grow Virtual</li>
                  <li>🪙 +100 CultivoCoins</li>
                  <li>💎 +50 GrowthGems</li>
                  <li>⚡ Boost de crescimento 2x</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/meus-pedidos" className="block">
              <Button variant="outline" className="w-full">
                Ver Meus Pedidos
              </Button>
            </Link>
            <Link href="/grow-virtual" className="block">
              <Button className="w-full">
                Acessar Grow Virtual
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <Link href="/marketplace">
              <Button variant="ghost">
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
