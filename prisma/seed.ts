import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Buscar subcategorias existentes para usar nos produtos
  const subcategories = {
    lampadasLed: await prisma.category.findUnique({ where: { slug: 'lampadas-led' } }),
    growTent: await prisma.category.findUnique({ where: { slug: 'grow-tent' } }),
    exaustores: await prisma.category.findUnique({ where: { slug: 'exaustores' } }),
    ventiladores: await prisma.category.findUnique({ where: { slug: 'ventiladores' } }),
    npkBasico: await prisma.category.findUnique({ where: { slug: 'npk-basico' } }),
    floracao: await prisma.category.findUnique({ where: { slug: 'floracao' } }),
    tesourasPoda: await prisma.category.findUnique({ where: { slug: 'tesouras-poda' } }),
    vasos: await prisma.category.findUnique({ where: { slug: 'vasos' } }),
    medidorPh: await prisma.category.findUnique({ where: { slug: 'medidor-ph' } }),
    kitsCompletos: await prisma.category.findUnique({ where: { slug: 'kits-completos' } }),
  }

  // Se alguma subcategoria não existir, buscar categorias principais como fallback
  const fallbackCategories = await Promise.all([
    prisma.category.findFirst({ where: { slug: 'iluminacao' } }),
    prisma.category.findFirst({ where: { slug: 'climatizacao' } }),
    prisma.category.findFirst({ where: { slug: 'nutricao' } }),
    prisma.category.findFirst({ where: { slug: 'tendas-kits' } }),
    prisma.category.findFirst({ where: { slug: 'ferramentas' } }),
  ])

  console.log('✅ Subcategorias encontradas para seed')

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

  // Criar produtos usando subcategorias (ou fallback para categorias principais)
  const products = [
    {
      name: 'LED Grow Light 300W Full Spectrum',
      slug: 'led-grow-light-300w',
      description: 'Painel LED de alta eficiência com espectro completo para todas as fases de crescimento. Economia de energia e melhor produtividade.',
      shortDesc: 'LED 300W com espectro completo',
      categoryId: subcategories.lampadasLed?.id || fallbackCategories[0]?.id || '',
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
      categoryId: subcategories.growTent?.id || fallbackCategories[3]?.id || '',
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
      categoryId: subcategories.exaustores?.id || fallbackCategories[1]?.id || '',
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
      categoryId: subcategories.npkBasico?.id || fallbackCategories[2]?.id || '',
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
      categoryId: subcategories.medidorPh?.id || fallbackCategories[4]?.id || '',
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
      categoryId: subcategories.ventiladores?.id || fallbackCategories[1]?.id || '',
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
      categoryId: subcategories.tesourasPoda?.id || fallbackCategories[4]?.id || '',
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
      categoryId: fallbackCategories[4]?.id || '',
      price: 42.00,
      comparePrice: 65.00,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=500']
    },
    // Produtos adicionais
    {
      name: 'Vaso Tecido 15 Litros Smart Pot',
      slug: 'vaso-tecido-15l-smart-pot',
      description: 'Vaso de tecido respirável que promove melhor desenvolvimento radicular. Previne enovelamento de raízes.',
      shortDesc: 'Smart Pot 15L respirável',
      categoryId: subcategories.vasos?.id || fallbackCategories[4]?.id || '',
      price: 35.00,
      comparePrice: 55.00,
      stock: 40,
      images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500']
    },
    {
      name: 'Substrato Premium Fibra de Coco 50L',
      slug: 'substrato-fibra-coco-50l',
      description: 'Substrato de fibra de coco 100% natural. Excelente retenção de água e aeração. pH balanceado.',
      shortDesc: 'Fibra Coco 50L premium',
      categoryId: fallbackCategories[2]?.id || '',
      price: 45.00,
      comparePrice: 70.00,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500']
    },
    {
      name: 'Perlita Expandida 10 Litros Substrato Cultivo',
      slug: 'perlita-expandida-10l-cultivo',
      description: 'Perlita expandida para melhorar drenagem e aeração do substrato. Material inerte e reutilizável.',
      shortDesc: 'Perlita 10L drenagem',
      categoryId: fallbackCategories[2]?.id || '',
      price: 28.00,
      comparePrice: 42.00,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500']
    },
    {
      name: 'Termohigrômetro Digital com Sonda',
      slug: 'termohigrometro-digital-sonda',
      description: 'Medidor de temperatura e umidade com sensor externo. Display LCD grande e alarme configurável.',
      shortDesc: 'Termohigrômetro preciso',
      categoryId: fallbackCategories[4]?.id || '',
      price: 68.00,
      comparePrice: 95.00,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1551808525-51a94da548ce?w=500']
    },
    {
      name: 'Refletor Cooltube 150mm com Vidro',
      slug: 'refletor-cooltube-150mm',
      description: 'Refletor refrigerado a ar para HPS/MH. Reduz temperatura e aumenta eficiência luminosa.',
      shortDesc: 'Cooltube 150mm refrigerado',
      categoryId: fallbackCategories[0]?.id || '',
      price: 180.00,
      comparePrice: 250.00,
      stock: 12,
      images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500']
    },
    {
      name: 'Filtro de Carvão Ativado 150mm 420m³/h',
      slug: 'filtro-carvao-ativado-150mm',
      description: 'Filtro anti-odor profissional com carvão ativado australiano. Remove 99% dos odores.',
      shortDesc: 'Filtro carvão 150mm',
      categoryId: subcategories.exaustores?.id || fallbackCategories[1]?.id || '',
      price: 320.00,
      comparePrice: 450.00,
      stock: 10,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500']
    },
    {
      name: 'Kit Poda Profissional 5 Peças',
      slug: 'kit-poda-profissional-5-pecas',
      description: 'Kit completo: tesoura reta, tesoura curva, tesoura colheita, pinça e lupa 60x. Case organizador incluído.',
      shortDesc: 'Kit 5 ferramentas poda',
      categoryId: subcategories.tesourasPoda?.id || fallbackCategories[4]?.id || '',
      price: 135.00,
      comparePrice: 190.00,
      stock: 20,
      images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500']
    },
    {
      name: 'Mangueira Flexível Aluminizada 150mm 3m',
      slug: 'mangueira-flexivel-150mm-3m',
      description: 'Mangueira sanfonada com camada refletiva. Flexível e resistente a altas temperaturas.',
      shortDesc: 'Mangueira 150mm 3m',
      categoryId: subcategories.ventiladores?.id || fallbackCategories[1]?.id || '',
      price: 48.00,
      comparePrice: 75.00,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=500']
    },
    {
      name: 'Lupa 60x LED Iluminada',
      slug: 'lupa-60x-led-iluminada',
      description: 'Lupa de bolso com LED UV. Ideal para verificar tricomas e detectar pragas. Bateria incluída.',
      shortDesc: 'Lupa 60x com LED UV',
      categoryId: fallbackCategories[4]?.id || '',
      price: 38.00,
      comparePrice: 58.00,
      stock: 55,
      images: ['https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=500']
    },
    {
      name: 'Kit 30 Budclip LST Low Stress Training',
      slug: 'kit-30-budclip-lst-training',
      description: 'Clips reutilizáveis para técnicas LST. Material flexível que não danifica plantas. Pack com 30 unidades.',
      shortDesc: 'Kit 30 clips LST',
      categoryId: fallbackCategories[4]?.id || '',
      price: 25.00,
      comparePrice: 40.00,
      stock: 60,
      images: ['https://images.unsplash.com/photo-1416339442236-8ceb164046f8?w=500']
    },
    {
      name: 'Tela SCROG 120x120cm Ajustável',
      slug: 'tela-scrog-120x120-ajustavel',
      description: 'Rede elástica para técnica Screen of Green. Malha 5x5cm com ganchos ajustáveis. Aumenta produção.',
      shortDesc: 'Rede SCROG 120x120cm',
      categoryId: fallbackCategories[4]?.id || '',
      price: 55.00,
      comparePrice: 85.00,
      stock: 28,
      images: ['https://images.unsplash.com/photo-1621112904887-419379ce6824?w=500']
    },
    {
      name: 'Balança Digital Precisão 0.01g até 500g',
      slug: 'balanca-digital-precisao-001g',
      description: 'Balança de precisão com tela LCD retroiluminada. 6 unidades de medida. Calibração incluída.',
      shortDesc: 'Balança 0.01g precisão',
      categoryId: fallbackCategories[4]?.id || '',
      price: 72.00,
      comparePrice: 105.00,
      stock: 32,
      images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500']
    },
    {
      name: 'Bomba de Ar 4 Saídas 15W Aquário',
      slug: 'bomba-ar-4-saidas-15w',
      description: 'Bomba de ar silenciosa para DWC/hidroponia. 4 saídas independentes, 15W. Inclui pedras difusoras.',
      shortDesc: 'Bomba ar 4x 15W silenciosa',
      categoryId: fallbackCategories[4]?.id || '',
      price: 85.00,
      comparePrice: 125.00,
      stock: 22,
      images: ['https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=500']
    },
    {
      name: 'Solução Calibração pH 4.0 e 7.0 - 250ml',
      slug: 'solucao-calibracao-ph-250ml',
      description: 'Kit calibração com 2 soluções buffer pH 4.0 e 7.0. Essencial para medidores digitais. Validade 2 anos.',
      shortDesc: 'Kit calibração pH 250ml',
      categoryId: fallbackCategories[2]?.id || '',
      price: 42.00,
      comparePrice: 65.00,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500']
    },
    {
      name: 'Enzimas Biológicas 250ml Limpeza Raiz',
      slug: 'enzimas-biologicas-250ml',
      description: 'Complexo enzimático para decompor raízes mortas. Previne patógenos e melhora absorção de nutrientes.',
      shortDesc: 'Enzimas limpeza 250ml',
      categoryId: fallbackCategories[2]?.id || '',
      price: 78.00,
      comparePrice: 110.00,
      stock: 18,
      images: ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500']
    }
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        shortDesc: product.shortDesc,
        categoryId: product.categoryId,
        price: product.price,
        comparePrice: product.comparePrice,
        stock: product.stock,
        status: 'ACTIVE'
      },
      create: {
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
