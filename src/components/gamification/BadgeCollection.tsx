'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Award, ShoppingCart, Calendar, Users, Sparkles } from 'lucide-react'

interface Badge {
  name: string;
  icon: string;
  rarity: keyof typeof rarityColors;
  description: string;
  unlocked: boolean;
}

const badges: Record<string, Badge[]> = {
  compras: [
    { name: "Primeira Semente", icon: "🌰", rarity: "comum", description: "Primeira compra", unlocked: true },
    { name: "Illuminador", icon: "💡", rarity: "raro", description: "5 produtos de iluminação", unlocked: true },
    { name: "Alquimista", icon: "🧪", rarity: "épico", description: "10 fertilizantes diferentes", unlocked: false },
    { name: "High Roller", icon: "💰", rarity: "lendário", description: "Compra de R$ 1000+", unlocked: false },
  ],
  consistencia: [
    { name: "Week Warrior", icon: "🔥", rarity: "comum", description: "7 dias seguidos", unlocked: true },
    { name: "Month Master", icon: "📅", rarity: "raro", description: "30 dias seguidos", unlocked: true },
    { name: "Year Legend", icon: "⚡", rarity: "lendário", description: "365 dias seguidos", unlocked: false },
    { name: "Eternal", icon: "💎", rarity: "mítico", description: "730 dias seguidos", unlocked: false },
  ],
  social: [
    { name: "Networker", icon: "🔗", rarity: "raro", description: "Indicar 5 amigos", unlocked: true },
    { name: "Influencer", icon: "⭐", rarity: "épico", description: "100 likes em reviews", unlocked: false },
    { name: "Community Hero", icon: "👥", rarity: "lendário", description: "Ajudar 50 iniciantes", unlocked: false },
  ],
  secretos: [
    { name: "Night Owl", icon: "🦉", rarity: "épico", description: "Comprar à meia-noite", unlocked: false },
    { name: "Lucky Charm", icon: "🍀", rarity: "mítico", description: "Evento RNG muito raro", unlocked: false },
    { name: "Detective", icon: "🕵️", rarity: "épico", description: "Descobrir easter egg", unlocked: false },
  ]
}

const rarityColors = {
  comum: "bg-gray-100 border-gray-300 text-gray-700",
  raro: "bg-blue-100 border-blue-300 text-blue-700", 
  épico: "bg-purple-100 border-purple-300 text-purple-700",
  lendário: "bg-orange-100 border-orange-300 text-orange-700",
  mítico: "bg-red-100 border-red-300 text-red-700"
}

export function BadgeCollection() {
  const [selectedBadge, setSelectedBadge] = useState<(Badge & { category: string }) | null>(null)

  interface Badge {
    name: string;
    icon: string;
    rarity: keyof typeof rarityColors;
    description: string;
    unlocked: boolean;
  }

  const BadgeCard = ({ badge, category }: { badge: Badge, category: string }) => (
    <Card 
      className={`cursor-pointer transition-all hover:scale-105 ${
        badge.unlocked ? '' : 'opacity-50 grayscale'
      }`}
      onClick={() => setSelectedBadge({...badge, category})}
    >
      <CardContent className="p-4 text-center">
        <div className="text-4xl mb-2">{badge.icon}</div>
        <div className="font-semibold text-sm mb-1">{badge.name}</div>
        <Badge className={`text-xs ${rarityColors[badge.rarity as keyof typeof rarityColors]}`}>
          {badge.rarity}
        </Badge>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Coleção de Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compras" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="compras" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Compras
              </TabsTrigger>
              <TabsTrigger value="consistencia" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Consistência
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Social
              </TabsTrigger>
              <TabsTrigger value="secretos" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Secretos
              </TabsTrigger>
            </TabsList>

            {Object.entries(badges).map(([category, badgeList]) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {badgeList.map((badge, index) => (
                    <BadgeCard key={index} badge={badge} category={category} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {selectedBadge && (
        <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">{selectedBadge.icon}</div>
            <h3 className="text-2xl font-bold mb-2">{selectedBadge.name}</h3>
            <Badge className={`mb-4 ${rarityColors[selectedBadge.rarity as keyof typeof rarityColors]}`}>
              {selectedBadge.rarity.toUpperCase()}
            </Badge>
            <p className="text-gray-600 mb-4">{selectedBadge.description}</p>
            <div className="text-sm text-gray-500">
              Status: {selectedBadge.unlocked ? "✅ Desbloqueado" : "🔒 Bloqueado"}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}