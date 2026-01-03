import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Migrando produtos para subcategorias corretas...\n");

  // Buscar todas as subcategorias necessárias
  const subcategories = await prisma.category.findMany({
    where: {
      slug: {
        in: [
          "refletores",
          "fibra-de-coco",
          "perlita",
          "enzimas",
          "filtros-de-carvao",
          "dutos",
          "timers",
          "termometro",
          "redes-trelica",
          "balancas",
          "bombas-dagua",
        ],
      },
    },
  });

  const subcatMap = new Map(subcategories.map((cat) => [cat.slug, cat.id]));

  // Mapeamento de produtos para subcategorias
  const productMappings = [
    // Iluminação
    {
      name: "Refletor Cooltube",
      subcategorySlug: "refletores",
    },
    // Nutrição
    {
      name: "Substrato Premium Fibra de Coco",
      subcategorySlug: "fibra-de-coco",
    },
    {
      name: "Perlita Expandida",
      subcategorySlug: "perlita",
    },
    {
      name: "Enzimas Biológicas",
      subcategorySlug: "enzimas",
    },
    // Climatização
    {
      name: "Filtro de Carvão Ativado",
      subcategorySlug: "filtros-de-carvao",
    },
    {
      name: "Mangueira Flexível Aluminizada",
      subcategorySlug: "dutos",
    },
    // Ferramentas
    {
      name: "Timer Digital Programável",
      subcategorySlug: "timers",
    },
    {
      name: "Termohigrômetro Digital",
      subcategorySlug: "termometro",
    },
    {
      name: "Tela SCROG",
      subcategorySlug: "redes-trelica",
    },
    {
      name: "Balança Digital Precisão",
      subcategorySlug: "balancas",
    },
    {
      name: "Bomba de Ar",
      subcategorySlug: "bombas-dagua",
    },
  ];

  let updated = 0;
  let notFound = 0;

  for (const mapping of productMappings) {
    const subcategoryId = subcatMap.get(mapping.subcategorySlug);

    if (!subcategoryId) {
      console.log(
        `❌ Subcategoria não encontrada: ${mapping.subcategorySlug}`
      );
      notFound++;
      continue;
    }

    // Buscar produto por nome parcial
    const product = await prisma.product.findFirst({
      where: {
        name: {
          contains: mapping.name,
        },
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      console.log(`⚠️  Produto não encontrado: ${mapping.name}`);
      notFound++;
      continue;
    }

    // Atualizar categoria
    await prisma.product.update({
      where: { id: product.id },
      data: { categoryId: subcategoryId },
    });

    console.log(
      `✅ ${product.name}\n   ${product.category.name} → ${mapping.subcategorySlug}`
    );
    updated++;
  }

  console.log(`\n📊 Resumo:`);
  console.log(`   ✅ Produtos atualizados: ${updated}`);
  console.log(`   ⚠️  Não encontrados: ${notFound}`);
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
