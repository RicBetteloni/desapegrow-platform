'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react'

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export function CartSheet() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    loadCart()
    
    window.addEventListener('cartUpdated', loadCart)
    return () => window.removeEventListener('cartUpdated', loadCart)
  }, [])

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }

  const updateQuantity = (productId: string, change: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCartItems(updatedCart)
  }

  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCartItems(updatedCart)
  }

  const clearCart = () => {
    if (confirm('Deseja limpar o carrinho?')) {
      localStorage.removeItem('cart')
      setCartItems([])
    }
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      {/* Botão do Carrinho */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sheet Lateral */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '100%',
          maxWidth: '28rem',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms',
          backgroundColor: 'white',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.15)'
        }}
      >
        {/* Header Fixo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb',
          flexShrink: 0
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
            🛒 Carrinho ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              border: 'none',
              background: 'transparent'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Área de Items (Com Scroll) */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem'
        }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
              <ShoppingCart style={{ 
                width: '4rem', 
                height: '4rem', 
                margin: '0 auto 1rem',
                color: '#d1d5db'
              }} />
              <p style={{ color: '#6b7280' }}>Carrinho vazio</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => (
                <div key={item.productId} style={{
                  display: 'flex',
                  gap: '0.75rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  {/* Imagem */}
                  <div style={{ flexShrink: 0 }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '0.5rem',
                        display: 'block'
                      }}
                    />
                  </div>

                  {/* Informações */}
                  <div style={{ 
                    flex: 1, 
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      marginBottom: '0.25rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.25rem'
                    }}>
                      {item.name}
                    </h3>
                    
                    <p style={{ 
                      color: '#059669', 
                      fontWeight: 'bold',
                      marginBottom: '0.5rem'
                    }}>
                      R$ {item.price.toFixed(2)}
                    </p>
                    
                    {/* Controles */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem' 
                    }}>
                      <button
                        onClick={() => updateQuantity(item.productId, -1)}
                        disabled={item.quantity <= 1}
                        style={{
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          border: 'none',
                          background: item.quantity <= 1 ? '#f3f4f6' : 'transparent',
                          cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span style={{ 
                        fontWeight: 600, 
                        width: '2rem', 
                        textAlign: 'center' 
                      }}>
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.productId, 1)}
                        style={{
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => removeItem(item.productId)}
                        style={{
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          border: 'none',
                          background: 'transparent',
                          color: '#dc2626',
                          marginLeft: 'auto',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Fixo */}
        {cartItems.length > 0 && (
          <div style={{
            borderTop: '1px solid #e5e7eb',
            padding: '1rem',
            backgroundColor: 'white',
            flexShrink: 0
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              <span>Total:</span>
              <span style={{ color: '#059669' }}>R$ {total.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/checkout" onClick={() => setIsOpen(false)}>
                <Button className="w-full" size="lg">
                  Finalizar Compra
                </Button>
              </Link>
              
              <button
                onClick={clearCart}
                style={{
                  width: '100%',
                  fontSize: '0.875rem',
                  color: '#dc2626',
                  padding: '0.5rem',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#991b1b'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#dc2626'}
              >
                Limpar Carrinho
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
