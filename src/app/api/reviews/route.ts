import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await req.json()
    
    // Validação básica
    if (!data.rating || !data.content || !data.productId) {
      return NextResponse.json({ error: 'Dados obrigatórios não fornecidos' }, { status: 400 })
    }

    // Simular criação de review (sem Prisma por enquanto)
    const newReview = {
      id: Date.now().toString(),
      userId: session.user.id,
      productId: data.productId,
      rating: data.rating,
      title: data.title,
      content: data.content,
      pointsAwarded: true,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Calcular pontos baseado na qualidade da review
    let pointsEarned = 50 // Base points

    // Bonus por conteúdo detalhado
    if (data.content.length > 100) pointsEarned += 15
    if (data.title && data.title.length > 10) pointsEarned += 10
    if (data.images && data.images.length > 0) pointsEarned += 20

    // Aqui você implementaria:
    // 1. Salvar no banco com Prisma
    // 2. Atualizar pontos do usuário
    // 3. Verificar se é compra verificada
    
    return NextResponse.json({
      review: newReview,
      message: 'Review criado com sucesso!',
      pointsEarned
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar review:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Mock de reviews para demonstração
  const mockReviews = [
    {
      id: '1',
      userId: 'user1',
      productId: '1',
      rating: 5,
      title: 'Excelente produto!',
      content: 'LED de ótima qualidade, chegou super rápido.',
      pointsAwarded: true,
      status: 'APPROVED',
      createdAt: new Date('2024-01-15T10:30:00Z'),
      updatedAt: new Date('2024-01-15T10:30:00Z')
    }
  ]

  return NextResponse.json({ reviews: mockReviews })
}