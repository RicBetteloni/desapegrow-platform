'use client'

import React from 'react'
import { toast } from 'sonner'
import { PlantStageBadges } from './PlantStageBadges'

interface Plant {
  id: string
  name: string
  strain: string
  stage: string
  daysGrowing: number
  health: number
  size: number
  waterLevel: number
  vpdLevel: number
  lightHours: number
  genetics: Record<string, unknown>
}

export function PlantCarePanel({ plant, onUpdate }: { plant: Plant; onUpdate: () => void }) {
  const handleCare = async (careType: string, value?: number) => {
    try {
      const response = await fetch('/api/grow/plant/care', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantId: plant.id,
          careType,
          value
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        onUpdate()
      } else {
        toast.error(data.error)
      }
    } catch (err) {
      toast.error('Erro ao cuidar da planta')
      console.error(err)
    }
  }

  const handleHarvest = async () => {
    if (plant.stage !== 'HARVEST_READY') {
      toast.error('Planta ainda não está pronta para colheita!')
      return
    }

    try {
      const response = await fetch('/api/grow/plant/harvest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantId: plant.id })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(
          <div className="flex flex-col space-y-2">
            <p className="font-bold text-lg">🎉 Colheita Realizada!</p>
            <div className="space-y-1">
              <p className="text-sm">✨ Qualidade: {data.harvest.quality}</p>
              <p className="text-sm">💰 +{data.harvest.rewards.coins} coins</p>
              <p className="text-sm">💎 +{data.harvest.rewards.gems} gems</p>
              <p className="text-sm">🏆 Card NFT adicionado ao inventário!</p>
            </div>
          </div>,
          { duration: 7000 }
        )
        onUpdate()
      } else {
        toast.error(data.error)
      }
    } catch (err) {
      toast.error('Erro ao colher planta')
      console.error(err)
    }
  }

  return (
    <PlantStageBadges 
      key={`badges-${plant.id}`}
      currentStage={plant.stage}
      genetics={plant.name}
      strain={plant.strain}
      rarity={(plant.genetics as Record<string, unknown>)?.rarity as string || 'COMMON'}
      plant={plant}
      onCare={handleCare}
      onHarvest={handleHarvest}
    />
  )
}
