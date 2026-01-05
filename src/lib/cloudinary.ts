import { v2 as cloudinary } from 'cloudinary';

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Faz upload de uma imagem para o Cloudinary
 * @param file - Arquivo ou buffer da imagem
 * @param folder - Pasta no Cloudinary (ex: 'produtos', 'usuarios')
 * @param publicId - ID público opcional (nome do arquivo)
 * @returns URL segura da imagem hospedada
 */
export async function uploadImage(
  file: File | Buffer | string,
  folder: string = 'produtos',
  publicId?: string
): Promise<string> {
  try {
    let fileData: string | Buffer;

    // Converter File para buffer se necessário
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      fileData = Buffer.from(arrayBuffer);
    } else {
      fileData = file;
    }

    // Upload para o Cloudinary
    const result = await cloudinary.uploader.upload(
      typeof fileData === 'string' ? fileData : `data:image/jpeg;base64,${fileData.toString('base64')}`,
      {
        folder: `desapegrow/${folder}`,
        public_id: publicId,
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ],
      }
    );

    return result.secure_url;
  } catch (error) {
    console.error('Erro ao fazer upload para Cloudinary:', error);
    throw new Error('Falha no upload da imagem');
  }
}

/**
 * Deleta uma imagem do Cloudinary
 * @param publicId - ID público da imagem (path completo)
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Erro ao deletar imagem do Cloudinary:', error);
    throw new Error('Falha ao deletar imagem');
  }
}
