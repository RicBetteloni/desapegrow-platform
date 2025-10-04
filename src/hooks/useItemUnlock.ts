// src/hooks/useItemUnlock.ts
import { useState, useCallback } from 'react';

interface UnlockItemParams {
  productId: string;
  orderId: string;
}

interface UnlockedItem {
  id: string;
  name: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  itemType: string;
  iconUrl: string;
  effects: { effectType: string; value: number }[];
}

interface UnlockRewards {
  cultivoCoins: number;
  growthGems: number;
  totalCoins: number;
  totalGems: number;
}

interface UnlockResult {
  success: boolean;
  item: UnlockedItem;
  rewards: UnlockRewards;
  message: string;
}

export function useItemUnlock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlockedItem, setUnlockedItem] = useState<UnlockedItem | null>(null);
  const [rewards, setRewards] = useState<UnlockRewards | null>(null);
  const [showModal, setShowModal] = useState(false);

  /**
   * Desbloqueia item virtual baseado na compra
   */
  const unlockItem = useCallback(async ({ productId, orderId }: UnlockItemParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/grow/unlock-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, orderId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao desbloquear item');
      }

      const data: UnlockResult = await response.json();

      setUnlockedItem(data.item);
      setRewards(data.rewards);
      setShowModal(true);

      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao desbloquear item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fecha o modal de item desbloqueado
   */
  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  /**
   * Reset completo do estado
   */
  const reset = useCallback(() => {
    setUnlockedItem(null);
    setRewards(null);
    setError(null);
    setShowModal(false);
  }, []);

  return {
    unlockItem,
    loading,
    error,
    unlockedItem,
    rewards,
    showModal,
    closeModal,
    reset
  };
}