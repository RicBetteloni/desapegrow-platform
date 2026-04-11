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
    } catch {
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

// ============================================
// GA4 EVENT TRACKING FUNCTIONS
// ============================================

interface GA4ProductItem {
  item_id: string
  item_name: string
  item_category?: string
  price?: number
  quantity?: number
  item_brand?: string
}

interface GA4PurchaseEvent {
  transaction_id: string
  affiliation?: string
  value: number
  currency: string
  tax?: number
  shipping?: number
  items: GA4ProductItem[]
}

/**
 * Track GA4 login event
 */
export function trackGA4Login(userId?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'login', {
      method: 'email',
      user_id: userId,
    })
    const analytics = getAnalytics()
    analytics.setUserId(userId || '')
  }
}

/**
 * Track GA4 user signup
 */
export function trackGA4SignUp() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: 'email',
    })
  }
}

/**
 * Track GA4 logout event
 */
export function trackGA4Logout() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'logout', {})
  }
}

/**
 * Track GA4 product view
 */
export function trackGA4ViewItem(items: GA4ProductItem[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    const value = items.reduce((sum, item) => sum + (item.price || 0), 0)
    window.gtag('event', 'view_item', {
      items: items,
      value: value,
      currency: 'BRL',
    })
  }
}

/**
 * Track GA4 search event
 */
export function trackGA4Search(searchTerm: string, resultsCount?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
      results_count: resultsCount || 0,
    })
  }
}

/**
 * Track GA4 category/filter selection
 */
export function trackGA4FilterSelect(filterName: string, filterValue: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item_list', {
      item_category: filterName,
      item_category_2: filterValue,
    })
  }
}

/**
 * Track GA4 add to cart
 */
export function trackGA4AddToCart(items: GA4ProductItem[], cartValue?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    const value = cartValue || items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)
    window.gtag('event', 'add_to_cart', {
      items: items,
      value: value,
      currency: 'BRL',
    })
  }
}

/**
 * Track GA4 remove from cart
 */
export function trackGA4RemoveFromCart(items: GA4ProductItem[], cartValue?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    const value = cartValue || items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)
    window.gtag('event', 'remove_from_cart', {
      items: items,
      value: value,
      currency: 'BRL',
    })
  }
}

/**
 * Track GA4 begin checkout
 */
export function trackGA4BeginCheckout(items: GA4ProductItem[], cartValue: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      items: items,
      value: cartValue,
      currency: 'BRL',
    })
  }
}

/**
 * Track GA4 add shipping info
 */
export function trackGA4AddShippingInfo(shippingTier?: string, value?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_shipping_info', {
      shipping_tier: shippingTier || 'standard',
      value: value || 0,
      currency: 'BRL',
    })
  }
}

/**
 * Track GA4 add payment info
 */
export function trackGA4AddPaymentInfo(paymentType?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_payment_info', {
      payment_type: paymentType || 'credit_card',
    })
  }
}

/**
 * Track GA4 purchase (conversion event)
 */
export function trackGA4Purchase(purchaseData: GA4PurchaseEvent) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: purchaseData.transaction_id,
      affiliation: purchaseData.affiliation || 'Desapegrow',
      value: purchaseData.value,
      currency: purchaseData.currency,
      tax: purchaseData.tax || 0,
      shipping: purchaseData.shipping || 0,
      items: purchaseData.items,
    })
  }
}

/**
 * Track GA4 refund
 */
export function trackGA4Refund(transactionId: string, value: number, items: GA4ProductItem[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'refund', {
      transaction_id: transactionId,
      value: value,
      currency: 'BRL',
      items: items,
    })
  }
}

/**
 * Track GA4 custom event
 */
export function trackGA4CustomEvent(eventName: string, eventData: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventData)
  }
}

/**
 * Track GA4 page engagement (scroll)
 */
export function trackGA4ScrollEngage() {
  if (typeof window === 'undefined') return

  let maxScroll = 0

  const trackScroll = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent

      if (scrollPercent >= 50 && maxScroll < 60) {
        trackGA4CustomEvent('scroll_depth', { depth: '50%' })
      }
      if (scrollPercent >= 90 && maxScroll < 100) {
        trackGA4CustomEvent('scroll_depth', { depth: '90%' })
      }
    }
  }

  window.addEventListener('scroll', trackScroll, { passive: true })
}

/**
 * Track GA4 navigation clicks
 */
export function trackGA4NavClick(label: string, destination?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'navigation', {
      event_category: 'navigation',
      event_label: label,
      page_path: destination,
    })
  }
}

/**
 * Track GA4 exceptions/errors
 */
export function trackGA4Exception(description: string, fatal: boolean = false) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: description,
      fatal: fatal,
    })
  }
}

/**
 * Set GA4 user properties
 */
export function setGA4UserProperties(userId: string, userProperties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', { 'user_id': userId })
    if (userProperties) {
      window.gtag('set', userProperties)
    }
  }
}

// Extend window object to include gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}