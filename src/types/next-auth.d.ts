import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      isSeller: boolean
      avatar?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    avatar?: string | null
    isSeller?: boolean
    gameProfile?: unknown
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    isSeller: boolean
  }
}
