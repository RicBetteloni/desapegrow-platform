import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest, 
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { orderId } = params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: 'Status obrigatório' }, { status: 400 })
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: session.user.id }
    })

    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    if (status === 'CANCELED') {
      const orderItems = await prisma.orderItem.findMany({ where: { orderId } })
      
      for (const item of orderItems) {
        const product = await prisma.product.update({
          where: { id: item.productId },
          data: { 
            stock: { increment: item.quantity },
            status: 'ACTIVE'
          }
        })
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })

    return NextResponse.json({ order: updatedOrder })
  } catch (err) {
    console.error('Erro atualizar status:', err)
    return NextResponse.json({ error: 'Erro ao atualizar status' }, { status: 500 })
  }
}
