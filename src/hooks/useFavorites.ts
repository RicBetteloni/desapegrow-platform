'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function useFavorites() {
  const { data: session } = useSession()
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      fetchFavorites()
    }
  }, [session])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites || [])
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (productId: string) => {
    if (!session?.user?.id) {
      // Redirecionar para login ou mostrar modal
      return
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.favorited) {
          setFavorites([...favorites, productId])
        } else {
          setFavorites(favorites.filter(id => id !== productId))
        }
      }
    } catch (error) {
      console.error('Erro ao alterar favorito:', error)
    }
  }

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorited: (productId: string) => favorites.includes(productId)
  }
}