import { getServerSession } from 'next-auth'
import { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

interface ExtendedUser extends User {
  id: string
  email: string
  name: string
  role: string
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
          role: user.role,
          avatar: user.avatar,
          isSeller: !!user.sellerProfile
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser
        token.id = extendedUser.id
        token.role = extendedUser.role
        token.isSeller = extendedUser.isSeller
      }
      return token
    },
    async session({ session, token }) {
      // Type assertion para evitar erro de tipagem
      const user = session.user as {
        id: string
        name: string
        email: string
        role: string
        isSeller: boolean
      }
      
      user.id = token.id as string
      user.role = token.role as string
      user.isSeller = token.isSeller as boolean
      
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
