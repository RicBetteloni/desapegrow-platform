import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'
import { OrderStatus, ProductStatus } from '@prisma/client'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
  options: { timeout: 5000 }
})

const paymentClient = new Payment(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Para notificações via Webhook padrão do MP
    const topic = body.type || body.topic
    const paymentId =
      body.data?.id || body['data.id'] || body.resource?.split('/').pop()

    if (topic !== 'payment' || !paymentId) {
      console.log('Webhook ignorado:', { topic, paymentId })
      return NextResponse.json({ received: true })
    }

    const mpPayment = await paymentClient.get({ id: String(paymentId) })

    const orderId = mpPayment.external_reference
    const status = mpPayment.status

    if (!orderId) {
      console.log('Pagamento sem external_reference, ignorando.')
      return NextResponse.json({ received: true })
    }

    if (status === 'approved') {
      await prisma.$transaction(async tx => {
        // Claim idempotente: só processa uma vez quando ainda está PENDING
        const claimed = await tx.order.updateMany({
          where: {
            id: orderId,
            status: OrderStatus.PENDING
          },
          data: {
            status: OrderStatus.PROCESSING
          }
        })

        if (claimed.count === 0) {
          // Já processado ou em estado final
          return
        }

        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true }
        })

        if (!order) {
          throw new Error(`Pedido ${orderId} não encontrado`)
        }

        for (const item of order.items) {
          const stockUpdated = await tx.product.updateMany({
            where: {
              id: item.productId,
              stock: { gte: item.quantity }
            },
            data: {
              stock: { decrement: item.quantity }
            }
          })

          if (stockUpdated.count === 0) {
            throw new Error(
              `Estoque insuficiente ao confirmar pagamento para produto ${item.productId}`
            )
          }

          const currentProduct = await tx.product.findUnique({
            where: { id: item.productId },
            select: { stock: true }
          })

          if (currentProduct && currentProduct.stock === 0) {
            await tx.product.update({
              where: { id: item.productId },
              data: { status: ProductStatus.INACTIVE }
            })
          }
        }
      })

      console.log('Pedido confirmado via webhook:', orderId, '→ PROCESSING')
      return NextResponse.json({ received: true })
    }

    if (status === 'rejected' || status === 'cancelled') {
      await prisma.order.updateMany({
        where: {
          id: orderId,
          status: OrderStatus.PENDING
        },
        data: {
          status: OrderStatus.CANCELED
        }
      })

      console.log('Pedido cancelado via webhook:', orderId, '→ CANCELED')
      return NextResponse.json({ received: true })
    }

    // pending / in_process: mantemos o pedido em PENDING
    await prisma.order.updateMany({
      where: {
        id: orderId,
        status: OrderStatus.PENDING
      },
      data: {
        status: OrderStatus.PENDING
      }
    })

    console.log('Pedido mantido em PENDING via webhook:', orderId, 'status MP:', status)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro no webhook Mercado Pago:', error)
    // sempre 200 para o MP não tentar reenviar infinitamente
    return NextResponse.json({ received: true })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}
