import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 5000 }
})

const payment = new Payment(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('🔔 Webhook Mercado Pago recebido:', body)

    // Mercado Pago envia diferentes tipos de notificações
    // Nos interessam as de payment_id
    if (body.type !== 'payment') {
      console.log('⏭️  Webhook ignorado (tipo não é payment):', body.type)
      return NextResponse.json({ received: true })
    }

    const paymentId = body.data?.id

    if (!paymentId) {
      console.log('⚠️  Payment ID não encontrado no webhook')
      return NextResponse.json({ received: true })
    }

    // Buscar informações completas do pagamento
    let paymentData
    try {
      const response = await payment.get({ id: paymentId.toString() })
      paymentData = response
    } catch (error) {
      console.error('❌ Erro ao buscar dados do pagamento:', error)
      return NextResponse.json({ received: true })
    }

    console.log('💳 Pagamento encontrado:', {
      id: paymentData.id,
      status: paymentData.status,
      external_reference: paymentData.external_reference
    })

    const orderId = paymentData.external_reference
    const paymentStatus = paymentData.status

    if (!orderId) {
      console.log('⚠️  Order ID não encontrado no pagamento')
      return NextResponse.json({ received: true })
    }
    // Mapear status do Mercado Pago para nosso sistema
    let orderStatus: OrderStatus = OrderStatus.PENDING
    
    if (paymentStatus === 'approved') {
      orderStatus = OrderStatus.PROCESSING
      console.log('✅ Pagamento aprovado para ordem:', orderId)
    } else if (paymentStatus === 'pending' || paymentStatus === 'in_process') {
      orderStatus = OrderStatus.PENDING
      console.log('⏳ Pagamento pendente para ordem:', orderId)
    } else if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
      orderStatus = OrderStatus.CANCELED
      console.log('❌ Pagamento rejeitado para ordem:', orderId)
    }

    // Atualizar status do pedido no banco de dados
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: orderStatus,
        updatedAt: new Date()
      }
    })
    

    console.log('📝 Pedido atualizado:', orderId, '→', orderStatus)

    return NextResponse.json({ 
      received: true,
      orderId,
      status: orderStatus
    })

  } catch (error) {
    console.error('❌ Erro no webhook Mercado Pago:', error)
    // Retornar 200 de qualquer forma para evitar reprocessamento
    return NextResponse.json({ 
      received: true,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}

// GET para validar que o endpoint existe
export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook Mercado Pago ativo',
    endpoint: '/api/webhooks/mercadopago'
  })
}
