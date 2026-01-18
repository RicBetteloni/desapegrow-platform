import { readFileSync } from 'fs';
import { join } from 'path';
import { Blob } from 'buffer';
import crypto from 'crypto';

const cloudName = 'dasx39hlf';
const apiKey = '526769849277111';
const apiSecret = 'A78DjXpt6fzz7pnb9BxzhX4kmqE';

async function uploadToCloudinary() {
  console.log('🔑 Cloud Name:', cloudName);
  
  try {
    const imagePath = join(process.cwd(), 'public', 'newlayout', 'Hero-grow-logo.png');
    const imageBuffer = readFileSync(imagePath);
    
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('file', blob, 'Hero-grow-logo.png');
    formData.append('folder', 'desapegrow/home');
    formData.append('public_id', 'hero-grow-logo');
    formData.append('api_key', apiKey);
    
    const timestamp = Math.round(Date.now() / 1000);
    formData.append('timestamp', timestamp.toString());
    
    const signature = crypto
      .createHash('sha1')
      .update(`folder=desapegrow/home&public_id=hero-grow-logo&timestamp=${timestamp}${apiSecret}`)
      .digest('hex');
    
    formData.append('signature', signature);

    console.log('📤 Uploading to Cloudinary...');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Upload concluído!');
      console.log('🔗 URL:', result.secure_url);
    } else {
      console.error('❌ Erro:', result);
    }
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

uploadToCloudinary();
