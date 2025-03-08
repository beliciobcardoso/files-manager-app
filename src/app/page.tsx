'use client';
import { useState } from 'react';
import { Card } from 'primereact/card';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Button } from 'primereact/button';
import FolderTree from './components/FileManager/FolderTree';
import FolderView from './components/FileManager/FolderView';
import FileViewer from './components/FileManager/FileViewer';
import type { FileType, FolderType } from './lib/types';

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const handleFolderSelect = (folder: FolderType) => {
    console.log("Pasta selecionada:", folder);
    setSelectedFolder(folder);
    setSelectedFile(null); // Limpa o arquivo selecionado quando seleciona uma pasta
  };

  const handleFileSelect = (file: FileType) => {
    console.log("Arquivo selecionado:", file);
    setSelectedFile(file);
  };

  const handleBackToFolder = () => {
    setSelectedFile(null);
  };

  const openNewFolderDialog = () => {
    setIsDialogVisible(true);
  };

  const createNewFolder = () => {
    if (newFolderName.trim() !== '') {
      console.log('Criar nova pasta:', newFolderName);
      // Lógica para criar a nova pasta
      setIsDialogVisible(false);
      setNewFolderName('');
    }
  };

  return (
    <main className="min-h-screen p-4 bg-gradient-to-b flex justify-center w-full from-gray-900 to-gray-950">
      <div className="w-full max-w-[2500px]">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Gerenciador de Arquivos</h1>
            <p className="text-gray-400">Gerencie seus documentos e imagens com facilidade</p>
          </div>
          <div className="flex gap-3">
            <Button icon="pi pi-cog" severity="secondary" text rounded aria-label="Configurações" />
            <Button icon="pi pi-question" severity="help" text rounded aria-label="Ajuda" />
          </div>
        </header>

        <Splitter className="border border-slate-700/50 p-0 bg-slate-800" style={{ height: 'calc(100vh - 200px)', width: '100%' }}>
          <SplitterPanel size={15} minSize={10} className="overflow-auto">
            <div className="p-4">
              <div className='flex items-center gap-2 mb-4'>
                <Button
                  label=""
                  icon="pi pi-plus"
                  onClick={openNewFolderDialog} 
                  severity="success"
                  size="small"
                />
                <h2 className="text-xl font-bold text-white flex items-center">
                  <i className="pi pi-folder mr-2 text-yellow-500"></i>
                  Pastas
                </h2>
              </div>
              <FolderTree onFolderSelect={handleFolderSelect} />
            </div>
          </SplitterPanel>

          <SplitterPanel size={77} minSize={60} className="overflow-auto w-full">
            {selectedFile ? (
              <FileViewer
                file={selectedFile}
                onBack={handleBackToFolder}
              />
            ) : (
              <FolderView
                folder={selectedFolder}
                onFileSelect={handleFileSelect}
              />
            )}
          </SplitterPanel>
        </Splitter>

        <footer className="mt-4 text-center text-gray-500 text-sm">
          © 2024 Gerenciador de Arquivos | Desenvolvido com Next.js e PrimeReact
        </footer>
      </div>

      {isDialogVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-700 p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Nova Pasta</h2>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="border p-2 w-full mb-4"
              placeholder="Nome da nova pasta"
            />
            <div className="flex justify-end gap-2">
              <Button label="Cancelar" onClick={() => setIsDialogVisible(false)} className="p-button-secondary" />
              <Button label="Criar" onClick={createNewFolder} className="p-button-primary" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
