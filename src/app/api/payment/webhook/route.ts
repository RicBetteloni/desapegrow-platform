import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

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

    let orderStatus: 'PENDING' | 'PROCESSING' | 'CANCELED' = 'PENDING'

    if (status === 'approved') {
      orderStatus = 'PROCESSING'
    } else if (status === 'rejected' || status === 'cancelled') {
      orderStatus = 'CANCELED'
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: orderStatus }
    })

    console.log('Pedido atualizado via webhook:', orderId, '→', orderStatus)

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
