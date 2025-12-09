import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const pathname = request.nextUrl.pathname;
    const isAuthPage = pathname.startsWith('/auth');
    const isAdminLoginPage = pathname === '/admin123';
    const isAdminPage = pathname.startsWith('/admin');

    // Pages publiques: auth et admin login
    if (isAuthPage || isAdminLoginPage) {
        // Si connecté et sur une page auth, rediriger vers l'accueil
        if (token && isAuthPage) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // Routes protégées pour utilisateurs connectés
    console.log(token)
    if (!token) {
        // Admin page: rediriger vers login admin
        if (isAdminPage) {
            return NextResponse.redirect(new URL('/admin123', request.url));
        }
    }

    // Si connecté, laisser passer (la vérification de rôle se fait côté client)
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/admin123', '/auth/:path*', '/profile/:path*', '/panier/:path*', '/catalogue/:path*', '/commande/:path*'],
};