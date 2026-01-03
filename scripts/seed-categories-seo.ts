import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Script para cadastrar categorias baseado na pesquisa de SEO
 * Baseado na estrutura hierárquica encontrada na análise de mercado
 */

async function main() {
  console.log('🌱 Iniciando cadastro de categorias SEO...\n')

  // Categorias principais com suas subcategorias
  const categoryTree = [
    {
      name: 'Iluminação LED',
      slug: 'iluminacao-led',
      description: 'Painéis LED, Quantum Board, lâmpadas grow e sistemas de iluminação para cultivo indoor',
      icon: '💡',
      subcategories: [
        {
          name: 'Quantum Board',
          slug: 'quantum-board',
          description: 'Painéis Quantum Board 480W, 240W, 120W com chips Samsung LM301H',
          icon: '⚡'
        },
        {
          name: 'Quantum Bar',
          slug: 'quantum-bar',
          description: 'LED Quantum Bar 480W, 240W para cultivo profissional',
          icon: '📊'
        },
        {
          name: 'Painel LED Modular',
          slug: 'painel-led-modular',
          description: 'Painéis LED modulares para expansão gradual',
          icon: '🔲'
        },
        {
          name: 'LED Hortícola Full Spectrum',
          slug: 'led-horticola-full-spectrum',
          description: 'LEDs com espectro completo para todas as fases',
          icon: '🌈'
        },
        {
          name: 'Complementos LED',
          slug: 'complementos-led',
          description: 'Deep Red 660nm, UV 380nm e acessórios para LED',
          icon: '✨'
        }
      ]
    },
    {
      name: 'Estufas e Tendas',
      slug: 'estufas-tendas',
      description: 'Grow Box, cabines de cultivo, tendas Dark Box e estufas profissionais',
      icon: '🏠',
      subcategories: [
        {
          name: 'Estufa 60x60',
          slug: 'estufa-60x60',
          description: 'Estufa compacta 60x60x140cm ideal para iniciantes',
          icon: '📦'
        },
        {
          name: 'Estufa 80x80',
          slug: 'estufa-80x80',
          description: 'Estufa 80x80x160cm para cultivo médio',
          icon: '📦'
        },
        {
          name: 'Estufa 120x120',
          slug: 'estufa-120x120',
          description: 'Estufa 120x120x200cm profissional Mylar 600D',
          icon: '📦'
        },
        {
          name: 'Estufa 120x240',
          slug: 'estufa-120x240',
          description: 'Estufa grande 120x240x200cm para produção',
          icon: '📦'
        },
        {
          name: 'Estufa 240x120',
          slug: 'estufa-240x120',
          description: 'Estufa comercial 240x120x200cm high-end',
          icon: '📦'
        },
        {
          name: 'Cabine Profissional',
          slug: 'cabine-profissional',
          description: 'Cabines Elite e sistemas modulares profissionais',
          icon: '🏢'
        },
        {
          name: 'Acessórios de Estufa',
          slug: 'acessorios-estufa',
          description: 'Janelas, portas, refletores e peças de reposição',
          icon: '🔧'
        }
      ]
    },
    {
      name: 'Exaustão e Ventilação',
      slug: 'exaustao-ventilacao',
      description: 'Exaustores inline, filtros de carvão ativado, ventiladores e sistema anti-odor',
      icon: '🌀',
      subcategories: [
        {
          name: 'Exaustor Centrífugo',
          slug: 'exaustor-centrifugo',
          description: 'Exaustores inline 100mm, 150mm, 200mm alta vazão',
          icon: '💨'
        },
        {
          name: 'Filtro Carvão Ativado',
          slug: 'filtro-carvao-ativado',
          description: 'Filtros anti-odor 4", 6", 8" para cultivo indoor',
          icon: '🧼'
        },
        {
          name: 'Ventilador Mini Clip',
          slug: 'ventilador-mini-clip',
          description: 'Ventiladores clip 15cm, 20cm para circulação',
          icon: '🌬️'
        },
        {
          name: 'Dutos e Conexões',
          slug: 'dutos-conexoes',
          description: 'Dutos flexíveis, abraçadeiras, curvas e conexões',
          icon: '🔗'
        },
        {
          name: 'Kit Anti-Odor Completo',
          slug: 'kit-anti-odor',
          description: 'Kit exaustor + filtro + duto completo',
          icon: '📦'
        }
      ]
    },
    {
      name: 'Controle Ambiental',
      slug: 'controle-ambiental',
      description: 'Medidores pH, EC, PPM, termohigrômetros e controladores de clima',
      icon: '🌡️',
      subcategories: [
        {
          name: 'Medidor pH EC PPM',
          slug: 'medidor-ph-ec-ppm',
          description: 'Medidores digitais 3 em 1 para hidroponia',
          icon: '📊'
        },
        {
          name: 'Termohigrômetro Digital',
          slug: 'termohigrometro-digital',
          description: 'Medidor temperatura e umidade com display',
          icon: '🌡️'
        },
        {
          name: 'Controlador Temperatura',
          slug: 'controlador-temperatura',
          description: 'Controladores automáticos de temperatura',
          icon: '🎛️'
        },
        {
          name: 'Umidificador Desumidificador',
          slug: 'umidificador-desumidificador',
          description: 'Equipamentos para controle de umidade',
          icon: '💧'
        },
        {
          name: 'Sensores IoT',
          slug: 'sensores-iot',
          description: 'Sensores inteligentes com app e automação',
          icon: '📱'
        }
      ]
    },
    {
      name: 'Nutrição e Substrato',
      slug: 'nutricao-substrato',
      description: 'Fertilizantes NPK, nutrientes orgânicos, substratos e aditivos',
      icon: '🧪',
      subcategories: [
        {
          name: 'Fertilizante NPK Vegetação',
          slug: 'fertilizante-npk-vegetacao',
          description: 'NPK 10-10-10, Flora Grow e nutrientes vegetativos',
          icon: '🌱'
        },
        {
          name: 'Fertilizante Floração',
          slug: 'fertilizante-floracao',
          description: 'Flora Bloom, PK Booster para fase reprodutiva',
          icon: '🌸'
        },
        {
          name: 'Substrato Orgânico Premium',
          slug: 'substrato-organico-premium',
          description: 'Terra vegetal enriquecida e substratos prontos',
          icon: '🪴'
        },
        {
          name: 'Fibra de Coco',
          slug: 'fibra-coco',
          description: 'Coco expandido, blocos prensados para hidroponia',
          icon: '🥥'
        },
        {
          name: 'Aditivos Micronutrientes',
          slug: 'aditivos-micronutrientes',
          description: 'CalMag, enzimas, ácidos húmicos e fúlvicos',
          icon: '⚗️'
        },
        {
          name: 'Estimuladores de Raiz',
          slug: 'estimuladores-raiz',
          description: 'Hormônios enraizadores e bioestimulantes',
          icon: '🌿'
        }
      ]
    },
    {
      name: 'Sistemas Hidropônicos',
      slug: 'sistemas-hidroponicos',
      description: 'DWC, NFT, Drip, sistemas aeropônicos e hidroponia completa',
      icon: '💧',
      subcategories: [
        {
          name: 'Sistema DWC',
          slug: 'sistema-dwc',
          description: 'Deep Water Culture com balde e bomba de ar',
          icon: '🪣'
        },
        {
          name: 'Sistema Drip Gotejamento',
          slug: 'sistema-drip-gotejamento',
          description: 'Irrigação por gotejamento automatizada',
          icon: '💧'
        },
        {
          name: 'Sistema NFT',
          slug: 'sistema-nft',
          description: 'Nutrient Film Technique com canais',
          icon: '📐'
        },
        {
          name: 'Sistema Wick',
          slug: 'sistema-wick',
          description: 'Sistema passivo com pavio para iniciantes',
          icon: '🕯️'
        },
        {
          name: 'Sistema Aeropônico',
          slug: 'sistema-aeroponico',
          description: 'Nebulização de nutrientes high-tech',
          icon: '☁️'
        }
      ]
    },
    {
      name: 'Recipientes e Vasos',
      slug: 'recipientes-vasos',
      description: 'Vasos Air-Pot, Smart Pot, vasos plásticos e bandejas',
      icon: '🪴',
      subcategories: [
        {
          name: 'Vaso Air-Pot',
          slug: 'vaso-air-pot',
          description: 'Air-Pot para poda aérea de raízes 5L, 15L, 25L',
          icon: '🌬️'
        },
        {
          name: 'Vaso Smart Pot',
          slug: 'vaso-smart-pot',
          description: 'Smart Pot tecido respirável 7L, 15L, 30L',
          icon: '🧺'
        },
        {
          name: 'Vaso Plástico Padrão',
          slug: 'vaso-plastico-padrao',
          description: 'Vasos plásticos tradicionais com furos',
          icon: '🪣'
        },
        {
          name: 'Vaso Cerâmica Drenagem',
          slug: 'vaso-ceramica-drenagem',
          description: 'Vasos decorativos com sistema de drenagem',
          icon: '🏺'
        },
        {
          name: 'Bandejas e Pratos',
          slug: 'bandejas-pratos',
          description: 'Bandejas para mudas, pratos coletores',
          icon: '🍽️'
        }
      ]
    },
    {
      name: 'Acessórios e Ferramentas',
      slug: 'acessorios-ferramentas',
      description: 'Tesouras de poda, clips, telas SCROG, timers e ferramentas essenciais',
      icon: '🔧',
      subcategories: [
        {
          name: 'Tesoura Poda Profissional',
          slug: 'tesoura-poda-profissional',
          description: 'Tesouras curvas e retas em aço inox',
          icon: '✂️'
        },
        {
          name: 'Clip Suporte de Ramo',
          slug: 'clip-suporte-ramo',
          description: 'Clips de plástico para apoiar galhos pesados',
          icon: '📎'
        },
        {
          name: 'Barbante e Fita LST',
          slug: 'barbante-fita-lst',
          description: 'Material para Low Stress Training',
          icon: '🧵'
        },
        {
          name: 'Tela SCROG',
          slug: 'tela-scrog',
          description: 'Tela verde Screen of Green 60x60, 120x120',
          icon: '🕸️'
        },
        {
          name: 'Refletores Mylar',
          slug: 'refletores-mylar',
          description: 'Mylar refletivo 95% para paredes',
          icon: '✨'
        },
        {
          name: 'Termômetro Infravermelho',
          slug: 'termometro-infravermelho',
          description: 'Medidor laser para temperatura de folhas',
          icon: '🌡️'
        },
        {
          name: 'Timer Programável',
          slug: 'timer-programavel',
          description: 'Timers digitais e analógicos para automação',
          icon: '⏰'
        },
        {
          name: 'Lupa Microscópio',
          slug: 'lupa-microscopio',
          description: 'Lupa 60x-100x para verificar tricomas',
          icon: '🔬'
        }
      ]
    }
  ]

  let totalCreated = 0
  let totalUpdated = 0

  // Processar cada categoria principal
  for (const mainCategory of categoryTree) {
    console.log(`\n📁 Processando: ${mainCategory.name}`)
    
    // Criar ou atualizar categoria principal
    const mainCat = await prisma.category.upsert({
      where: { slug: mainCategory.slug },
      update: {
        name: mainCategory.name,
        description: mainCategory.description,
        icon: mainCategory.icon
      },
      create: {
        name: mainCategory.name,
        slug: mainCategory.slug,
        description: mainCategory.description,
        icon: mainCategory.icon
      }
    })

    console.log(`   ✅ ${mainCat.name} (ID: ${mainCat.id})`)
    totalCreated++

    // Processar subcategorias se existirem
    if (mainCategory.subcategories) {
      for (const subCategory of mainCategory.subcategories) {
        const subCat = await prisma.category.upsert({
          where: { slug: subCategory.slug },
          update: {
            name: subCategory.name,
            description: subCategory.description,
            icon: subCategory.icon
          },
          create: {
            name: subCategory.name,
            slug: subCategory.slug,
            description: subCategory.description,
            icon: subCategory.icon
          }
        })

        console.log(`      ↳ ${subCat.name} (${subCat.slug})`)
        totalCreated++
      }
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`✅ Seed concluído com sucesso!`)
  console.log(`📊 Total de categorias criadas/atualizadas: ${totalCreated}`)
  console.log('='.repeat(60) + '\n')

  // Mostrar resumo final
  const allCategories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  console.log(`\n📋 RESUMO - Total de ${allCategories.length} categorias no banco:\n`)
  
  // Agrupar por categoria principal (baseado no slug)
  const mainCats = allCategories.filter(cat => !cat.slug.includes('-') || 
    ['iluminacao-led', 'estufas-tendas', 'exaustao-ventilacao', 'controle-ambiental', 
     'nutricao-substrato', 'sistemas-hidroponicos', 'recipientes-vasos', 'acessorios-ferramentas'].includes(cat.slug))
  
  console.log('Categorias Principais:')
  mainCats.forEach(cat => {
    console.log(`   ${cat.icon} ${cat.name} (${cat.slug})`)
  })
  
  console.log(`\nSubcategorias: ${allCategories.length - mainCats.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
