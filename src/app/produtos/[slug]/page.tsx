'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../../../components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  stock: number
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/marketplace-products/${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data.product)
        } else {
          router.push('/marketplace')
        }
      } catch (error) {
        console.error('Erro:', error)
        router.push('/marketplace')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [params.slug, router])

  if (loading) return <div className="p-8">Carregando...</div>
  if (!product) return <div className="p-8">Produto não encontrado</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <Link href="/marketplace">
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-lg mb-4">{product.description}</p>
        <div className="text-2xl font-bold text-green-600">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </div>
        {product.comparePrice && (
          <div className="text-lg text-gray-500 line-through">
            R$ {product.comparePrice.toFixed(2).replace('.', ',')}
          </div>
        )}
        <p className="mt-4">Estoque: {product.stock} unidades</p>
      </div>
    </div>
  )
}