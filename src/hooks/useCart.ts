'use client'

import { useState, useEffect } from 'react'

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
  const [items, setItems] = useState<CartItem[]>([])

  // Carregar carrinho do localStorage na inicialização
  useEffect(() => {
    const saved = localStorage.getItem('cart-items')
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

  // Salvar no localStorage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem('cart-items', JSON.stringify(items))
  }, [items])

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