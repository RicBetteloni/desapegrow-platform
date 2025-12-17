'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User, Menu, X } from 'lucide-react'

type CartItem = {
  quantity: number
}

export default function Header() {
  const { data: session } = useSession()
  const isSeller = session?.user?.role === 'SELLER'
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const menuItems = [
    { href: '/marketplace', label: 'Marketplace', icon: '🛒' },
    { href: '/grow-virtual', label: 'Grow Virtual', icon: '🌱' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/analytics', label: 'Analytics', icon: '📈' },
    { href: '/gamification', label: 'Gamificação', icon: '🎮' },
    { href: '/meus-pedidos', label: 'Meus Pedidos', icon: '📦' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container flex h-16 items-center px-4 relative">
        <Link href="/marketplace" className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-green-600 transition-colors">
          <span className="text-2xl">🌱</span>
          <span className="hidden sm:inline">Desapegrow</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="ml-auto hidden lg:flex items-center gap-2">
          {session ? (
            <>
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href} className="cursor-pointer">
                  <Button variant="ghost" size="sm" className="cursor-pointer text-xs xl:text-sm">
                    <span className="hidden xl:inline">{item.icon} </span>{item.label}
                  </Button>
                </Link>
              ))}
              
              {isSeller && (
                <Link href="/vendedor" className="cursor-pointer">
                  <Button variant="ghost" size="sm" className="bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer text-xs xl:text-sm">
                    <span className="hidden xl:inline">🏪 </span>Vendedor
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

        {/* Mobile Navigation */}
        <div className="ml-auto flex lg:hidden items-center gap-2">
          {session && (
            <>
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

              <Button 
                variant="ghost" 
                size="sm" 
                className="cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </>
          )}

          {!session && (
            <Link href="/auth/signin">
              <Button size="sm">Entrar</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && session && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-40">
          <div className="container px-4 py-4 flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {isSeller && (
              <Link 
                href="/vendedor"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
              >
                <span className="text-2xl">🏪</span>
                <span className="font-medium text-green-700">Painel Vendedor</span>
              </Link>
            )}

            <div className="border-t pt-3 mt-2 flex flex-col gap-2">
              <Link 
                href="/perfil"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Meu Perfil</span>
              </Link>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false)
                  signOut()
                }}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
