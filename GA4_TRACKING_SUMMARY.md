# 📊 Integração Google Analytics 4 (GA4) - Sumário Completo

## 🎯 Visão Geral
Implementação completa de rastreamento de eventos GA4 em todas as jornadas principais do Desapegrow. O site agora captura dados detalhados sobre navegação, produtos visualizados, compras, pesquisas e comportamento do usuário.

---

## 🔧 Configuração Base

### Google Tag Manager (GTM)
- **Container ID**: GTM-WVJS63N7
- **Local**: [src/app/layout.tsx](src/app/layout.tsx)
- **Status**: ✅ Implementado

### Google Analytics 4 (GA4)
- **Measurement ID**: G-H4Y8WPR3HC
- **Script**: Global Site Tag (gtag.js)
- **Local**: [src/app/layout.tsx](src/app/layout.tsx)
- **Status**: ✅ Implementado

### Utilitários de Tracking
- **Arquivo**: [src/lib/analytics.ts](src/lib/analytics.ts)
- **Funções GA4**: 20+ funções para rastreamento de eventos
- **Compatibilidade**: GA4 events + Custom analytics do Desapegrow
- **Status**: ✅ Expandido

---

## 📑 Eventos Implementados

### 1. **Eventos de Autenticação**
| Evento | Função | Local |
|--------|--------|-------|
| **login** | Rastreia login de usuários | [Header.tsx](src/components/layout/Header.tsx) - NextAuth |
| **logout** | Rastreia logout de usuários | [Header.tsx](src/components/layout/Header.tsx) - L256 |
| **sign_up** | Rastreia novo registro | Página de signup |

**Dados Capturados**:
- Método de autenticação (email)
- User ID (opcional)

---

### 2. **Eventos de Produtos**

