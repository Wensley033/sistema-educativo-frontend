import { NextResponse } from 'next/server';

/**
 * Rutas públicas que no requieren autenticación
 */
const publicRoutes = ['/'];

/**
 * Middleware para proteger rutas
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Verificar si es una ruta pública
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // TODO: Implementar validación real de token cuando el backend esté listo
  // Por ahora, permitimos acceso a todas las rutas para desarrollo
  // El middleware de cookies no funciona con localStorage del cliente

  // Descomentar esto cuando tengas autenticación JWT real desde el backend:
  /*
  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  */

  return NextResponse.next();
}

/**
 * Configuración de rutas que serán procesadas por el middleware
 */
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * - api (API routes)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
