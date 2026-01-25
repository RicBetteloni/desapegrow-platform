import { getServerSession } from 'next-auth'
import { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

interface ExtendedUser extends User {
  id: string
  email: string
  name: string
  isAdmin: boolean
  avatar?: string | null
  isSeller: boolean
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciais inválidas')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            gameProfile: true,
            sellerProfile: true
          }
        })

        if (!user) {
          throw new Error('Usuário não encontrado')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Senha incorreta')
        }

        if (user.gameProfile) {
          await prisma.gameProfile.update({
            where: { userId: user.id },
            data: { lastLoginDate: new Date() }
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          avatar: user.avatar,
          isSeller: !!user.sellerProfile
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const extendedUser = user as ExtendedUser
        token.id = extendedUser.id
        token.email = extendedUser.email
        token.name = extendedUser.name
        token.isAdmin = extendedUser.isAdmin
        token.isSeller = extendedUser.isSeller
        
        console.log('🔑 JWT criado com ID:', token.id)
        
        // Buscar phone e avatar do banco no login
        const dbUser = await prisma.user.findUnique({
          where: { id: extendedUser.id },
          select: { phone: true, avatar: true }
        })
        if (dbUser) {
          token.phone = dbUser.phone
          token.avatar = dbUser.avatar
        }
      }
      
      // Se foi chamado update() manualmente, recarrega os dados do banco
      if (trigger === 'update') {
        console.log('🔄 JWT Update trigger - recarregando dados do banco...', session)
        
        if (token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            include: { sellerProfile: true }
          })
          if (dbUser) {
            token.name = dbUser.name
            token.email = dbUser.email
            token.phone = dbUser.phone
            token.isAdmin = dbUser.isAdmin
            token.isSeller = !!dbUser.sellerProfile
            console.log('✅ Token JWT atualizado:', { name: token.name, phone: token.phone })
          }
        }
      }
      
      return token
    },
    async session({ session, token }) {
      // SEMPRE incluir o ID do token na session
      if (token.id) {
        session.user.id = token.id as string
      }
      
      console.log('📋 Session callback - token.id:', token.id, 'session.user:', session.user)
      
      // Buscar dados do banco para garantir dados atualizados
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isAdmin: true,
            avatar: true,
            createdAt: true,
            sellerProfile: {
              select: { id: true }
            }
          }
        })
        
        if (dbUser) {
          session.user = {
            ...session.user,
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            phone: dbUser.phone,
            isAdmin: dbUser.isAdmin,
            avatar: dbUser.avatar,
            createdAt: dbUser.createdAt.toISOString(),
            isSeller: !!dbUser.sellerProfile
          }
        }
      }
      
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET
}

export async function getSession() {
  return await getServerSession(authOptions)
}
