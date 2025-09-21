import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já existe' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gameProfile: {
          create: {
            totalPoints: 100,      // BÔNUS DE CADASTRO!
            availablePoints: 100,
            currentLevel: 'INICIANTE'
          }
        }
      },
      include: {
        gameProfile: true
      }
    })

    return NextResponse.json({
      message: 'Usuário criado com sucesso!',
      points: 100
    })

  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}