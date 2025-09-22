import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    // Teste simples de conexão
    await prisma.$connect()
    
    // Contar registros
    const userCount = await prisma.user.count()
    const categoryCount = await prisma.category.count()
    
    return NextResponse.json({ 
      message: 'Conexão OK',
      users: userCount,
      categories: categoryCount
    })
  } catch (error) {
    console.error('Erro de conexão:', error)
    return NextResponse.json({ 
      error: 'Falha na conexão',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}