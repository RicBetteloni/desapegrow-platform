import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    console.log('🔍 Buscando produto:', slug)

    const product = await prisma.product.findUnique({
      where: { 
        slug,
        status: 'ACTIVE'
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
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

    if (!product) {
      console.log('❌ Produto não encontrado:', slug)
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Produto encontrado:', product.name)

    // Converter Decimal para number
    const productJSON = {
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      avgRating: product.avgRating ? Number(product.avgRating) : null,
      seller: {
        ...product.seller,
        avgRating: product.seller.avgRating ? Number(product.seller.avgRating) : null
      }
    }

    return NextResponse.json({ product: productJSON })

  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
      { status: 500 }
    )
  }
}
