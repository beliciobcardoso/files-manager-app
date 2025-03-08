import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);
const passwordHash = bcrypt.hashSync("12345678", salt);

const prisma = new PrismaClient();

async function main() {
  try {
    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    let userId: string;

    if (!existingUser) {
      // Cria um usuário padrão
      const user = await prisma.user.create({
        data: {
          name: 'Admin',
          email: 'admin@example.com',
          passwordHash,
        },
      });
      console.log(`Usuário padrão criado com ID: ${user.id}`);
      userId = user.id;
    } else {
      console.log('Usuário padrão já existe, usando o existente.');
      userId = existingUser.id;
    }

    // Verifica se já existem pastas
    const existingFolders = await prisma.folder.findMany();

    if (existingFolders.length === 0) {
      console.log('Criando estrutura de pastas...');

      // Criar pastas root
      const root = await prisma.folder.create({
        data: {
          key: '0',
          name: 'ROOT',
          path: '/',
          userId: userId,
          parentKey: null,
        },
      });

      // Criar pastas principais
      const documentos = await prisma.folder.create({
        data: {
          key: '1',
          name: 'Documentos',
          path: '/Documentos',
          parentKey: '0',
          userId: userId,
        },
      });

      const imagens = await prisma.folder.create({
        data: {
          key: '2',
          name: 'Imagens',
          path: '/Imagens',
          parentKey: '0',
          userId: userId,
        },
      });

      const downloads = await prisma.folder.create({
        data: {
          key: '3',
          name: 'Downloads',
          path: '/Downloads',
          parentKey: '0',
          userId: userId,
        },
      });


      console.log('Estrutura de pastas criada com sucesso!');

    } else {
      console.log('Pastas já existem, pulando criação.');
    }

    // if (existingFolders.length === 0) {
    //   console.log('Criando estrutura de pastas...');

    //   // Criar pastas principais
    //   const documentos = await prisma.folder.create({
    //     data: {
    //       key: '1',
    //       name: 'Documentos',
    //       path: '/Documentos',
    //       parentKey: '0',
    //       userId: userId,
    //     },
    //   });

    //   const imagens = await prisma.folder.create({
    //     data: {
    //       key: '2',
    //       name: 'Imagens',
    //       path: '/Imagens',
    //       parentKey: '0',
    //       userId: userId,
    //     },
    //   });

    //   const downloads = await prisma.folder.create({
    //     data: {
    //       key: '3',
    //       name: 'Downloads',
    //       path: '/Downloads',
    //       parentKey: '0',
    //       userId: userId,
    //     },
    //   });

    //   // Criar subpastas para Documentos
    //   const trabalho = await prisma.folder.create({
    //     data: {
    //       key: '11',
    //       name: 'Trabalho',
    //       path: '/Documentos/Trabalho',
    //       parentKey: documentos.key,
    //       userId: userId,
    //     },
    //   });

    //   const pessoal = await prisma.folder.create({
    //     data: {
    //       key: '12',
    //       name: 'Pessoal',
    //       path: '/Documentos/Pessoal',
    //       parentKey: documentos.key,
    //       userId: userId,
    //     },
    //   });

    //   // Criar subpastas para Trabalho
    //   const projetos = await prisma.folder.create({
    //     data: {
    //       key: '111',
    //       name: 'Projetos',
    //       path: '/Documentos/Trabalho/Projetos',
    //       parentKey: trabalho.key,
    //       userId: userId,
    //     },
    //   });

    //   // Criar subpastas para Projetos
    //   const desenvolvimento = await prisma.folder.create({
    //     data: {
    //       key: '1111',
    //       name: 'Desenvolvimento',
    //       path: '/Documentos/Trabalho/Projetos/Desenvolvimento',
    //       parentKey: projetos.key,
    //       userId: userId,
    //     },
    //   });

    //   const testes = await prisma.folder.create({
    //     data: {
    //       key: '1112',
    //       name: 'Testes',
    //       path: '/Documentos/Trabalho/Projetos/Testes',
    //       parentKey: projetos.key,
    //       userId: userId,
    //     },
    //   });

    //   const implantacao = await prisma.folder.create({
    //     data: {
    //       key: '1113',
    //       name: 'Implantação',
    //       path: '/Documentos/Trabalho/Projetos/Implantação',
    //       parentKey: projetos.key,
    //       userId: userId,
    //     },
    //   });

    //   // Criar subpastas para Desenvolvimento
    //   const frontend = await prisma.folder.create({
    //     data: {
    //       key: '11111',
    //       name: 'Frontend',
    //       path: '/Documentos/Trabalho/Projetos/Desenvolvimento/Frontend',
    //       parentKey: desenvolvimento.key,
    //       userId: userId,
    //     },
    //   });

    //   const backend = await prisma.folder.create({
    //     data: {
    //       key: '11112',
    //       name: 'Backend',
    //       path: '/Documentos/Trabalho/Projetos/Desenvolvimento/Backend',
    //       parentKey: desenvolvimento.key,
    //       userId: userId,
    //     },
    //   });

    //   // Criar subpastas para Imagens
    //   const ferias = await prisma.folder.create({
    //     data: {
    //       key: '21',
    //       name: 'Férias',
    //       path: '/Imagens/Férias',
    //       parentKey: imagens.key,
    //       userId: userId,
    //     },
    //   });

    //   const familia = await prisma.folder.create({
    //     data: {
    //       key: '22',
    //       name: 'Família',
    //       path: '/Imagens/Família',
    //       parentKey: imagens.key,
    //       userId: userId,
    //     },
    //   });

    //   console.log('Estrutura de pastas criada com sucesso!');
    // } else {
    //   console.log('Pastas já existem, pulando criação.');
    // }

  } catch (error) {
    console.error('Erro ao executar seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });