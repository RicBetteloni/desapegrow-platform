import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🖼️  Atualizando apenas produtos com imagens quebradas...\n')

  // Mapear apenas os 2 produtos com problema para URLs válidas
  const imagensMap: Record<string, string> = {
    'perlita-expandida-10l-cultivo': 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=500',
    'kit-30-budclip-lst-training': 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500',
  }

  let atualizados = 0
  let naoEncontrados = 0

  for (const [slug, imagemUrl] of Object.entries(imagensMap)) {
    const produto = await prisma.product.findUnique({
      where: { slug },
      include: { images: true }
    })

    if (!produto) {
      console.log(`⏭️  Produto "${slug}" não encontrado, pulando...`)
      naoEncontrados++
      continue
    }

    if (produto.images.length === 0) {
      console.log(`❌ Produto "${produto.name}" não tem imagens`)
      continue
    }

    // Atualizar a primeira imagem para a URL do mapeamento aleatório
    const imagemId = produto.images[0].id
    await prisma.productImage.update({
      where: { id: imagemId },
      data: { url: imagemUrl }
    })

    console.log(`✅ "${produto.name}"`)
    console.log(`   🖼️  Nova URL: ${imagemUrl}`)
    atualizados++
  }

  console.log(`\n✨ Processo concluído!`)
  console.log(`✅ ${atualizados} produtos atualizados`)
  if (naoEncontrados > 0) {
    console.log(`⏭️  ${naoEncontrados} produtos não encontrados`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
