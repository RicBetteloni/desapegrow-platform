# 📢 Sistema de Banners e Publicidade - Marketplace

## 📐 Especificações de Banners

### Banner Principal (Carousel)
- **Tamanho recomendado**: 1200x400px
- **Formato**: JPG, PNG ou WebP
- **Peso máximo**: 500KB
- **Quantidade**: 3-5 banners rotativos
- **Tempo de exibição**: 5 segundos cada

**Arquivos:**
- `black-friday.jpg` - Promoções e ofertas especiais
- `novidades.jpg` - Lançamentos e produtos novos
- `frete-gratis.jpg` - Benefícios e vantagens

### Publicidade Horizontal
- **Tamanho**: 728x90px (Banner Leaderboard)
- **Localização**: Entre categorias e produtos
- **Formato**: JPG, PNG, GIF animado
- **Peso máximo**: 150KB

### Publicidade Lateral (Sidebar)
- **Tamanho**: 300x250px (Medium Rectangle)
- **Localização**: Sidebar direita
- **Formato**: JPG, PNG, GIF animado
- **Peso máximo**: 150KB
- **Quantidade**: 2 espaços

## 🎨 Diretrizes de Design

### Cores Recomendadas
- Verde principal: `#16a34a` (green-600)
- Verde claro: `#22c55e` (green-500)
- Contraste: Branco ou preto para textos

### Elementos Obrigatórios
- ✅ Logo da marca/produto
- ✅ Call-to-action claro
- ✅ Texto legível (mínimo 14px)
- ✅ Contraste adequado

### Evitar
- ❌ Excesso de texto
- ❌ Muitas cores diferentes
- ❌ Imagens pixeladas
- ❌ Animações muito rápidas (GIF)

## 🔧 Como Adicionar Novos Banners

1. **Adicione a imagem** nesta pasta (`public/banners/`)
2. **Edite o arquivo**: `src/app/marketplace/page.tsx`
3. **Localize o array `banners`** (linha ~60)
4. **Adicione um novo objeto**:

```javascript
{
  id: 4,
  title: 'Seu Título Aqui! 🎉',
  subtitle: 'Descrição atrativa do banner',
  image: '/banners/seu-banner.jpg',
  bgColor: 'from-purple-600 to-pink-600', // Tailwind gradient
  link: '/marketplace?promo=suapromo'
}
```

## 📊 Espaços Publicitários Disponíveis

| Espaço | Tamanho | Localização | Status |
|--------|---------|-------------|--------|
| Banner Carousel | 1200x400 | Topo da página | ✅ Ativo |
| Leaderboard | 728x90 | Antes dos produtos | 🔄 Preparado |
| Sidebar 1 | 300x250 | Lateral direita (topo) | 🔄 Preparado |
| Sidebar 2 | 300x250 | Lateral direita (meio) | 🔄 Preparado |

## 💡 Dicas para Conversão

### CTA (Call-to-Action) Efetivos
- "Ver Ofertas"
- "Comprar Agora"
- "Aproveitar Desconto"
- "Garantir o Meu"
- "Conhecer Mais"

### Urgência e Escassez
- "Só hoje!"
- "Últimas unidades"
- "Promoção por tempo limitado"
- "Enquanto durar o estoque"

### Benefícios em Destaque
- "Frete Grátis"
- "10% OFF na primeira compra"
- "Ganhe CultivoCoins"
- "Cashback garantido"

## 🎯 Analytics e Rastreamento

Para rastrear cliques nos banners, adicione parâmetros UTM na URL:

```
/marketplace?utm_source=banner&utm_medium=carousel&utm_campaign=blackfriday
```

## 📝 Changelog

- **2025-01-01**: Sistema de publicidade implementado
- **2025-01-01**: Carousel com 3 banners rotativos
- **2025-01-01**: Espaços publicitários preparados
