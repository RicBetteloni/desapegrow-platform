// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { items, total, paymentMethod } = await req.json();

    // Validar dados
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Carrinho vazio' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'PROCESSING',
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    // Log analytics
    console.log('[Order Created]', {
      orderId: order.id,
      userId,
      total,
      itemCount: items.length,
      timestamp: new Date().toISOString()
    });

    // Track analytics event
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'ORDER_PLACED',
          data: {
            userId,
            orderId: order.id,
            value: total,
            timestamp: Date.now(),
            metadata: {
              itemCount: items.length,
              paymentMethod
            }
          }
        })
      });
    } catch (error) {
      console.error('Error tracking analytics:', error);
      // Não falha o pedido se analytics falhar
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Pedido criado com sucesso!',
      order: {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          id: item.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
          category: item.product.category.name
        }))
      }
    });

  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// GET - Listar pedidos do usuário
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calcular totais para cada pedido
    const ordersWithTotals = orders.map(order => ({
      ...order,
      total: order.items.reduce((sum, item) => {
        return sum + (Number(item.price) * item.quantity);
      }, 0),
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0)
    }));

    return NextResponse.json({ orders: ordersWithTotals });

  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}