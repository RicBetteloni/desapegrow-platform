'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { AuthLoading } from '@/components/auth/AuthLoading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

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
  buyer: {
    name: string
    email: string
  }
  total: number
}

export default function PedidosVendedorPage() {
  const { session, loading } = useRequireAuth('/auth/signin')
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/vendedor/orders', {
        credentials: 'include'
      })
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Erro ao carregar pedidos do vendedor:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
      PENDING: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      PROCESSING: { label: 'Processando', color: 'bg-blue-100 text-blue-800', icon: Package },
      SHIPPED: { label: 'Enviado', color: 'bg-purple-100 text-purple-800', icon: Truck },
      DELIVERED: { label: 'Entregue', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CANCELED: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle }
    }

    const cfg = map[status] || map.PENDING
    const Icon = cfg.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
        <Icon className="w-3 h-3" />
        {cfg.label}
      </span>
    )
  }

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId)
    try {
      const response = await fetch(`/api/vendedor/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar status')
      }

      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status } : o)
      )
    } catch (err) {
      console.error(err)
      alert('Erro ao atualizar status do pedido')
    } finally {
      setUpdating(null)
    }
  }

  if (loading || !session) return <AuthLoading />

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">💰 Minhas Vendas</h1>
          <p className="text-gray-600">Acompanhe e gerencie os pedidos dos seus produtos</p>
        </div>

        {loadingOrders ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">Nenhum pedido ainda</h2>
              <p className="text-gray-600">
                Assim que um cliente comprar seus produtos, os pedidos aparecerão aqui.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Pedido #{order.id.slice(0, 8)}
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Comprador: <span className="font-semibold">{order.buyer.name}</span> ({order.buyer.email})
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(order.status)}
                    <p className="text-sm font-semibold text-green-700">
                      Total: R$ {order.total.toFixed(2)}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Itens */}
                  <div className="space-y-2">
                    {order.items.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 bg-gray-50 rounded-md p-2"
                      >
                        <img
                          src={item.product.images[0]?.url || '/placeholder.png'}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qtde: {item.quantity} • R$ {parseFloat(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ações de Status */}
                  <div className="flex flex-wrap gap-2 justify-end border-t pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updating === order.id || order.status === 'PENDING'}
                      onClick={() => updateStatus(order.id, 'PENDING')}
                    >
                      Marcar como Pendente
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updating === order.id || order.status === 'PROCESSING'}
                      onClick={() => updateStatus(order.id, 'PROCESSING')}
                    >
                      Em Processamento
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updating === order.id || order.status === 'SHIPPED'}
                      onClick={() => updateStatus(order.id, 'SHIPPED')}
                    >
                      Enviado
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updating === order.id || order.status === 'DELIVERED'}
                      onClick={() => updateStatus(order.id, 'DELIVERED')}
                    >
                      Entregue
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      disabled={updating === order.id || order.status === 'CANCELED'}
                      onClick={() => updateStatus(order.id, 'CANCELED')}
                    >
                      Cancelar
                    </Button>
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
