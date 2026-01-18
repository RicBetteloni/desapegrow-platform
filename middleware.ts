import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware para bloquear trackers/malware ANTES de processar
export function middleware(req: NextRequest) {
  // Bloquear silenciosamente requisições de tracking/malware
  const blockedPaths = [
    'hybridaction',
    'zybTrackerStatistics',
    '.well-known/appspecific'
  ]
  
  if (blockedPaths.some(path => req.nextUrl.pathname.includes(path))) {
    return new NextResponse(null, { status: 204 }) // 204 No Content - silencioso
  }
  
  // Continua com lógica de autenticação apenas para rotas protegidas
  const protectedRoutes = [
    '/dashboard',
    '/vendedor',
    '/checkout',
    '/grow-virtual',
    '/meus-pedidos',
    '/perfil'
  ]
  
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  
  if (!isProtectedRoute) {
    return NextResponse.next()
  }
  
  // Aqui você pode adicionar lógica de auth se necessário
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Matcher para TODAS as requisições
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}