import { NextRequest, NextResponse } from 'next/server'

// Mesmos produtos mock do arquivo anterior
const mockProducts = [
  {
    id: '1',
    name: 'LED Grow Light 150W Full Spectrum',
    description: 'LED de alta qualidade com espectro completo para todas as fases do cultivo. Consumo eficiente de energia e vida útil de mais de 50.000 horas. Ideal para cultivo indoor profissional.\n\nCaracterísticas:\n• Espectro completo 380-800nm\n• Consumo real: 150W\n• Cobertura: 60x60cm\n• Vida útil: 50.000 horas\n• Certificado IP65',
    shortDesc: 'Iluminação profissional para cultivo indoor',
    slug: 'led-grow-light-150w-full-spectrum',
    price: 189.90,
    comparePrice: 249.90,
    stock: 15,
    categoryId: '1',
    status: 'ACTIVE',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', alt: 'LED Grow Light' },
      { url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600', alt: 'LED em funcionamento' }
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
    description: 'Sistema completo de hidroponia NFT para até 20 plantas. Inclui bomba d\'água, tubulações, reservatório de 40L e manual completo de instalação. Perfeito para verduras e ervas.\n\nInclui:\n• Reservatório 40L\n• Bomba submersa 400L/h\n• 4 tubos NFT\n• Suportes e conexões\n• Manual de instalação',
    shortDesc: 'Sistema completo para cultivo hidropônico',
    slug: 'sistema-hidroponico-nft-completo',
    price: 299.90,
    stock: 8,
    categoryId: '3',
    status: 'ACTIVE',
    images: [
      { url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600', alt: 'Sistema Hidropônico' },
      { url: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600', alt: 'Plantas no sistema' }
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
    description: 'Fertilizante 100% orgânico rico em nutrientes essenciais. Formulado especialmente para plantas de crescimento rápido. Melhora a estrutura do solo e aumenta a produtividade.\n\nComposição:\n• NPK 10-10-10\n• Matéria orgânica 60%\n• Micronutrientes quelados\n• pH balanceado',
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    console.log('API: Buscando produto com slug:', slug)
    
    const product = mockProducts.find(p => p.slug === slug)
    
    if (!product) {
      console.log('API: Produto não encontrado para slug:', slug)
      console.log('API: Slugs disponíveis:', mockProducts.map(p => p.slug))
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    console.log('API: Produto encontrado:', product.name)
    return NextResponse.json({ product })
  } catch (error) {
    console.error('API: Erro ao buscar produto:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}