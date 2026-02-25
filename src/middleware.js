import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // --- Protect admin dashboard routes ---
    const adminProtectedRoutes = ['/dashboard', '/students', '/invoices', '/reports', '/settings'];
    const isAdminRoute = adminProtectedRoutes.some(route => pathname.startsWith(route));

    if (isAdminRoute) {
        const adminToken = request.cookies.get('admin_token')?.value;
        if (!adminToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(adminToken, secret);
        } catch {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('admin_token');
            return response;
        }
    }

    // --- Protect student API routes ---
    if (pathname.startsWith('/api/student') && !pathname.includes('/login')) {
        const studentToken = request.cookies.get('student_token')?.value;
        if (!studentToken) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(studentToken, secret);
        } catch {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
    }

    // --- Protect student dashboard routes ---
    const studentProtectedRoutes = ['/student/dashboard', '/billing'];
    const isStudentRoute = studentProtectedRoutes.some(route => pathname.startsWith(route));

    if (isStudentRoute) {
        const studentToken = request.cookies.get('student_token')?.value;
        const adminToken = request.cookies.get('admin_token')?.value;

        // Either admin or student can see /billing
        if (pathname.startsWith('/billing')) {
            if (!studentToken && !adminToken) {
                return NextResponse.redirect(new URL('/student/login', request.url));
            }
        } else if (pathname.startsWith('/student/dashboard')) {
            if (!studentToken) {
                return NextResponse.redirect(new URL('/student/login', request.url));
            }
        }

        const tokenToVerify = studentToken || adminToken;
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(tokenToVerify, secret);
        } catch {
            const redirectUrl = pathname.startsWith('/billing') && !studentToken ? '/login' : '/student/login';
            const response = NextResponse.redirect(new URL(redirectUrl, request.url));
            if (studentToken) response.cookies.delete('student_token');
            return response;
        }
    }

    // --- Protect billing API routes (allow students to see their own) ---
    if (pathname.startsWith('/api/billing/')) {
        const adminToken = request.cookies.get('admin_token')?.value;
        const studentToken = request.cookies.get('student_token')?.value;

        if (!adminToken && !studentToken) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/students/:path*',
        '/billing/:path*',
        '/invoices/:path*',
        '/reports/:path*',
        '/settings/:path*',
        '/student/dashboard/:path*',
        '/api/student/:path*',
    ],
};
