'use client';
import { useEffect, useState } from 'react';
import { Tree } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import { ProgressSpinner } from 'primereact/progressspinner';
import type { FolderType } from '@/app/lib/types';
import { Button } from 'primereact/button';

// CSS mais agressivo para forçar o recuo
const customStyles = `
  .custom-tree .p-treenode-children {
    margin-left: 2rem !important;
    padding-left: 1rem !important;
    border-left: 1px dashed rgba(255, 255, 255, 0.2);
  }
`;

interface FolderTreeProps {
  onFolderSelect: (folder: FolderType) => void;
}

export default function FolderTree({ onFolderSelect }: FolderTreeProps) {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>({'1': true});
  const [loading, setLoading] = useState<boolean>(true);

  const expandAll = () => {
    let _expandedKeys = {};

    for (let node of nodes) {
      expandNode(node, _expandedKeys);
    }

    setExpandedKeys(_expandedKeys);
    updateNodeIcons(_expandedKeys);
  };

  const collapseAll = () => {
    setExpandedKeys({});
    updateNodeIcons({});
  };

  const expandNode = (node: TreeNode, _expandedKeys: { [key: string]: boolean }) => {  
    if (node.children && node.children.length) {
      if(node.key === undefined) {
        return
      }
      _expandedKeys[node.key] = true;

      for (let child of node.children) {
        expandNode(child, _expandedKeys);
      }
    }
  };

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/folders');
        if (!response.ok) throw new Error('Falha ao carregar pastas');

        const data = await response.json();
        const treeNodes = buildTreeNodes(data);

        setNodes(treeNodes);
      } catch (error) {
        console.error('Erro ao carregar estrutura de pastas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, []);

  const buildTreeNodes = (folders: FolderType[]): TreeNode[] => {
    // Função recursiva para construir a estrutura da árvore
    const buildNode = (folder: FolderType): TreeNode => {
      const isExpanded = expandedKeys[folder.key || ''] || false;
      const hasChildren = folder.subfolders && folder.subfolders.length > 0;

      return {
        key: folder.id,
        label: folder.name,
        data: folder,
        icon: hasChildren 
        ? (!isExpanded ? 'pi pi-folder-open text-yellow-500' : 'pi pi-folder text-yellow-300')
        : 'pi pi-folder text-yellow-100',
        children: folder.subfolders?.map((subfolder) => buildNode(subfolder)) || []
      };
    };
    return folders.map(folder => buildNode(folder));
  };

  // Função para atualizar os ícones das pastas com base no estado de expansão
  const updateNodeIcons = (expandedKeysMap: { [key: string]: boolean }) => {
    // Função recursiva para atualizar os ícones dos nós
    const updateIcon = (nodeList: TreeNode[]): TreeNode[] => {
      return nodeList.map(node => {
        const isExpanded = node.key ? expandedKeysMap[node.key] : false;
        const hasChildren = node.children && node.children.length > 0;
        
        // Atualiza o ícone com base no estado de expansão e se tem filhos
        const updatedNode = {
          ...node,
          icon: hasChildren 
            ? (isExpanded ? 'pi pi-folder-open text-yellow-500' : 'pi pi-folder text-yellow-300')
            : 'pi pi-folder text-yellow-100'
        };
        
        // Atualiza recursivamente os nós filhos
        if (updatedNode.children && updatedNode.children.length > 0) {
          updatedNode.children = updateIcon(updatedNode.children);
        }
        
        return updatedNode;
      });
    };
    
    setNodes(prevNodes => updateIcon([...prevNodes]));
  };

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const handleSelectionChange = (e: any) => {
    // Para modo de seleção única, o valor é uma string direta
    const newKey = e.value;
    setSelectedKey(newKey);

    if (newKey) {
      const selectedTreeNode = findNodeByKey(nodes, newKey);

      if (selectedTreeNode && selectedTreeNode.data) {
        onFolderSelect(selectedTreeNode.data);
      }
    }
  };

  const findNodeByKey = (nodes: TreeNode[], key: string): TreeNode | null => {
    for (let node of nodes) {
      if (node.key === key) return node;
      if (node.children) {
        const foundInChildren = findNodeByKey(node.children, key);
        if (foundInChildren) return foundInChildren;
      }
    }
    return null;
  };

  // Função para lidar com a expansão/contração manual das pastas
  const handleToggle = (e: any) => {
    const newExpandedKeys = e.value;
    setExpandedKeys(newExpandedKeys);
    
    // Atualiza os ícones quando o estado de expansão muda
    updateNodeIcons(newExpandedKeys);
  };

  // Atualiza os ícones quando o componente é montado
  useEffect(() => {
    if (nodes.length > 0) {
      updateNodeIcons(expandedKeys);
    }
  }, [nodes.length]);

  return (
    <div className="">
      {/* Inserindo os estilos CSS customizados */}
      <style jsx global>{customStyles}</style>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-6">
          <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" fill="var(--surface-ground)" animationDuration=".8s" />
          <span className="mt-3 text-gray-300">Carregando pastas...</span>
        </div>
      ) : (
        <>
        <div className='gap-2 flex'>
          <Button label="" icon="pi pi-plus" className="mb-3" onClick={expandAll} text raised />
          <Button label="" icon="pi pi-minus" className="mb-3" onClick={collapseAll} text raised />
        </div>
          <Tree
            value={nodes}
            expandedKeys={expandedKeys}
            onToggle={handleToggle}
            className="w-full custom-tree"
            selectionMode="single"
            selectionKeys={selectedKey}
            onSelectionChange={handleSelectionChange}
            pt={{
              root: { className: 'border border-slate-700/40 rounded-lg p-3 bg-slate-800/70 text-white shadow-md' },
              node: { className: 'text-white hover:bg-slate-700/50 rounded transition-colors duration-150' },
              content: { className: 'cursor-pointer py-1.5 px-2 rounded-md' },
              toggler: { className: 'text-gray-400 hover:text-white transition-colors' },
              nodeIcon: { className: 'mr-2' }
            }}
          />
        </>
      )}
    </div>
  );
}