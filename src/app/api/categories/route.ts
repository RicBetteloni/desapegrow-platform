import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    console.log('📂 Buscando categorias...')

    // Verificar conexão com o banco
    await prisma.$connect()

    const { searchParams } = new URL(request.url)
    const includeAll = searchParams.get('includeAll') === 'true'

    // Se includeAll=true (para formulário de cadastro), retorna todas
    if (includeAll) {
      const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              products: {
                where: {
                  status: 'ACTIVE'
                }
              }
            }
          }
        }
      })
      console.log('✅ Todas as categorias encontradas:', categories.length)
      return NextResponse.json({ categories })
    }

    // Caso contrário, retorna apenas categorias principais com TODAS as subcategorias
    const categories = await prisma.category.findMany({
      where: {
        parentId: null // Apenas categorias principais
      },
      orderBy: { name: 'asc' },
      include: {
        subcategories: {
          // Retornar TODAS as subcategorias, independente de terem produtos
          orderBy: { name: 'asc' },
          include: {
            _count: {
              select: {
                products: {
                  where: {
                    status: 'ACTIVE'
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            products: {
              where: {
                status: 'ACTIVE'
              }
            }
          }
        }
      }
    })

    console.log('✅ Categorias principais encontradas:', categories.length)

    return NextResponse.json({ categories })

  } catch (error) {
    console.error('❌ Erro ao buscar categorias:', error)
    console.error('❌ Detalhes do erro:', {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'Erro ao buscar categorias', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
