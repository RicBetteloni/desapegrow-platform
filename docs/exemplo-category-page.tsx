// EXEMPLO PRÁTICO: Como implementar páginas de categoria otimizadas para SEO

/**
 * Arquivo: src/app/cultivo-indoor/[category]/page.tsx
 * 
 * Este arquivo cria páginas dinâmicas para cada uma das 59 categorias cadastradas
 * Exemplo de URLs geradas:
 * - /cultivo-indoor/iluminacao-led
 * - /cultivo-indoor/quantum-board
 * - /cultivo-indoor/estufa-120x120
 * - /cultivo-indoor/exaustor-centrifugo
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

// ============================================
// 1. GENERATE METADATA (SEO)
// ============================================
export async function generateMetadata({ 
  params 
}: { 
  params: { category: string } 
}): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.category }
  })

  if (!category) return {}

  // Keywords baseadas na categoria
  const keywords = getKeywordsForCategory(category.slug)

  return {
    title: `${category.name} para Cultivo Indoor | Desapegrow`,
    description: category.description || `Encontre os melhores produtos de ${category.name} para seu cultivo indoor. Entrega rápida e preços competitivos.`,
    keywords: keywords,
    
    // Open Graph para compartilhamento
    openGraph: {
      title: `${category.name} - Cultivo Indoor`,
      description: category.description || '',
      url: `https://desapegrow.com/cultivo-indoor/${category.slug}`,
      siteName: 'Desapegrow',
      type: 'website',
      images: [
        {
          url: `/categories/${category.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: category.name
        }
      ]
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} - Cultivo Indoor`,
      description: category.description || '',
      images: [`/categories/${category.slug}.jpg`]
    },

    // Alternates para idiomas (futuro)
    alternates: {
      canonical: `https://desapegrow.com/cultivo-indoor/${category.slug}`
    }
  }
}

// ============================================
// 2. GENERATE STATIC PARAMS (SSG)
// ============================================
export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true }
  })

  return categories.map((category) => ({
    category: category.slug,
  }))
}

// ============================================
// 3. PAGE COMPONENT
// ============================================
export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: { category: string }
  searchParams: { sort?: string, price?: string }
}) {
  // Buscar categoria
  const category = await prisma.category.findUnique({
    where: { slug: params.category }
  })

  if (!category) notFound()

  // Buscar produtos da categoria
  const products = await prisma.product.findMany({
    where: { 
      categoryId: category.id,
      isActive: true 
    },
    include: {
      seller: {
        select: {
          name: true,
          sellerProfile: {
            select: {
              businessName: true
            }
          }
        }
      }
    },
    orderBy: getOrderBy(searchParams.sort),
    take: 24
  })

  // Breadcrumbs para Schema
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Cultivo Indoor', href: '/cultivo-indoor' },
    { name: category.name, href: `/cultivo-indoor/${category.slug}` }
  ]

  // FAQ específica da categoria
  const faqItems = getFAQForCategory(category.slug)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Schema Markup - Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbItems.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.name,
              "item": `https://desapegrow.com${item.href}`
            }))
          })
        }}
      />

      {/* Breadcrumbs visíveis */}
      <nav className="mb-6 text-sm">
        {breadcrumbItems.map((item, index) => (
          <span key={index}>
            <Link href={item.href} className="text-blue-600 hover:underline">
              {item.name}
            </Link>
            {index < breadcrumbItems.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </span>
        ))}
      </nav>

      {/* Header da Categoria */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <span className="text-5xl">{category.icon}</span>
          {category.name} para Cultivo Indoor
        </h1>
        
        <p className="text-lg text-gray-600 max-w-3xl">
          {category.description}
        </p>

        {/* SEO Text - Primeiro parágrafo otimizado */}
        <div className="mt-6 prose max-w-none">
          <p>
            {getCategoryIntroText(category.slug)}
          </p>
        </div>
      </header>

      {/* Filtros e Ordenação */}
      <aside className="mb-6 flex gap-4 flex-wrap">
        <select className="border rounded px-4 py-2">
          <option>Ordenar por</option>
          <option value="relevance">Relevância</option>
          <option value="price_asc">Menor Preço</option>
          <option value="price_desc">Maior Preço</option>
          <option value="newest">Mais Novos</option>
        </select>

        <select className="border rounded px-4 py-2">
          <option>Faixa de Preço</option>
          <option value="0-100">Até R$ 100</option>
          <option value="100-500">R$ 100 - R$ 500</option>
          <option value="500-1000">R$ 500 - R$ 1.000</option>
          <option value="1000+">Acima de R$ 1.000</option>
        </select>

        {/* Filtros específicos por categoria */}
        {getCategorySpecificFilters(category.slug)}
      </aside>

      {/* Grid de Produtos */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">
          {products.length} produtos encontrados
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <article 
              key={product.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <Link href={`/produtos/${product.slug}`}>
                <div className="relative aspect-square">
                  <Image
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                    {product.shortDesc}
                  </p>

                  <div className="flex items-baseline gap-2 mb-2">
                    {product.comparePrice && (
                      <span className="text-sm text-gray-400 line-through">
                        R$ {Number(product.comparePrice).toFixed(2)}
                      </span>
                    )}
                    <span className="text-xl font-bold text-green-600">
                      R$ {Number(product.price).toFixed(2)}
                    </span>
                  </div>

                  {product.comparePrice && (
                    <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                      {calculateDiscount(product.price, product.comparePrice)}% OFF
                    </span>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ Section com Schema */}
      <section className="mb-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Perguntas Frequentes</h2>
        
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <details key={index} className="bg-white rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">
                {item.question}
              </summary>
              <p className="mt-2 text-gray-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        {/* Schema Markup - FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqItems.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.answer
                }
              }))
            })
          }}
        />
      </section>

      {/* Conteúdo SEO adicional */}
      <section className="prose max-w-none">
        <h2>Por que comprar {category.name} na Desapegrow?</h2>
        <p>
          Na Desapegrow, você encontra os melhores produtos de {category.name} 
          com preços competitivos e entrega rápida para todo o Brasil. 
          Todos os nossos vendedores são verificados e os produtos passam por 
          rigoroso controle de qualidade.
        </p>

        <h3>Vantagens de comprar conosco:</h3>
        <ul>
          <li>✅ Frete grátis acima de R$ 500</li>
          <li>✅ Parcelamento em até 12x sem juros</li>
          <li>✅ Garantia de 90 dias</li>
          <li>✅ Suporte técnico especializado</li>
          <li>✅ Programa de fidelidade com recompensas</li>
        </ul>
      </section>

      {/* Produtos Relacionados */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">
          Categorias Relacionadas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {getRelatedCategories(category.slug).map((relatedCat) => (
            <Link
              key={relatedCat.slug}
              href={`/cultivo-indoor/${relatedCat.slug}`}
              className="border rounded-lg p-4 hover:shadow-lg transition text-center"
            >
              <span className="text-4xl mb-2 block">{relatedCat.icon}</span>
              <span className="font-semibold">{relatedCat.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getKeywordsForCategory(slug: string): string[] {
  const keywordMap: Record<string, string[]> = {
    'quantum-board': [
      'quantum board 480w',
      'led samsung lm301h',
      'painel quantum board',
      'quantum board cultivo',
      'led grow quantum'
    ],
    'estufa-120x120': [
      'estufa grow 120x120',
      'tenda cultivo 120x120',
      'grow box 120x120',
      'estufa mylar 600d',
      'cabine cultivo 120cm'
    ],
    'medidor-ph-ec-ppm': [
      'medidor ph ec ppm',
      'medidor ph hidroponia',
      'phmeter cultivo',
      'medidor condutividade',
      'tds meter'
    ]
    // ... mais categorias
  }

  return keywordMap[slug] || []
}

function getCategoryIntroText(slug: string): string {
  const introTexts: Record<string, string> = {
    'quantum-board': 'Os painéis Quantum Board representam a evolução mais recente em iluminação LED para cultivo indoor. Utilizando chips Samsung LM301H de última geração, esses painéis oferecem eficiência luminosa superior, menor consumo de energia e melhor penetração de luz, resultando em plantas mais saudáveis e colheitas abundantes. Ideais para estufas de 120x120cm, os modelos de 480W são os mais procurados por cultivadores profissionais.',
    
    'estufa-120x120': 'As estufas grow de 120x120x200cm são as mais populares entre cultivadores intermediários e profissionais. Com revestimento interno Mylar 600D que reflete 95% da luz, estrutura robusta em metal e múltiplas aberturas para ventilação, essas tendas proporcionam o ambiente perfeito para até 18 plantas. O tamanho é ideal para comportar um painel LED de 480W e sistema de exaustão completo.',
    
    // ... mais textos
  }

  return introTexts[slug] || `Descubra nossa seleção completa de produtos para cultivo indoor com os melhores preços do mercado.`
}

function getFAQForCategory(slug: string): Array<{ question: string, answer: string }> {
  const faqMap: Record<string, Array<{ question: string, answer: string }>> = {
    'quantum-board': [
      {
        question: 'Qual LED Quantum Board escolher para estufa 120x120?',
        answer: 'Para uma estufa de 120x120cm, recomendamos um painel Quantum Board de 480W com chips Samsung LM301H. Este wattagem proporciona cobertura ideal e penetração de luz adequada para todas as fases de crescimento.'
      },
      {
        question: 'Quantum Board consome muita energia?',
        answer: 'Não. Um painel de 480W consome aproximadamente R$ 200-250 por mês rodando 18h/dia na vegetação e 12h/dia na floração, muito mais econômico que lâmpadas HPS tradicionais.'
      },
      {
        question: 'Preciso de ventilador para o LED?',
        answer: 'Sim, apesar de gerarem menos calor que HPS, os painéis Quantum Board ainda precisam de circulação de ar adequada. Recomendamos pelo menos um ventilador oscilante de 40cm.'
      }
    ],
    'estufa-120x120': [
      {
        question: 'Quantas plantas cabem em uma estufa 120x120?',
        answer: 'Depende da técnica de cultivo. Com vasos de 15L, você consegue cultivar confortavelmente 9-16 plantas. Com técnicas como SCROG, pode otimizar para até 18 plantas menores.'
      },
      {
        question: 'Estufa Mylar 600D é resistente?',
        answer: 'Sim! O tecido Mylar 600D é extremamente durável, resistente a rasgos e 100% à prova de luz. Com cuidado adequado, pode durar anos sem necessidade de troca.'
      }
    ]
    // ... mais FAQs
  }

  return faqMap[slug] || []
}

function getCategorySpecificFilters(slug: string): React.ReactNode {
  // Filtros específicos baseados na categoria
  if (slug.includes('led') || slug.includes('quantum')) {
    return (
      <>
        <select className="border rounded px-4 py-2">
          <option>Wattagem</option>
          <option value="120">120W</option>
          <option value="240">240W</option>
          <option value="480">480W</option>
        </select>
        <select className="border rounded px-4 py-2">
          <option>Chip</option>
          <option value="samsung">Samsung LM301H</option>
          <option value="osram">Osram</option>
          <option value="cree">Cree</option>
        </select>
      </>
    )
  }

  if (slug.includes('estufa')) {
    return (
      <select className="border rounded px-4 py-2">
        <option>Tamanho</option>
        <option value="60x60">60x60cm</option>
        <option value="80x80">80x80cm</option>
        <option value="120x120">120x120cm</option>
        <option value="120x240">120x240cm</option>
      </select>
    )
  }

  return null
}

function getRelatedCategories(slug: string): Array<{ slug: string, name: string, icon: string }> {
  const relatedMap: Record<string, Array<{ slug: string, name: string, icon: string }>> = {
    'quantum-board': [
      { slug: 'estufa-120x120', name: 'Estufa 120x120', icon: '🏠' },
      { slug: 'exaustor-centrifugo', name: 'Exaustor', icon: '🌀' },
      { slug: 'timer-programavel', name: 'Timer', icon: '⏰' }
    ],
    'estufa-120x120': [
      { slug: 'quantum-board', name: 'LED 480W', icon: '💡' },
      { slug: 'kit-anti-odor', name: 'Kit Anti-Odor', icon: '🧼' },
      { slug: 'vaso-smart-pot', name: 'Vasos', icon: '🪴' }
    ]
    // ... mais relacionados
  }

  return relatedMap[slug] || []
}

function getOrderBy(sort?: string) {
  switch (sort) {
    case 'price_asc':
      return { price: 'asc' as const }
    case 'price_desc':
      return { price: 'desc' as const }
    case 'newest':
      return { createdAt: 'desc' as const }
    default:
      return { createdAt: 'desc' as const }
  }
}

function calculateDiscount(price: any, comparePrice: any): number {
  const p = Number(price)
  const cp = Number(comparePrice)
  return Math.round(((cp - p) / cp) * 100)
}
