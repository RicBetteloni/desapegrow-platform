// src/prisma/seed.ts
import { PrismaClient, Prisma, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  {
    id: '1',
    name: 'Equipamentos de Iluminação',
    slug: 'iluminacao',
    description: 'LEDs, HPS, fluorescentes e acessórios de iluminação',
    icon: '💡',
  },
  {
    id: '2',
    name: 'Ventilação e Climatização',
    slug: 'ventilacao',
    description: 'Exaustores, ventiladores, filtros de carvão',
    icon: '🌀',
  },
  {
    id: '3',
    name: 'Sistemas Hidropônicos',
    slug: 'hidroponia',
    description: 'NFT, DWC, aeroponia e sistemas completos',
    icon: '💧',
  },
  {
    id: '4',
    name: 'Fertilizantes e Nutrição',
    slug: 'fertilizantes',
    description: 'Fertilizantes orgânicos, minerais e suplementos',
    icon: '🧪',
  },
  {
    id: '5',
    name: 'Substratos e Vasos',
    slug: 'substratos',
    description: 'Fibra de coco, perlita, vermiculita e vasos inteligentes',
    icon: '🏺',
  },
];

const TAGS = [
  { name: 'LED', slug: 'led', color: '#10B981' },
  { name: 'Orgânico', slug: 'organico', color: '#059669' },
  { name: 'Automático', slug: 'automatico', color: '#3B82F6' },
  { name: 'Profissional', slug: 'profissional', color: '#8B5CF6' },
  { name: 'Iniciante', slug: 'iniciante', color: '#F59E0B' },
  { name: 'Indoor', slug: 'indoor', color: '#EF4444' },
];

const PRODUCTS = [
  {
    name: 'LED Grow Light 150W Full Spectrum',
    description:
      'LED de alta qualidade com espectro completo para todas as fases do cultivo. Consumo eficiente de energia e vida útil de mais de 50.000 horas. Ideal para cultivo indoor profissional.',
    shortDesc: 'Iluminação profissional para cultivo indoor',
    slug: 'led-grow-light-150w-full-spectrum',
    price: 189.90,
    comparePrice: 249.90,
    stock: 15,
    categoryId: '1',
    status: 'ACTIVE',
    images: [{ url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600', alt: 'LED Grow Light' }],
    sellerBusinessName: 'Cultivo Pro',
    totalReviews: 23,
    avgRating: 4.8,
  },
  {
    name: 'Sistema Hidropônico NFT Completo',
    description:
      "Sistema completo de hidroponia NFT para até 20 plantas. Inclui bomba d'água, tubulações, reservatório de 40L e manual completo de instalação.",
    shortDesc: 'Sistema completo para cultivo hidropônico',
    slug: 'sistema-hidroponico-nft-completo',
    price: 299.90,
    stock: 8,
    categoryId: '3',
    status: 'ACTIVE',
    images: [{ url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600', alt: 'Sistema Hidropônico' }],
    sellerBusinessName: 'HidroTech',
    totalReviews: 15,
    avgRating: 4.6,
  },
  {
    name: 'Fertilizante Orgânico Premium 1kg',
    description: 'Fertilizante 100% orgânico rico em nutrientes essenciais. Formulado especialmente para plantas de crescimento rápido.',
    shortDesc: 'Nutrição orgânica premium para plantas',
    slug: 'fertilizante-organico-premium-1kg',
    price: 45.90,
    comparePrice: 59.90,
    stock: 25,
    categoryId: '4',
    status: 'ACTIVE',
    images: [{ url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600', alt: 'Fertilizante Orgânico' }],
    sellerBusinessName: 'BioCultivo',
    totalReviews: 31,
    avgRating: 4.9,
  },
];

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');
  try {
    console.log('🗑️  Dados anteriores limpos');
    await prisma.reviewHelpful.deleteMany();
    await prisma.reviewReply.deleteMany();
    await prisma.reviewMedia.deleteMany();
    await prisma.review.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productTagRelation.deleteMany();
    await prisma.productTag.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.sellerProfile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();

    console.log('📂 Criando categorias...');
    for (const category of CATEGORIES) {
      await prisma.category.create({
        data: category,
      });
      console.log(`✅ Categoria criada: ${category.name}`);
    }

    console.log('🏷️  Criando tags...');
    for (const tag of TAGS) {
      await prisma.productTag.create({
        data: tag,
      });
      console.log(`✅ Tag criada: ${tag.name}`);
    }

    console.log('🧑‍🌾 Criando usuários e perfis de vendedores mockados...');
    const joao = await prisma.user.create({
      data: {
        email: 'joao.silva@example.com',
        name: 'João Silva',
        password: 'hashed_password_for_joao',
        role: 'SELLER',
        sellerProfile: {
          create: {
            businessName: 'Cultivo Pro',
            cnpj: '12.345.678/0001-90',
          },
        },
      },
      include: {
        sellerProfile: true,
      },
    });

    const maria = await prisma.user.create({
      data: {
        email: 'maria.santos@example.com',
        name: 'Maria Santos',
        password: 'hashed_password_for_maria',
        role: 'SELLER',
        sellerProfile: {
          create: {
            businessName: 'HidroTech',
            cnpj: '98.765.432/0001-21',
          },
        },
      },
      include: {
        sellerProfile: true,
      },
    });

    const pedro = await prisma.user.create({
      data: {
        email: 'pedro.costa@example.com',
        name: 'Pedro Costa',
        password: 'hashed_password_for_pedro',
        role: 'SELLER',
        sellerProfile: {
          create: {
            businessName: 'BioCultivo',
            cnpj: '11.222.333/0001-44',
          },
        },
      },
      include: {
        sellerProfile: true,
      },
    });

    console.log('📦 Criando produtos mockados...');
    for (const product of PRODUCTS) {
      let sellerId = '';
      switch (product.sellerBusinessName) {
        case 'Cultivo Pro':
          sellerId = joao.sellerProfile?.id || '';
          break;
        case 'HidroTech':
          sellerId = maria.sellerProfile?.id || '';
          break;
        case 'BioCultivo':
          sellerId = pedro.sellerProfile?.id || '';
          break;
      }

      if (sellerId) {
        await prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            shortDesc: product.shortDesc,
            slug: product.slug,
            price: new Prisma.Decimal(product.price),
            comparePrice: product.comparePrice ? new Prisma.Decimal(product.comparePrice) : undefined,
            stock: product.stock,
            categoryId: product.categoryId,
            status: product.status as ProductStatus,
            totalReviews: product.totalReviews,
            avgRating: product.avgRating,
            sellerId: sellerId,
            images: {
              create: product.images,
            },
          },
        });
        console.log(`✅ Produto criado: ${product.name}`);
      }
    }

    console.log('🎉 Seed concluído com sucesso!');
    const usersCount = await prisma.user.count();
    const categoriesCount = await prisma.category.count();
    const productsCount = await prisma.product.count();
    console.log(`📊 Criadas ${usersCount} usuários, ${categoriesCount} categorias e ${productsCount} produtos.`);
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('💥 Erro fatal no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Conexão com banco fechada');
  });