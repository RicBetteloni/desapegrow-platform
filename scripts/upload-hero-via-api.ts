import { readFileSync } from 'fs';
import { join } from 'path';

async function uploadImage() {
  try {
    const imagePath = join(process.cwd(), 'public', 'newlayout', 'Hero-grow-logo.png');
    const imageBuffer = readFileSync(imagePath);
    
    // Converter para blob/file simulado
    const file = new File([imageBuffer], 'Hero-grow-logo.png', { type: 'image/png' });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'home');
    
    console.log('📤 Uploading Hero-grow-logo.png to Cloudinary...');
    
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Upload concluído!');
      console.log('🔗 URL:', data.url);
    } else {
      console.error('❌ Erro:', data.error);
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

uploadImage();
