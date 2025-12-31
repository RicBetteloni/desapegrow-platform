import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function resetAndCreateUser() {
  try {
    console.log('🔄 Preparando ambiente de testes...\n');
    
    // Verificar usuário existente
    const existingUser = await prisma.user.findUnique({
      where: { email: 'vendedor@desapegrow.com' }
    });
    
    if (existingUser) {
      console.log(`✅ Usuário já existe:`);
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Nome: ${existingUser.name}`);
      
      // Limpar VirtualGrow antigo se existir
      const oldGrow = await prisma.virtualGrow.findUnique({
        where: { userId: existingUser.id }
      });
      
      if (oldGrow) {
        console.log('\n🧹 Limpando VirtualGrow antigo...');
        // Limpar relacionamentos primeiro
        await prisma.virtualItem.deleteMany({
          where: { growId: oldGrow.id }
        });
        await prisma.virtualPlant.deleteMany({
          where: { growId: oldGrow.id }
        });
        await prisma.dailyRewardLog.deleteMany({
          where: { growId: oldGrow.id }
        });
        await prisma.virtualGrow.delete({
          where: { id: oldGrow.id }
        });
        console.log('✅ VirtualGrow antigo removido');
      }
    } else {
      console.log('\n⚠️ Usuário não encontrado. Criando novo usuário...');
      const hashedPassword = await bcrypt.hash('senha123', 10);
      
      const newUser = await prisma.user.create({
        data: {
          email: 'vendedor@desapegrow.com',
          name: 'Vendedor Teste',
          password: hashedPassword,
          role: 'SELLER'
        }
      });
      
      console.log(`✅ Usuário criado:`);
      console.log(`   ID: ${newUser.id}`);
      console.log(`   Email: ${newUser.email}`);
    }
    
    console.log('\n✅ Tudo pronto!');
    console.log('📋 Próximos passos:');
    console.log('   1. Limpar cookies do navegador (F12 > Application > Cookies)');
    console.log('   2. Acessar: http://localhost:3000/api/auth/signout');
    console.log('   3. Fazer login com: vendedor@desapegrow.com / senha123');
    console.log('   4. Testar o welcome pack em: http://localhost:3000/grow-virtual\n');
    
  } catch (error: any) {
    console.error('❌ Erro:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

resetAndCreateUser();
