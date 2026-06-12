import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get('admin_session');

    // Protect all /admin routes except /admin/login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
