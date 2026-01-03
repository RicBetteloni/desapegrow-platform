# 🎯 GUIA RÁPIDO - SEO DESAPEGROW

## ✅ O QUE JÁ FOI FEITO

### 1. Categorias Cadastradas
**59 categorias** organizadas em 8 grupos principais:

```
📂 Desapegrow
├── 💡 Iluminação LED (5 subcategorias)
├── 🏠 Estufas e Tendas (7 subcategorias)
├── 🌀 Exaustão e Ventilação (5 subcategorias)
├── 🌡️ Controle Ambiental (5 subcategorias)
├── 🧪 Nutrição e Substrato (6 subcategorias)
├── 💧 Sistemas Hidropônicos (5 subcategorias)
├── 🪴 Recipientes e Vasos (5 subcategorias)
└── 🔧 Acessórios e Ferramentas (8 subcategorias)
```

### 2. Pesquisa de Mercado
Análise completa de:
- ✅ Grama Cultivo (líder nacional)
- ✅ Leds Indoor (especialista)
- ✅ Grow Power (marketplace)
- ✅ Reddit r/Cultivonha (10k+ membros)
- ✅ Comunidades de cultivo

### 3. Keywords Mapeadas
**+150 palavras-chave** identificadas e priorizadas:
- **Tier 1:** Alto volume (cultivo indoor, kit cultivo, estufa 120x120)
- **Tier 2:** Cauda longa (led quantum bar 480w samsung lm301h)

---

## 🚀 COMO USAR AS CATEGORIAS

### Verificar Categorias no Banco
```bash
npx tsx scripts/seed-categories-seo.ts
```

### Listar Todas as Categorias
```typescript
// No código
const categories = await prisma.category.findMany({
  orderBy: { name: 'asc' }
})
```

### Filtrar por Categoria Principal
```typescript
// Exemplo: Buscar produtos de "Iluminação LED"
const products = await prisma.product.findMany({
  where: {
    category: {
      slug: 'iluminacao-led'
    }
  }
})
```

---

## 🎯 PRÓXIMOS PASSOS (PRIORIDADES)

### 🔴 URGENTE - Semana 1-2

#### 1. Criar Página de Categoria
Arquivo: `src/app/cultivo-indoor/[category]/page.tsx`

```typescript
import { prisma } from '@/lib/prisma'

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.category }
  })
  
  const products = await prisma.product.findMany({
    where: { categoryId: category?.id }
  })

  return (
    <div>
      <h1>{category?.name} para Cultivo Indoor</h1>
      <p>{category?.description}</p>
      
      {/* Grid de produtos */}
      <div className="grid grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      
      {/* FAQ estruturada */}
      <section>
        <h2>Perguntas Frequentes</h2>
        {/* FAQ com Schema Markup */}
      </section>
    </div>
  )
}
```

#### 2. Adicionar Meta Tags nos Produtos
Arquivo: `src/app/produtos/[slug]/page.tsx`

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)
  
  return {
    title: `${product.name} | Desapegrow - Cultivo Indoor`,
    description: product.shortDesc || product.description.slice(0, 155),
    keywords: [product.category.name, ...product.tags],
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
      type: 'product'
    }
  }
}
```

#### 3. Criar Sitemap Dinâmico
Arquivo: `src/app/sitemap.ts`

```typescript
import { prisma } from '@/lib/prisma'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await prisma.category.findMany()
  const products = await prisma.product.findMany()
  
  return [
    {
      url: 'https://desapegrow.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categories.map(cat => ({
      url: `https://desapegrow.com/cultivo-indoor/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...products.map(product => ({
      url: `https://desapegrow.com/produtos/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  ]
}
```

---

### 🟡 IMPORTANTE - Semana 3-4

#### 4. Criar Primeiro Artigo de Blog
Tema: **"Como Montar um Cultivo Indoor em Casa"**

Estrutura:
```markdown
# Como Montar um Cultivo Indoor em Casa - Guia Completo 2025

## 1. Introdução (200 palavras)
- Por que cultivo indoor?
- Benefícios vs outdoor

## 2. Equipamentos Essenciais (500 palavras)
### 2.1 Iluminação LED
- Quantum Board 480W
- Para estufa 120x120

### 2.2 Estufa Grow
- Tamanhos: 80x80, 120x120
- Mylar refletivo

### 2.3 Exaustão
- Exaustor inline
- Filtro de carvão

## 3. Montagem Passo a Passo (800 palavras)
### Passo 1: Escolher local
### Passo 2: Montar estufa
### Passo 3: Instalar LED
### Passo 4: Conectar exaustão

## 4. Custos (400 palavras)
- Kit básico: R$ 2.000
- Kit intermediário: R$ 4.000
- Kit profissional: R$ 8.000

## 5. FAQ (300 palavras)
- Quanto consome de energia?
- É legal cultivar em casa?
- Quanto tempo até colheita?

## 6. Produtos Recomendados (200 palavras)
[Links internos para produtos]
```

#### 5. Schema Markup para Produtos
Adicionar em cada página de produto:

```typescript
// components/ProductSchema.tsx
export function ProductSchema({ product }: { product: Product }) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Desapegrow"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price.toString(),
      "priceCurrency": "BRL",
      "availability": product.stock > 0 ? "InStock" : "OutOfStock",
      "url": `https://desapegrow.com/produtos/${product.slug}`
    }
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

