// src/app/api/marketplace-products/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    // Busca o produto no banco de dados pelo slug,
    // incluindo as informações de categoria e vendedor
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
        status: 'ACTIVE' // Apenas produtos ativos devem ser visíveis
      },
      include: {
        category: true,
        seller: {
          include: {
            user: true
          }
        },
        images: true
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    // Ajusta o formato de retorno para ser compatível com a interface do front-end
    const formattedProduct = {
      ...product,
      price: product.price.toNumber(), // Converte Decimal para Number
      comparePrice: product.comparePrice?.toNumber() ?? undefined,
      avgRating: product.avgRating?.toNumber() ?? undefined,
      seller: {
        businessName: product.seller.businessName,
        user: { name: product.seller.user.name }
      },
      // Aqui, o Prisma já retorna os campos de category e images corretamente
    }

    return NextResponse.json({ product: formattedProduct })
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}