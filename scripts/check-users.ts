import { prisma } from '../src/lib/prisma';

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });
    
    console.log(`\n📊 Total de usuários: ${users.length}\n`);
    
    users.forEach((user, idx) => {
      console.log(`${idx + 1}. ${user.name} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Criado em: ${user.createdAt}\n`);
    });
    
    // Verificar se o usuário da sessão existe
    const sessionUserId = 'cmjok8p140000ijqwucz0tcow';
    const sessionUser = await prisma.user.findUnique({
      where: { id: sessionUserId }
    });
    
    console.log(`\n🔍 Verificando usuário da sessão (${sessionUserId}):`);
    if (sessionUser) {
      console.log(`   ✅ ENCONTRADO: ${sessionUser.name} (${sessionUser.email})`);
    } else {
      console.log(`   ❌ NÃO ENCONTRADO - Este é o problema!`);
      console.log(`   A sessão tem um userId que não existe no banco de dados.`);
    }
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Erro:', message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
