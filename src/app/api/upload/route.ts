// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo encontrado' }, { status: 400 });
    }

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo inválido' }, { status: 400 });
    }

    // Validar tamanho (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande (max 5MB)' }, { status: 400 });
    }

    // Determinar a pasta baseado no tipo
    const folder = type === 'produto' ? 'produtos' : type === 'perfil' ? 'usuarios' : 'outros';

    // Upload para Cloudinary
    const fileUrl = await uploadImage(file, folder);

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 });
  }
}