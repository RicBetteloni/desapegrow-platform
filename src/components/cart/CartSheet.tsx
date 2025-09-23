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

  if (!isOpen) {
    return (
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
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <Card className="w-full max-w-md h-full overflow-hidden flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Seu Carrinho ({totalItems})</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative w-16 h-16 rounded overflow-hidden">
                      <Image
                        src={item.image || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                      <p className="text-sm font-bold text-primary mt-1">
                        R$ {item.price.toFixed(2).replace('.', ',')}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-600 hover:text-red-700"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>

        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Resumo gamificado */}
            <Card className="p-3 bg-green-50 border-green-200">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span>Você ganhará:</span>
                </span>
                <span className="font-bold text-green-600">
                  {pointsEarned} CultivoCoins
                </span>
              </div>
            </Card>

            {/* Total */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-xl font-bold text-primary">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-2">
              <Button className="w-full" size="lg">
                Finalizar Compra
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={clearCart}
              >
                Limpar Carrinho
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}