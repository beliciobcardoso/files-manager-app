# Gerenciador de Arquivos

Este é um aplicativo de gerenciamento de arquivos desenvolvido com Next.js v14.2.24 e PrimeReact. Ele permite visualizar, organizar e gerenciar arquivos e pastas de forma intuitiva e eficiente.

## Funcionalidades

- 🗂️ Visualização de estrutura de pastas em árvore
- 📂 Navegação intuitiva entre pastas
- 📄 Visualização de arquivos de diferentes tipos (texto, imagens, PDF)
- 📤 Upload de arquivos
- 📩 Download de arquivos
- 🔄 Interface responsiva e amigável

## Tecnologias Utilizadas

- **Next.js 14.2.24**: Framework React com App Router
- **TypeScript**: Para tipagem segura
- **PrimeReact**: Componentes de UI
- **Tailwind CSS**: Para estilização

## Estrutura do Projeto

```
/app
  /api
    /files           # API para gerenciar arquivos
    /folders         # API para gerenciar pastas
  /components
    /FileManager
      FileViewer.tsx    # Visualização de arquivos
      FolderView.tsx    # Visualização do conteúdo das pastas
      FolderTree.tsx    # Árvore de pastas
  /lib
    /types.ts        # Tipos TypeScript
    /utils.ts        # Funções utilitárias
  layout.tsx         # Layout principal
  page.tsx           # Página principal do gerenciador
```

## Como Executar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para ver o aplicativo em execução.

## Melhorias Futuras

- Função de pesquisa de arquivos
- Operações em lote (seleção múltipla)
- Suporte para arrastar e soltar
- Histórico de operações
- Integração com serviços de armazenamento em nuvem

## Baseado em Next.js

Este projeto foi inicializado com [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) e utiliza as fontes [Geist](https://vercel.com/font) da Vercel.
