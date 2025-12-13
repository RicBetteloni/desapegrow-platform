import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE'
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true, // ← ADICIONE ESTA LINHA
        seller: {
          select: {
            id: true,
            user: { select: { name: true } },
          },
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calcular média de avaliações
    const productsWithRatings = products.map(product => {
      const avgRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : null;
      
      // Não incluir reviews no retorno para reduzir payload
      const { reviews, ...productData } = product;
      
      return {
        ...productData,
        avgRating,
        totalReviews: product.reviews.length
      };
    })

    return NextResponse.json({ products: productsWithRatings })
  } catch (error) {
    console.error('Erro ao listar produtos:', error)
    return NextResponse.json(
      { error: 'Erro ao listar produtos' },
      { status: 500 }
    )
  }
}