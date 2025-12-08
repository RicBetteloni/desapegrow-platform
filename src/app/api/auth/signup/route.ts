import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json()

    // Validações
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Verificar se e-mail já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'E-mail já cadastrado' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: 'BUYER'
      }
    })

    // Criar perfil de jogo automaticamente
    await prisma.gameProfile.create({
      data: {
        userId: user.id,
        totalPoints: 0,
        availablePoints: 0,
        currentLevel: 'INICIANTE',
        loginStreak: 0
      }
    })

    return NextResponse.json({
      success: true,
      userId: user.id
    })

  } catch (error) {
    console.error('Erro no signup:', error)
    return NextResponse.json(
      { error: 'Erro ao criar conta' },
      { status: 500 }
    )
  }
}
