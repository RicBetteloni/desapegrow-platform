import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'E-mail é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Por segurança, sempre retornamos sucesso (mesmo se e-mail não existir)
    // Isso previne enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Se o e-mail existir, você receberá instruções'
      })
    }

    // Gerar token de recuperação (válido por 1 hora)
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora

    // Salvar token no banco (você precisará adicionar esses campos no schema)
    // Por enquanto, vamos apenas logar no console
    console.log('🔐 Token de recuperação gerado:', {
      email: user.email,
      token: resetToken,
      expiry: resetTokenExpiry,
      resetLink: `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    })

    // TODO: Enviar e-mail real usando SendGrid, Resend, ou similar
    // Exemplo com Resend:
    // await resend.emails.send({
    //   from: 'noreply@desapegrow.com',
    //   to: user.email,
    //   subject: 'Recuperação de Senha - Desapegrow',
    //   html: `Clique aqui para redefinir: <a href="${resetLink}">${resetLink}</a>`
    // })

    return NextResponse.json({
      success: true,
      message: 'E-mail de recuperação enviado'
    })

  } catch (error) {
    console.error('Erro no forgot-password:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}
