import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se o usuário tem perfil de vendedor
    let sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id }
    })

    // Se não tem, criar um perfil básico
    if (!sellerProfile) {
      sellerProfile = await prisma.sellerProfile.create({
        data: {
          userId: session.user.id
        }
      })
    }

    const data = await req.json()
    
    // Criar slug do nome
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description,
        shortDesc: data.shortDesc,
        price: parseFloat(data.price),
        comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : null,
        stock: parseInt(data.stock),
        categoryId: data.categoryId,
        sellerId: sellerProfile.id,
        status: 'ACTIVE',
        images: {
          create: data.images?.map((url: string, index: number) => ({
            url,
            order: index
          })) || []
        }
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

    return NextResponse.json({ product })

  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: {
        category: true,
        seller: {
          include: {
            user: true
          }
        },
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}