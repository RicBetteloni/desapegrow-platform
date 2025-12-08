import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type IncomingItem = {
  productId: string
  quantity: number
  price: number
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { items, total, paymentMethod } = body as {
      items?: IncomingItem[]
      total?: number
      paymentMethod?: string
    }

    if (!items?.length || typeof total !== 'number' || !paymentMethod) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    // 1. Validar estoque
    const stockErrors: string[] = []
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product || product.stock < item.quantity) {
        stockErrors.push(
          `Produto ${product?.name || item.productId}: estoque insuficiente`
        )
      }
    }

    if (stockErrors.length > 0) {
      return NextResponse.json(
        { error: stockErrors.join('; ') },
        { status: 400 }
      )
    }

    // 2. Criar pedido
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: 'PENDING'
      }
    })

    // 3. Criar orderItems + debitar estoque + status
    let calculatedTotal = 0
    for (const item of items) {
      calculatedTotal += item.price * item.quantity

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }
      })

      const updatedProduct = await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      })

      if (updatedProduct.stock === 0) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { status: 'INACTIVE' }
        })
      }
    }

    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: order.id },
      include: { product: true }
    })

    return NextResponse.json(
      {
        order: { ...order, orderItems },
        calculatedTotal,
        paymentMethod
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Erro no /api/orders:', err)
    return NextResponse.json(
      { error: 'Erro ao criar pedido' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await prisma.orderItem.findMany({
          where: { orderId: order.id },
          include: { product: true }
        })
        return { ...order, orderItems }
      })
    )

    return NextResponse.json({ orders: ordersWithItems })
  } catch (err) {
    console.error('Erro listar pedidos:', err)
    return NextResponse.json(
      { error: 'Erro ao listar pedidos' },
      { status: 500 }
    )
  }
}
