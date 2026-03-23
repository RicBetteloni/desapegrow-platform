import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    console.log('🛍️ Buscando produtos...')
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    console.log('📊 Parâmetros:', { search, category })

    // Verificar conexão com o banco
    await prisma.$connect()

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
      // Buscar a categoria pelo slug
      const categoryData = await prisma.category.findUnique({
        where: { slug: category },
        include: {
          subcategories: true
        }
      })

      if (categoryData) {
        // Se for uma categoria PAI (tem subcategorias), buscar produtos dela E das subcategorias
        if (categoryData.subcategories && categoryData.subcategories.length > 0) {
          const categoryIds = [categoryData.id, ...categoryData.subcategories.map(sub => sub.id)]
          where.categoryId = { in: categoryIds }
        } else {
          // Se for subcategoria ou categoria sem filhas, buscar apenas dela
          where.category = { slug: category }
        }
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
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

    console.log('✅ Produtos encontrados:', products.length)

    // Calcular média de avaliações
    const productsWithRatings = products.map(product => {
      const avgRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : null;
      
      return {
        ...product,
        avgRating,
        totalReviews: product.reviews.length
      };
    })

    return NextResponse.json({ products: productsWithRatings })
  } catch (error) {
    console.error('❌ Erro ao listar produtos:', error)
    console.error('❌ Detalhes do erro:', {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'Erro ao listar produtos', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}