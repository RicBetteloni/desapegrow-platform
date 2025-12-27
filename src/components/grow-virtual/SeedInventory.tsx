'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sprout, Sparkles, Info } from 'lucide-react'
import { toast } from 'sonner'

interface Seed {
  id: string
  name: string
  rarity: string
  iconUrl: string
  effects: Record<string, unknown>
}

interface SeedInventoryProps {
  seeds: Seed[]
  onPlant: () => void
}

export function SeedInventory({ seeds, onPlant }: SeedInventoryProps) {
  const [germinating, setGerminating] = useState<string | null>(null)
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null)

  const germinateSeed = async (seedId: string) => {
    setGerminating(seedId)
    
    try {
      const response = await fetch('/api/grow/plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seedItemId: seedId })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(
          <div className="flex flex-col space-y-1">
            <p className="font-bold">🌱 Semente Germinada!</p>
            <p className="text-sm">{data.plant.name} começou a crescer!</p>
            <p className="text-xs text-gray-600">Cuide bem dela para colher os melhores resultados</p>
          </div>,
          { duration: 5000 }
        )
        onPlant()
      } else {
        toast.error(data.error || 'Erro ao germinar semente')
      }
    } catch (error) {
      toast.error('Erro ao germinar semente')
      console.error(error)
    } finally {
      setGerminating(null)
    }
  }

  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return {
          badge: 'bg-purple-500 text-white border-purple-600',
          card: 'border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50',
          glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]'
        }
      case 'EPIC':
        return {
          badge: 'bg-orange-500 text-white border-orange-600',
          card: 'border-orange-300 bg-gradient-to-br from-orange-50 to-red-50',
          glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]'
        }
      case 'RARE':
        return {
          badge: 'bg-blue-500 text-white border-blue-600',
          card: 'border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50',
          glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]'
        }
      case 'UNCOMMON':
        return {
          badge: 'bg-green-500 text-white border-green-600',
          card: 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50',
          glow: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]'
        }
      default: // COMMON
        return {
          badge: 'bg-gray-500 text-white border-gray-600',
          card: 'border-gray-300 bg-white',
          glow: ''
        }
    }
  }

  if (seeds.length === 0) {
    return (
      <div className="text-center py-12">
        <Sprout className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma semente no inventário</h3>
        <p className="text-gray-500">Você já plantou todas as suas sementes ou ainda não recebeu nenhuma!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {seeds.map((seed) => {
        const style = getRarityStyle(seed.rarity)
        const genetics = seed.effects.genetics as Record<string, unknown>
        const isSelected = selectedSeed === seed.id
        
        return (
          <Card 
            key={seed.id} 
            className={`${style.card} ${style.glow} border-2 transition-all cursor-pointer hover:scale-105 ${
              isSelected ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => setSelectedSeed(seed.id)}
          >
            <CardContent className="p-6 space-y-4">
              {/* Header com raridade */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge className={`${style.badge} mb-2`}>
                    <Sparkles className="w-3 h-3 mr-1" />
                    {seed.rarity}
                  </Badge>
                  <h3 className="font-bold text-lg">{seed.name}</h3>
                </div>
                <div className="text-4xl">🌱</div>
              </div>

              {/* Informações da genética */}
              {genetics && (
                <div className="space-y-2 text-sm bg-white/50 p-3 rounded-lg">
                  {genetics.lineage && (
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-gray-600">Genética:</p>
                        <p className="font-semibold text-gray-800">{String(genetics.lineage || '')}</p>
                      </div>
                    </div>
                  )}
                  {genetics.thc && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">THC:</span>
                      <span className="font-bold text-green-700">{String(genetics.thc || '')}</span>
                    </div>
                  )}
                  {genetics.flowering && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Floração:</span>
                      <span className="font-semibold">{String(genetics.flowering || '')}</span>
                    </div>
                  )}
                  {genetics.difficulty && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dificuldade:</span>
                      <span className="font-semibold">{String(genetics.difficulty || '')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Botão de germinar */}
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  germinateSeed(seed.id)
                }}
                disabled={germinating === seed.id}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {germinating === seed.id ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Germinando...
                  </>
                ) : (
                  <>
                    <Sprout className="w-4 h-4 mr-2" />
                    Germinar Semente
                  </>
                )}
              </Button>

              {genetics?.era && (
                <p className="text-xs text-center text-gray-500 italic">
                  Era: {String(genetics.era)}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
