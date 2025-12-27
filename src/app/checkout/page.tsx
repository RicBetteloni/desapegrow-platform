'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ShoppingCart, AlertCircle } from 'lucide-react'

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
    addressNumber: '',
    addressComplement: '',
    city: '',
    state: '',
    zipCode: ''
  })

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    if (typeof window === 'undefined') return
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch {
        setCartItems([])
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError('Nome completo é obrigatório')
      return false
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Email válido é obrigatório')
      return false
    }
    if (!formData.phone.trim()) {
      setError('Telefone é obrigatório')
      return false
    }
    if (!formData.cpf.trim() || formData.cpf.replace(/\D/g, '').length !== 11) {
      setError('CPF válido é obrigatório')
      return false
    }
    if (!formData.address.trim()) {
      setError('Endereço é obrigatório')
      return false
    }
    if (!formData.city.trim()) {
      setError('Cidade é obrigatória')
      return false
    }
    if (!formData.state.trim()) {
      setError('Estado é obrigatório')
      return false
    }
    if (!formData.zipCode.trim()) {
      setError('CEP é obrigatório')
      return false
    }
    return true
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return
    if (cartItems.length === 0) {
      setError('Seu carrinho está vazio')
      return
    }

    setLoading(true)

    try {
      // 1. Cria pedido no banco
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          })),
          total,
          paymentMethod: 'mercadopago'
        })
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        if (orderData.code === 'USER_NOT_FOUND') {
          setError('Sua sessão expirou. Por favor, faça logout e login novamente.')
        } else {
          setError(orderData.error || 'Erro ao criar pedido')
        }
        return
      }

      const orderId = orderData.order.id

      // 2. Cria preferência no Mercado Pago
      const mpResponse = await fetch('/api/payment/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity
          })),
          orderId
        })
      })

      const mpData = await mpResponse.json()

      if (!mpResponse.ok) {
        setError(mpData.error || 'Erro ao processar pagamento')
        return
      }

      // Modo TESTE - usar sandboxInitPoint para credenciais de teste
      // Use cartões de teste do Mercado Pago
      const redirectUrl = mpData.sandboxInitPoint || mpData.initPoint || mpData.init_point

      if (!redirectUrl) {
        setError('URL de pagamento não retornada pelo Mercado Pago')
        console.error('❌ MP Response:', mpData)
        return
      }

      console.log('✅ URL de redirecionamento:', redirectUrl)
      console.log('🧪 Modo TESTE - Use cartões de teste do Mercado Pago')

      // NÃO limpar carrinho aqui - só limpar após confirmação de pagamento
      // O carrinho será limpo na página de sucesso do pagamento

      // 3. Redireciona para o checkout do Mercado Pago
      console.log('🔀 Redirecionando para Mercado Pago...')
      window.location.href = redirectUrl
    } catch (err) {
      console.error('Erro checkout:', err)
      setError('Erro ao processar compra')
    } finally {
      setLoading(false)
    }
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto p-6 max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
              <Link href="/marketplace">
                <Button>Voltar ao Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">💳 Finalizar Compra</h1>

        <div className="grid md:grid-cols-[2fr,1fr] gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckout} className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nome Completo *
                  </label>
                  <Input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="João Silva"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Telefone *
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="11999999999"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    CPF *
                  </label>
                  <Input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="00000000000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Endereço *
                  </label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Rua das Flores"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Número *
                  </label>
                  <Input
                    type="text"
                    name="addressNumber"
                    value={formData.addressNumber}
                    onChange={handleInputChange}
                    placeholder="123"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Complemento
                  </label>
                  <Input
                    type="text"
                    name="addressComplement"
                    value={formData.addressComplement}
                    onChange={handleInputChange}
                    placeholder="Apto 42"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cidade *
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="São Paulo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estado *
                  </label>
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="SP"
                    maxLength={2}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    CEP *
                  </label>
                  <Input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="01234567"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Processando...' : 'Ir para pagamento'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="h-fit sticky top-6">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cartItems.map(item => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm"
                  >
                    <span className="line-clamp-1">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-semibold">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Frete</span>
                  <span>Cálculo na entrega</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-green-600 border-t pt-2">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/carrinho">
                <Button variant="outline" className="w-full">
                  ← Voltar ao carrinho
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
