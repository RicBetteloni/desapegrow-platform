import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'newest'

    console.log('🔍 Buscando produtos:', { category, search, sortBy })

    // Construir filtros
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE'
    }

    if (category && category !== 'all') {
      where.category = {
        slug: category
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDesc: { contains: search, mode: 'insensitive' } }
      ]
    }
    // Definir ordenação
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
    
    switch (sortBy) {
      case 'price-asc':
        orderBy = { price: 'asc' }
        break
      case 'price-desc':
        orderBy = { price: 'desc' }
        break
      case 'popular':
        orderBy = { totalReviews: 'desc' }
        break
      case 'rating':
        orderBy = { avgRating: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Buscar produtos
    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 3
        },
        category: {
          select: {
            name: true,
            slug: true,
            icon: true
          }
        },
        seller: {
          select: {
            businessName: true,
            avgRating: true
          }
        }
      }
    })

    console.log('✅ Produtos encontrados:', products.length)

    // Converter Decimal para number para JSON
    const productsJSON = products.map(product => ({
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      weight: product.weight ? Number(product.weight) : null,
      height: product.height ? Number(product.height) : null,
      width: product.width ? Number(product.width) : null,
      length: product.length ? Number(product.length) : null,
      avgRating: product.avgRating ? Number(product.avgRating) : null,
      seller: {
        ...product.seller,
        avgRating: product.seller.avgRating ? Number(product.seller.avgRating) : null
      }
    }))

    return NextResponse.json({ products: productsJSON })

  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
