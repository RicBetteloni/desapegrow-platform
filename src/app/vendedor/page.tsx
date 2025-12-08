'use client'
import { useState, useEffect } from 'react'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { AuthLoading } from '@/components/auth/AuthLoading'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Package, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  status: string
  images: { url: string }[]
  totalReviews: number
  avgRating: number | null
}

interface Stats {
  totalProducts: number
  activeProducts: number
  totalOrders: number
  totalRevenue: number
}

export default function VendedorDashboard() {
  const { session, loading } = useRequireAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (session) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      const [productsRes, statsRes] = await Promise.all([
        fetch('/api/vendedor/products'),
        fetch('/api/vendedor/stats')
      ])

      const productsData = await productsRes.json()
      const statsData = await statsRes.json()

      setProducts(productsData.products || [])
      setStats(statsData.stats || {
        totalProducts: 0,
        activeProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Deseja realmente excluir este produto?')) return

    try {
      const response = await fetch(`/api/vendedor/products/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
        alert('Produto excluído com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      alert('Erro ao excluir produto')
    }
  }

  if (loading || !session) {
    return <AuthLoading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-6">
        {/* Header da Página */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">🏪 Painel do Vendedor</h1>
            <p className="text-gray-600">Gerencie seus produtos e vendas</p>
          </div>
          <div className="flex gap-2">
            <Link href="/vendedor/produtos/novo">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Novo Produto
              </Button>
            </Link>
            <Link href="/vendedor/pedidos">
              <Button variant="outline" size="lg">
                📋 Ver Pedidos
              </Button>
            </Link>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        {loadingData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total de Produtos
                  </CardTitle>
                  <Package className="w-4 h-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Produtos Ativos
                  </CardTitle>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats?.activeProducts || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total de Vendas
                  </CardTitle>
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats?.totalOrders || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Receita Total
                  </CardTitle>
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    R$ {stats?.totalRevenue.toFixed(2) || '0.00'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Produtos */}
            <Card>
              <CardHeader>
                <CardTitle>Meus Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 mb-4">Você ainda não tem produtos cadastrados</p>
                    <Link href="/vendedor/produtos/novo">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Cadastrar Primeiro Produto
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {/* Imagem */}
                        <img
                          src={product.images[0]?.url || '/placeholder.png'}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />

                        {/* Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span>Preço: R$ {product.price.toFixed(2)}</span>
                            <span>Estoque: {product.stock}</span>
                            <span className={`font-semibold ${
                              product.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'
                            }`}>
                              {product.status === 'ACTIVE' ? '✓ Ativo' : '○ Inativo'}
                            </span>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex gap-2">
                          <Link href={`/produtos/${product.slug}`} target="_blank">
                            <Button variant="outline" size="sm" title="Ver como aparece no marketplace">
                              👁️
                            </Button>
                          </Link>

                          <Link href={`/vendedor/produtos/${product.id}/editar`}>
                            <Button variant="outline" size="sm" title="Editar produto">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Excluir produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* BOTÕES DE NAVEGAÇÃO - NOVO */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link href="/marketplace">
            <Button className="w-full sm:w-auto">🛒 Ver Marketplace</Button>
          </Link>
          <Link href="/vendedor/pedidos">
            <Button variant="outline" className="w-full sm:w-auto">📋 Meus Pedidos</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
