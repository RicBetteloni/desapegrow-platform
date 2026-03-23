import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateCategories() {
  try {
    console.log('🔄 Atualizando categorias existentes...')
    
    // Buscar todas as categorias existentes
    const categories = await prisma.category.findMany()
    
    console.log(`📊 Encontradas ${categories.length} categorias`)
    
    // 1. Atualizar "Estrutura" para "Tendas / Kits completos"
    const estrutura = categories.find(c => c.slug === 'estrutura')
    if (estrutura) {
      await prisma.category.update({
        where: { id: estrutura.id },
        data: { 
          name: 'Tendas / Kits completos',
          slug: 'tendas-kits',
          icon: '⛺',
          description: 'Tendas refletivas, estruturas e kits completos para cultivo'
        }
      })
      console.log(`✅ Renomeado: Estrutura → Tendas / Kits completos`)
    }
    
    // 2. Renomear "Ventilação" para "Climatização"
    const ventilacao = categories.find(c => c.slug === 'ventilacao')
    if (ventilacao) {
      await prisma.category.update({
        where: { id: ventilacao.id },
        data: { 
          name: 'Climatização',
          slug: 'climatizacao',
          icon: '🌬️',
          description: 'Ventiladores, exaustores, ar condicionado e controle de clima'
        }
      })
      console.log(`✅ Renomeado: Ventilação → Climatização`)
      
      // Adicionar novas subcategorias para Climatização
      const subcatsToAdd = [
        { name: 'Ar Condicionado', slug: 'ar-condicionado', icon: '❄️', description: 'Ar condicionado portátil e split' },
        { name: 'Umidificadores', slug: 'umidificadores', icon: '💦', description: 'Umidificadores de ar' },
        { name: 'Desumidificadores', slug: 'desumidificadores', icon: '🌪️', description: 'Desumidificadores' },
      ]
      
      for (const subcat of subcatsToAdd) {
        const exists = categories.find(c => c.slug === subcat.slug)
        if (!exists) {
          await prisma.category.create({
            data: {
              ...subcat,
              parentId: ventilacao.id
            }
          })
          console.log(`  ➕ Adicionada subcategoria: ${subcat.name}`)
        }
      }
    }
    
    console.log('✨ Categorias atualizadas com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao atualizar categorias:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateCategories()
