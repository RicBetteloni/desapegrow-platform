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
  const isAdmin = session?.user?.role === 'ADMIN'
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

  // Menu items dinâmicos baseados no role
  const menuItems = [
    { href: '/marketplace', label: 'Marketplace', icon: '🛒', roles: ['BUYER', 'SELLER', 'ADMIN'] },
    { href: '/grow-virtual', label: 'Grow Virtual', icon: '🌱', roles: ['BUYER', 'SELLER', 'ADMIN'] },
    { href: '/gamification', label: 'Gamificação', icon: '🎮', roles: ['BUYER', 'SELLER', 'ADMIN'] },
    { href: '/meus-pedidos', label: 'Meus Pedidos', icon: '📦', roles: ['BUYER', 'SELLER', 'ADMIN'] },
    { href: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['ADMIN'] },
    { href: '/analytics', label: 'Analytics', icon: '📈', roles: ['ADMIN'] },
  ].filter(item => !session?.user?.role || item.roles.includes(session.user.role))

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white shadow-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/marketplace" className="flex items-center gap-2 font-bold text-lg md:text-xl text-gray-900 hover:text-green-600 transition-colors">
            <span className="text-2xl">🌱</span>
            <span>Desapegrow</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
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
                      <span className="hidden xl:inline">🏪 </span>Área do Vendedor
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
          </nav>

          {/* Mobile Navigation */}
          <nav className="flex lg:hidden items-center gap-2">
            {session ? (
              <>
                {/* Carrinho Mobile */}
                <Link href="/carrinho">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-6 w-6 text-gray-700" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* Menu Hamburguer */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-7 w-7 text-gray-700" />
                  ) : (
                    <Menu className="h-7 w-7 text-gray-700" />
                  )}
                </Button>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6">
                  Entrar
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Menu Dropdown - Outside header for better positioning */}
      {mobileMenuOpen && session && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/20 z-40 top-16"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu */}
          <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b shadow-xl z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-4 flex flex-col gap-2">
              {menuItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-green-50 active:bg-green-100 transition-colors border border-transparent hover:border-green-200"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium text-base">{item.label}</span>
                </Link>
              ))}

              {isSeller && (
                <Link 
                  href="/vendedor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-lg bg-green-50 hover:bg-green-100 active:bg-green-200 transition-colors border border-green-200"
                >
                  <span className="text-2xl">🏪</span>
                  <span className="font-medium text-green-700 text-base">Painel Vendedor</span>
                </Link>
              )}

              <div className="border-t pt-3 mt-2 flex flex-col gap-2">
                <Link 
                  href="/perfil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="font-medium text-base">Meu Perfil</span>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base"
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
        </>
      )}
    </>
  )
}
