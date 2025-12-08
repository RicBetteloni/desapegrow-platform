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
  
  // Formulário
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

    if (!validateForm()) {
      return
    }

    if (cartItems.length === 0) {
      setError('Carrinho está vazio')
      return
    }

    setLoading(true)

    try {
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          })),
          total,
          paymentMethod: 'simulated',
          // Dados cliente (opcional, pode salvar em Order depois)
          customer: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            cpf: formData.cpf,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao processar pedido')
        return
      }

      // Limpar carrinho
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('cartUpdated'))

      // Redirecionar para sucesso
      router.push(`/checkout/sucesso?orderId=${data.order.id}`)
    } catch (err) {
      console.error('Erro checkout:', err)
      setError('Erro ao processar compra. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
          {/* Formulário */}
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

                {/* Nome Completo */}
                <div>
                  <label className="block text-sm font-medium mb-2">Nome Completo *</label>
                  <Input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="João Silva"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="joao@email.com"
                    required
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone *</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-sm font-medium mb-2">CPF *</label>
                  <Input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                {/* Endereço */}
                <div>
                  <label className="block text-sm font-medium mb-2">Endereço *</label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Rua das Flores"
                    required
                  />
                </div>

                {/* Número */}
                <div>
                  <label className="block text-sm font-medium mb-2">Número *</label>
                  <Input
                    type="text"
                    name="addressNumber"
                    value={formData.addressNumber}
                    onChange={handleInputChange}
                    placeholder="123"
                    required
                  />
                </div>

                {/* Complemento */}
                <div>
                  <label className="block text-sm font-medium mb-2">Complemento</label>
                  <Input
                    type="text"
                    name="addressComplement"
                    value={formData.addressComplement}
                    onChange={handleInputChange}
                    placeholder="Apto 42"
                  />
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-sm font-medium mb-2">Cidade *</label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="São Paulo"
                    required
                  />
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium mb-2">Estado *</label>
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

                {/* CEP */}
                <div>
                  <label className="block text-sm font-medium mb-2">CEP *</label>
                  <Input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="01234-567"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Processando...' : 'Confirmar Compra'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resumo */}
          <Card className="h-fit sticky top-6">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="line-clamp-1">{item.name} x{item.quantity}</span>
                    <span className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</span>
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
                  ← Voltar ao Carrinho
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
