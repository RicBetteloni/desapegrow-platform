'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Upload, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  subcategories?: Category[]
}

export default function NovoProdutoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([''])
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([false])
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

  // Carregar categorias do banco
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
        alert('Erro ao carregar categorias. Recarregue a página.')
      }
    }
    fetchCategories()
  }, [])

  const addImageUrl = () => {
    setUploadedImages([...uploadedImages, ''])
    setUploadingImages([...uploadingImages, false])
  }

  const handleImageUpload = async (index: number, file: File) => {
    try {
      // Marcar como fazendo upload
      const newUploadingStates = [...uploadingImages]
      newUploadingStates[index] = true
      setUploadingImages(newUploadingStates)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'produto')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Erro ao fazer upload')
      }
      
      // Atualizar URL da imagem
      const newImages = [...uploadedImages]
      newImages[index] = data.url
      setUploadedImages(newImages)

      alert('✅ Imagem enviada com sucesso!')
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      const message = error instanceof Error ? error.message : 'Erro ao fazer upload da imagem'
      alert('❌ ' + message)
    } finally {
      // Desmarcar upload
      const newUploadingStates = [...uploadingImages]
      newUploadingStates[index] = false
      setUploadingImages(newUploadingStates)
    }
  }

  const removeImageUrl = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
    setUploadingImages(uploadingImages.filter((_, i) => i !== index))
  }

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    setSelectedCategory(category || null)
    
    // Se a categoria não tem subcategorias, já seleciona ela mesma
    if (category && (!category.subcategories || category.subcategories.length === 0)) {
      setFormData({ ...formData, categorySlug: category.slug })
    } else {
      setFormData({ ...formData, categorySlug: '' })
    }
  }

  const handleSubcategoryChange = (subcategoryId: string) => {
    const subcategory = selectedCategory?.subcategories?.find(c => c.id === subcategoryId)
    if (subcategory) {
      setFormData({ ...formData, categorySlug: subcategory.slug })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validImageUrls = uploadedImages.filter(url => url.trim() !== '')

      if (validImageUrls.length === 0) {
        alert('Adicione pelo menos uma imagem!')
        setLoading(false)
        return
      }

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        stock: parseInt(formData.stock),
        weight: formData.weight ? parseFloat(formData.weight) : null,
        images: validImageUrls
      }

      console.log('📦 Enviando produto:', payload)

      const response = await fetch('/api/vendedor/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      console.log('📡 Resposta da API:', data)

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Erro ao criar produto')
      }

      alert('✅ Produto criado com sucesso!')
      router.push('/vendedor')

    } catch (error) {
      console.error('❌ Erro completo:', error)
      const message = error instanceof Error ? error.message : 'Erro ao criar produto'
      alert('❌ ' + message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-6 max-w-3xl">
        <div className="mb-6">
          <Link href="/vendedor">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">📦 Novo Produto</h1>
          <p className="text-gray-600">Preencha as informações do produto</p>
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
                  placeholder="Ex: LED Grow Light 300W"
                  required
                />
              </div>

              <div>
                <Label htmlFor="shortDesc">Descrição Curta</Label>
                <Input
                  id="shortDesc"
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({...formData, shortDesc: e.target.value})}
                  placeholder="Resumo de 1 linha"
                  maxLength={100}
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição Completa *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descrição detalhada do produto..."
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria Principal *</Label>
                <Select
                  value={selectedCategory?.id || ''}
                  onValueChange={handleCategoryChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
                <div>
                  <Label htmlFor="subcategory">Subcategoria *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={handleSubcategoryChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma subcategoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory.subcategories.map((subcat) => (
                        <SelectItem key={subcat.id} value={subcat.id}>
                          {subcat.icon} {subcat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedCategory && (!selectedCategory.subcategories || selectedCategory.subcategories.length === 0) && (
                <input type="hidden" value={formData.categoryId} />
              )}
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
                    placeholder="0.00"
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
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Preço antigo para mostrar desconto
                  </p>
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
                    placeholder="0"
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
                    placeholder="0.000"
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
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800">
                � <strong>Upload de Imagens:</strong> Selecione até 5 imagens do seu computador (JPG, PNG, WEBP - máx 5MB cada)
              </div>

              {uploadedImages.map((url, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`file-${index}`} className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
                          <div className="flex items-center justify-center gap-2">
                            <Upload className="w-5 h-5 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {url ? 'Alterar imagem' : 'Selecionar imagem'}
                            </span>
                          </div>
                          <input
                            id={`file-${index}`}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(index, file)
                            }}
                            className="hidden"
                            disabled={uploadingImages[index]}
                          />
                        </div>
                      </Label>
                    </div>
                    {uploadedImages.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeImageUrl(index)}
                        disabled={uploadingImages[index]}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {uploadingImages[index] && (
                    <div className="text-sm text-blue-600 flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Fazendo upload...
                    </div>
                  )}
                  
                  {url && !uploadingImages[index] && (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                        ✓ Enviada
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {uploadedImages.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addImageUrl}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Adicionar Mais Imagens
                </Button>
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
                  <SelectItem value="ACTIVE">✓ Ativo (visível no marketplace)</SelectItem>
                  <SelectItem value="DRAFT">○ Rascunho (não visível)</SelectItem>
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
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? '⏳ Criando...' : '✓ Criar Produto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