---

## 📊 KEYWORDS PRIORITÁRIAS

### Para Implementar AGORA
1. **`kit cultivo indoor`** → Criar landing page otimizada
2. **`estufa grow 120x120`** → Category page + produtos
3. **`led grow 480w`** → Filtros na categoria Iluminação
4. **`quantum board samsung`** → Destacar produtos com chips Samsung
5. **`exaustor filtro carvão`** → Kit anti-odor promocional

### URLs Ideais
```
✅ /cultivo-indoor/kits/kit-completo-18-plantas
✅ /cultivo-indoor/estufas-tendas/estufa-120x120
✅ /cultivo-indoor/iluminacao-led/quantum-board-480w
✅ /cultivo-indoor/exaustao-ventilacao/kit-anti-odor
✅ /blog/como-montar-cultivo-indoor-guia-completo
```

---

## 🎯 METAS MENSURÁVEIS

### Mês 1 (Janeiro 2026)
- [ ] 59 categorias cadastradas ✅ FEITO
- [ ] 10 product pages otimizadas com meta tags
- [ ] Sitemap.xml funcionando
- [ ] 1 artigo de blog publicado

### Mês 2 (Fevereiro 2026)
- [ ] 30+ product pages otimizadas
- [ ] 3 artigos de blog (3000+ palavras cada)
- [ ] Schema markup em todos os produtos
- [ ] Google Search Console configurado

### Mês 3 (Março 2026)
- [ ] 100% das product pages otimizadas
- [ ] 8 artigos de blog
- [ ] 3 vídeos YouTube
- [ ] 1.000 visitas orgânicas/mês

---

## 🔍 COMO VERIFICAR RESULTADOS

### Google Search Console
1. Adicionar propriedade: `https://desapegrow.com`
2. Verificar via DNS ou upload de arquivo
3. Enviar sitemap: `https://desapegrow.com/sitemap.xml`

### Métricas para Acompanhar
- **Impressões:** Quantas vezes seu site aparece no Google
- **Cliques:** Quantas pessoas clicam
- **CTR:** Taxa de cliques (meta: 3%+)
- **Posição Média:** Ranking médio (meta: top 20)

### Keywords para Monitorar
```
cultivo indoor
kit cultivo indoor
estufa grow 120x120
led grow 480w
quantum board
medidor ph ec
```

---

## 📝 COMANDOS ÚTEIS

### Rodar Seed de Categorias
```bash
npx tsx scripts/seed-categories-seo.ts
```

### Verificar Categorias no Banco
```bash
npx prisma studio
# Navegar para: categories
```

### Gerar Sitemap
```bash
npm run build
# Acesse: http://localhost:3000/sitemap.xml
```

### Limpar Cache Next.js
```bash
Remove-Item -Recurse -Force .next
npm run dev
```

---

## 🎨 TEMPLATES PRONTOS

### Component: Breadcrumbs
```typescript
// components/Breadcrumbs.tsx
export function Breadcrumbs({ items }: { items: Array<{ name: string, href: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://desapegrow.com${item.href}`
    }))
  }
  
  return (
    <>
      <nav className="breadcrumbs">
        {items.map((item, index) => (
          <span key={index}>
            <Link href={item.href}>{item.name}</Link>
            {index < items.length - 1 && ' > '}
          </span>
        ))}
      </nav>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
```

### Component: FAQ Schema
```typescript
// components/FAQSchema.tsx
export function FAQSchema({ questions }: { questions: Array<{ q: string, a: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  }
  
  return (
    <>
      <section className="faq">
        <h2>Perguntas Frequentes</h2>
        {questions.map((item, index) => (
          <div key={index}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </section>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
```

---

## 🏆 BENCHMARKING COMPETIDORES

### Grama Cultivo (Líder)
- Domain Authority: ~35
- Tráfego estimado: 50k/mês
- Pontos fortes: Catálogo amplo, reviews
- Pontos fracos: Blog desatualizado

### Leds Indoor
- Domain Authority: ~28
- Tráfego estimado: 20k/mês
- Pontos fortes: Especialista em LED
- Pontos fracos: Sem marketplace

### Como Vencer
1. **Conteúdo:** 2-3 artigos/semana vs 1-2/mês
2. **Vídeos:** Canal YouTube ativo
3. **Comunidade:** Discord/Reddit ativo
4. **Tech:** Next.js = mais rápido
5. **UX:** Gamificação diferenciada

---

## 🎯 AÇÃO IMEDIATA (HOJE)

1. ✅ Categorias cadastradas (FEITO)
2. ⏳ Criar página `/cultivo-indoor/[category]`
3. ⏳ Adicionar meta tags em 5 produtos
4. ⏳ Criar sitemap.xml
5. ⏳ Escrever primeiro rascunho de artigo

---

## 📚 DOCUMENTAÇÃO COMPLETA

Veja mais detalhes em:
- **Estratégia completa:** `/docs/ESTRATEGIA-SEO-2025.md`
- **Pesquisa original:** `/SEO desap.txt` (anexo)
- **Schema Prisma:** `/prisma/schema.prisma`
- **Script de seed:** `/scripts/seed-categories-seo.ts`

---

**Última atualização:** 02/01/2026
**Status:** ✅ Fase 1 Concluída | ⏳ Aguardando Fase 2
