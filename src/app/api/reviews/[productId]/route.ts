import { NextResponse } from 'next/server'

// Mock de reviews...
interface Review {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    comment: string;
}

const mockReviews: Review[] = [
    // ... seus reviews aqui ...
];

export async function GET(
  _request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params
    
    // Filtrar reviews pelo produto
    const productReviews = mockReviews.filter(review => review.productId === productId)

    return NextResponse.json({ reviews: productReviews })
  } catch (error) {
    console.error('Erro ao buscar reviews por produto:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}