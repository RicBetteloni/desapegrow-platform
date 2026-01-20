'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'

type CartItem = {
  quantity: number
}

export default function Header() {
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
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


  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1280px] mx-auto h-24 px-4 py-5 flex items-center gap-6">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image
            src="/logo/logo.svg"
            alt="Desapegrow"
            width={200}
            height={56}
            priority
            quality={100}
            className="h-14 md:h-16 w-auto"
          />
        </Link>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1">
          <div className="w-full relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos…"
              className="
                w-full h-10 pl-10 pr-4
                rounded-xl
                bg-[#F4F6F2]
                text-sm
                outline-none
                border border-transparent
                focus:border-[#DDE7D8]
              "
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              {/* Botão Anunciar - destaque - apenas desktop */}
              <Link href="/vendedor/produtos/novo" className="hidden md:block">
                <Button className="bg-[#E5A12A] hover:bg-[#F5B13A] text-white rounded-lg px-4 text-sm font-semibold">
                  + Anunciar Grátis
                </Button>
              </Link>

              {/* Carrinho */}
              <Link href="/carrinho">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              
              {/* Ícone Perfil - apenas desktop */}
              <Link href="/perfil" className="hidden md:block">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              {/* Hambúrguer - apenas mobile */}
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  className="text-sm font-medium hover:bg-gray-100"
                >
                  Entrar
                </Button>
              </Link>

              <Link href="/auth/signup">
                <Button className="bg-[#2F5F39] hover:bg-[#3A7347] text-white rounded-lg px-4 text-sm font-semibold">
                  Criar conta
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {/* Search Mobile */}
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar produtos…"
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#F4F6F2] text-sm outline-none border border-transparent focus:border-[#DDE7D8]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {session ? (
              <>
                <Link 
                  href="/vendedor/produtos/novo" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button className="w-full bg-[#E5A12A] hover:bg-[#F5B13A] text-white">
                    + Anunciar Grátis
                  </Button>
                </Link>
                
                <Link 
                  href="/marketplace" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-green-600"
                >
                  Marketplace
                </Link>
                
                <Link 
                  href="/perfil" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-green-600"
                >
                  Meu Perfil
                </Link>
                
                <Link 
                  href="/meus-pedidos" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-green-600"
                >
                  Meus Pedidos
                </Link>
                
                {session.user?.isSeller && (
                  <Link 
                    href="/vendedor" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-green-600"
                  >
                    Painel Vendedor
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                  className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/marketplace" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-green-600"
                >
                  Marketplace
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
