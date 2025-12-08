import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const order = await prisma.order.findFirst({
      where: {
        id: params.orderId,
        userId: session.user.id
      },
      include: { items: true }
    })

    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    if (order.status === 'DELIVERED' || order.status === 'SHIPPED') {
      return NextResponse.json({ 
        error: 'Não é possível cancelar um pedido que já foi enviado' 
      }, { status: 400 })
    }

    console.log('🔄 Cancelando pedido:', params.orderId)

    // Devolver estoque
    for (const item of order.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, name: true }
      })

      if (product) {
        const newStock = product.stock + item.quantity

        console.log(`📈 Devolvendo estoque de ${product.name}: ${product.stock} → ${newStock}`)

        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: newStock,
            status: 'ACTIVE' // Reativar produto
          }
        })
      }
    }

    // Atualizar status do pedido
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'CANCELED' }
    })

    console.log('✅ Pedido cancelado e estoque devolvido')

    return NextResponse.json({ 
      success: true,
      message: 'Pedido cancelado com sucesso. Estoque foi devolvido.'
    })

  } catch (error) {
    console.error('❌ Erro ao cancelar pedido:', error)
    return NextResponse.json({ 
      error: 'Erro ao cancelar pedido',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
