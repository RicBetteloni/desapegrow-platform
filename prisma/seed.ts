import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CATEGORIES = [
  {
    name: "Equipamentos de Iluminação",
    slug: "iluminacao",
    description: "LEDs, HPS, fluorescentes e acessórios de iluminação",
    icon: "💡"
  },
  {
    name: "Ventilação e Climatização",
    slug: "ventilacao",
    description: "Exaustores, ventiladores, filtros de carvão",
    icon: "🌀"
  },
  {
    name: "Sistemas Hidropônicos",
    slug: "hidroponia",
    description: "NFT, DWC, aeroponia e sistemas completos",
    icon: "💧"
  },
  {
    name: "Fertilizantes e Nutrição",
    slug: "fertilizantes",
    description: "Fertilizantes orgânicos, minerais e suplementos",
    icon: "🧪"
  },
  {
    name: "Substratos e Vasos",
    slug: "substratos",
    description: "Fibra de coco, perlita, vermiculita e vasos inteligentes",
    icon: "🏺"
  }
]

const TAGS = [
  { name: "LED", slug: "led", color: "#10B981" },
  { name: "Orgânico", slug: "organico", color: "#059669" },
  { name: "Automático", slug: "automatico", color: "#3B82F6" },
  { name: "Profissional", slug: "profissional", color: "#8B5CF6" },
  { name: "Iniciante", slug: "iniciante", color: "#F59E0B" },
  { name: "Indoor", slug: "indoor", color: "#EF4444" }
]

async function main() {
  console.log('Criando categorias...')
  
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  console.log('Criando tags...')
  
  for (const tag of TAGS) {
    await prisma.productTag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag
    })
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })