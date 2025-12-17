'use client'

import { useState, useEffect, type ComponentType, type SVGProps } from 'react'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { AuthLoading } from '@/components/auth/AuthLoading'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'

interface OrderItem {
  id: string
  quantity: number
  price: string
  product: {
    name: string
    images: { url: string }[]
  }
}

interface Order {
  id: string
  status: string
  createdAt: string
  items: OrderItem[]
  _count: {
    items: number
  }
}

export default function MeusPedidosPage() {
  const { session, loading } = useRequireAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (session) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/my-orders')
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const cancelOrder = async (orderId: string, currentStatus: string) => {
  if (['SHIPPED', 'DELIVERED'].includes(currentStatus)) {
    alert('❌ Não é possível cancelar pedidos já enviados!')
    return
  }

  if (!confirm('Tem certeza que deseja cancelar este pedido?')) return

  try {
    const response = await fetch(`/api/orders/${orderId}/cancel`, {
      method: 'POST'
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error)
    }

    alert('✅ Pedido cancelado com sucesso!')
    fetchOrders()

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao cancelar pedido'
    alert('❌ ' + message)
  }
}


  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'secondary' | 'default' | 'destructive'; icon: ComponentType<SVGProps<SVGSVGElement>> }> = {
      PENDING: { 
        label: 'Pendente', 
        variant: 'secondary',
        icon: Clock
      },
      PROCESSING: { 
        label: 'Processando', 
        variant: 'default',
        icon: Package
      },
      SHIPPED: { 
        label: 'Enviado', 
        variant: 'default',
        icon: Truck
      },
      DELIVERED: { 
        label: 'Entregue', 
        variant: 'default',
        icon: CheckCircle
      },
      CANCELED: { 
        label: 'Cancelado', 
        variant: 'destructive',
        icon: XCircle
      }
    }

    const config = statusConfig[status] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </Badge>
    )
  }

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity)
    }, 0)
  }

  if (loading || !session) {
    return <AuthLoading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">📦 Meus Pedidos</h1>
          <p className="text-gray-600">Acompanhe o status das suas compras</p>
        </div>

        {loadingOrders ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Nenhum pedido ainda</h2>
              <p className="text-gray-600 mb-4">
                Você ainda não fez nenhuma compra
              </p>
              <Link href="/marketplace">
                <Button size="lg">
                  Ir para Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Pedido #{order.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Items do Pedido */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={item.product.images[0]?.url || '/placeholder.png'} 
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">
                            Quantidade: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            R$ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total e Ações */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Total do Pedido</p>
                      <p className="text-xl font-bold text-green-600">
                        R$ {calculateTotal(order.items).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/pedido/${order.id}`}>
                        <Button variant="outline">
                          Ver Detalhes
                        </Button>
                      </Link>
                      {order.status === 'DELIVERED' && (
                        <Button>
                          Avaliar Produtos
                        </Button>
                      )}
                      {order.status !== 'DELIVERED' && order.status !== 'CANCELED' && (
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelOrder(order.id, order.status)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Cancelar Pedido
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
