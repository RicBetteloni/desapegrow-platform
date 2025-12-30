'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Sprout, Leaf, Flower, Award, Crown, ChevronDown, ChevronUp,
  Heart, Droplets, Sun, Thermometer, Sparkles
} from 'lucide-react'

interface PlantStageBadgesProps {
  currentStage: string
  genetics: string
  strain: string
  rarity?: string
  plant: {
    id: string
    health: number
    waterLevel: number
    lightHours: number
    vpdLevel: number
    daysGrowing: number
    size: number
    genetics?: Record<string, unknown>
  }
  onCare: (type: string, value?: number) => Promise<void>
  onHarvest: () => Promise<void>
}

const STAGES = [
  { key: 'SEED', label: 'Semente', emoji: '🌰', icon: Sprout },
  { key: 'SEEDLING', label: 'Muda', emoji: '🌱', icon: Sprout },
  { key: 'VEGETATIVE', label: 'Vegetativo', emoji: '🌿', icon: Leaf },
  { key: 'PRE_FLOWER', label: 'Pré-Flora', emoji: '🌾', icon: Leaf },
  { key: 'FLOWERING', label: 'Floração', emoji: '🌸', icon: Flower },
  { key: 'HARVEST_READY', label: 'Colheita', emoji: '✨', icon: Award }
]

const STAGE_NAMES: Record<string, string> = {
  SEED: '🌱 Semente',
  SEEDLING: '🌿 Muda',
  VEGETATIVE: '🪴 Vegetativo',
  PRE_FLOWER: '🌸 Pré-Floração',
  FLOWERING: '🌺 Floração',
  HARVEST_READY: '✨ Pronta para Colher'
}

