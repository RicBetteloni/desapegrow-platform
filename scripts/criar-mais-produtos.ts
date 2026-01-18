import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Criando mais 10 produtos do Mercado Livre...\n')

  // Buscar categoria de iluminação ou eletrônicos
  const categories = await prisma.category.findMany()
  const iluminacaoCategory = categories.find(c => c.slug === 'iluminacao')
  const eletronicoCategory = categories.find(c => c.slug === 'eletronicos')
  const categoryId = iluminacaoCategory?.id || eletronicoCategory?.id || categories[0].id

  // Buscar ou criar perfil de vendedor
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'ricardo@desapegrow.com' },
        { isAdmin: true },
        { sellerProfile: { isNot: null } }
      ]
    },
    include: {
      sellerProfile: true
    }
  })

  if (!user) {
    user = await prisma.user.findFirst({
      include: {
        sellerProfile: true
      }
    })
  }

  if (!user) {
    console.log('📝 Criando usuário vendedor padrão...')
    user = await prisma.user.create({
      data: {
        name: 'Vendedor Marketplace',
        email: 'vendedor-marketplace@desapegrow.com',
        password: 'temp123',
        isEmailVerified: true
      },
      include: {
        sellerProfile: true
      }
    })
    console.log('✅ Usuário vendedor criado!\n')
  }

  let sellerProfile = user.sellerProfile
  if (!sellerProfile) {
    console.log('📝 Criando perfil de vendedor...')
    sellerProfile = await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        businessName: user.name
      }
    })
    console.log('✅ Perfil de vendedor criado!\n')
  }

  console.log(`👤 Usando vendedor: ${user.name} (${user.email})`)
  console.log(`🆔 Seller Profile ID: ${sellerProfile.id}\n`)

  const produtos = [
    {
      name: 'Kit Exaustor 150mm + Filtro Carvão + Duto Grow Indoor',
      slug: 'kit-exaustor-150mm-filtro-carvao-duto-grow',
      description: `Kit completo para ventilação e controle de odores em cultivos indoor. Inclui exaustor inline 150mm, filtro de carvão ativado e duto flexível alumínio.

COMPONENTES:
• Exaustor Inline 150mm - Vazão 580m³/h
• Filtro Carvão Ativado 150mm - 580m³/h
• Duto flexível alumínio - 5 metros
• Abraçadeiras de fixação incluídas
• Bivolt 110/220V

CARACTERÍSTICAS:
✓ Sistema completo plug & play
✓ Filtragem eficiente de odores
✓ Baixo ruído operacional
✓ Instalação rápida e fácil
✓ Controle de temperatura e umidade
✓ Renovação constante de ar`,
      price: 282.00,
      comparePrice: 319.90,
      stock: 8,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_975691-MLB73927725483_012024-F.webp', alt: 'Kit Exaustor com Filtro' }
      ]
    },
    {
      name: 'Lâmpada LED Grow 60W E27 Full Spectrum',
      slug: 'lampada-led-grow-60w-e27-full-spectrum',
      description: `Lâmpada LED Grow 60W com 300 LEDs para cultivo indoor. Espectro completo para todas as fases de crescimento. Soquete E27 padrão.

ESPECIFICAÇÕES:
• Potência: 60W reais
• Total de LEDs: 300 unidades
• Soquete: E27 (padrão)
• Espectro: Full Spectrum
• Voltagem: Bivolt 85-265V
• Ângulo: 120°

VANTAGENS:
✓ Plug and play - soquete padrão
✓ Baixo consumo energético
✓ Todas as fases: germinação até colheita
✓ Sem necessidade de ventilação forçada
✓ Vida útil 50.000 horas
✓ Ideal para espaços pequenos`,
      price: 49.90,
      comparePrice: null,
      stock: 25,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_650481-MLB53432256771_012023-F.webp', alt: 'Lâmpada LED Grow 60W' }
      ]
    },
    {
      name: 'Substrato Terrô Mix Auto 7 Litros Orgânico',
      slug: 'substrato-terro-mix-auto-7l-organico',
      description: `Substrato premium Terrô Mix Auto 7 litros. Mistura orgânica profissional para cultivo indoor e outdoor. Rica em nutrientes e com excelente drenagem.

COMPOSIÇÃO:
• Turfa de Sphagnum
• Fibra de coco
• Perlita expandida
• Húmus de minhoca
• Carvão vegetal ativado
• pH balanceado 6.0-6.5

BENEFÍCIOS:
✓ Pronto para uso
✓ Rico em matéria orgânica
✓ Excelente aeração e drenagem
✓ Retenção ideal de água
✓ Certificação orgânica
✓ Ideal para autos e fotos`,
      price: 63.90,
      comparePrice: null,
      stock: 42,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_973547-MLB70615989775_072023-F.webp', alt: 'Substrato Orgânico' }
      ]
    },
    {
      name: 'Perlita Expandida 10 Litros Substrato Cultivo',
      slug: 'perlita-expandida-10l-cultivo',
      description: `Perlita expandida de alta qualidade para melhorar aeração e drenagem. 10 litros. Essencial para substratos profissionais de cultivo indoor.

CARACTERÍSTICAS:
• Volume: 10 litros
• Granulometria: Média (3-6mm)
• Densidade: Baixa
• pH neutro: 7.0
• Esterilizada e livre de patógenos

APLICAÇÕES:
✓ Melhora aeração do substrato
✓ Aumenta drenagem
✓ Evita compactação
✓ Hidroponia e aeroponia
✓ Mistura com terra e coco
✓ Camada de drenagem em vasos`,
      price: 41.39,
      comparePrice: null,
      stock: 67,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_926207-MLB52777086772_122022-F.webp', alt: 'Perlita Expandida' }
      ]
    },
    {
      name: 'Fertilizante Smart Grow Fat Nug 250ml Flora',
      slug: 'fertilizante-smart-grow-fat-nug-250ml',
      description: `Fertilizante líquido Smart Grow Fat Nug 250ml. Estimulador de floração profissional. Aumenta densidade e peso dos frutos.

FORMULAÇÃO:
• NPK: 0-8-10 + Micronutrientes
• Fósforo (P): 8%
• Potássio (K): 10%
• Boro, Molibdênio, Zinco
• Base orgânica

USO:
✓ Aplicar na fase de floração
✓ Dosagem: 2-4ml por litro
✓ Aumenta produção em até 30%
✓ Melhora aroma e sabor
✓ Compatível com sistemas hidropônicos
✓ Rende até 125 litros de solução`,
      price: 47.47,
      comparePrice: null,
      stock: 31,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_824569-MLB72164099488_102023-F.webp', alt: 'Fertilizante Líquido' }
      ]
    },
    {
      name: 'Lâmpada LED Grow 28W E27 UV IR Full Spectrum',
      slug: 'lampada-led-grow-28w-e27-uv-ir',
      description: `Lâmpada LED Grow 28W com UV e IR para cultivo indoor. Espectro completo otimizado. Soquete E27 bivolt. Ideal para pequenos grows.

ESPECIFICAÇÕES TÉCNICAS:
• Potência: 28W
• Total de LEDs: 120 unidades
• Soquete: E27 padrão
• UV: 385-400nm
• IR: 730nm
• Full Spectrum: 380-780nm
• Bivolt automático

DIFERENCIAIS:
✓ UV estimula produção de resina
✓ IR acelera crescimento
✓ Baixíssimo consumo
✓ Ideal para 0.25m² - 0.5m²
✓ Substitui HPS 50W
✓ Garantia 12 meses`,
      price: 28.99,
      comparePrice: null,
      stock: 88,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_737105-MLB76146662819_052024-F.webp', alt: 'Lâmpada LED 28W' }
      ]
    },
    {
      name: 'Kit 30 Budclip LST Low Stress Training',
      slug: 'kit-30-budclip-lst-training',
      description: `Kit com 30 Budclips para Low Stress Training (LST). Tutoramento profissional de plantas. Aumenta produção através do controle de crescimento.

CONTEÚDO:
• 30 unidades de Budclips
• Cor verde camuflado
• Material: Plástico resistente PP
• Reutilizáveis
• Compatível com vasos de 7 a 30 litros

TÉCNICA LST:
✓ Aumenta exposição de luz
✓ Desenvolve mais pontas
✓ Não estressa a planta
✓ Controla altura
✓ Maximiza aproveitamento do espaço
✓ Aumenta produção em até 40%`,
      price: 55.90,
      comparePrice: null,
      stock: 154,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_912655-MLB74963043226_032024-F.webp', alt: 'Budclips LST' }
      ]
    },
    {
      name: 'Biochar Carvão Vegetal Ativado 500g',
      slug: 'biochar-carvao-ativado-500g',
      description: `Biochar - carvão vegetal ativado orgânico 500g. Melhora estrutura do solo, retenção de água e nutrientes. Produto sustentável.

BENEFÍCIOS:
• Aumenta CTC (Capacidade de Troca Catiônica)
• Melhora retenção de água em 30%
• Aumenta vida microbiana
• Corrige pH naturalmente
• Sequestra carbono
• Granulometria: 5-10mm

APLICAÇÃO:
✓ Misturar 5-10% no substrato
✓ Válido para cultivo orgânico
✓ Melhora aeração
✓ Reduz necessidade de rega
✓ Efeito permanente
✓ 500g rende até 10 litros`,
      price: 19.00,
      comparePrice: null,
      stock: 203,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_925669-MLB72946697536_112023-F.webp', alt: 'Biochar Carvão' }
      ]
    },
    {
      name: 'Kit 3 Vasos Feltro 27 Litros Robusto Grow',
      slug: 'kit-3-vasos-feltro-27l-grow',
      description: `Kit com 3 vasos de feltro 27 litros. Tecido respirável premium para cultivo indoor e outdoor. Sistema air-pruning de raízes.

ESPECIFICAÇÕES:
• Capacidade: 27 litros cada
• Altura: 30cm
• Diâmetro: 35cm
• Tecido: Feltro geotêxtil 300g/m²
• Cor: Preto
• Alças reforçadas

VANTAGENS:
✓ Air-pruning natural das raízes
✓ Melhor oxigenação
✓ Controle de temperatura
✓ Drenagem superior
✓ Reutilizável - lavar e usar
✓ Evita enovelamento de raízes`,
      price: 107.55,
      comparePrice: null,
      stock: 19,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_678315-MLB74429856990_022024-F.webp', alt: 'Vasos de Feltro' }
      ]
    },
    {
      name: 'Rede Scrog 1,20x2,5m Smart Grow Tela Suporte',
      slug: 'rede-scrog-120x250-smart-grow',
      description: `Rede Scrog 1,20x2,5m para técnica Screen of Green. Tela de suporte elástica para maximizar produção. Malha 10x10cm.

CARACTERÍSTICAS:
• Dimensões: 1,20m x 2,5m
• Malha: 10x10cm
• Material: Nylon elástico resistente
• Cor: Branco
• Ganchos de fixação incluídos

TÉCNICA SCROG:
✓ Distribui luz uniformemente
✓ Aumenta número de colas
✓ Controla altura do cultivo
✓ Maximiza espaço vertical
✓ Aumenta produção em até 50%
✓ Ideal para LEDs potentes`,
      price: 34.60,
      comparePrice: null,
      stock: 76,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_825946-MLB72478831374_102023-F.webp', alt: 'Rede Scrog' }
      ]
    }
  ]

  console.log('📦 Criando 10 produtos...\n')

  let sucessos = 0
  let erros = 0

  for (const produto of produtos) {
    try {
      // Verificar se já existe
      const existing = await prisma.product.findUnique({
        where: { slug: produto.slug }
      })

      if (existing) {
        console.log(`⏭️  Produto "${produto.name}" já existe, pulando...`)
        continue
      }

      const created = await prisma.product.create({
        data: {
          name: produto.name,
          slug: produto.slug,
          description: produto.description,
          price: produto.price,
          comparePrice: produto.comparePrice,
          stock: produto.stock,
          status: 'ACTIVE',
          sellerId: sellerProfile.id,
          categoryId: categoryId,
          images: {
            create: produto.images
          }
        },
        include: {
          images: true,
          category: true
        }
      })

      console.log(`✅ "${created.name}"`)
      console.log(`   💰 R$ ${created.price}${created.comparePrice ? ` (era R$ ${created.comparePrice})` : ''}`)
      console.log(`   📦 Estoque: ${created.stock} unidades`)
      console.log(`   🏷️  Categoria: ${created.category.name}`)
      console.log(`   🔗 /produtos/${created.slug}\n`)

      sucessos++
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`❌ Erro ao criar "${produto.name}": ${error.message}\n`)
      } else {
        console.log(`❌ Erro ao criar "${produto.name}": Erro desconhecido\n`)
      }
      erros++
    }
  }

  console.log(`\n✨ Processo concluído!`)
  console.log(`✅ ${sucessos} produtos criados`)
  if (erros > 0) {
    console.log(`❌ ${erros} erros`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
