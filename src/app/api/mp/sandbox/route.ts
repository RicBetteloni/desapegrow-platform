import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, orderId, customer } = body

    // 1. Cria Preference ID simulado
    const preferenceId = `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    
    // 2. Simula URLs reais do MP
    const sandboxUrls = {
      success: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/payment/success?preference_id=${preferenceId}&orderId=${orderId}`,
      failure: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/payment/failure?preference_id=${preferenceId}`,
      pending: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/payment/pending?preference_id=${preferenceId}`
    }

    console.log('🧪 MP Sandbox criado:', { preferenceId, orderId })

    return NextResponse.json({
      init_point: sandboxUrls.success, // Simula "aprovado instantâneo"
      sandbox: true,
      preference_id: preferenceId,
      sandboxUrls
    }, { status: 201 })

  } catch (err) {
    console.error('Erro MP Sandbox:', err)
    return NextResponse.json({ error: 'Erro sandbox' }, { status: 500 })
  }
}
