// src/components/CurrencyDisplayHeader.tsx
'use client'

import { useState, useEffect } from 'react'
import { Coins, Gem } from 'lucide-react'

export default function CurrencyDisplayHeader() {
  const [coins, setCoins] = useState({ cultivoCoins: 0, growthGems: 0 })

  useEffect(() => {
    fetch('/api/grow/coins')
      .then(r => r.json())
      .then(setCoins)
      .catch(console.error)
  }, [])

  return (
    <div className="flex items-center space-x-2 bg-white/90 rounded-full px-3 py-2">
      <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-50 rounded-full">
        <Coins className="w-4 h-4 text-yellow-600" />
        <span className="text-sm font-bold text-yellow-700">{coins.cultivoCoins}</span>
      </div>
      <div className="flex items-center space-x-1 px-2 py-1 bg-purple-50 rounded-full">
        <Gem className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-bold text-purple-700">{coins.growthGems}</span>
      </div>
    </div>
  )
}