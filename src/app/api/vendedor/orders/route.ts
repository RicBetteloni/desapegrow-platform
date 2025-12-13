import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    let seller = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id }
    })

    // Se não existe, cria automaticamente
    if (!seller) {
      seller = await prisma.sellerProfile.create({
        data: {
          userId: session.user.id
        }
      })
    }

    // Buscar pedidos que tenham ao menos 1 item de produtos deste seller
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId: seller.id
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
