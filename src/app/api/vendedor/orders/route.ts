import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    console.log('🏪 Buscando pedidos do VENDEDOR (sellerId):', session.user.id)

    let seller = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id }
    })

    // Se não existe, cria automaticamente
    if (!seller) {
      console.log('📝 Criando perfil de vendedor automaticamente...')
      seller = await prisma.sellerProfile.create({
        data: {
          userId: session.user.id
        }
      })
      console.log('✅ Perfil de vendedor criado:', seller.id)
    }

    console.log('🔍 SellerProfile ID:', seller.id)

    // Buscar pedidos que tenham ao menos 1 item de produtos deste seller
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId: seller.id  // sellerId = VENDEDOR
            }
          }
        }
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        items: {
          where: {
            product: {
              sellerId: seller.id
            }
          },
          include: {
            product: {
              select: {
                name: true,
                images: {
                  take: 1,
                  select: { url: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('✅ Pedidos de VENDA encontrados:', orders.length)
    console.log('📊 Detalhes:', orders.map(o => ({ 
      orderId: o.id.slice(0, 8), 
      status: o.status,
      items: o.items.length,
      buyer: o.user.name 
    })))

    const ordersJSON = orders.map(order => {
      const total = order.items.reduce((sum, item) => {
        return sum + Number(item.price) * item.quantity
      }, 0)

      return {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price.toString(),
          product: {
            name: item.product.name,
            images: item.product.images
          }
        })),
        buyer: {
          name: order.user.name,
          email: order.user.email
        },
        total
      }
    })

    return NextResponse.json({ orders: ordersJSON })

  } catch (error) {
    console.error('Erro ao buscar pedidos do vendedor:', error)
    return NextResponse.json({ error: 'Erro ao buscar pedidos' }, { status: 500 })
  }
}
