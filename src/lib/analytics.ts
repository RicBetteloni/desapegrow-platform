// src/lib/analytics.ts
'use client'

type AnalyticsEvent = 
  | 'USER_SIGNUP'
  | 'USER_LOGIN'
  | 'PRODUCT_VIEW'
  | 'PRODUCT_FAVORITE'
  | 'CART_ADD'
  | 'CART_REMOVE'
  | 'CHECKOUT_START'
  | 'ORDER_PLACED'
  | 'PRODUCT_REVIEW'
  | 'POINTS_EARNED'
  | 'BADGE_EARNED'
  | 'LEVEL_UP'
  | 'SEARCH_QUERY'
  | 'PAGE_VIEW'

interface Product {
  id: string
  name: string
  price: number
  quantity: number
}

interface AnalyticsData {
  userId?: string
  productId?: string
  categoryId?: string
  value?: number
  metadata?: Record<string, string | number | boolean>
  pointsEarned?: number
  sessionId?: string
}

class DesapegrowAnalytics {
  private sessionId: string
  private userId?: string
  private events: Array<{
    event: AnalyticsEvent
    data: AnalyticsData
    timestamp: number
  }> = []

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initSession()
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  private initSession() {
    this.track('PAGE_VIEW', {
      metadata: { 
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      }
    })
  }

  setUserId(userId: string) {
    this.userId = userId
  }

  track(event: AnalyticsEvent, data: AnalyticsData = {}) {
    const eventData = {
      event,
      data: {
        ...data,
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    }

    this.events.push(eventData)
    this.sendToServer(eventData)

    // Log para debug em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, eventData.data)
    }
  }

  private async sendToServer(eventData: {
    event: AnalyticsEvent;
    data: AnalyticsData & {
      timestamp: number;
    };
    timestamp: number;
  }) {
    try {
      // Enviar para API em modo não-bloqueante
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      }).catch(() => {
        // Ignorar erros de tracking silenciosamente
      })
    } catch (error) {
      // Tracking não deve quebrar a aplicação
    }
  }

  // Métodos de conveniência para eventos comuns
  trackPurchase(orderId: string, value: number, products: Product[]) {
    this.track('ORDER_PLACED', {
      value,
      metadata: { 
        orderId, 
        products: JSON.stringify(products),
        itemCount: products.length
      }
    })
  }

  trackGamification(event: 'POINTS_EARNED' | 'BADGE_EARNED' | 'LEVEL_UP', data: {
    pointsEarned?: number
    badgeName?: string
    newLevel?: string
    reason?: string
  }) {
    this.track(event, {
      pointsEarned: data.pointsEarned,
      metadata: data
    })
  }

  trackSearch(query: string, results: number) {
    this.track('SEARCH_QUERY', {
      metadata: { query, resultsCount: results }
    })
  }

  trackCartAction(action: 'add' | 'remove', productId: string, quantity: number, price: number) {
    this.track(action === 'add' ? 'CART_ADD' : 'CART_REMOVE', {
      productId,
      value: price * quantity,
      metadata: { quantity, price }
    })
  }

  // Obter métricas da sessão atual
  getSessionMetrics() {
    return {
      sessionId: this.sessionId,
      eventsCount: this.events.length,
      sessionDuration: this.events.length > 0 ? Date.now() - this.events[0].timestamp : 0,
      pageViews: this.events.filter(e => e.event === 'PAGE_VIEW').length,
      productViews: this.events.filter(e => e.event === 'PRODUCT_VIEW').length,
      cartActions: this.events.filter(e => e.event.includes('CART')).length
    }
  }
}

// Instância global
let analytics: DesapegrowAnalytics

export const getAnalytics = (): DesapegrowAnalytics => {
  if (!analytics) {
    analytics = new DesapegrowAnalytics()
  }
  return analytics
}

// Hook React para usar analytics
export const useAnalytics = () => {
  return getAnalytics()
}