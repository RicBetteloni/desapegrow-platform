import { NextRequest, NextResponse } from 'next/server'

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
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }  // <- aqui sim é 'productId'
) {
  try {
    const { productId } = await params  // <- usar 'productId' aqui
    
    // Filtrar reviews pelo produto
    const productReviews = mockReviews.filter(review => review.productId === productId)
    
    // ... resto do código
  } catch (error) {
    // ...
  }
}