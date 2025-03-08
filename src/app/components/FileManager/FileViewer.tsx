'use client';

import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { isImageFile, isPdfFile, isTextFile } from '@/app/lib/utils';
import type { FileType } from '@/app/lib/types';

interface FileViewerProps {
  file: FileType;
  onBack: () => void;
}

export default function FileViewer({ file, onBack }: FileViewerProps) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      console.log("Carregando conteúdo do arquivo:", file);
      loadFileContent();
    }
  }, [file]);

  const loadFileContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Determina como exibir o arquivo com base no tipo
      if (isImageFile(file.type)) {
        // Para imagens, não precisamos carregar o conteúdo como texto
        setFileContent(null);
      } else if (isTextFile(file.type)) {
        // Para arquivos de texto, carregamos o conteúdo
        const response = await fetch(`/api/files/content?fileId=${file.id}`);
        if (!response.ok) throw new Error('Falha ao carregar conteúdo do arquivo');
        
        const data = await response.text();
        setFileContent(data);
      } else {
        // Outros tipos de arquivo
        setFileContent(null);
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo do arquivo:', error);
      setError('Não foi possível carregar o conteúdo deste arquivo.');
    } finally {
      setLoading(false);
    }
  };

  const renderFileContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
          <span className="ml-3 text-white">Carregando conteúdo do arquivo...</span>
        </div>
      );
    }

    if (error) {
      return <div className="p-4 text-red-500">{error}</div>;
    }

    if (isImageFile(file.type)) {
      return (
        <div className="flex justify-center p-4">
          <img 
            src={`/api/files/content?fileId=${file.id}`} 
            alt={file.name} 
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      );
    }

    if (isPdfFile(file.type)) {
      return (
        <div className="h-[70vh]">
          <div className="flex flex-col items-center justify-center h-full bg-slate-600 p-4 text-white">
            <p className="mb-4">Visualização de PDF não disponível na versão de demonstração</p>
            <Button 
              label="Baixar PDF" 
              icon="pi pi-download" 
              severity="info"
              onClick={() => window.open(`/api/files/download?fileId=${file.id}`, '_blank')}
            />
          </div>
        </div>
      );
    }

    if (isTextFile(file.type) && fileContent) {
      return (
        <div className="p-4 bg-slate-600 rounded overflow-auto max-h-[70vh]">
          <pre className="whitespace-pre-wrap text-white">{fileContent}</pre>
        </div>
      );
    }

    return (
      <div className="p-4 text-center text-white">
        <p>Este tipo de arquivo não pode ser exibido diretamente.</p>
        <Button 
          label="Baixar arquivo" 
          icon="pi pi-download" 
          onClick={() => window.open(`/api/files/download?fileId=${file.id}`, '_blank')}
          className="mt-4"
        />
      </div>
    );
  };

  return (
    <Card 
      title={`Arquivo: ${file.name}`} 
      className="p-2 bg-slate-800"
      pt={{ 
        title: { className: 'text-white' },
        content: { className: 'bg-slate-800' }
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-sm text-gray-300">Tipo: {file.type}</span>
        </div>
        <div>
          <Button 
            icon="pi pi-download" 
            label="Baixar" 
            onClick={() => window.open(`/api/files/download?fileId=${file.id}`, '_blank')}
            className="mr-2"
            severity="info"
            outlined
          />
          <Button 
            icon="pi pi-arrow-left" 
            label="Voltar" 
            onClick={onBack}
            severity="secondary"
            outlined
          />
        </div>
      </div>
      
      <div className="border border-slate-700 rounded bg-slate-700">
        {renderFileContent()}
      </div>
    </Card>
  );
}