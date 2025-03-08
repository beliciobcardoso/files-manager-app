import { NextRequest, NextResponse } from 'next/server';
import { minioClient } from '@/service/objectStore';
import crypto from 'crypto';
import prisma from '@/app/lib/prisma';

const BUCKET_NAME = process.env.STORAGE_BUCKET_NAME || 'files-manager';

// Verifica se o bucket existe, caso contrário, cria um novo
async function ensureBucketExists() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`Bucket '${BUCKET_NAME}' criado com sucesso`);
    }
  } catch (error) {
    console.error('Erro ao verificar/criar bucket:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verifica se o bucket existe
    await ensureBucketExists();

    // Extrai os dados do formulário
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderKey = formData.get('folderKey') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado', success: false },
        { status: 400 }
      );
    }

    if (!folderKey) {
      return NextResponse.json(
        { error: 'Chave da pasta é necessária', success: false },
        { status: 400 }
      );
    }

    // Encontra a pasta no banco de dados
    const folder = await prisma.folder.findUnique({
      where: { key: folderKey }
    });

    if (!folder) {
      return NextResponse.json(
        { error: 'Pasta não encontrada', success: false },
        { status: 404 }
      );
    }

    // Gera um ID único para o arquivo
    const fileId = crypto.randomUUID();
    
    // Cria uma chave para o arquivo no formato "folderKey_fileId"
    const fileKey = `${folderKey}_${fileId}`;
    
    // Converte o arquivo para um buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Faz o upload do arquivo para o Minio
    const objectKey = `${folder.path.replace(/^\//, '')}/${file.name}`.replace(/\\/g, '/').replace(/\/\//g, '/');
    
    await minioClient.putObject(
      BUCKET_NAME,
      objectKey,
      buffer,
      {
        'Content-Type': file.type,
        'Content-Length': buffer.length,
      }
    );

    // Salva os metadados do arquivo no banco de dados
    const savedFile = await prisma.file.create({
      data: {
        key: fileKey,
        name: file.name,
        type: file.type,
        size: file.size,
        path: `${folder.path}/${file.name}`,
        lastModified: new Date(),
        folderKey: folder.key,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Arquivo enviado com sucesso',
      file: {
        id: savedFile.id,
        key: savedFile.key,
        name: savedFile.name,
        type: savedFile.type,
        size: savedFile.size,
        path: savedFile.path,
        lastModified: savedFile.lastModified,
      }
    });
  } catch (error) {
    console.error('Erro no upload do arquivo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', success: false },
      { status: 500 }
    );
  }
}

// Rota para verificar o status do servidor de armazenamento
export async function GET() {
  try {
    await ensureBucketExists();
    return NextResponse.json({
      success: true,
      message: 'Servidor de armazenamento está operacional',
      bucket: BUCKET_NAME
    });
  } catch (error) {
    console.error('Erro ao verificar o servidor de armazenamento:', error);
    return NextResponse.json(
      { error: 'Servidor de armazenamento indisponível', success: false },
      { status: 500 }
    );
  }
}