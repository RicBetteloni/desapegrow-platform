'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { ShoppingCart, Plus, Minus, X, Zap } from 'lucide-react'
import { useCart } from '../../hooks/useCart'

export function CartSheet() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeFromCart, updateQuantity, clearCart, total, totalItems, pointsEarned } = useCart()

  return (
    <>
      {/* Botão do Carrinho */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Carrinho
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            {totalItems}
          </Badge>
        )}
      </Button>

      {/* Overlay do Carrinho */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Carrinho ({totalItems})</span>
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Carrinho vazio</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="border rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 relative rounded overflow-hidden">
                            <Image
                              src={item.image || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100'}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{item.name}</h3>
                            <p className="text-sm font-bold text-green-600 mt-1">
                              R$ {item.price.toFixed(2).replace('.', ',')}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm w-8 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-600"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer com total */}
              {items.length > 0 && (
                <div className="border-t p-4 space-y-3">
                  <div className="bg-green-50 p-3 rounded">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center space-x-1">
                        <Zap className="h-4 w-4 text-green-600" />
                        <span>CultivoCoins:</span>
                      </span>
                      <span className="font-bold text-green-600">
                        +{pointsEarned}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      R$ {total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full">
                      Finalizar Compra
                    </Button>
                    <Button variant="outline" className="w-full" onClick={clearCart}>
                      Limpar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}