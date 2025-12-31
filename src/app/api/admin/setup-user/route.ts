import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// REMOVER ESTE ENDPOINT DEPOIS DE USAR!
export async function POST(req: Request) {
  try {
    const { secret } = await req.json();
    
    // Proteção básica
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    // Verificar se usuário já existe
    const existing = await prisma.user.findUnique({
      where: { email: 'vendedor@desapegrow.com' }
    });
    
    if (existing) {
      // Resetar senha
      const hashedPassword = await bcrypt.hash('senha123', 10);
      await prisma.user.update({
        where: { id: existing.id },
        data: { password: hashedPassword }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Senha resetada',
        user: {
          id: existing.id,
          email: existing.email,
          name: existing.name
        },
        credentials: {
          email: 'vendedor@desapegrow.com',
          password: 'senha123'
        }
      });
    }
    
    // Criar novo usuário
    const hashedPassword = await bcrypt.hash('senha123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'vendedor@desapegrow.com',
        name: 'Vendedor Teste',
        password: hashedPassword,
        role: 'SELLER'
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Usuário criado',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      credentials: {
        email: 'vendedor@desapegrow.com',
        password: 'senha123'
      }
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST com {"secret": "YOUR_SECRET"}' 
  });
}
