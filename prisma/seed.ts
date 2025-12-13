import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'iluminacao' },
      update: {},
      create: {
        name: 'Iluminação',
        slug: 'iluminacao',
        description: 'LEDs, lâmpadas e sistemas de iluminação',
        icon: '💡'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'ventilacao' },
      update: {},
      create: {
        name: 'Ventilação',
        slug: 'ventilacao',
        description: 'Exaustores, ventiladores e filtros',
        icon: '🌀'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'nutrientes' },
      update: {},
      create: {
        name: 'Nutrientes',
        slug: 'nutrientes',
        description: 'Fertilizantes e suplementos',
        icon: '🧪'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'tendas' },
      update: {},
      create: {
        name: 'Tendas',
        slug: 'tendas',
        description: 'Estufas e grow boxes',
        icon: '🏠'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'ferramentas' },
      update: {},
      create: {
        name: 'Ferramentas',
        slug: 'ferramentas',
        description: 'Tesouras, medidores e acessórios',
        icon: '🔧'
      }
    })
  ])

  console.log('✅ Categorias criadas:', categories.length)

  // Criar usuário vendedor de teste
  const seller = await prisma.user.upsert({
    where: { email: 'vendedor@desapegrow.com' },
    update: {},
    create: {
      email: 'vendedor@desapegrow.com',
      name: 'Vendedor Teste',
      password: '$2a$10$X8qZ9Z8Z8Z8Z8Z8Z8Z8Z8u', // senha: "123456"
      role: 'SELLER',
      gameProfile: {
        create: {
          totalPoints: 0,
          availablePoints: 0,
          currentLevel: 'INICIANTE'
        }
      },
      sellerProfile: {
        create: {
          businessName: 'Grow Shop Teste',
          totalSales: 0,
          totalOrders: 0
        }
      }
    },
    include: {
      sellerProfile: true
    }
  })

  console.log('✅ Vendedor criado:', seller.email)

  // Criar produtos
  const products = [
    {
      name: 'LED Grow Light 300W Full Spectrum',
      slug: 'led-grow-light-300w',
      description: 'Painel LED de alta eficiência com espectro completo para todas as fases de crescimento. Economia de energia e melhor produtividade.',
      shortDesc: 'LED 300W com espectro completo',
      categoryId: categories[0].id, // Iluminação
      price: 450.00,
      comparePrice: 650.00,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1621112904887-419379ce6824?w=500']
    },
    {
      name: 'Tenda de Cultivo 80x80x160cm',
      slug: 'tenda-cultivo-80x80',
      description: 'Grow box de alta qualidade com revestimento refletivo 95%. Estrutura robusta em metal e tecido 600D resistente.',
      shortDesc: 'Grow Box 80x80x160cm',
      categoryId: categories[3].id, // Tendas
      price: 380.00,
      comparePrice: 520.00,
      stock: 8,
      images: ['https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=500']
    },
    {
      name: 'Exaustor Inline 150mm 420m³/h',
      slug: 'exaustor-inline-150mm',
      description: 'Exaustor inline silencioso de alta vazão. Motor duplo rolamento para maior durabilidade. Ideal para tendas médias.',
      shortDesc: 'Exaustor 150mm silencioso',
      categoryId: categories[1].id, // Ventilação
      price: 280.00,
      comparePrice: 380.00,
      stock: 12,
      images: ['https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=500']
    },
    {
      name: 'Kit Nutrientes Orgânicos 3 Partes',
      slug: 'kit-nutrientes-organicos',
      description: 'Kit completo de nutrientes orgânicos para todas as fases. Inclui Grow, Bloom e Micro. Rende até 200L de solução.',
      shortDesc: 'Kit nutrição completa orgânica',
      categoryId: categories[2].id, // Nutrientes
      price: 165.00,
      comparePrice: 220.00,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500']
    },
    {
      name: 'Medidor pH e EC Digital',
      slug: 'medidor-ph-ec-digital',
      description: 'Medidor digital de pH e condutividade elétrica com tela LCD. Calibração automática e compensação de temperatura.',
      shortDesc: 'Medidor pH/EC preciso',
      categoryId: categories[4].id, // Ferramentas
      price: 95.00,
      comparePrice: 140.00,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500']
    },
    {
      name: 'Ventilador Oscilante 40cm 110W',
      slug: 'ventilador-oscilante-40cm',
      description: 'Ventilador de parede com oscilação automática. 3 velocidades e silencioso. Essencial para circulação de ar.',
      shortDesc: 'Ventilador oscilante 40cm',
      categoryId: categories[1].id, // Ventilação
      price: 120.00,
      comparePrice: 160.00,
      stock: 18,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500']
    },
    {
      name: 'Tesoura de Poda Premium Curva',
      slug: 'tesoura-poda-premium',
      description: 'Tesoura profissional em aço inox com lâminas curvas. Cabo ergonômico com revestimento antiderrapante.',
      shortDesc: 'Tesoura profissional curva',
      categoryId: categories[4].id, // Ferramentas
      price: 58.00,
      comparePrice: 85.00,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1416339442236-8ceb164046f8?w=500']
    },
    {
      name: 'Timer Digital Programável 220V',
      slug: 'timer-digital-programavel',
      description: 'Timer digital com 8 programações diárias. Display LCD e backup de bateria. Controle preciso de iluminação.',
      shortDesc: 'Timer 8 programações/dia',
      categoryId: categories[4].id, // Ferramentas
      price: 42.00,
      comparePrice: 65.00,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=500']
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        sellerId: seller.sellerProfile!.id,
        status: 'ACTIVE',
        images: {
          create: product.images.map((url, index) => ({
            url,
            alt: product.name,
            order: index
          }))
        }
      }
    })
  }

  console.log('✅ Produtos criados:', products.length)
  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
