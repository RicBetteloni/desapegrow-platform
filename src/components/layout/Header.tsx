'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User } from 'lucide-react'

type CartItem = {
  quantity: number
}

export default function Header() {
  const { data: session } = useSession()
  const isSeller = session?.user?.role === 'seller'
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Contador carrinho em tempo real
    const loadCartCount = () => {
      if (typeof window === 'undefined') {
        return
      }

      const savedCart = window.localStorage.getItem('cart')

      if (!savedCart) {
        setCartCount(0)
        return
      }

      try {
        const cart = JSON.parse(savedCart) as CartItem[]
        const total = cart.reduce((sum: number, item: CartItem) => sum + (item.quantity ?? 0), 0)
        setCartCount(total)
      } catch {
        setCartCount(0)
      }
    }

    loadCartCount()
    window.addEventListener('cartUpdated', loadCartCount)

    return () => {
      window.removeEventListener('cartUpdated', loadCartCount)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container flex h-16 items-center px-4">
        <Link href="/marketplace" className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-green-600 transition-colors">
          <span className="text-2xl">🌱</span>
          Desapegrow
        </Link>
        
        <div className="ml-auto flex items-center gap-3">
          {session ? (
            <>
              <Link href="/marketplace" className="cursor-pointer">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  🛒 Marketplace
                </Button>
              </Link>

              <Link href="/grow-virtual" className="cursor-pointer">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  🌱 Grow Virtual
                </Button>
              </Link>

              <Link href="/dashboard" className="cursor-pointer">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  📊 Dashboard
                </Button>
              </Link>

              <Link href="/analytics" className="cursor-pointer">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  📈 Analytics
                </Button>
              </Link>

              <Link href="/gamification" className="cursor-pointer">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  🎮 Gamificação
                </Button>
              </Link>

              <Link href="/meus-pedidos" className="cursor-pointer">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  📦 Meus Pedidos
                </Button>
              </Link>
              
              {(session.user as { isSeller?: boolean })?.isSeller && (
                <Link href="/vendedor" className="cursor-pointer">
                  <Button variant="ghost" size="sm" className="bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer">
                    🏪 Painel Vendedor
                  </Button>
                </Link>
              )}
              
              <Link href="/carrinho" className="cursor-pointer">
                <Button variant="ghost" size="sm" className="relative cursor-pointer">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </div>
                  )}
                </Button>
              </Link>
              
              <Link href="/perfil" className="cursor-pointer">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/auth/signin">
              <Button>Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
