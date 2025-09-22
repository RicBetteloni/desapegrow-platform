import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'

// Armazenamento temporário em memória (como os produtos)
const favorites: { userId: string; productId: string }[] = []

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const userFavorites = favorites
      .filter(fav => fav.userId === session.user.id)
      .map(fav => fav.productId)

    return NextResponse.json({ favorites: userFavorites })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { productId } = await req.json()
    
    const existingIndex = favorites.findIndex(
      fav => fav.userId === session.user.id && fav.productId === productId
    )

    if (existingIndex >= 0) {
      // Remove dos favoritos
      favorites.splice(existingIndex, 1)
      return NextResponse.json({ favorited: false })
    } else {
      // Adiciona aos favoritos
      favorites.push({ userId: session.user.id, productId })
      return NextResponse.json({ favorited: true })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}