'use client'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react'

interface OrderItem {
  productId: string
  quantity: number
  price: number
  product?: {
    name: string
  }
}

interface Order {
  id: string
  status: string
  createdAt: string
  orderItems: OrderItem[]
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const orderId = searchParams.get('orderId')

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch('/api/orders')
        const data = await res.json()
        const found = (data.orders || []).find((o: Order) => o.id === orderId)
        setOrder(found || null)
      } catch (error) {
        console.error('Erro ao carregar pedido:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto p-6 max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <p className="text-lg">Pedido não encontrado.</p>
              <Link href="/marketplace">
                <Button>Voltar ao Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const total = order
    ? order.orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader className="text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
            <CardTitle className="text-2xl">
              Pedido realizado com sucesso!
            </CardTitle>
            <p className="text-gray-600">
              Código do pedido: <span className="font-mono">{orderId}</span>
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {loading && (
              <p className="text-center text-gray-600">Carregando dados do pedido...</p>
            )}

            {!loading && order && (
              <>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Status:{' '}
                    <span className="font-semibold text-green-700">
                      {order.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Itens do pedido:
                  </p>
                  <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                    {order.orderItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm"
                      >
                        <span className="line-clamp-1">
                          {item.product?.name || 'Produto'} x{item.quantity}
                        </span>
                        <span className="font-semibold">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {total !== null && (
                    <div className="flex justify-between font-bold text-lg mt-2">
                      <span>Total pago</span>
                      <span className="text-green-700">
                        R$ {total.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            {!loading && !order && (
              <p className="text-center text-gray-600">
                Não foi possível carregar os detalhes do pedido, mas ele foi criado
                com sucesso.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link href="/meus-pedidos">
                <Button className="w-full sm:w-auto">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Ver meus pedidos
                </Button>
              </Link>

              <Link href="/marketplace">
                <Button variant="outline" className="w-full sm:w-auto">
                  Continuar comprando
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
