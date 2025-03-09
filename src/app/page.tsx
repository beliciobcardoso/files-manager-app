'use client';
import { useState, useRef } from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Button } from 'primereact/button';
import FolderTree, { FolderTreeRef } from './components/FileManager/FolderTree';
import FolderView from './components/FileManager/FolderView';
import FileViewer from './components/FileManager/FileViewer';
import type { FileType, FolderType } from './lib/types';
import { Dialog } from 'primereact/dialog';

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [mensagemAlerta, setMensagemAlerta] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [mensagensErros, setMensagensErros] = useState<{ [key: string]: string }>({});
  const folderTreeRef = useRef<FolderTreeRef>(null);

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
    if (!selectedFolder) {
      const mensagemAlerta = 'Selecione uma pasta para criar uma nova pasta';
      setMensagemAlerta(mensagemAlerta);
      setIsAlertVisible(true);
      return;
    }

    setIsDialogVisible(true);
  };

  const createNewFolder = async () => {
    if (newFolderName.trim() === '') {
      setMensagensErros({ ...mensagensErros, nome: 'O nome da pasta é obrigatório' });
      return;
    }

    // Verificar se o usuário já existe (Provissorio)
    const userIdExiste = await fetch('/api/user?email=admin@example.com')
    if (!userIdExiste) {
      console.log('Usuário não encontrado');
      return;
    }

    const user = await userIdExiste.json();

    // Lógica para criar a nova pasta
    const response = await fetch('/api/folders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newFolderName,
        userId: user.id,
        selectedFolder
      }),
    });

    if (response.ok) {
      console.log('Nova pasta criada com sucesso');
      
      // Obter dados da pasta recém-criada
      const newFolder = await response.json();

      // Fechar o diálogo e limpar o formulário
      setIsDialogVisible(false);
      setNewFolderName('');
      setMensagensErros({});

      // Recarregar a árvore de pastas e selecionar a nova pasta
      if (folderTreeRef.current) {
        // Recarregar a árvore de pastas
        await folderTreeRef.current.reloadFolders();
        
        // Selecionar a nova pasta após um pequeno delay para garantir que a árvore foi atualizada
        setTimeout(() => {
          if (newFolder && newFolder.id) {
            folderTreeRef.current?.selectFolder(newFolder.id);
          }
        }, 100);
      }
    } else {
      console.error('Erro ao criar nova pasta');
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
                  text raised
                />
                <h2 className="text-xl font-bold text-white flex items-center">
                  <i className="pi pi-folder mr-2 text-yellow-500"></i>
                  Pastas
                </h2>
              </div>
              <FolderTree 
                ref={folderTreeRef}
                onFolderSelect={handleFolderSelect} 
              />
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
      <Dialog
        header="Atenção"
        visible={isAlertVisible}
        style={{ width: '500px', maxWidth: '98vw' }}
        modal
        onHide={() => setIsAlertVisible(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button label="Entendi" onClick={() => setIsAlertVisible(false)} className="p-button-primary" />
          </div>
        }
      >
        <div className="p-fluid">
          <p className="text-lg">{mensagemAlerta}</p>
        </div>
      </Dialog>

      <Dialog
        header="Nova Pasta"
        visible={isDialogVisible}
        style={{ width: '500px', maxWidth: '98vw' }}
        modal
        onHide={() => setIsDialogVisible(false)}
        footer={
          <div className="flex justify-end gap-4">
            <Button label="Cancelar" onClick={() => setIsDialogVisible(false)} severity='danger' outlined className="p-2" />
            <Button label="Criar" onClick={createNewFolder} className="p-button-primary p-2" text raised autoFocus/>
          </div>
        }
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="newFolderName" className="p-d-block sr-only">Nova pasta</label>
            <input
              id="newFolderName"
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="p-inputtext p-component text-lg w-full py-2 px-4"
              placeholder="Nome da nova pasta"
            />
          </div>
          {mensagensErros.nome && newFolderName.length === 0 && (
            <small className="p-error block mt-2">{mensagensErros.nome}</small>
          )}
        </div>
      </Dialog>
    </main>
  );
}
