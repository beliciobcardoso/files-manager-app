import { NextResponse } from 'next/server';
import type { FolderType } from '@/app/lib/types';
import prisma from '@/app/lib/prisma';

// Função recursiva para construir a estrutura aninhada de pastas
function buildFolderHierarchy(folders: any[], parentKey: string | null = null): FolderType[] {
  const result: FolderType[] = [];

  const children = folders.filter(folder => folder.parentKey === parentKey);

  for (const child of children) {
    const folderWithSubfolders: FolderType = {
      id: child.id,
      key: child.key,
      name: child.name,
      path: child.path,
      parentKey: child.parentKey,
      userId: child.userId,
      subfolders: buildFolderHierarchy(folders, child.key)
    };

    result.push(folderWithSubfolders);
  }

  return result;
}

async function generateKey(baseKey: string): Promise<string> {

  let num = 1;
  let newKey = baseKey + num;

  // Obter todas as pastas
  const allFolders = await prisma.folder.findMany({
    orderBy: {
      key: 'asc'
    }
  });

  if (baseKey === '0') {
    if (!allFolders.length) {
      return '1';
    } else {
      const lastFolder = allFolders[allFolders.length - 1];
      const lastKey = parseInt(lastFolder.key);
      return (lastKey + 1).toString();
    }
  } else {

    while (allFolders.some(folder => folder.key === newKey)) {
      num++;
      newKey = baseKey + num;
    }

    return newKey;
  }
}

export async function GET() {
  try {
    // Obter todas as pastas
    const allFolders = await prisma.folder.findMany({
      orderBy: {
        key: 'asc'
      }
    });

    // Construir hierarquia de pastas
    const folderHierarchy = buildFolderHierarchy(allFolders);

    return NextResponse.json(folderHierarchy);
  } catch (error) {
    console.error('Erro ao buscar pastas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estrutura de pastas' },
      { status: 500 }
    );
  }
}

// Opção para criar uma nova pasta
export async function POST(req: Request) {
  const { name, userId, selectedFolder } = await req.json();

  const path = selectedFolder.path === '/' ? `${selectedFolder.path}${name} ` : `${selectedFolder.path}/${name}`
  const parentKey = selectedFolder.key;
  const key = await generateKey(parentKey);

  try {
    // Lógica para criar a nova pasta
    const newFolder = await prisma.folder.create({
      data: {
        key,
        name,
        parentKey,
        userId,
        path
      }
    });

    // Retorna o objeto completo da pasta para que possamos usá-lo no front-end
    return NextResponse.json(newFolder);
  } catch (error) {
    console.error('Erro ao criar pasta:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pasta' },
      { status: 500 }
    );
  }
}