// Script para fazer upload da hero-grow-logo.png para Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadHeroLogo() {
  try {
    const imagePath = path.join(process.cwd(), 'public', 'newlayout', 'Hero-grow-logo.png');
    console.log('📸 Uploading Hero-grow-logo.png...');
    
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'desapegrow/home',
      public_id: 'hero-grow-logo',
      overwrite: true,
    });
    
    console.log(`✅ Upload concluído!`);
    console.log(`🔗 URL: ${result.secure_url}`);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

uploadHeroLogo();
