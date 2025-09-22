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

function getProducts(): Product[] {
  return [
    {
      id: '1',
      name: 'LED Grow Light 150W Full Spectrum',
      description: 'LED de alta qualidade com espectro completo para todas as fases do cultivo. Consumo eficiente de energia e vida útil de mais de 50.000 horas.',
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
      description: 'Sistema completo de hidroponia NFT para até 20 plantas. Inclui bomba, tubulações e reservatório.',
      shortDesc: 'Sistema completo para cultivo hidropônico',
      slug: 'sistema-hidroponico-nft-completo',
      price: 299.90,
      stock: 8,
      categoryId: '3',
      status: 'ACTIVE',
      images: [
        { url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600', alt: 'Sistema Hidropônico' }
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
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    return NextResponse.json({ 
      message: 'Produto criado com sucesso (demonstração)',
      product: {
        id: Date.now().toString(),
        name: data.name,
        slug: data.name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-')
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
  }
}

export async function GET() {
  const products = getProducts()
  return NextResponse.json({ products })
}