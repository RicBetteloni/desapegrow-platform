import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { prisma } from '@/lib/prisma'

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 5000 }
})

const preference = new Preference(client)

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    type Item = {
      productId: string
      name: string
      image?: string
      price: number
      quantity: number
    }

    const { items, orderId } = await request.json() as { items: Item[]; orderId: string }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Calcular total
    const total = items.reduce((sum: number, item: Item) => {
      return sum + (item.price * item.quantity)
    }, 0)

    // Criar preferência de pagamento
    const preferenceData = {
      body: {
        items: items.map((item: Item) => ({
          id: item.productId,
          title: item.name,
          description: item.name,
          picture_url: item.image,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: 'BRL'
        })),
        payer: {
          name: user.name,
          email: user.email,
          phone: user.phone ? {
            area_code: user.phone.substring(0, 2),
            number: user.phone.substring(2)
          } : undefined
        },
        back_urls: {
          success: `${process.env.NEXTAUTH_URL}/payment/success?orderId=${orderId}`,
          failure: `${process.env.NEXTAUTH_URL}/payment/failure?orderId=${orderId}`,
          pending: `${process.env.NEXTAUTH_URL}/payment/pending?orderId=${orderId}`
        },
        auto_return: 'approved' as const,
        notification_url: `${process.env.NEXTAUTH_URL}/api/payment/webhook`,
        external_reference: orderId,
        statement_descriptor: 'DESAPEGROW',
        metadata: {
          user_id: user.id,
          order_id: orderId
        }
      }
    }

    const response = await preference.create(preferenceData)

    return NextResponse.json({
      preferenceId: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point
    })

  } catch (error: unknown) {
    console.error('Erro ao criar preferência MP:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Erro ao criar pagamento', details: message },
      { status: 500 }
    )
  }
}
