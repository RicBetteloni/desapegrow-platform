import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        products: {
          select: {
            id: true,
            status: true
          }
        }
      }
    })

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Perfil de vendedor não encontrado' }, { status: 404 })
    }

    const stats = {
      totalProducts: sellerProfile.products.length,
      activeProducts: sellerProfile.products.filter(p => p.status === 'ACTIVE').length,
      totalOrders: sellerProfile.totalOrders,
      totalRevenue: Number(sellerProfile.totalSales)
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 })
  }
}
