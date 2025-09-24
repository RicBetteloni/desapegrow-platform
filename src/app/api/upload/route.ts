// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Simulação de um armazenamento em memória.
// EM UM AMBIENTE DE PRODUÇÃO, substitua por um serviço real como Cloudinary, S3, etc.
const uploadedFiles: { [key: string]: string } = {};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo encontrado' }, { status: 400 });
    }

    // Gerar uma URL simulada e armazenar em memória.
    // A URL real seria o link do bucket/serviço de armazenamento.
    const fileUrl = `https://images.unsplash.com/photo-${Date.now()}?w=600&q=80`;
    
    // Simular o armazenamento do arquivo
    uploadedFiles[fileUrl] = `Arquivo para ${type}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 });
  }
}