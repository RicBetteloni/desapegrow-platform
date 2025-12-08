// scripts/reset-password.ts
/**
 * Script para resetar senha de um usuário
 * 
 * Uso:
 * npx tsx scripts/reset-password.ts
 */

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function resetPassword() {
  console.log('🔐 Script de Reset de Senha\n')
  console.log('=' .repeat(50))

  try {
    const email = 'joao.silva@example.com'
    const newPassword = 'senha123'

    console.log(`\n📧 Buscando usuário: ${email}`)
    
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log(`❌ Usuário não encontrado!`)
      return
    }

    console.log(`✅ Usuário encontrado: ${user.name}`)
    
    // Hash da nova senha
    console.log(`\n🔒 Gerando hash para nova senha...`)
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Atualizar senha
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    console.log(`✅ Senha atualizada com sucesso!`)
    console.log('\n' + '='.repeat(50))
    console.log('📝 CREDENCIAIS DE LOGIN:')
    console.log(`   Email: ${email}`)
    console.log(`   Senha: ${newPassword}`)
    console.log('\n🌐 Acesse: http://localhost:3000/auth/signin')
    console.log('=' .repeat(50))

  } catch (error) {
    console.error('\n❌ ERRO:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetPassword().catch(console.error)