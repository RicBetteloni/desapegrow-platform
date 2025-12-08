// src/app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const items = body?.items as {
      productId: string
      quantity: number
    }[]

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 })
    }

    // Buscar produtos
    const productIds = items.map(i => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, stock: true }
    })

    // Validar estoque
    for (const item of items) {
      const product = products.find(p => p.id === item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Produto não encontrado (${item.productId})` },
          { status: 400 }
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}` },
          { status: 400 }
        )
      }
    }

    // Calcular total
    const total = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId)!
      return sum + Number(product.price) * item.quantity
    }, 0)

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: 'PROCESSING',
        items: {
          create: items.map(item => {
            const product = products.find(p => p.id === item.productId)!
            return {
              productId: product.id,
              quantity: item.quantity,
              price: product.price
            }
          })
        }
      }
    })

    // Atualizar estoque de cada produto
    for (const item of items) {
      const product = products.find(p => p.id === item.productId)!
      const newStock = product.stock - item.quantity

      await prisma.product.update({
        where: { id: product.id },
        data: {
          stock: newStock,
          status: newStock <= 0 ? 'INACTIVE' : 'ACTIVE'
        }
      })
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      total
    })
  } catch (err) {
    console.error('Erro no checkout:', err)
    return NextResponse.json(
      { error: 'Erro ao processar checkout' },
      { status: 500 }
    )
  }
}