#### View Item (Visualização de Produto)
| Propriedade | Detalhes |
|------------|----------|
| **Trigger** | Quando usuário acessa página de detalhe do produto |
| **Locais** | [produtos/[slug]/page.tsx](src/app/produtos/[slug]/page.tsx#L41-L60) e [marketplace/[slug]/page.tsx](src/app/marketplace/[slug]/page.tsx#L42-L61) |
| **Status** | ✅ Implementado |

**Dados Capturados**:
```javascript
{
  item_id: product.id,
  item_name: product.name,
  item_category: product.category.name,
  price: product.price,
  item_brand: "Desapegrow"
}
```

---

### 3. **Eventos de Carrinho**

#### Add to Cart (Adicionar ao Carrinho)
| Propriedade | Detalhes |
|------------|----------|
| **Trigger** | Click no botão "Adicionar ao Carrinho" |
| **Locais** | [ProductCard.tsx](src/components/marketplace/ProductCard.tsx#L47-L88), [produtos/[slug]/page.tsx](src/app/produtos/[slug]/page.tsx), [marketplace/[slug]/page.tsx](src/app/marketplace/[slug]/page.tsx) |
| **Status** | ✅ Implementado em 3 locais |

**Dados Capturados**:
```javascript
{
  items: [{
    item_id: product.id,
    item_name: product.name,
    price: product.price,
    quantity: 1,
    item_brand: "Desapegrow"
  }],
  value: product.price,
  currency: "BRL"
}
```

#### Remove from Cart (Remover do Carrinho)
| Propriedade | Detalhes |
|------------|----------|
| **Trigger** | Click no botão remover no carrinho |
| **Local** | [CartSheet.tsx](src/components/cart/CartSheet.tsx#L46-L66) |
| **Status** | ✅ Implementado |

**Dados Capturados**:
```javascript
{
  items: [{...}],
  value: itemPrice * quantity,
  currency: "BRL"
}
```

---

### 4. **Eventos de Checkout**

#### Begin Checkout (Iniciar Checkout)
| Propriedade | Detalhes |
|------------|----------|
| **Trigger** | Formulário de checkout validado + enviado |
| **Local** | [checkout/page.tsx](src/app/checkout/page.tsx#L39-L69) |
| **Status** | ✅ Implementado |

**Dados Capturados**:
```javascript
{
  items: [{ item_id, item_name, price, quantity }],
  value: cartValue,
  currency: "BRL"
}
```

#### Purchase (Compra Realizada) ⭐ CONVERSÃO-CHAVE
| Propriedade | Detalhes |
|------------|----------|
| **Trigger** | Página de sucesso do pedido carregada |
| **Local** | [checkout/sucesso/page.tsx](src/app/checkout/sucesso/page.tsx#L20-L72) |
| **Status** | ✅ Implementado |

**Dados Capturados**:
```javascript
{
  transaction_id: order.id,
  affiliation: "Desapegrow",
  value: orderTotal,
  currency: "BRL",
  tax: 0,
  shipping: 0,
  items: [{
    item_id: productId,
    item_name: productName,
    price: itemPrice,
    quantity: quantity
  }]
}
```

---

### 5. **Eventos de Search & Navegação**

#### Search (Busca)
| Propriedade | Detalhes |
|------------|----------|
| **Trigger** | Envio de formulário de busca |
| **Local** | [marketplace/page.tsx](src/app/marketplace/page.tsx#L311-L323) |
| **Status** | ✅ Implementado |

**Dados Capturados**:
```javascript
{
  search_term: "termo buscado",
  results_count: numberOfResults
}
```

#### Filter Select (Seleção de Categoria/Filtro)
| Propriedade | Detalhes |
|------------|----------|
| **Trigger** | Seleção de categoria ou filtro |
| **Local** | [marketplace/page.tsx](src/app/marketplace/page.tsx#L320) |
| **Status** | ✅ Implementado |

**Dados Capturados**:
```javascript
{
  item_category: "category_name",
  item_category_2: "filter_value"
}
```

---

## 📊 Eventos Disponíveis (Não Implementados Ainda)

### Eventos Futuros
Funções criadas e prontas para uso:

| Evento | Função | Uso Ideal |
|--------|--------|-----------|
| `add_shipping_info` | `trackGA4AddShippingInfo()` | Após seleção de método de entrega |
| `add_payment_info` | `trackGA4AddPaymentInfo()` | Após seleção de método de pagamento |
| `refund` | `trackGA4Refund()` | Ao processar reembolso |
| `scroll_depth` | `trackGA4ScrollEngage()` | Engajamento em páginas |
| `exception` | `trackGA4Exception()` | Erros e falhas |
| `navigation` | `trackGA4NavClick()` | Cliques em navegação |

---

## 🔍 Como Funciona o Rastreamento

### 1. **Page Views Automáticas**
- GA4 rastreia automaticamente todas as transições de página
- Integrado via GTM + gtag.js
- **Sem ação necessária**

### 2. **Eventos Customizados**
Todos os eventos são rastreados através de:

```typescript
// Importação
import { trackGA4Login, trackGA4AddToCart, ... } from '@/lib/analytics'

// Uso
trackGA4AddToCart([
  {
    item_id: product.id,
    item_name: product.name,
    price: product.price,
    quantity: 1,
    item_brand: 'Desapegrow'
  }
], cartValue)
```

### 3. **Duplo Tracking**
- **GA4**: Para relatórios nativos do Google Analytics
- **Custom Analytics**: Salvo em `/api/analytics/track` para backup e análise customizada

---

## 📈 Como Visualizar os Dados

### Em Google Analytics 4

1. **Realtime Reports** (Tempo Real)
   - Navegue até: Reports → Realtime
   - Veja usuários ativos agora
   - Eventos acontecendo em tempo real

2. **Conversion Events**
   - Configure `purchase` como evento de conversão chave
   - Navegue até: Configure → Conversions
   - Defina metas/objetivos

3. **User Journey**
   - Reports → Exploration → Path Analysis
   - Veja rotas dos usuários no site

4. **Ecommerce Reports**
   - Reports → E-commerce → Shopping Behavior
   - Analise funil de compra

---

## ✅ Arquivos Modificados

### Arquivos de Tracking
- [x] `src/lib/analytics.ts` - Expandido com 20+ funções GA4
- [x] `src/app/layout.tsx` - Adicionado gtag script

### Páginas de Conversão
- [x] `src/app/checkout/sucesso/page.tsx` - Purchase event
- [x] `src/app/checkout/page.tsx` - Begin checkout event

### Páginas de Produto
- [x] `src/app/produtos/[slug]/page.tsx` - View item + Add to cart
- [x] `src/app/marketplace/[slug]/page.tsx` - View item + Add to cart

### Componentes
- [x] `src/components/marketplace/ProductCard.tsx` - Add to cart event
- [x] `src/components/cart/CartSheet.tsx` - Remove from cart event
- [x] `src/components/layout/Header.tsx` - Logout event

### Páginas de Navegação
- [x] `src/app/marketplace/page.tsx` - Search + Filter events

---

## 🚀 Próximos Passos (Futuro)

### Phase 2: Engajamento Avançado
- [ ] Scroll depth tracking (90% página)
- [ ] Tempo de permanência em página
- [ ] Cliques em links específicos
- [ ] Vídeos (se houver)
- [ ] Forms interativos

### Phase 3: Attribution & Funil
- [ ] Cross-device attribution
- [ ] Multi-touch attribution
- [ ] Funil de compra detalhado
- [ ] Análise de coorte

### Phase 4: Machine Learning
- [ ] Audiences automáticas no GA4
- [ ] Previsão de churn
- [ ] Recomendações de otimização

---

## 🔐 Dados de Privacidade

### Conformidade
- ✅ LGPD (Lei Geral de Proteção de Dados)
- ✅ Sem coleta de dados sensíveis
- ✅ IPs anônimos (GA4 padrão)
- ✅ User IDs opcionais

### O que NÃO é rastreado
- ❌ Dados de pagamento (Mercado Pago gerencia)
- ❌ Senhas
- ❌ CPF completo
- ❌ Dados bancários

---

## 📞 Referências

- **GA4 Setup**: https://analytics.google.com/
- **GTM Documentation**: https://marketingplatform.google.com/about/tag-manager/
- **GA4 Events Guide**: https://developers.google.com/analytics/devguides/collection/ga4/events
- **Measurement ID**: G-H4Y8WPR3HC
- **GTM Container**: GTM-WVJS63N7

---

## ✨ Resumo Executivo

**Total de Eventos GA4 Implementados**: 8 eventos principais

**Jornada Rastreada**:
```
Homepage 
  ↓ (click) 
Busca/Filtro 
  ↓ (view_item)
Página Produto
  ↓ (add_to_cart)
Carrinho
  ↓ (begin_checkout)
Checkout
  ↓ (purchase) ⭐
Sucesso - CONVERSÃO
```

**Status de Build**: ✅ Compilado com sucesso (55 páginas)

**Deploy**: Pronto para produção em Vercel

---

*Última atualização: 11 de Abril de 2026*
*Status: Pronto para Produção* ✅
