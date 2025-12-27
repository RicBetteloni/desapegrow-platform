'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Droplets, Sun, Thermometer, Heart, Sparkles, Award } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '../ui/badge'
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

const STAGE_NAMES: Record<string, string> = {
  SEED: '🌱 Semente',
  SEEDLING: '🌿 Muda',
  VEGETATIVE: '🪴 Vegetativo',
  PRE_FLOWER: '🌸 Pré-Floração',
  FLOWERING: '🌺 Floração',
  HARVEST_READY: '✨ Pronta para Colher'
}

const STAGE_EMOJIS: Record<string, string> = {
  SEED: '🌱',
  SEEDLING: '🌿',
  VEGETATIVE: '🪴',
  PRE_FLOWER: '🌸',
  FLOWERING: '🌺',
  HARVEST_READY: '✨'
}

export function PlantCarePanel({ plant, onUpdate }: { plant: Plant; onUpdate: () => void }) {
  const [caring, setCaring] = useState(false)

  const handleCare = async (careType: string, value?: number) => {
    setCaring(true)
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
    } finally {
      setCaring(false)
    }
  }

  const handleHarvest = async () => {
    if (plant.stage !== 'HARVEST_READY') {
      toast.error('Planta ainda não está pronta para colheita!')
      return
    }

    setCaring(true)
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
    } finally {
      setCaring(false)
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 75) return 'text-green-600'
    if (health >= 50) return 'text-yellow-600'
    if (health >= 25) return 'text-orange-600'
    return 'text-red-600'
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
