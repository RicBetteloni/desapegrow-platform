'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react'

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function CarrinhoPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    loadCart()
    const handler = () => loadCart()
    window.addEventListener('cartUpdated', handler)
    return () => window.removeEventListener('cartUpdated', handler)
  }, [])

  const loadCart = () => {
    const savedCart = typeof window !== 'undefined'
      ? localStorage.getItem('cart')
      : null
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch {
        setCartItems([])
      }
    } else {
      setCartItems([])
    }
  }

  const updateQuantity = (productId: string, change: number) => {
    const updated = cartItems.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQty }
      }
      return item
    })
    localStorage.setItem('cart', JSON.stringify(updated))
    setCartItems(updated)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeItem = (productId: string) => {
    const updated = cartItems.filter(item => item.productId !== productId)
    localStorage.setItem('cart', JSON.stringify(updated))
    setCartItems(updated)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const clearCart = () => {
    if (!confirm('Deseja limpar o carrinho?')) return
    localStorage.removeItem('cart')
    setCartItems([])
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <ShoppingCart className="w-7 h-7" />
          Meu Carrinho
        </h1>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 mb-4">
                Seu carrinho está vazio no momento.
              </p>
              <Link href="/marketplace">
                <Button>Ir para o marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-[2fr,1fr] gap-6">
            {/* Lista de itens */}
            <Card>
              <CardContent className="p-4 space-y-4">
                {cartItems.map(item => (
                  <div
                    key={item.productId}
                    className="flex gap-3 border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-green-700 font-bold mt-1">
                        R$ {item.price.toFixed(2)}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.productId, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.productId, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          className="ml-auto text-red-600 hover:text-red-700"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Resumo */}
            <Card>
              <CardContent className="p-6 space-y-4 sticky top-6">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-green-700">
                    R$ {total.toFixed(2)}
                  </span>
                </div>

                <Link href="/checkout">
                  <Button className="w-full" size="lg">
                    Finalizar compra
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700"
                  onClick={clearCart}
                >
                  Limpar carrinho
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* BOTÕES DE NAVEGAÇÃO - NOVO */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link href="/marketplace">
            <Button variant="outline" className="w-full sm:w-auto">
              ← Continuar Comprando
            </Button>
          </Link>
          <Link href="/vendedor/pedidos">
            <Button variant="outline" className="w-full sm:w-auto">
              📋 Meus Pedidos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
