// src/components/ItemUnlockedModal.tsx
'use client'

import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  item: { name: string }
  rewards: { cultivoCoins: number; growthGems: number }
  onClose: () => void
}

export default function ItemUnlockedModal({ isOpen, item, rewards, onClose }: Props) {
  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-2xl font-bold mb-2">Item Desbloqueado!</h2>
          <p className="text-xl font-semibold text-purple-600 mb-4">{item.name}</p>
          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
            <p>🪙 +{rewards.cultivoCoins} CultivoCoins</p>
            <p>💎 +{rewards.growthGems} GrowthGems</p>
          </div>
          <button onClick={onClose} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
            Ver Inventário
          </button>
        </div>
      </div>
    </div>
  )
}