import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    let sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id }
    })

    // Se não existe, cria automaticamente
    if (!sellerProfile) {
      sellerProfile = await prisma.sellerProfile.create({
        data: {
          userId: session.user.id
        }
      })
    }

    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        sellerId: sellerProfile.id
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        category: {
          select: {
            slug: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    const productJSON = {
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      weight: product.weight ? Number(product.weight) : null
    }

    return NextResponse.json({ product: productJSON })

  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json({ error: 'Erro ao buscar produto' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    let sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id }
    })

    // Se não existe, cria automaticamente
    if (!sellerProfile) {
      sellerProfile = await prisma.sellerProfile.create({
        data: {
          userId: session.user.id
        }
      })
    }

    const body = await request.json()
    const {
      name,
      shortDesc,
      description,
      categorySlug,
      price,
      comparePrice,
      stock,
      weight,
      images,
      status
    } = body

    // Verificar se produto pertence ao vendedor
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        sellerId: sellerProfile.id
      }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    // Buscar categoria
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    })

    if (!category) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 400 })
    }

    // Deletar imagens antigas
    await prisma.productImage.deleteMany({
      where: { productId: params.id }
    })

    // Atualizar produto
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        categoryId: category.id,
        name,
        shortDesc: shortDesc || null,
        description,
        price,
        comparePrice: comparePrice || null,
        stock,
        weight: weight || null,
        status: status || 'ACTIVE',
        images: {
          create: images.map((url: string, index: number) => ({
            url,
            alt: name,
            order: index
          }))
        }
      }
    })

    return NextResponse.json({ success: true, productId: product.id })

  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    let sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id }
    })

    // Se não existe, cria automaticamente
    if (!sellerProfile) {
      sellerProfile = await prisma.sellerProfile.create({
        data: {
          userId: session.user.id
        }
      })
    }

    // Deletar produto (cascade vai deletar imagens)
    await prisma.product.delete({
      where: {
        id: params.id,
        sellerId: sellerProfile.id
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro ao deletar produto:', error)
    return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 })
  }
}