export function PlantStageBadges({ 
  currentStage, 
  genetics, 
  strain, 
  rarity, 
  plant, 
  onCare, 
  onHarvest 
}: PlantStageBadgesProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [caring, setCaring] = useState(false)
  
  const currentStageIndex = STAGES.findIndex(s => s.key === currentStage)
  const currentStageData = STAGES[currentStageIndex]
  
  if (!currentStageData) {
    return null
  }
  
  const CurrentStageIcon = currentStageData.icon
  
  const getHealthColor = (health: number) => {
    if (health >= 75) return 'text-green-600'
    if (health >= 50) return 'text-yellow-600'
    if (health >= 25) return 'text-orange-600'
    return 'text-red-600'
  }
  
  const getStageStyle = (stage: string, index: number) => {
    const isPast = index < currentStageIndex
    const isCurrent = stage === currentStage
    
    if (isPast) return 'bg-green-100 text-green-700 border-green-300 opacity-60'
    if (isCurrent) return 'bg-green-500 text-white border-green-600 animate-pulse'
    return 'bg-gray-100 text-gray-400 border-gray-300'
  }

  const getGeneticsStyle = () => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-700 shadow-lg'
      case 'EPIC':
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-600 shadow-lg'
      case 'RARE':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-600 shadow-lg'
      case 'UNCOMMON':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600 shadow-lg'
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white border-gray-600'
    }
  }

  const handleCareAction = async (type: string, value?: number) => {
    setCaring(true)
    try {
      await onCare(type, value)
    } finally {
      setCaring(false)
    }
  }

  const handleHarvestAction = async () => {
    setCaring(true)
    try {
      await onHarvest()
    } finally {
      setCaring(false)
    }
  }

  const isHarvestReady = currentStage === 'HARVEST_READY'

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow relative min-h-[550px]" style={{ perspective: '1000px' }}>
      <div 
        className={`transition-transform duration-700 ${showDetails ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRENTE DO CARD */}
        <div 
          className={`${showDetails ? 'invisible' : 'visible'} min-h-[550px]`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <div>
                    <div>{genetics}</div>
                    <Badge variant="outline" className="mt-1 text-xs">{strain}</Badge>
                  </div>
                </CardTitle>
              </div>
              <Badge className="text-sm px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600">
                {STAGE_NAMES[currentStage]}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-8 flex items-center justify-center min-h-[450px]">
            <div className="flex flex-col items-center gap-6">
              {isHarvestReady ? (
                <div className="flex flex-col items-center gap-4">
                  <Crown className="w-24 h-24 text-yellow-500 animate-pulse" />
                  <Badge 
                    variant="outline"
                    className={`${getGeneticsStyle()} text-2xl px-6 py-3 animate-pulse`}
                  >
                    {currentStageData.emoji} {genetics}
                  </Badge>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <CurrentStageIcon className="w-24 h-24 text-green-600" />
                  <Badge 
                    variant="outline"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-600 text-2xl px-6 py-3 shadow-xl animate-pulse"
                  >
                    {currentStageData.emoji} {currentStageData.label}
                  </Badge>
                </div>
              )}
              
              <Button
                onClick={() => setShowDetails(true)}
                size="lg"
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base"
              >
                Ver Detalhes
                <ChevronDown className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </div>

        {/* VERSO DO CARD - TODAS AS INFORMAÇÕES */}
        <div 
          className={`absolute inset-0 ${!showDetails ? 'invisible' : 'visible'} min-h-[550px]`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-4 h-4" />
                Detalhes da Planta
              </CardTitle>
              
              <Button
                onClick={() => setShowDetails(false)}
                variant="ghost"
                size="sm"
                className="text-green-700 hover:text-green-900 h-8"
              >
                <ChevronUp className="w-4 h-4 mr-1" />
                Voltar
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(550px - 60px)' }}>
            {/* Badges de todos os estágios */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {STAGES.map((stage, index) => {
                const StageIcon = stage.icon
                const isPast = index < currentStageIndex
                const isCurrent = stage.key === currentStage
                
                return (
                  <Badge 
                    key={stage.key}
                    variant="outline"
                    className={`${getStageStyle(stage.key, index)} transition-all duration-300 text-[10px] px-2 py-0.5`}
                  >
                    {isCurrent && <StageIcon className="w-2.5 h-2.5 mr-0.5" />}
                    {stage.emoji} {stage.label}
                    {isPast && ' ✓'}
                  </Badge>
                )
              })}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex flex-col items-center p-2 bg-white rounded-lg border">
                <Heart className={`w-4 h-4 mb-1 ${getHealthColor(plant.health)}`} />
                <span className="text-[10px] text-gray-600">Saúde</span>
                <span className={`text-sm font-bold ${getHealthColor(plant.health)}`}>
                  {plant.health}%
                </span>
              </div>

              <div className="flex flex-col items-center p-2 bg-white rounded-lg border">
                <Droplets className="w-4 h-4 mb-1 text-blue-600" />
                <span className="text-[10px] text-gray-600">Água</span>
                <span className="text-sm font-bold text-blue-600">
                  {plant.waterLevel}%
                </span>
              </div>

              <div className="flex flex-col items-center p-2 bg-white rounded-lg border">
                <Sun className="w-4 h-4 mb-1 text-yellow-600" />
                <span className="text-[10px] text-gray-600">Luz</span>
                <span className="text-sm font-bold text-yellow-600">
                  {plant.lightHours}h
                </span>
              </div>

              <div className="flex flex-col items-center p-2 bg-white rounded-lg border">
                <Thermometer className="w-4 h-4 mb-1 text-purple-600" />
                <span className="text-[10px] text-gray-600">VPD</span>
                <span className="text-sm font-bold text-purple-600">
                  {(plant.vpdLevel ?? 1.0).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Progress Info */}
            <div className="bg-white p-2 rounded-lg border mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Dias de Cultivo</span>
                <span className="font-bold">{(plant.daysGrowing ?? 0).toFixed(0)} dias</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Tamanho</span>
                <span className="font-bold">{(plant.size ?? 0).toFixed(1)}g</span>
              </div>
            </div>

            {/* Care Actions */}
            {!isHarvestReady ? (
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                <Button
                  onClick={() => handleCareAction('WATER')}
                  disabled={caring || plant.waterLevel >= 100}
                  variant="outline"
                  size="sm"
                  className="text-[10px] h-8 px-2"
                >
                  <Droplets className="w-3 h-3 mr-1" />
                  Regar
                </Button>

                <Button
                  onClick={() => handleCareAction('VPD_ADJUST', 1.2)}
                  disabled={caring}
                  variant="outline"
                  size="sm"
                  className="text-[10px] h-8 px-2"
                >
                  <Thermometer className="w-3 h-3 mr-1" />
                  VPD
                </Button>

                <Button
                  onClick={() => handleCareAction('LIGHT_ADJUST', 18)}
                  disabled={caring}
                  variant="outline"
                  size="sm"
                  className="text-[10px] h-8 px-2"
                >
                  <Sun className="w-3 h-3 mr-1" />
                  Luz
                </Button>

                <Button
                  onClick={() => handleCareAction('NUTRIENT', 15)}
                  disabled={caring}
                  variant="outline"
                  size="sm"
                  className="text-[10px] h-8 px-2"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Nutrientes
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleHarvestAction}
                disabled={caring}
                className="w-full mb-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-sm h-9"
              >
                <Award className="w-4 h-4 mr-2" />
                🌿 Colher e Gerar NFT
              </Button>
            )}

            {/* Genetics Info */}
            {plant.genetics && (
              <div className="bg-white p-2 rounded-lg border">
                <p className="text-xs font-bold text-gray-700 mb-1.5">📊 Genética:</p>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div><span className="text-gray-600">THC:</span> <span className="font-bold">{String(plant.genetics.thc || '')}</span></div>
                  <div><span className="text-gray-600">CBD:</span> <span className="font-bold">{String(plant.genetics.cbd || '')}</span></div>
                  <div><span className="text-gray-600">Floração:</span> <span className="font-bold">{String(plant.genetics.flowering || '')}</span></div>
                  <div><span className="text-gray-600">Dificuldade:</span> <span className="font-bold">{String(plant.genetics.difficulty || '')}</span></div>
                </div>
              </div>
            )}

            {/* Progresso resumo */}
            <div className="mt-3 pt-2 border-t border-green-200">
              <p className="text-[10px] text-gray-700 font-medium text-center">
                📊 Progresso: {currentStageIndex + 1}/{STAGES.length} estágios concluídos
              </p>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
