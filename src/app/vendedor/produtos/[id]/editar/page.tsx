'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Upload, X } from 'lucide-react'

const CATEGORIAS = [
  { id: 'iluminacao', nome: 'Iluminação', icone: '💡' },
  { id: 'ventilacao', nome: 'Ventilação', icone: '🌀' },
  { id: 'nutrientes', nome: 'Nutrientes', icone: '🧪' },
  { id: 'tendas', nome: 'Tendas', icone: '🏠' },
  { id: 'ferramentas', nome: 'Ferramentas', icone: '🔧' }
]

export default function EditarProdutoPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const [formData, setFormData] = useState({
    name: '',
    shortDesc: '',
    description: '',
    categorySlug: '',
    price: '',
    comparePrice: '',
    stock: '',
    weight: '',
    status: 'ACTIVE'
  })

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/vendedor/products/${productId}`)
      if (!response.ok) throw new Error('Produto não encontrado')

      const data = await response.json()
      const product = data.product

      setFormData({
        name: product.name,
        shortDesc: product.shortDesc || '',
        description: product.description,
        categorySlug: product.category.slug,
        price: product.price.toString(),
        comparePrice: product.comparePrice ? product.comparePrice.toString() : '',
        stock: product.stock.toString(),
        weight: product.weight ? product.weight.toString() : '',
        status: product.status
      })

      setImageUrls(product.images.map((img: { url: string }) => img.url))
      
    } catch (error) {
      alert('Erro ao carregar produto')
      router.push('/vendedor')
    } finally {
      setLoading(false)
    }
  }

  const addImageUrl = () => {
    setImageUrls([...imageUrls, ''])
  }

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls]
    newUrls[index] = value
    setImageUrls(newUrls)
  }

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const validImageUrls = imageUrls.filter(url => url.trim() !== '')

      if (validImageUrls.length === 0) {
        alert('Adicione pelo menos uma imagem!')
        setSaving(false)
        return
      }

      const response = await fetch(`/api/vendedor/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
          stock: parseInt(formData.stock),
          weight: formData.weight ? parseFloat(formData.weight) : null,
          images: validImageUrls
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao atualizar produto')
      }

      alert('✅ Produto atualizado com sucesso!')
      router.push('/vendedor')

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      alert('❌ Erro: ' + message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-green-700">
            <span>🌱</span>
            <span>Desapegrow</span>
          </Link>
          <Link href="/vendedor">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto p-6 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">✏️ Editar Produto</h1>
          <p className="text-gray-600">Atualize as informações do produto</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="shortDesc">Descrição Curta</Label>
                <Input
                  id="shortDesc"
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({...formData, shortDesc: e.target.value})}
                  maxLength={100}
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição Completa *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.categorySlug}
                  onValueChange={(value) => setFormData({...formData, categorySlug: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icone} {cat.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Preço e Estoque */}
          <Card>
            <CardHeader>
              <CardTitle>Preço e Estoque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="comparePrice">Preço Comparação (R$)</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({...formData, comparePrice: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Quantidade em Estoque *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.001"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Imagens */}
          <Card>
            <CardHeader>
              <CardTitle>Imagens do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  {imageUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImageUrl(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addImageUrl}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Adicionar Mais Imagens
              </Button>

              {imageUrls.some(url => url.trim()) && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {imageUrls
                    .filter(url => url.trim())
                    .map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png'
                        }}
                      />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status do Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">✓ Ativo</SelectItem>
                  <SelectItem value="DRAFT">○ Rascunho</SelectItem>
                  <SelectItem value="INACTIVE">✕ Inativo</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex gap-4">
            <Link href="/vendedor" className="flex-1">
              <Button variant="outline" className="w-full" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? '⏳ Salvando...' : '✓ Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
