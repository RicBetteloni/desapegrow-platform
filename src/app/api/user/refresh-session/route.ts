import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Endpoint para forçar refresh da sessão após atualização de dados
 * Este endpoint retorna os dados mais recentes do usuário
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Retornar a sessão atual que será reconstruída com dados atualizados
    return NextResponse.json({
      success: true,
      session: session
    })

  } catch (error) {
    console.error('Erro ao refresh session:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
