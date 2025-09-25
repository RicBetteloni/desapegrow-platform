import { NextRequest, NextResponse } from 'next/server'

type Product = {
  slug: string;
  // Adicione outras propriedades relevantes aqui, se necessário
};

const products: Product[] = [
  // ... seus produtos ...
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }  // <- Adicionar Promise aqui
) {
  try {
    const { slug } = await params  // <- Adicionar await aqui
    const product = products.find(p => p.slug === slug)
    
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}