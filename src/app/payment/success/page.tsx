'use client'

export const dynamic = 'force-dynamic'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2 } from 'lucide-react'

interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  status: string
  total: number
  items: OrderItem[]
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const preferenceId = searchParams.get('preference_id')
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    // Limpar carrinho quando chegar na página de sucesso
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('cartUpdated'))
    }

    const loadOrder = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (!res.ok) {
          setLoading(false)
          return
        }
        const data = await res.json()
        setOrder(data.order)
      } catch {
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center space-y-6">
          <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900">
            ✅ Pagamento processado!
          </h1>

          {order && (
            <div className="bg-gray-50 rounded-lg p-4 text-left text-sm space-y-2">
              <p>
                <span className="font-semibold">Pedido:</span> {order.id}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {order.status}
              </p>
              <p className="font-semibold mt-2">Itens:</p>
              {order.items.map(item => (
                <div
                  key={item.productId}
                  className="flex justify-between text-xs"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <p className="font-semibold mt-2">
                Total: R$ {order.total.toFixed(2)}
              </p>
            </div>
          )}

          {preferenceId && (
            <p className="text-xs text-gray-500">
              Preference ID: <span className="font-mono">{preferenceId}</span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/meus-pedidos">
              <Button className="w-full">📋 Meus pedidos</Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" className="w-full">
                🛒 Comprar mais
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
