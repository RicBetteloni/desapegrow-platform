import { NextResponse } from 'next/server'

const categories = [
  { id: '1', name: 'Equipamentos de Iluminação', slug: 'iluminacao' },
  { id: '2', name: 'Ventilação e Climatização', slug: 'ventilacao' },
  { id: '3', name: 'Sistemas Hidropônicos', slug: 'hidroponia' },
  { id: '4', name: 'Fertilizantes e Nutrição', slug: 'fertilizantes' },
  { id: '5', name: 'Substratos e Vasos', slug: 'substratos' }
]

export async function GET() {
  return NextResponse.json({ categories })
}