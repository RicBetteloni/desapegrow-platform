import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const seller = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!seller) {
      return NextResponse.json({ error: 'Perfil de vendedor não encontrado' }, { status: 404 })
    }

    const { status } = await request.json()

    // Validar status
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }

    // Verificar se o pedido realmente tem itens deste vendedor
    const order = await prisma.order.findFirst({
      where: {
        id: params.orderId,
        items: {
          some: {
            product: {
              sellerId: seller.id
            }
          }
        }
      },
      include: { items: true }
    })

    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado para este vendedor' }, { status: 404 })
    }

    console.log(`🔄 Atualizando pedido ${params.orderId} de ${order.status} para ${status}`)

    // Se vendedor está cancelando, devolver estoque
    if (status === 'CANCELED' && order.status !== 'CANCELED') {
      console.log('🔄 Devolvendo estoque por cancelamento do vendedor...')

      for (const item of order.items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, name: true }
        })

        if (product) {
          const newStock = product.stock + item.quantity

          console.log(`📈 ${product.name}: ${product.stock} → ${newStock}`)

          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: newStock,
              status: 'ACTIVE'
            }
          })
        }
      }
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status }
    })

    console.log('✅ Pedido atualizado:', updated.status)

    return NextResponse.json({ success: true, status: updated.status })

  } catch (error) {
    console.error('❌ Erro ao atualizar status do pedido:', error)
    return NextResponse.json({ 
      error: 'Erro ao atualizar status',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
