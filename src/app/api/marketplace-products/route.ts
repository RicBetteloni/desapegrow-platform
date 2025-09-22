import { NextResponse } from 'next/server'

export async function GET() {
  const products = [
    {
      id: '1',
      name: 'LED Grow Light 150W Full Spectrum',
      description: 'LED de alta qualidade com espectro completo para todas as fases do cultivo. Consumo eficiente de energia e vida útil de mais de 50.000 horas. Ideal para cultivo indoor profissional.',
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
      description: 'Sistema completo de hidroponia NFT para até 20 plantas. Inclui bomba d\'água, tubulações, reservatório de 40L e manual completo de instalação.',
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
    },
    {
      id: '3',
      name: 'Fertilizante Orgânico Premium 1kg',
      description: 'Fertilizante 100% orgânico rico em nutrientes essenciais. Formulado especialmente para plantas de crescimento rápido.',
      shortDesc: 'Nutrição orgânica premium para plantas',
      slug: 'fertilizante-organico-premium-1kg',
      price: 45.90,
      comparePrice: 59.90,
      stock: 25,
      categoryId: '4',
      status: 'ACTIVE',
      images: [
        { url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600', alt: 'Fertilizante Orgânico' }
      ],
      seller: {
        businessName: 'BioCultivo',
        user: { name: 'Pedro Costa' }
      },
      category: { name: 'Fertilizantes e Nutrição' },
      totalReviews: 31,
      avgRating: 4.9
    }
  ]

  return NextResponse.json({ products })
}