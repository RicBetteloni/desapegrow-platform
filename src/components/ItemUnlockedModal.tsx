// src/components/ItemUnlockedModal.tsx
'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Zap, Star, Gift, X } from 'lucide-react'

interface ItemEffect {
  type: string
  value: number
  duration?: number
}

interface UnlockedItem {
  name: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  itemType: string
  iconUrl: string
  effects: ItemEffect[]
}

interface ItemUnlockedModalProps {
  isOpen: boolean
  item: UnlockedItem | null
  rewards: {
    cultivoCoins: number
    growthGems: number
  }
  onClose: () => void
}

const RARITY_CONFIG = {
  COMMON: {
    gradient: 'from-gray-400 to-gray-600',
    bg: 'from-gray-50 to-gray-100',
    border: 'border-gray-400',
    text: 'text-gray-700',
    glow: 'shadow-gray-400/50',
    emoji: '⚪'
  },
  RARE: {
    gradient: 'from-blue-400 to-blue-600',
    bg: 'from-blue-50 to-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-700',
    glow: 'shadow-blue-400/50',
    emoji: '🔵'
  },
  EPIC: {
    gradient: 'from-purple-400 to-purple-600',
    bg: 'from-purple-50 to-purple-100',
    border: 'border-purple-400',
    text: 'text-purple-700',
    glow: 'shadow-purple-400/50',
    emoji: '🟣'
  },
  LEGENDARY: {
    gradient: 'from-yellow-400 to-orange-600',
    bg: 'from-yellow-50 to-orange-100',
    border: 'border-orange-400',
    text: 'text-orange-700',
    glow: 'shadow-orange-400/50',
    emoji: '🟠'
  }
}

const EFFECT_LABELS: Record<string, { label: string; emoji: string }> = {
  growth_speed: { label: 'Velocidade', emoji: '⚡' },
  health_boost: { label: 'Saúde', emoji: '💚' },
  yield_multiplier: { label: 'Colheita', emoji: '🌾' },
  automation: { label: 'Automação', emoji: '🤖' }
}

export default function ItemUnlockedModal({ isOpen, item, rewards, onClose }: ItemUnlockedModalProps) {
  const [animate, setAnimate] = useState(false)
  const [showRewards, setShowRewards] = useState(false)

  useEffect(() => {
    if (isOpen && item) {
      setAnimate(false)
      setTimeout(() => setAnimate(true), 100)
      setTimeout(() => setShowRewards(true), 800)
    } else {
      setShowRewards(false)
    }
  }, [isOpen, item])

  if (!isOpen || !item) return null

  const config = RARITY_CONFIG[item.rarity]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <div className={`relative max-w-lg w-full bg-white rounded-2xl shadow-2xl transform transition-all duration-500 ${animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        {/* Header */}
        <div className={`p-6 rounded-t-2xl bg-gradient-to-br ${config.bg} border-b-4 ${config.border}`}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 mb-2">
              <Sparkles className={`w-6 h-6 ${config.text}`} />
              <h2 className={`text-2xl font-bold ${config.text}`}>Item Desbloqueado!</h2>
              <Sparkles className={`w-6 h-6 ${config.text}`} />
            </div>
            <p className="text-sm text-gray-600">Você ganhou um novo item para seu Grow Virtual</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Item Icon */}
          <div className="relative mb-6">
            <div className={`w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-2xl ${config.glow} transform hover:scale-110 transition-transform duration-300`}>
              <div className="text-6xl">{config.emoji}</div>
            </div>
            
            {/* Floating icons */}
            <Star className="absolute top-0 right-1/4 w-6 h-6 text-yellow-400 animate-ping" />
            <Sparkles className="absolute bottom-0 left-1/4 w-6 h-6 text-blue-400 animate-pulse" />
            <Zap className="absolute top-1/2 right-0 w-6 h-6 text-purple-400 animate-bounce" />
          </div>

          {/* Item Info */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
            <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${config.gradient} text-white font-semibold text-sm shadow-lg`}>
              {item.rarity}
            </div>
          </div>

          {/* Effects */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold mb-3 text-center text-gray-700">📊 Efeitos no Seu Grow</h4>
            <div className="space-y-2">
              {item.effects.map((effect, idx) => {
                const effectLabel = EFFECT_LABELS[effect.type] || { label: effect.type, emoji: '⭐' }
                return (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-sm flex items-center space-x-2">
                      <span>{effectLabel.emoji}</span>
                      <span>{effectLabel.label}</span>
                    </span>
                    <span className="font-bold text-green-600">
                      {effect.type === 'yield_multiplier' ? `×${effect.value.toFixed(2)}` : `+${effect.value}%`}
                      {effect.duration && <span className="text-xs text-gray-500 ml-1">({effect.duration}d)</span>}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Rewards */}
          {showRewards && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200 animate-pulse-slow">
              <div className="flex items-center justify-center space-x-6">
                <div className="text-center">
                  <Gift className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
                  <div className="font-bold text-lg text-yellow-600">+{rewards.cultivoCoins} 🪙</div>
                  <div className="text-xs text-gray-600">CultivoCoins</div>
                </div>
                <div className="text-center">
                  <Sparkles className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                  <div className="font-bold text-lg text-purple-600">+{rewards.growthGems} 💎</div>
                  <div className="text-xs text-gray-600">GrowthGems</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <button onClick={onClose} className={`w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r ${config.gradient} text-white hover:shadow-xl transform hover:scale-105 transition-all duration-200`}>
            🌱 Ver Meu Inventário
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}