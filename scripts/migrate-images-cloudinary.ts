// Script para migrar imagens da pasta public/produtos para Cloudinary
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import cloudinary from '../src/lib/cloudinary';

const prisma = new PrismaClient();

async function uploadToCloudinary(imagePath: string, folder: string = 'produtos'): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: `desapegrow/${folder}`,
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Erro ao fazer upload de ${imagePath}:`, error);
    throw error;
  }
}

async function migrateProductImages() {
  try {
    console.log('🚀 Iniciando migração de imagens para Cloudinary...\n');

    // Buscar todas as imagens de produtos
    const productImages = await prisma.productImage.findMany({
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(`📦 Encontradas ${productImages.length} imagens\n`);

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const image of productImages) {
      console.log(`\n📸 Processando: ${image.product.name} - ${image.url}`);
      
      // Verificar se a imagem já está no Cloudinary
      if (image.url.includes('cloudinary.com')) {
        console.log('   ✅ Já está no Cloudinary - pulando');
        skippedCount++;
        continue;
      }

      try {
        let newUrl = image.url;

        // Se for URL local (/produtos/...)
        if (image.url.startsWith('/produtos/') || image.url.startsWith('/public/produtos/')) {
          const imageName = image.url.replace('/produtos/', '').replace('/public/produtos/', '');
          const imagePath = path.join(process.cwd(), 'public', 'produtos', imageName);

          // Verificar se o arquivo existe
          if (fs.existsSync(imagePath)) {
            console.log(`   📤 Fazendo upload de: ${imageName}`);
            newUrl = await uploadToCloudinary(imagePath, 'produtos');
            console.log(`   ✅ Upload concluído: ${newUrl}`);
          } else {
            console.log(`   ⚠️  Arquivo não encontrado: ${imagePath}`);
            continue; // Pular este item
          }
        } else if (image.url.startsWith('http')) {
          // Manter URLs externas (Unsplash, etc)
          console.log(`   ℹ️  Mantendo URL externa`);
          skippedCount++;
          continue;
        }

        // Atualizar imagem com nova URL
        await prisma.productImage.update({
          where: { id: image.id },
          data: { url: newUrl },
        });
        
        migratedCount++;
        console.log(`   💾 Imagem atualizada no banco`);

      } catch (error) {
        console.error(`   ❌ Erro ao processar imagem:`, error);
        errorCount++;
      }
    }

    console.log('\n\n📊 RESUMO DA MIGRAÇÃO');
    console.log('='.repeat(50));
    console.log(`✅ Imagens migradas: ${migratedCount}`);
    console.log(`⏭️  Imagens puladas: ${skippedCount}`);
    console.log(`❌ Erros encontrados: ${errorCount}`);
    console.log(`📦 Total de imagens: ${productImages.length}`);
    console.log('='.repeat(50));
    console.log('\n✨ Migração concluída!');

  } catch (error) {
    console.error('\n❌ Erro fatal na migração:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar migração
migrateProductImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
