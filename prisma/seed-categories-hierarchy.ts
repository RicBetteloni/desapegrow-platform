import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de categorias hierárquicas...')

  // Estrutura baseada na pesquisa de SEO
  const categoriesData = [
    {
      name: 'Tendas / Kits completos',
      slug: 'tendas-kits',
      icon: '⛺',
      description: 'Tendas refletivas, estruturas e kits completos para cultivo',
      subcategories: [
        { name: 'Grow Tent', slug: 'grow-tent', icon: '⛺', description: 'Tendas refletivas completas' },
        { name: 'Armários Grow', slug: 'armarios-grow', icon: '📦', description: 'Armários e gabinetes' },
        { name: 'Mini Estufas', slug: 'mini-estufas', icon: '🏡', description: 'Estufas compactas' },
        { name: 'Kits Completos', slug: 'kits-completos', icon: '📦', description: 'Kits grow prontos' },
        { name: 'Acessórios Estrutura', slug: 'acessorios-estrutura', icon: '🔧', description: 'Barras, ganchos e acessórios' },
      ]
    },
    {
      name: 'Iluminação',
      slug: 'iluminacao',
      icon: '💡',
      description: 'Lâmpadas, LEDs e sistemas de iluminação para cultivo indoor',
      subcategories: [
        { name: 'Lâmpadas LED', slug: 'lampadas-led', icon: '💡', description: 'LEDs Full Spectrum e Quantum Board' },
        { name: 'Lâmpadas HPS/MH', slug: 'lampadas-hps-mh', icon: '💡', description: 'Vapor de sódio e haletos metálicos' },
        { name: 'Lâmpadas CFL', slug: 'lampadas-cfl', icon: '💡', description: 'Fluorescentes compactas' },
        { name: 'Painéis LED', slug: 'paineis-led', icon: '🔆', description: 'Painéis LED profissionais' },
        { name: 'Reatores', slug: 'reatores', icon: '⚡', description: 'Reatores eletrônicos e convencionais' },
        { name: 'Refletores', slug: 'refletores', icon: '✨', description: 'Refletores Cool Tube e air cooled' },
        { name: 'Timer Iluminação', slug: 'timer-iluminacao', icon: '⏰', description: 'Timers e controladores de luz' },
      ]
    },
    {
      name: 'Climatização',
      slug: 'climatizacao',
      icon: '🌬️',
      description: 'Ventiladores, exaustores, ar condicionado e controle de clima',
      subcategories: [
        { name: 'Ventiladores', slug: 'ventiladores', icon: '🌬️', description: 'Circuladores e ventiladores' },
        { name: 'Exaustores', slug: 'exaustores', icon: '🌀', description: 'Exaustores inline e axiais' },
        { name: 'Intratores', slug: 'intratores', icon: '💨', description: 'Sistemas de entrada de ar' },
        { name: 'Ar Condicionado', slug: 'ar-condicionado', icon: '❄️', description: 'Ar condicionado portátil e split' },
        { name: 'Filtros de Carvão', slug: 'filtros-carvao', icon: '🔲', description: 'Filtros para controle de odor' },
        { name: 'Dutos', slug: 'dutos', icon: '〰️', description: 'Dutos flexíveis e rígidos' },
        { name: 'Speed Controller', slug: 'speed-controller', icon: '🎚️', description: 'Controladores de velocidade' },
        { name: 'Umidificadores', slug: 'umidificadores', icon: '💦', description: 'Umidificadores de ar' },
        { name: 'Desumidificadores', slug: 'desumidificadores', icon: '🌪️', description: 'Desumidificadores' },
      ]
    },
    {
      name: 'Irrigação',
      slug: 'irrigacao',
      icon: '💧',
      description: 'Sistemas de irrigação, bombas e reservatórios',
      subcategories: [
        { name: 'Sistemas Hidropônicos', slug: 'sistemas-hidroponicos', icon: '💦', description: 'DWC, NFT, Aeroponia' },
        { name: 'Bombas d\'água', slug: 'bombas-agua', icon: '🚰', description: 'Bombas submersas e periféricas' },
        { name: 'Reservatórios', slug: 'reservatorios', icon: '🛢️', description: 'Tanques e baldes' },
        { name: 'Mangueiras', slug: 'mangueiras', icon: '〰️', description: 'Tubos e conexões' },
        { name: 'Gotejadores', slug: 'gotejadores', icon: '💧', description: 'Sistema de gotejamento' },
        { name: 'Irrigação Automática', slug: 'irrigacao-automatica', icon: '⚙️', description: 'Sistemas automatizados' },
      ]
    },
    {
      name: 'Substratos',
      slug: 'substratos',
      icon: '🌱',
      description: 'Solos, substratos e meios de cultivo',
      subcategories: [
        { name: 'Terra Vegetal', slug: 'terra-vegetal', icon: '🌍', description: 'Solos e terras preparadas' },
        { name: 'Fibra de Coco', slug: 'fibra-coco', icon: '🥥', description: 'Coco em blocos e chips' },
        { name: 'Perlita', slug: 'perlita', icon: '⚪', description: 'Perlita expandida' },
        { name: 'Vermiculita', slug: 'vermiculita', icon: '🟤', description: 'Vermiculita expandida' },
        { name: 'Lã de Rocha', slug: 'la-rocha', icon: '🧊', description: 'Rockwool para hidroponia' },
        { name: 'Húmus', slug: 'humus', icon: '🪱', description: 'Húmus de minhoca' },
        { name: 'Turfa', slug: 'turfa', icon: '🟫', description: 'Turfa e musgo' },
      ]
    },
    {
      name: 'Nutrição',
      slug: 'nutricao',
      icon: '🧪',
      description: 'Fertilizantes, aditivos e suplementos',
      subcategories: [
        { name: 'NPK Básico', slug: 'npk-basico', icon: '🔬', description: 'Fertilizantes base' },
        { name: 'Vegetativo', slug: 'vegetativo', icon: '🌿', description: 'Nutrientes para crescimento' },
        { name: 'Floração', slug: 'floracao', icon: '🌸', description: 'Nutrientes para floração' },
        { name: 'Estimuladores Raiz', slug: 'estimuladores-raiz', icon: '🌱', description: 'Bioestimulantes de raiz' },
        { name: 'PK Boosters', slug: 'pk-boosters', icon: '💪', description: 'Impulsionadores de floração' },
        { name: 'Cal-Mag', slug: 'cal-mag', icon: '🧬', description: 'Cálcio e magnésio' },
        { name: 'Enzimas', slug: 'enzimas', icon: '🦠', description: 'Enzimas e microorganismos' },
        { name: 'Orgânicos', slug: 'organicos', icon: '♻️', description: 'Fertilizantes orgânicos' },
      ]
    },
    {
      name: 'Monitoramento',
      slug: 'monitoramento',
      icon: '📊',
      description: 'Medidores, controladores e automação',
      subcategories: [
        { name: 'Medidor pH', slug: 'medidor-ph', icon: '🔬', description: 'pHmetros digitais e analógicos' },
        { name: 'Medidor EC/TDS', slug: 'medidor-ec-tds', icon: '📊', description: 'Condutivímetros' },
        { name: 'Termômetro', slug: 'termometro', icon: '🌡️', description: 'Medidores de temperatura' },
        { name: 'Higrômetro', slug: 'higrometro', icon: '💧', description: 'Medidores de umidade' },
        { name: 'Timers', slug: 'timers', icon: '⏰', description: 'Temporizadores programáveis' },
        { name: 'Controladores Clima', slug: 'controladores-clima', icon: '🌡️', description: 'Controle temperatura e umidade' },
        { name: 'CO2 Sistemas', slug: 'co2-sistemas', icon: '🫧', description: 'Injeção de CO2' },
        { name: 'Lupas Microscópios', slug: 'lupas-microscopios', icon: '🔍', description: 'Lupas de aumento' },
      ]
    },
    {
      name: 'Ferramentas',
      slug: 'ferramentas',
      icon: '🔧',
      description: 'Ferramentas e acessórios diversos',
      subcategories: [
        { name: 'Tesouras Poda', slug: 'tesouras-poda', icon: '✂️', description: 'Tesouras especializadas' },
        { name: 'Vasos', slug: 'vasos', icon: '🪴', description: 'Smart pots e vasos de feltro' },
        { name: 'Bandejas', slug: 'bandejas', icon: '📦', description: 'Bandejas de cultivo' },
        { name: 'Redes Treliça', slug: 'redes-trelica', icon: '🕸️', description: 'Redes SCROG' },
        { name: 'Palitos Suporte', slug: 'palitos-suporte', icon: '🏗️', description: 'Tutores e estacas' },
        { name: 'Etiquetas', slug: 'etiquetas', icon: '🏷️', description: 'Identificação de plantas' },
        { name: 'Luvas', slug: 'luvas', icon: '🧤', description: 'Luvas de proteção' },
        { name: 'Pulverizadores', slug: 'pulverizadores', icon: '💦', description: 'Borrifadores' },
      ]
    },
  ]

  // Criar categorias principais e suas subcategorias
  for (const categoryData of categoriesData) {
    const { subcategories, ...mainCategoryData } = categoryData
    
    // Criar categoria principal
    const mainCategory = await prisma.category.create({
      data: mainCategoryData,
    })

    console.log(`✅ Categoria principal criada: ${mainCategory.name}`)

    // Criar subcategorias
    if (subcategories && subcategories.length > 0) {
      for (const subData of subcategories) {
        const subCategory = await prisma.category.create({
          data: {
            ...subData,
            parentId: mainCategory.id,
          },
        })
        console.log(`  ↳ Subcategoria: ${subCategory.name}`)
      }
    }
  }

  console.log('\n🎉 Seed de categorias hierárquicas concluído!')
  console.log(`📊 Total: ${categoriesData.length} categorias principais`)
  const totalSub = categoriesData.reduce((acc, cat) => acc + (cat.subcategories?.length || 0), 0)
  console.log(`📊 Total: ${totalSub} subcategorias`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
