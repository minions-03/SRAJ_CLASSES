import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    const token = request.cookies.get('admin_token')?.value;
    const { pathname } = request.nextUrl;

    // List of protected routes
    const protectedRoutes = ['/dashboard', '/students', '/billing', '/invoices', '/reports', '/settings'];

    // Check if the current route starts with any of the protected routes
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            console.error('JWT Verification failed:', error);
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('admin_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/students/:path*', '/billing/:path*', '/invoices/:path*', '/reports/:path*', '/settings/:path*'],
};
