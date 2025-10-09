// src/components/VirtualInventoryComponent.tsx
'use client'

import { useState, useEffect } from 'react'
import { Package, Sparkles, Filter, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface ItemEffect {
  type: 'growth_speed' | 'health_boost' | 'yield_multiplier' | 'automation'
  value: number
}

interface VirtualItem {
  id: string
  name: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  itemType: string
  iconUrl: string
  effects: ItemEffect[]
  createdAt: string
}

interface InventoryStats {
  totalItems: number
  byRarity: {
    COMMON: number
    RARE: number
    EPIC: number
    LEGENDARY: number
  }
}

const RARITY_COLORS = {
  COMMON: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700', emoji: '⚪' },
  RARE: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700', emoji: '🔵' },
  EPIC: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700', emoji: '🟣' },
  LEGENDARY: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700', emoji: '🟠' }
}

const ITEM_TYPE_ICONS: Record<string, string> = {
  LIGHTING: '💡',
  NUTRIENTS: '🧪',
  SUBSTRATE: '🏺',
  TOOLS: '🔧',
  GENETICS: '🧬',
  AUTOMATION: '🤖',
  DECORATION: '✨',
  BOOSTER: '⚡'
}

export default function VirtualInventoryComponent() {
  const [inventory, setInventory] = useState<VirtualItem[]>([])
  const [stats, setStats] = useState<InventoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterRarity, setFilterRarity] = useState<string>('ALL')
  const [filterType, setFilterType] = useState<string>('ALL')

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/grow/unlock-item')
      if (!response.ok) throw new Error('Erro ao carregar inventário')
      const data = await response.json()
      setInventory(data.inventory || [])
      setStats(data.stats)
    } catch (error) {
      console.error('Erro ao buscar inventário:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = inventory.filter(item => {
    const rarityMatch = filterRarity === 'ALL' || item.rarity === filterRarity
    const typeMatch = filterType === 'ALL' || item.itemType === filterType
    return rarityMatch && typeMatch
  })

  const totalPower = inventory.reduce((sum, item) => {
    if (item.effects && Array.isArray(item.effects)) {
      return sum + item.effects.length * (
        item.rarity === 'LEGENDARY' ? 4 : 
        item.rarity === 'EPIC' ? 3 :
        item.rarity === 'RARE' ? 2 : 1
      )
    }
    return sum
  }, 0)

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando inventário...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Itens</p>
              <p className="text-2xl font-bold">{stats?.totalItems || 0}</p>
            </div>
            <Package className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Poder Total</p>
              <p className="text-2xl font-bold text-purple-600">{totalPower}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Legendários</p>
              <p className="text-2xl font-bold text-orange-600">{stats?.byRarity.LEGENDARY || 0}</p>
            </div>
            <Sparkles className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Épicos</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.byRarity.EPIC || 0}</p>
            </div>
            <Sparkles className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <select value={filterRarity} onChange={(e) => setFilterRarity(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="ALL">Todas Raridades</option>
            <option value="COMMON">⚪ Common</option>
            <option value="RARE">🔵 Rare</option>
            <option value="EPIC">🟣 Epic</option>
            <option value="LEGENDARY">🟠 Legendary</option>
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="ALL">Todos os Tipos</option>
            <option value="LIGHTING">💡 Iluminação</option>
            <option value="NUTRIENTS">🧪 Nutrientes</option>
            <option value="AUTOMATION">🤖 Automação</option>
            <option value="GENETICS">🧬 Genética</option>
            <option value="BOOSTER">⚡ Booster</option>
          </select>
        </div>
      </div>

      {/* Inventory Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2 text-gray-700">
            {inventory.length === 0 ? 'Nenhum Item Desbloqueado' : 'Nenhum item encontrado'}
          </h3>
          <p className="text-gray-500 mb-4">
            {inventory.length === 0 ? 'Compre produtos no marketplace para desbloquear itens virtuais!' : 'Tente ajustar os filtros'}
          </p>
          {inventory.length === 0 && (
            <Link href="/marketplace" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              🛒 Ir para Marketplace
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const config = RARITY_COLORS[item.rarity]
            const typeIcon = ITEM_TYPE_ICONS[item.itemType] || '📦'
            return (
              <div key={item.id} className={`${config.bg} ${config.border} border-2 rounded-xl p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl p-2 rounded-lg bg-white/50">{typeIcon}</div>
                  <div className="text-2xl">{config.emoji}</div>
                </div>
                <h4 className={`font-bold mb-1 ${config.text}`}>{item.name}</h4>
                <p className="text-xs text-gray-600 mb-3">{item.itemType.replace('_', ' ')}</p>
                {item.effects && Array.isArray(item.effects) && item.effects.length > 0 && (
                  <div className="space-y-1 mb-3">
                    {item.effects.slice(0, 2).map((effect: ItemEffect, idx: number) => (
                      <div key={idx} className="text-xs bg-white/70 rounded px-2 py-1">
                        <span className="font-semibold">
                          {effect.type === 'growth_speed' && '⚡ Crescimento'}
                          {effect.type === 'health_boost' && '💚 Saúde'}
                          {effect.type === 'yield_multiplier' && '🌾 Colheita'}
                          {effect.type === 'automation' && '🤖 Auto'}
                        </span>
                        <span className="ml-1 text-green-600 font-bold">
                          {effect.type === 'yield_multiplier' ? `×${effect.value}` : `+${effect.value}%`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-300/50">
                  {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Rarity Distribution */}
      {inventory.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">📊 Distribuição por Raridade</h3>
          <div className="space-y-3">
            {Object.entries(stats?.byRarity || {}).map(([rarity, count]) => {
              const percentage = ((count / (stats?.totalItems || 1)) * 100).toFixed(1)
              const config = RARITY_COLORS[rarity as keyof typeof RARITY_COLORS]
              return (
                <div key={rarity}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium flex items-center space-x-2">
                      <span>{config.emoji}</span>
                      <span>{rarity}</span>
                    </span>
                    <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className={`h-full ${config.bg.replace('100', '500')} transition-all duration-500`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}