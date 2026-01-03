import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkProducts() {
  try {
    console.log('🔍 Verificando produtos e suas categorias...\n')
    
    // Buscar todas as categorias principais
    const mainCategories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        products: {
          where: { status: 'ACTIVE' }
        },
        subcategories: {
          include: {
            products: {
              where: { status: 'ACTIVE' }
            }
          }
        }
      }
    })
    
    for (const cat of mainCategories) {
      console.log(`📦 ${cat.name} (${cat.slug})`)
      
      if (cat.products.length > 0) {
        console.log(`  ⚠️  ${cat.products.length} produtos na categoria PAI (deveria estar em subcategorias):`)
        cat.products.forEach(p => console.log(`     - ${p.name}`))
      }
      
      if (cat.subcategories.length > 0) {
        console.log(`  📁 Subcategorias:`)
        cat.subcategories.forEach(sub => {
          console.log(`     - ${sub.name}: ${sub.products.length} produtos`)
          if (sub.products.length > 0) {
            sub.products.forEach(p => console.log(`        ✓ ${p.name}`))
          }
        })
      }
      
      console.log('')
    }
    
    // Resumo
    const totalProducts = await prisma.product.count({ where: { status: 'ACTIVE' } })
    console.log(`\n📊 RESUMO:`)
    console.log(`   Total de produtos ativos: ${totalProducts}`)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProducts()
