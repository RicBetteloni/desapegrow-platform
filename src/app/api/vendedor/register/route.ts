import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { businessName, cnpj, phone } = await request.json()

    if (!businessName) {
      return NextResponse.json({ error: 'Nome da loja é obrigatório' }, { status: 400 })
    }

    // Verificar se já é vendedor
    const existingSeller = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (existingSeller) {
      return NextResponse.json({ error: 'Você já é um vendedor' }, { status: 400 })
    }

    // Atualizar telefone do usuário se fornecido
    if (phone) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { phone }
      })
    }

    // Criar perfil de vendedor
    await prisma.sellerProfile.create({
      data: {
        userId: session.user.id,
        businessName,
        cnpj: cnpj || null,
        totalSales: 0,
        totalOrders: 0
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Perfil de vendedor criado com sucesso' 
    })

  } catch (error) {
    console.error('Erro ao criar vendedor:', error)
    return NextResponse.json({ error: 'Erro ao criar vendedor' }, { status: 500 })
  }
}
