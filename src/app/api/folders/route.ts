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
  try {
    const data = await req.json();
    const { name, parentKey, userId, path } = data;

    // Validação dos dados
    if (!name || !userId) {
      return NextResponse.json(
        { error: 'Nome da pasta e ID do usuário são obrigatórios' },
        { status: 400 }
      );
    }

    // Gerar uma key única baseada no parentKey
    let newKey = '';
    if (parentKey !== '0') { // Verifica se não é a pasta raiz
      // Buscar todas as subpastas do pai para determinar a próxima key
      const siblingFolders = await prisma.folder.findMany({
        where: {
          parentKey: parentKey
        },
        orderBy: {
          key: 'desc'
        },
        take: 1
      });

      if (siblingFolders.length > 0) {
        // Incrementar o último digito da key
        const lastKey = siblingFolders[0].key;
        const baseKey = parentKey;
        const lastDigit = parseInt(lastKey.substring(baseKey.length)) || 0;
        newKey = `${baseKey}${lastDigit + 1}`;
      } else {
        // Primeira subpasta deste pai
        newKey = `${parentKey}1`;
      }
    } else {
      // Pasta raiz - encontrar a próxima key de nível superior
      const rootFolders = await prisma.folder.findMany({
        where: {
          parentKey: '0'
        },
        orderBy: {
          key: 'desc'
        },
        take: 1
      });

      if (rootFolders.length > 0) {
        const lastRootKey = rootFolders[0].key;
        const lastDigit = parseInt(lastRootKey) || 0;
        newKey = `${lastDigit + 1}`;
      } else {
        newKey = '1'; // Primeira pasta no sistema
      }
    }

    // Criar a nova pasta no banco de dados
    const newFolder = await prisma.folder.create({
      data: {
        key: newKey,
        name,
        path: path || `/${name}`,
        parentKey,
        userId
      }
    });

    return NextResponse.json(newFolder, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar pasta:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pasta' },
      { status: 500 }
    );
  }
}