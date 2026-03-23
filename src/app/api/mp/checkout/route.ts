import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest
) {
  try {
    const slug = request.nextUrl.searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug do produto é obrigatório' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findFirst({
      where: { slug },
      include: {
        category: { select: { name: true } },
        seller: {
          select: {
            id: true,
            user: { select: { name: true } },
          },
        },
        images: { select: { url: true, alt: true } },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
