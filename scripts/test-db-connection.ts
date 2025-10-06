// scripts/test-db-connection.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔗 Tentando conectar ao banco de dados...')
  try {
    await prisma.$connect()
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!')
  } catch (error) {
    console.error('❌ Erro de conexão com o banco de dados.')
    console.error('Detalhes do erro:', error)
    console.error('\n--- Dicas de troubleshooting ---')
    console.error('1. Verifique se a DATABASE_URL no seu .env.local está correta.')
    console.error('2. Certifique-se de que não há erros de digitação (usuário, senha, host).')
    console.error('3. Verifique se o banco de dados está online (no painel da Neon).')
    console.error('4. O problema pode ser um firewall ou VPN.')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()