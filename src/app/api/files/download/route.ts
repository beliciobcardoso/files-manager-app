import { NextRequest, NextResponse } from 'next/server';
import type { FileType } from '@/app/lib/types';

// Mock data from files/route.ts
const mockFiles: Record<string, FileType[]> = {
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
  ]
};

// Flatten the files array for easier lookup by ID
const allFiles: FileType[] = Object.values(mockFiles).flatMap(files => files);

export async function GET(request: NextRequest) {
  // Simulate delay to mimic real-world API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const searchParams = request.nextUrl.searchParams;
  const fileId = searchParams.get('fileId');
  
  if (!fileId) {
    return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
  }
  
  // Find the file by ID
  const file = allFiles.find(f => f.id === fileId);
  
  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
  
  // In a real application, we would serve the actual file here
  // For this demo, we'll just return a placeholder response
  return new Response(`Conteúdo simulado do arquivo: ${file.name}`, {
    headers: {
      'Content-Type': file.type,
      'Content-Disposition': `attachment; filename="${file.name}"`,
    },
  });
}