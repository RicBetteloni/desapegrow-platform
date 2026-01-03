'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type CartItem = {
  quantity: number
}

export default function Header() {
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
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
    <header className="sticky top-0 z-40 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1280px] mx-auto h-24 px-4 py-5 flex items-center gap-6">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo/logo.svg"
            alt="Desapegrow"
            width={200}
            height={60}
            priority
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
              
              <Link href="/perfil">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
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
            </>
          )}
        </div>
      </div>
    </header>
  )
}
