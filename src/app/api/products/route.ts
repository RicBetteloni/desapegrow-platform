import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

interface Product {
  id: string
  name: string
  description: string
  shortDesc?: string
  slug: string
  price: number
  comparePrice?: number
  stock: number
  categoryId: string
  status: string
  images: { url: string; alt: string }[]
  seller: {
    businessName?: string
    user: { name: string }
  }
  category: { name: string }
  totalReviews: number
  avgRating?: number
}

const products: Product[] = []

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    const product: Product = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      shortDesc: data.shortDesc,
      slug: data.name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-'),
      price: parseFloat(data.price),
      comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : undefined,
      stock: parseInt(data.stock),
      categoryId: data.categoryId,
      status: 'ACTIVE',
      images: data.images?.map((url: string) => ({ url, alt: data.name })) || [],
      seller: {
        businessName: undefined,
        user: { name: 'Vendedor Teste' }
      },
      category: { name: 'Categoria Teste' },
      totalReviews: 0,
      avgRating: undefined
    }

    products.push(product)
    return NextResponse.json({ product })

  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ products })
}