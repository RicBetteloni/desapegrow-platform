import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

type Item = {
  productId: string
  name: string
  image?: string
  price: number
  quantity: number
}

// Config Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
  options: { timeout: 5000 }
})

const preference = new Preference(client)

export async function POST(request: Request) {
  try {
    if (!process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'MP_ACCESS_TOKEN não configurado' },
        { status: 500 }
      )
    }

    const session = await getSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { items, orderId } = (await request.json()) as {
      items: Item[]
      orderId: string
    }

    if (!items?.length || !orderId) {
      return NextResponse.json(
        { error: 'items e orderId são obrigatórios' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_URL ||
      'http://localhost:3000'

    const isProduction = process.env.NODE_ENV === 'production'

    // Em sandbox/dev, evitar enviar payer fixo do usuário local para não gerar
    // bloqueio "uma das partes é de teste" no checkout do Mercado Pago.
    let payerData:
      | {
          name: string
          email: string
          phone?: { area_code: string; number: string }
        }
      | undefined

    if (isProduction) {
      payerData = {
        name: user.name,
        email: user.email
      }

      // Adiciona telefone se disponível e válido
      if (user.phone && user.phone.length >= 10) {
        const cleanPhone = user.phone.replace(/\D/g, '')
        payerData.phone = {
          area_code: cleanPhone.substring(0, 2),
          number: cleanPhone.substring(2)
        }
      }
    }

    const preferenceData = {
      body: {
        items: items.map(item => ({
          id: item.productId,
          title: item.name,
          description: item.name,
          picture_url: item.image,
          quantity: item.quantity,
          unit_price: Number(item.price),
          currency_id: 'BRL'
        })),
        ...(payerData ? { payer: payerData } : {}),
        back_urls: {
          success: `${baseUrl}/payment/success?orderId=${orderId}`,
          failure: `${baseUrl}/payment/failure?orderId=${orderId}`,
          pending: `${baseUrl}/payment/pending?orderId=${orderId}`
        },
        // auto_return apenas em produção
        ...(isProduction
          ? { auto_return: 'approved' as const }
          : {}),
        notification_url: `${baseUrl}/api/payment/webhook`,
        external_reference: orderId,
        statement_descriptor: 'DESAPEGROW',
        metadata: {
          user_id: user.id,
          order_id: orderId
        }
      }
    }

    console.log('🔵 Criando preferência MP com:', {
      items: items.length,
      orderId,
      userId: user.id,
      hasPayer: !!payerData,
      hasPhone: !!payerData?.phone
    })

    const response = await preference.create(preferenceData)

    console.log('✅ Preferência criada:', {
      id: response.id,
      hasInitPoint: !!response.init_point,
      hasSandboxInitPoint: !!response.sandbox_init_point
    })

    return NextResponse.json(
      {
        preferenceId: response.id,
        initPoint: response.init_point,
        sandboxInitPoint: response.sandbox_init_point
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Erro ao criar preferência MP:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Erro ao criar pagamento', details: message },
      { status: 500 }
    )
  }
}
