'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  stock: number
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
  images: { url: string }[]
}

export function useCart() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Gera a chave do localStorage baseada no usuário
  const getCartKey = () => {
    if (session?.user?.id) {
      return `cart-items-${session.user.id}`
    }
    return 'cart-items-guest'
  }

  // Carregar carrinho do localStorage quando o usuário estiver autenticado
  useEffect(() => {
    if (status === 'loading') return

    const cartKey = getCartKey()
    const saved = localStorage.getItem(cartKey)
    
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
        localStorage.removeItem(cartKey)
        setItems([])
      }
    } else {
      setItems([])
    }
    
    // Limpar carrinho de convidado se usuário fez login
    if (session?.user?.id) {
      localStorage.removeItem('cart-items-guest')
    }
    
    setIsInitialized(true)
  }, [session?.user?.id, status])

  // Salvar no localStorage sempre que o carrinho mudar (apenas se já inicializou)
  useEffect(() => {
    if (!isInitialized) return
    
    const cartKey = getCartKey()
    localStorage.setItem(cartKey, JSON.stringify(items))
  }, [items, session?.user?.id, isInitialized])

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(current => {
      const existingItem = current.find(item => item.id === product.id)
      
      if (existingItem) {
        // Se já existe, aumenta quantidade
        return current.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        )
      } else {
        // Adiciona novo item
        return [...current, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: Math.min(quantity, product.stock),
          image: product.images[0]?.url || '',
          stock: product.stock
        }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setItems(current => current.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems(current =>
      current.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const pointsEarned = Math.floor(total * 0.05) // 5% em pontos

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    totalItems,
    pointsEarned
  }
}