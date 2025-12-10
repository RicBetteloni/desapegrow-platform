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
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="container flex h-16 items-center px-4">
        <Link href="/marketplace" className="flex items-center gap-2 font-bold text-xl text-gradient-green hover:scale-105 transition-transform">
          <span className="text-2xl">🌱</span>
          Desapegrow
        </Link>
        
        <div className="ml-auto flex items-center gap-3">
          {session ? (
            <>
              <Link href="/marketplace">
                <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-700 transition-colors">
                  🛒 Marketplace
                </Button>
              </Link>
              
              {isSeller ? (
                <Link href="/vendedor">
                  <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-700 transition-colors">
                    📦 Vendedor
                  </Button>
                </Link>
              ) : (
                <Link href="/vendedor/meus-anuncios">
                  <Button variant="outline" size="sm" className="border-green-600 text-green-700 hover:bg-green-50 transition-colors">
                    Vender Agora
                  </Button>
                </Link>
              )}
              
              <Link href="/carrinho">
                <Button variant="ghost" size="sm" className="relative hover:bg-green-50 hover:text-green-700 transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-xs flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {cartCount > 9 ? '9+' : cartCount}
                    </div>
                  )}
                </Button>
              </Link>
              
              <Link href="/perfil">
                <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-700 transition-colors">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/auth/signin">
              <Button className="bg-gradient-green hover:opacity-90 transition-opacity">Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
