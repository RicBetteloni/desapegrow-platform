import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Adicionando subcategorias faltantes...\n");

  // Buscar categorias pai
  const substratos = await prisma.category.findUnique({
    where: { slug: "substratos" },
  });
  const climatizacao = await prisma.category.findUnique({
    where: { slug: "climatizacao" },
  });
  const irrigacao = await prisma.category.findUnique({
    where: { slug: "irrigacao" },
  });

  // Subcategorias a criar
  const subcategoriesToCreate = [
    {
      parentSlug: "substratos",
      parentId: substratos?.id,
      slug: "fibra-de-coco",
      name: "Fibra de Coco",
      icon: "🥥",
    },
    {
      parentSlug: "climatizacao",
      parentId: climatizacao?.id,
      slug: "filtros-de-carvao",
      name: "Filtros de Carvão",
      icon: "⚫",
    },
    {
      parentSlug: "irrigacao",
      parentId: irrigacao?.id,
      slug: "bombas-dagua",
      name: "Bombas d'água",
      icon: "🚰",
    },
  ];

  for (const subcat of subcategoriesToCreate) {
    if (!subcat.parentId) {
      console.log(`❌ Categoria pai não encontrada: ${subcat.parentSlug}`);
      continue;
    }

    const existing = await prisma.category.findUnique({
      where: { slug: subcat.slug },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: subcat.name,
          slug: subcat.slug,
          icon: subcat.icon,
          parentId: subcat.parentId,
        },
      });
      console.log(`✅ Subcategoria '${subcat.name}' criada`);
    } else {
      console.log(`ℹ️  Subcategoria '${subcat.name}' já existe`);
    }
  }

  console.log("\n✅ Concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
