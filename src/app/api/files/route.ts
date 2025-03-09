import { NextRequest, NextResponse } from 'next/server';
import type { FileType } from '@/app/lib/types';

// Mock data - in a real app, this would come from a database or file system
const mockFiles: Record<string, FileType[]> = {
  '0': [ // Root
  ],
  '1': [ // Documentos
    {
      id: '101',
      name: 'Relatório Anual.pdf',
      type: 'application/pdf',
      size: 2548760,
      lastModified: new Date('2023-12-15'),
      path: '/Documentos/Relatório Anual.pdf'
    },
    {
      id: '102',
      name: 'Notas.txt',
      type: 'text/plain',
      size: 1024,
      lastModified: new Date('2024-01-20'),
      path: '/Documentos/Notas.txt'
    }
  ],
  '11': [ // Trabalho
    {
      id: '1101',
      name: 'Apresentação.pptx',
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      size: 4567890,
      lastModified: new Date('2024-02-10'),
      path: '/Documentos/Trabalho/Apresentação.pptx'
    },
    {
      id: '1102',
      name: 'Contrato.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 1548790,
      lastModified: new Date('2024-01-05'),
      path: '/Documentos/Trabalho/Contrato.docx'
    }
  ],
  '111': [ // Projetos
    {
      id: '11101',
      name: 'Cronograma.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 2356780,
      lastModified: new Date('2024-02-22'),
      path: '/Documentos/Trabalho/Projetos/Cronograma.xlsx'
    },
    {
      id: '11102',
      name: 'Requisitos.md',
      type: 'text/markdown',
      size: 5675,
      lastModified: new Date('2024-02-15'),
      path: '/Documentos/Trabalho/Projetos/Requisitos.md'
    }
  ],
  '1111': [ // Desenvolvimento (nova pasta dentro de Projetos)
    {
      id: '11111',
      name: 'Código Fonte.zip',
      type: 'application/zip',
      size: 8765432,
      lastModified: new Date('2024-03-01'),
      path: '/Documentos/Trabalho/Projetos/Desenvolvimento/Código Fonte.zip'
    },
    {
      id: '11112',
      name: 'README.md',
      type: 'text/markdown',
      size: 3456,
      lastModified: new Date('2024-03-02'),
      path: '/Documentos/Trabalho/Projetos/Desenvolvimento/README.md'
    },
    {
      id: '11113',
      name: 'Diagrama.png',
      type: 'image/png',
      size: 456789,
      lastModified: new Date('2024-03-03'),
      path: '/Documentos/Trabalho/Projetos/Desenvolvimento/Diagrama.png'
    }
  ],
  '12': [ // Pessoal
    {
      id: '1201',
      name: 'Lista de Compras.txt',
      type: 'text/plain',
      size: 256,
      lastModified: new Date('2024-03-01'),
      path: '/Documentos/Pessoal/Lista de Compras.txt'
    }
  ],
  '2': [ // Imagens
    {
      id: '201',
      name: 'Foto.jpg',
      type: 'image/jpeg',
      size: 3547890,
      lastModified: new Date('2023-08-15'),
      path: '/Imagens/Foto.jpg'
    }
  ],
  '21': [ // Férias
    {
      id: '2101',
      name: 'Praia.jpg',
      type: 'image/jpeg',
      size: 4589760,
      lastModified: new Date('2023-07-22'),
      path: '/Imagens/Férias/Praia.jpg'
    },
    {
      id: '2102',
      name: 'Montanha.jpg',
      type: 'image/jpeg',
      size: 3265470,
      lastModified: new Date('2023-07-25'),
      path: '/Imagens/Férias/Montanha.jpg'
    }
  ],
  '22': [ // Família
    {
      id: '2201',
      name: 'Aniversário.jpg',
      type: 'image/jpeg',
      size: 5467890,
      lastModified: new Date('2023-11-10'),
      path: '/Imagens/Família/Aniversário.jpg'
    }
  ],
  '3': [ // Downloads
    {
      id: '301',
      name: 'Manual.pdf',
      type: 'application/pdf',
      size: 1547690,
      lastModified: new Date('2024-02-28'),
      path: '/Downloads/Manual.pdf'
    },
    {
      id: '302',
      name: 'Instalador.exe',
      type: 'application/x-msdownload',
      size: 25789460,
      lastModified: new Date('2024-02-25'),
      path: '/Downloads/Instalador.exe'
    }
  ],
  '1112': [ // Testes 
  ],
  '1113': [ // Implantação
  ],
  '11111': [ // Frontend
  ],
  '11112': [ // Backend
  ],
};

// Sample file contents for text files
const mockFileContents: Record<string, string> = {
  '102': 'Estas são minhas notas importantes.\nLembrar de comprar leite.\nMarcar consulta no dentista.',
  '1201': 'Arroz\nFeijão\nLeite\nFrutas\nLegumes\nPão',
  '11102': '# Requisitos do Projeto\n\n## Funcionalidades\n\n- Upload de arquivos\n- Visualização de documentos\n- Gerenciamento de pastas\n\n## Tecnologias\n\n- Next.js\n- TypeScript\n- PrimeReact'
};

export async function GET(request: NextRequest) {
  try {
    // Simulate delay to mimic real-world API
    await new Promise(resolve => setTimeout(resolve, 300));

    const searchParams = request.nextUrl.searchParams;
    const folderId = searchParams.get('folderId');

    if (!folderId) {
      return NextResponse.json(
        { error: 'Folder ID is required', success: false },
        { status: 400 }
      );
    }

    // Verificar se a pasta existe
    if (!mockFiles[folderId] && folderId !== 'root') {
      return NextResponse.json(
        { error: 'Folder not found', success: false },
        { status: 404 }
      );
    }

    const files = mockFiles[folderId] || [];
    return NextResponse.json({
      data: files,
      success: true,
      totalFiles: files.length
    });
  } catch (error) {
    console.error('Error in files API:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Em uma implementação real, isso lidaria com o upload de arquivos,
  // armazenaria eles e atualizaria o banco de dados.

  // Aqui estamos apenas simulando um upload bem-sucedido
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json({ success: true, message: 'Files uploaded successfully' });
}