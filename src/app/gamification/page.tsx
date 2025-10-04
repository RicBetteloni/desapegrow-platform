// src/app/gamification/page.tsx
'use client'

import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { GamificationGuide } from '@/components/gamification/GamificationGuide'

export default function GamificationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header Navegação */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-green-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/marketplace" 
                className="flex items-center space-x-3 text-2xl font-bold text-green-700 hover:text-green-600"
              >
                <span>🌱</span>
                <span>Voltar</span>
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent text-3xl font-bold">
                Gamificação Desapegrow
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <GamificationGuide />
    </div>
  )
}