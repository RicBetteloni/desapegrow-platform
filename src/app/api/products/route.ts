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

// Produtos de demonstração
const demoProducts: Product[] = [
  {
    id: '1',
    name: 'LED Grow Light 150W Full Spectrum',
    description: 'LED de alta qualidade com espectro completo para todas as fases do cultivo. Ideal para plantas de interior, oferece eficiência energética superior e vida útil prolongada. Perfeito para iniciantes e profissionais.',
    shortDesc: 'Iluminação profissional para cultivo indoor',
    slug: 'led-grow-light-150w-full-spectrum',
    price: 189.90,
    comparePrice: 249.90,
    stock: 15,
    categoryId: '1',
    status: 'ACTIVE',
    images: [
      { url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600', alt: 'LED Grow Light' }
    ],
    seller: {
      businessName: 'Cultivo Pro',
      user: { name: 'João Silva' }
    },
    category: { name: 'Equipamentos de Iluminação' },
    totalReviews: 23,
    avgRating: 4.8
  },
  {
    id: '2', 
    name: 'Sistema Hidropônico NFT Completo',
    description: 'Sistema completo de hidroponia NFT (Nutrient Film Technique) para até 20 plantas. Inclui bomba, tubulações, reservatório e manual completo. Ideal para verduras e ervas aromáticas.',
    shortDesc: 'Sistema completo para cultivo hidropônico',
    slug: 'sistema-hidroponico-nft-completo',
    price: 299.90,
    stock: 8,
    categoryId: '3',
    status: 'ACTIVE',
    images: [
      { url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600', alt: 'Sistema Hidropônico' }
    ],
    seller: {
      businessName: 'HidroTech',
      user: { name: 'Maria Santos' }
    },
    category: { name: 'Sistemas Hidropônicos' },
    totalReviews: 15,
    avgRating: 4.6
  }
]

// Array para produtos dinâmicos
const dynamicProducts: Product[] = []

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

    dynamicProducts.push(product)
    return NextResponse.json({ product })

  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
  }
}

export async function GET() {
  // Retorna produtos demo + produtos dinâmicos
  const allProducts = [...demoProducts, ...dynamicProducts]
  return NextResponse.json({ products: allProducts })
}