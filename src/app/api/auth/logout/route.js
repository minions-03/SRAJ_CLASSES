import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        (await cookies()).delete('admin_token');
        return NextResponse.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout API Error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
