// Script para fazer upload das imagens da home para Cloudinary
import cloudinary from '../src/lib/cloudinary';
import path from 'path';

async function uploadHomeImages() {
  const images = [
    { file: 'hero-main.png', name: 'hero-main' },
    { file: 'hero-grow.png', name: 'hero-grow' },
    { file: 'hero-feature-1.png', name: 'hero-feature-1' },
    { file: 'hero-feature-2.png', name: 'hero-feature-2' },
    { file: 'hero-feature-3.png', name: 'hero-feature-3' },
  ];

  console.log('📤 Fazendo upload das imagens da home para Cloudinary...\n');

  for (const img of images) {
    try {
      const imagePath = path.join(process.cwd(), 'public', 'newlayout', img.file);
      console.log(`📸 Uploading ${img.file}...`);
      
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: 'desapegrow/home',
        public_id: img.name,
        overwrite: true,
      });
      
      console.log(`✅ ${img.file} → ${result.secure_url}\n`);
    } catch (error) {
      console.error(`❌ Erro em ${img.file}:`, error);
    }
  }
}

uploadHomeImages()
  .then(() => {
    console.log('✨ Upload concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
