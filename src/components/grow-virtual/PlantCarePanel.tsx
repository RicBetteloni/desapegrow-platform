'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Droplets, Sun, Thermometer, Heart, Sparkles, Award } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '../ui/badge'

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
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span className="text-4xl">{STAGE_EMOJIS[plant.stage]}</span>
              <div>
                <div>{plant.name}</div>
                <Badge variant="outline" className="mt-1">{plant.strain}</Badge>
              </div>
            </CardTitle>
          </div>
          <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600">
            {STAGE_NAMES[plant.stage]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
            <Heart className={`w-6 h-6 mb-1 ${getHealthColor(plant.health)}`} />
            <span className="text-sm text-gray-600">Saúde</span>
            <span className={`text-lg font-bold ${getHealthColor(plant.health)}`}>
              {plant.health}%
            </span>
          </div>

          <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
            <Droplets className="w-6 h-6 mb-1 text-blue-600" />
            <span className="text-sm text-gray-600">Água</span>
            <span className="text-lg font-bold text-blue-600">
              {plant.waterLevel}%
            </span>
          </div>

          <div className="flex flex-col items-center p-3 bg-yellow-50 rounded-lg">
            <Sun className="w-6 h-6 mb-1 text-yellow-600" />
            <span className="text-sm text-gray-600">Luz</span>
            <span className="text-lg font-bold text-yellow-600">
              {plant.lightHours}h
            </span>
          </div>

          <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
            <Thermometer className="w-6 h-6 mb-1 text-purple-600" />
            <span className="text-sm text-gray-600">VPD</span>
            <span className="text-lg font-bold text-purple-600">
              {plant.vpdLevel.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Dias de Cultivo</span>
            <span className="font-bold">{plant.daysGrowing.toFixed(0)} dias</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tamanho</span>
            <span className="font-bold">{plant.size.toFixed(1)}g</span>
          </div>
        </div>

        {/* Care Actions */}
        {plant.stage !== 'HARVEST_READY' ? (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleCare('WATER')}
              disabled={caring || plant.waterLevel >= 100}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Droplets className="w-4 h-4" />
              Regar
            </Button>

            <Button
              onClick={() => handleCare('VPD_ADJUST', 1.2)}
              disabled={caring}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Thermometer className="w-4 h-4" />
              Ajustar VPD (-10 coins)
            </Button>

            <Button
              onClick={() => handleCare('LIGHT_ADJUST', 18)}
              disabled={caring}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Sun className="w-4 h-4" />
              Ajustar Luz
            </Button>

            <Button
              onClick={() => handleCare('NUTRIENT', 15)}
              disabled={caring}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Nutrientes (-15 coins)
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleHarvest}
            disabled={caring}
            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
          >
            <Award className="w-5 h-5 mr-2" />
            🌿 Colher e Gerar Card NFT
          </Button>
        )}

        {/* Genetics Info */}
        {plant.genetics && (
          <div className="pt-4 border-t">
            <p className="text-sm font-semibold text-gray-700 mb-2">📊 Genética:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-gray-600">THC:</span> <span className="font-bold">{plant.genetics.thc}</span></div>
              <div><span className="text-gray-600">CBD:</span> <span className="font-bold">{plant.genetics.cbd}</span></div>
              <div><span className="text-gray-600">Floração:</span> <span className="font-bold">{plant.genetics.flowering}</span></div>
              <div><span className="text-gray-600">Dificuldade:</span> <span className="font-bold">{plant.genetics.difficulty}</span></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
