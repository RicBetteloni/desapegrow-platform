import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeDuplicate() {
  try {
    console.log('🔍 Procurando categoria "Tenda" duplicada...')
    
    // Buscar todas as categorias que possam ser duplicadas
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { slug: 'tenda' },
          { slug: 'tendas' },
          { name: { contains: 'Tenda', mode: 'insensitive' } }
        ]
      },
      include: {
        products: true,
        subcategories: true
      }
    })
    
    console.log(`📊 Encontradas ${categories.length} categorias relacionadas:`)
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug}) - ${cat.products.length} produtos, ${cat.subcategories.length} subcategorias`)
    })
    
    // Remover categorias "tenda" que não são a principal
    for (const cat of categories) {
      if ((cat.slug === 'tenda' || cat.slug === 'tendas') && cat.slug !== 'tendas-kits') {
        // Encontrar a categoria principal
        const tendasKits = categories.find(c => c.slug === 'tendas-kits')
        
        // Se tiver produtos, mover para "tendas-kits"
        if (cat.products.length > 0 && tendasKits) {
          await prisma.product.updateMany({
            where: { categoryId: cat.id },
            data: { categoryId: tendasKits.id }
          })
          console.log(`  📦 Movidos ${cat.products.length} produtos para Tendas/Kits`)
        }
        
        // Se tiver subcategorias, mover para "tendas-kits"
        if (cat.subcategories.length > 0 && tendasKits) {
          await prisma.category.updateMany({
            where: { parentId: cat.id },
            data: { parentId: tendasKits.id }
          })
          console.log(`  📁 Movidas ${cat.subcategories.length} subcategorias para Tendas/Kits`)
        }
        
        // Deletar a categoria duplicada
        await prisma.category.delete({
          where: { id: cat.id }
        })
        console.log(`  ✅ Removida categoria duplicada: ${cat.name}`)
      }
    }
    
    console.log('✨ Limpeza concluída!')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeDuplicate()
