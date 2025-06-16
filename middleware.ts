import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = [
  '/auth/dashboard',
  '/auth/registros',
  '/auth/planos',
  '/auth/equipe',
  '/auth/relatorios'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verifica se rota é protegida
  const requiresAuth = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (!requiresAuth) return NextResponse.next();

  // Cookie com token de auth (definido pelo cliente após login)
  const token = request.cookies.get('auth-token');

  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Aplicar middleware a todas as rotas exceto assets e rotas públicas
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)']
};
