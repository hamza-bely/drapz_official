import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
    const isAdminPage = request.nextUrl.pathname.startsWith('/admindrapz');

    if (!token && !isAuthPage && !isAdminPage) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admindrapz/:path*', '/auth/:path*'],
};