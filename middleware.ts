import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    
    // Se está em página de auth e já está logado, redireciona para marketplace
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/marketplace', req.url))
    }

    // Se não está logado e tenta acessar área privada, redireciona para login
    if (!isAuth && !isAuthPage) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => true
    },
  }
)

// Apenas rotas protegidas (não inclui /, /marketplace, etc)
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/vendedor/:path*',
    '/checkout/:path*',
    '/grow-virtual/:path*',
    '/meus-pedidos/:path*',
    '/perfil/:path*',
    '/auth/signin',
    '/auth/signup'
  ]
}