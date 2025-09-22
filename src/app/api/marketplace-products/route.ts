import { NextResponse } from 'next/server'

export async function GET() {
  const products = [
    {
      id: '1',
      name: 'LED Grow Light 150W Full Spectrum',
      description: 'LED de alta qualidade com espectro completo para todas as fases do cultivo.',
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
    }
  ]

  return NextResponse.json({ products })
}