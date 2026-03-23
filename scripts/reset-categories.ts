import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetCategories() {
  try {
    console.log('� Atualizando categorias existentes...')
    
    // Buscar todas as categorias existentes
    const categories = await prisma.category.findMany()
    
    console.log(`📊 Encontradas ${categories.length} categorias`)
    
    // Atualizar categorias principais
    const mainCategories = [
      { slug: 'iluminacao', name: 'Iluminação', icon: '💡' },
      { slug: 'ventilacao', name: 'Ventilação', icon: '🌬️' },
      { slug: 'estrutura', name: 'Estrutura', icon: '🏠' },
      { slug: 'irrigacao', name: 'Irrigação', icon: '💧' },
      { slug: 'substratos', name: 'Substratos', icon: '🌱' },
      { slug: 'nutricao', name: 'Nutrição', icon: '🧪' },
      { slug: 'monitoramento', name: 'Monitoramento', icon: '📊' },
      { slug: 'ferramentas', name: 'Ferramentas', icon: '🔧' },
    ]
    
    for (const cat of mainCategories) {
      const existing = categories.find(c => c.slug === cat.slug)
      if (existing) {
        await prisma.category.update({
          where: { id: existing.id },
          data: { name: cat.name, icon: cat.icon }
        })
        console.log(`✅ Atualizado: ${cat.name}`)
      }
    }
    
    // Atualizar "controle" para "monitoramento"
    const controle = categories.find(c => c.slug === 'controle')
    if (controle) {
      await prisma.category.update({
        where: { id: controle.id },
        data: { 
          name: 'Monitoramento',
          slug: 'monitoramento',
          icon: '📊'
        }
      })
      console.log(`✅ Renomeado: Controle → Monitoramento`)
    }
    
    // Atualizar "grow-box" para "estrutura"
    const growBox = categories.find(c => c.slug === 'grow-box')
    if (growBox) {
      await prisma.category.update({
        where: { id: growBox.id },
        data: { 
          name: 'Estrutura',
          slug: 'estrutura',
          icon: '🏠'
        }
      })
      console.log(`✅ Renomeado: Grow Box → Estrutura`)
    }
    
    // Atualizar "nutrientes" para "nutrição"
    const nutrientes = categories.find(c => c.slug === 'nutrientes')
    if (nutrientes) {
      await prisma.category.update({
        where: { id: nutrientes.id },
        data: { 
          name: 'Nutrição',
          slug: 'nutricao',
          icon: '🧪'
        }
      })
      console.log(`✅ Renomeado: Nutrientes → Nutrição`)
    }
    
    console.log('✨ Categorias atualizadas com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao deletar categorias:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetCategories()
