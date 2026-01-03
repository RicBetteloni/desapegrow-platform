import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateProductsToSubcategories() {
  try {
    console.log('🔄 Atualizando produtos para usar subcategorias...')
    
    // Buscar subcategorias
    const lampadasLed = await prisma.category.findUnique({ where: { slug: 'lampadas-led' } })
    const growTent = await prisma.category.findUnique({ where: { slug: 'grow-tent' } })
    const exaustores = await prisma.category.findUnique({ where: { slug: 'exaustores' } })
    const ventiladores = await prisma.category.findUnique({ where: { slug: 'ventiladores' } })
    const npkBasico = await prisma.category.findUnique({ where: { slug: 'npk-basico' } })
    const floracao = await prisma.category.findUnique({ where: { slug: 'floracao' } })
    const tesourasPoda = await prisma.category.findUnique({ where: { slug: 'tesouras-poda' } })
    const vasos = await prisma.category.findUnique({ where: { slug: 'vasos' } })
    const medidorPh = await prisma.category.findUnique({ where: { slug: 'medidor-ph' } })
    const kitsCompletos = await prisma.category.findUnique({ where: { slug: 'kits-completos' } })
    
    // Buscar produtos
    const produtos = await prisma.product.findMany({
      include: {
        category: true
      }
    })
    
    console.log(`📦 Encontrados ${produtos.length} produtos`)
    
    // Mapear produtos para subcategorias baseado no nome
    for (const produto of produtos) {
      let novaCategoria = null
      
      // Lógica de mapeamento baseada no nome do produto
      if (produto.name.toLowerCase().includes('led') || produto.name.toLowerCase().includes('lâmpada')) {
        novaCategoria = lampadasLed
      } else if (produto.name.toLowerCase().includes('tent') || produto.name.toLowerCase().includes('tenda') || produto.name.toLowerCase().includes('grow box')) {
        novaCategoria = growTent
      } else if (produto.name.toLowerCase().includes('exaustor')) {
        novaCategoria = exaustores
      } else if (produto.name.toLowerCase().includes('ventilador')) {
        novaCategoria = ventiladores
      } else if (produto.name.toLowerCase().includes('nutriente') || produto.name.toLowerCase().includes('npk')) {
        novaCategoria = npkBasico
      } else if (produto.name.toLowerCase().includes('floração') || produto.name.toLowerCase().includes('bloom')) {
        novaCategoria = floracao
      } else if (produto.name.toLowerCase().includes('tesoura') || produto.name.toLowerCase().includes('poda')) {
        novaCategoria = tesourasPoda
      } else if (produto.name.toLowerCase().includes('vaso')) {
        novaCategoria = vasos
      } else if (produto.name.toLowerCase().includes('ph') || produto.name.toLowerCase().includes('medidor')) {
        novaCategoria = medidorPh
      } else if (produto.name.toLowerCase().includes('kit')) {
        novaCategoria = kitsCompletos
      }
      
      if (novaCategoria && novaCategoria.id !== produto.categoryId) {
        await prisma.product.update({
          where: { id: produto.id },
          data: { categoryId: novaCategoria.id }
        })
        console.log(`  ✅ ${produto.name} → ${novaCategoria.name}`)
      } else {
        console.log(`  ⏭️  ${produto.name} mantido em ${produto.category.name}`)
      }
    }
    
    console.log('✨ Atualização concluída!')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateProductsToSubcategories()
