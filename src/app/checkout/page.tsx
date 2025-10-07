// src/app/checkout/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useItemUnlock } from '@/hooks/useItemUnlock'
import ItemUnlockedModal from '@/components/ItemUnlockedModal';
import { ShoppingCart, CreditCard, Package, Gift } from 'lucide-react'

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  
const { unlockItem, unlockedItem, rewards, showModal, closeModal } = useItemUnlock()

  // Carregar itens do carrinho do localStorage
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }

    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [session, status, router])

  // Calcular total
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 200 ? 0 : 15.90
  const total = subtotal + shipping

// SUBSTITUIR handleCheckout por:
const handleCheckout = async (e: React.FormEvent) => {
  e.preventDefault()
  setProcessingPayment(true)

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const orderResponse = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems, total, paymentMethod: 'credit_card' })
    })

    if (!orderResponse.ok) throw new Error('Erro ao criar pedido')
    const orderData = await orderResponse.json()

    // UNLOCK ITEMS
    for (const item of cartItems) {
      try {
        await unlockItem({ productId: item.productId, orderId: orderData.orderId })
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error('Erro ao desbloquear item:', error)
      }
    }

    localStorage.removeItem('cart')
    setShowSuccessMessage(true)

  } catch (error) {
    console.error('Erro no checkout:', error)
    alert('Erro ao processar pagamento.')
  } finally {
    setProcessingPayment(false)
  }
}

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-green-700">
            <span>🌱</span>
            <span>Desapegrow</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/marketplace">
              <Button variant="ghost">Voltar ao Marketplace</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🛒 Finalizar Compra</h1>
          <p className="text-gray-600">Complete seu pedido e desbloqueie itens virtuais!</p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Carrinho Vazio</h2>
              <p className="text-gray-600 mb-4">Adicione produtos ao carrinho para continuar</p>
              <Link href="/marketplace">
                <Button>Ir para Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Coluna Esquerda - Resumo do Pedido */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items do Carrinho */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Itens do Pedido</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">R$ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Bonus Card */}
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Gift className="w-8 h-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-purple-800">Bônus de Compra!</h3>
                      <p className="text-sm text-purple-700">
                        Cada produto desbloqueará um item virtual para seu Grow! 🎁
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formulário de Pagamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Dados de Pagamento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="cardName">Nome no Cartão</Label>
                        <Input 
                          id="cardName" 
                          placeholder="João Silva"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                        <Input 
                          id="cardNumber" 
                          placeholder="0000 0000 0000 0000"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiry">Validade</Label>
                        <Input 
                          id="expiry" 
                          placeholder="MM/AA"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv" 
                          placeholder="123"
                          type="password"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={processingPayment}
                    >
                      {processingPayment ? (
                        <>⏳ Processando Pagamento...</>
                      ) : (
                        <>🚀 Finalizar Compra - R$ {total.toFixed(2)}</>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Coluna Direita - Resumo de Valores */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Frete</span>
                      <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                        {shipping === 0 ? 'GRÁTIS' : `R$ ${shipping.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-600">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Bonus Preview */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-200">
                    <h4 className="font-semibold mb-2 text-orange-800">
                      🎁 Você vai desbloquear:
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>✨ {cartItems.length} {cartItems.length === 1 ? 'item virtual' : 'itens virtuais'}</li>
                      <li>🪙 CultivoCoins</li>
                      <li>💎 GrowthGems</li>
                      <li>⚡ Boosts para seu Grow</li>
                    </ul>
                  </div>

                  {subtotal < 200 && (
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                      💡 Adicione mais R$ {(200 - subtotal).toFixed(2)} para frete grátis!
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Item Desbloqueado */}
      <ItemUnlockedModal
        isOpen={showModal}
        item={unlockedItem || null}
        rewards={rewards || { cultivoCoins: 0, growthGems: 0 }}
        onClose={closeModal}
      />
    </div>
  )
}