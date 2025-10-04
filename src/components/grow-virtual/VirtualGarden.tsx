'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Zap } from 'lucide-react';

interface VirtualPlant {
  id: string;
  name: string;
  stage: string;
  health: number;
  daysGrowing: number;
}

export function VirtualGarden() {
  const { data: session, status } = useSession();
  const [plants, setPlants] = useState<VirtualPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchGardenData();
  }, [session, status, router]);

  const fetchGardenData = async () => {
    try {
      const response = await fetch('/api/grow/garden');
      if (response.ok) {
        const data = await response.json();
        setPlants(data.plants);
      }
    } catch (error) {
      console.error('Erro ao carregar o jardim virtual:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando Jardim...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">My Virtual Garden 🪴</h1>
        <p className="text-gray-600">
          Cuide de suas plantas, colha e ganhe recompensas!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {plants.length === 0 ? (
          <Card className="col-span-full text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">Seu jardim está vazio!</h3>
              <p className="text-gray-500 mb-4">
                Compre sua primeira semente no marketplace para começar a plantar.
              </p>
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                Comprar Semente (100 CultivoCoins)
              </Button>
            </CardContent>
          </Card>
        ) : (
          plants.map((plant) => (
            <Card key={plant.id}>
              <CardHeader>
                <CardTitle>{plant.name}</CardTitle>
                <p className="text-sm text-gray-500">Estágio: {plant.stage}</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Crescendo há {plant.daysGrowing} dias
                </p>
                {/* Você pode adicionar aqui uma barra de progresso, etc. */}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}