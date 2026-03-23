import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function resetVendedorPassword() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'vendedor@desapegrow.com' }
    });

    if (!user) {
      console.log('❌ Usuário não encontrado!');
      return;
    }

    const newPassword = 'senha123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    console.log('✅ Senha resetada com sucesso!');
    console.log(`📧 Email: ${user.email}`);
    console.log(`🔑 Nova senha: ${newPassword}`);
    console.log(`\n🔗 Acesse: http://localhost:3000/auth/signin`);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Erro:', message);
  } finally {
    await prisma.$disconnect();
  }
}

resetVendedorPassword();
