import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Criando produtos baseados em anúncios reais da OLX...\n')

  // Buscar categorias existentes
  const categories = await prisma.category.findMany()
  const iluminacaoCategory = categories.find(c => c.slug === 'iluminacao')
  const eletronicoCategory = categories.find(c => c.slug === 'eletronicos')
  
  if (!iluminacaoCategory && !eletronicoCategory) {
    console.error('❌ Categorias não encontradas. Execute o seed primeiro.')
    return
  }

  const categoryId = iluminacaoCategory?.id || eletronicoCategory?.id || categories[0].id

  // Buscar ou criar usuário vendedor e seu perfil
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'ricardo@desapegrow.com' },
        { role: 'ADMIN' },
        { role: 'SELLER' }
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
        name: 'Vendedor OLX',
        email: 'vendedor-olx@desapegrow.com',
        password: 'temp123',
        role: 'SELLER',
        isEmailVerified: true
      },
      include: {
        sellerProfile: true
      }
    })
    console.log('✅ Usuário vendedor criado!\n')
  }

  // Criar perfil de vendedor se não existir
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
      name: 'LED Quantum Board LM281B 50W',
      slug: 'led-quantum-board-lm281b-50w',
      description: `Luminária LED de alta performance para cultivo indoor. Ideal para desenvolvimento de plantas em ambientes fechados. Promove o crescimento e floração, otimizando a produção. Fácil instalação e uso. Perfeita para hortas urbanas e cultivos diversos.

ESPECIFICAÇÕES:
• Modelo: Quantum BOARD LM281b
• Potência: 50W
• Tipo: Painel LED profissional
• Dissipador: Alumínio preto com aletas de resfriamento
• Sistema de suspensão: Correntes metálicas incluídas
• Espectro: Completo (Branco, Amarelo, Verde, Azul, Vermelho, Rosa)
• Cobertura: até 1m² de cultivo
• Bivolt (110/220V)

CARACTERÍSTICAS:
✓ Eficiência energética superior
✓ Instalação simples com correntes incluídas
✓ Todos os estágios de crescimento
✓ Sistema de resfriamento otimizado`,
      price: 250.00,
      comparePrice: 450.00,
      stock: 3,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_867691-MLB74447951738_022024-F.webp', alt: 'LED Quantum Board 50W' }
      ]
    },
    {
      name: 'Painel LED Samsung LM281B 65W Dimmer',
      slug: 'painel-led-samsung-lm281b-65w-dimmer',
      description: `Sunny Day - Agricultura indoor com luz própria. Painel Led Grow Quantum Samsung LM281B 65W Dimmer Cultivo. Envio imediato, nota fiscal e garantia.

ESPECIFICAÇÕES TÉCNICAS:
• Marca: Sunny Day
• Total de LEDs: 208 unidades
  - Samsung LM281B 3000K: 108 LEDs
  - Samsung LM281B 6500K: 56 LEDs
  - Epistar Deep Red 660nm: 28 LEDs
  - Epistar Far Red 730nm: 7 LEDs
  - Epistar UV 395nm: 9 LEDs
• PPFD: 280 µmol/s
• PAR: 2.6 µmol/J
• Dimensões: 24cm x 28cm x 1cm
• Voltagem: Bivolt (110/220V)

VANTAGENS:
✓ Controle de intensidade (Dimmer 0-100%)
✓ Espectro otimizado para todos os estágios
✓ Germinação, Vegetativo e Floração
✓ Nota fiscal incluída
✓ Garantia do fabricante`,
      price: 199.00,
      comparePrice: 210.00,
      stock: 9,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_906405-MLB75273671177_032024-F.webp', alt: 'Painel LED Samsung 65W' }
      ]
    },
    {
      name: 'Fita LED Full Spectrum 4Red 1Blue 1 Metro',
      slug: 'fita-led-full-spectrum-4red-1blue-1m',
      description: `Led Full Spectrum Indoor Grow 4red 1blue Cultivo Aquario 1 Metro Fita Arduino

Spectral range effects on plant physiology: 280nm~315nm mínima influência. 315nm~420nm previne alongamento. 420nm~500nm (azul) - maior impacto na fotossíntese. 620nm~750nm (vermelho) - alta absorção de clorofila e fotoperíodo.

ESPECIFICAÇÕES TÉCNICAS:
• Voltagem: 12V DC
• Quantidade de LEDs: 60 por metro
• Chip LED: 5050 SMD
• Lifespan: 50.000 horas
• Temperatura de operação: -20°C a +50°C
• Espectro Red: 610~720nm
• Espectro Blue: 400~520nm

CARACTERÍSTICAS:
✓ Full Spectrum - Germinação até colheita
✓ 450nm Blue + 630nm Red - Crescimento foliar acelerado
✓ 660nm Red - Promoção de floração
✓ Substitui HPS, HID, MH
✓ Perfeita para Grow Box, Grow Tent, DIY Hydroponics
✓ Energia eficiente`,
      price: 25.00,
      comparePrice: null,
      stock: 15,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_774851-MLB73439887956_122023-F.webp', alt: 'Fita LED RGB Full Spectrum' }
      ]
    },
    {
      name: 'Tenda Cultivo Indoor 60x60',
      slug: 'tenda-cultivo-indoor-60x60',
      description: `Tenha seu próprio cultivo indoor com a tenda 60x60! Ideal para cultivar suas plantas em um ambiente controlado, garantindo o crescimento saudável e a qualidade que você deseja. Perfeita para quem busca praticidade e resultados incríveis!

ESPECIFICAÇÕES:
• Dimensões: 60cm x 60cm x 160cm
• Material: Lona reforçada preta com interior reflexivo
• Detalhes: Zíperes robustos com puxadores
• Ventilação: Furos para passagem de cabos e ventilação
• Interior: Reflexivo para melhor aproveitamento de luz
• Embalagem: Compacta e discreta

CARACTERÍSTICAS:
✓ Espaço ideal para LED de 50-65W
✓ Controle de temperatura e umidade
✓ Ambiente fechado e controlado
✓ Fácil montagem
✓ Durável e resistente
✓ Múltiplos zíperes para fácil acesso
✓ Estrutura reforçada

IDEAL PARA:
✓ Pequenos cultivos
✓ Hortas urbanas
✓ Uso doméstico
✓ Iniciantes`,
      price: 600.00,
      comparePrice: 750.00,
      stock: 2,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_662814-MLB74791982986_022024-F.webp', alt: 'Tenda Cultivo 60x60' }
      ]
    },
    {
      name: 'Exaustor Cultivo Inline',
      slug: 'exaustor-cultivo-inline',
      description: `Exaustor profissional para cultivo indoor. Ventilação eficiente para grow rooms. Controle de temperatura e umidade.

ESPECIFICAÇÕES:
• Tipo: Inline (em linha)
• Vazão: Ajustável
• Voltagem: 110/220V
• Material: Metal resistente
• Ruído: Baixo
• Instalação: Fácil com abraçadeiras

CARACTERÍSTICAS:
✓ Controle de fluxo de ar
✓ Baixo ruído operacional
✓ Fácil instalação
✓ Durável e eficiente
✓ Ideal para grow rooms
✓ Remoção de ar quente
✓ Controle de odores (com filtro)

APLICAÇÕES:
✓ Grow rooms
✓ Estufas
✓ Ambientes fechados
✓ Controle climático`,
      price: 250.00,
      comparePrice: 350.00,
      stock: 5,
      images: [
        { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_644546-MLB72674494634_112023-F.webp', alt: 'Exaustor Inline' }
      ]
    }
  ]

  console.log(`📦 Criando ${produtos.length} produtos...\n`)

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
      console.log(`   💰 R$ ${created.price.toFixed(2)} ${created.comparePrice ? `(era R$ ${created.comparePrice.toFixed(2)})` : ''}`)
      console.log(`   📦 Estoque: ${created.stock} unidades`)
      console.log(`   🏷️  Categoria: ${created.category.name}`)
      console.log(`   🔗 /produtos/${created.slug}\n`)

    } catch (error) {
      console.error(`❌ Erro ao criar "${produto.name}":`, error)
    }
  }

  console.log('\n✨ Produtos OLX criados com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
