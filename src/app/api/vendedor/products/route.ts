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

    // Buscar ou criar perfil de vendedor
    let sellerProfile = await prisma.sellerProfile.findUnique({
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
      productsCount: sellerProfile?.products.length,
      userId: session.user.id
    })

    // Se não existe, cria automaticamente
    if (!sellerProfile) {
      console.log('🔧 Criando perfil de vendedor automaticamente...')
      sellerProfile = await prisma.sellerProfile.create({
        data: {
          userId: session.user.id
        },
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
      console.log('✅ Perfil criado:', sellerProfile.id)
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

    console.log('🔐 POST Session completa:', JSON.stringify(session, null, 2))
    console.log('📋 Headers:', Object.fromEntries(request.headers.entries()))

    if (!session?.user?.id) {
      console.error('❌ Sessão inválida. Session:', session)
      console.error('❌ User ID:', session?.user?.id)
      return NextResponse.json({ 
        error: 'Não autenticado',
        details: 'Sessão expirou ou inválida. Faça login novamente.',
        debug: {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id
        }
      }, { status: 401 })
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    console.log('👤 User encontrado:', {
      found: !!user,
      userId: session.user.id,
      userName: user?.name,
      userEmail: user?.email
    })

    if (!user) {
      return NextResponse.json({ 
        error: 'Usuário não encontrado no banco de dados',
        details: `O ID da sessão ${session.user.id} não corresponde a nenhum usuário`
      }, { status: 404 })
    }

    let sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id }
    })

    console.log('👤 Seller Profile na criação:', {
      found: !!sellerProfile,
      sellerId: sellerProfile?.id,
      userId: session.user.id
    })

    // Se não existe, cria automaticamente
    if (!sellerProfile) {
      console.log('🔧 Criando perfil de vendedor para criação de produto...')
      try {
        sellerProfile = await prisma.sellerProfile.create({
          data: {
            userId: session.user.id
          }
        })
        console.log('✅ Perfil criado:', sellerProfile.id)
      } catch (createError) {
        console.error('❌ Erro ao criar perfil:', createError)
        return NextResponse.json({ 
          error: 'Erro ao criar perfil de vendedor',
          details: createError instanceof Error ? createError.message : String(createError)
        }, { status: 500 })
      }
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

    console.log('📋 Dados recebidos:', {
      name,
      categorySlug,
      price,
      stock,
      imagesCount: images?.length,
      description: description?.substring(0, 50)
    })

    // Validar campos obrigatórios
    if (!name || !description || !categorySlug || !price || !stock || !images || images.length === 0) {
      return NextResponse.json({ 
        error: 'Campos obrigatórios faltando',
        details: {
          name: !name,
          description: !description,
          categorySlug: !categorySlug,
          price: !price,
          stock: !stock,
          images: !images || images.length === 0
        }
      }, { status: 400 })
    }

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

    console.log('📁 Categoria encontrada:', {
      found: !!category,
      categoryId: category?.id,
      categorySlug
    })

    if (!category) {
      return NextResponse.json({ 
        error: 'Categoria não encontrada',
        details: `Slug '${categorySlug}' não existe no banco de dados`
      }, { status: 400 })
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
        price: Number(price),
        comparePrice: comparePrice ? Number(comparePrice) : null,
        stock: Number(stock),
        weight: weight ? Number(weight) : null,
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
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A')
    console.error('❌ Message:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ 
      error: 'Erro ao criar produto',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
