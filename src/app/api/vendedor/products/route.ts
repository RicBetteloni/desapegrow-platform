import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()

    console.log('🔐 Session:', session)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Buscar perfil de vendedor
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        products: {
          include: {
            images: {
              take: 1,
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    console.log('👤 Seller Profile:', {
      found: !!sellerProfile,
      sellerId: sellerProfile?.id,
      productsCount: sellerProfile?.products.length
    })

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Perfil de vendedor não encontrado' }, { status: 404 })
    }

    // Converter produtos para JSON
    const productsJSON = sellerProfile.products.map(p => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      avgRating: p.avgRating ? Number(p.avgRating) : null
    }))

    console.log('✅ Produtos retornados:', productsJSON.length)

    return NextResponse.json({ products: productsJSON })

  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error)
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    console.log('🔐 POST Session:', session)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id }
    })

    console.log('👤 Seller Profile na criação:', {
      found: !!sellerProfile,
      sellerId: sellerProfile?.id,
      userId: session.user.id
    })

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Perfil de vendedor não encontrado' }, { status: 404 })
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

    // Gerar slug
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      + '-' + Date.now()

    // Buscar categoria
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    })

    if (!category) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 400 })
    }

    console.log('📦 Criando produto com sellerId:', sellerProfile.id)

    // Criar produto
    const product = await prisma.product.create({
      data: {
        sellerId: sellerProfile.id,
        categoryId: category.id,
        name,
        slug,
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

    console.log('✅ Produto criado:', {
      id: product.id,
      sellerId: product.sellerId,
      name: product.name
    })

    return NextResponse.json({ success: true, productId: product.id })

  } catch (error) {
    console.error('❌ Erro ao criar produto:', error)
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
  }
}
