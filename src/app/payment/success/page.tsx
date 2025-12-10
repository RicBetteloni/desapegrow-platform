'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const preferenceId = searchParams.get('preference_id')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center space-y-6">
          <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900">✅ Pagamento Aprovado!</h1>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Preference ID: <span className="font-mono">{preferenceId}</span></p>
            {orderId && <p>Pedido: <span className="font-mono">{orderId}</span></p>}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/meus-pedidos">
              <Button className="w-full">📋 Meus Pedidos</Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" className="w-full">🛒 Comprar Mais</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
