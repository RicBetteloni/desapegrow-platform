import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    console.log('🛒 Buscando pedidos onde usuário é COMPRADOR (userId):', session.user.id)

    const orders = await prisma.order.findMany({
      where: { 
        userId: session.user.id  // userId = COMPRADOR
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: {
                  take: 1,
                  select: {
                    url: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('✅ Pedidos de COMPRA encontrados:', orders.length)
    console.log('📊 Status dos pedidos:', orders.map(o => ({ id: o.id.slice(0, 8), status: o.status })))

    return NextResponse.json({ orders })

  } catch (error) {
    console.error('❌ Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    )
  }
}
