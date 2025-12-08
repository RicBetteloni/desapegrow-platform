import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // TODO: Verificar token no banco de dados
    // Por enquanto, vamos aceitar qualquer token para teste
    // Em produção, você precisa validar:
    // 1. Se o token existe
    // 2. Se não está expirado
    // 3. Se pertence a um usuário válido

    // TEMPORÁRIO: Buscar usuário por e-mail (você deve usar o token)
    // Este é apenas um exemplo simplificado
    const user = await prisma.user.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Atualizar senha
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    // TODO: Invalidar o token após uso

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso'
    })

  } catch (error) {
    console.error('Erro no reset-password:', error)
    return NextResponse.json(
      { error: 'Erro ao redefinir senha' },
      { status: 500 }
    )
  }
}
