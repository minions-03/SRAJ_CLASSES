import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/mail';

export async function POST(request) {
    try {
        const { name, email, phone, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required.' },
                { status: 400 }
            );
        }

        await sendContactEmail(name, email, message, phone);

        return NextResponse.json(
            { message: 'Message sent successfully.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in contact API:', error);
        return NextResponse.json(
            { error: 'Failed to send message.' },
            { status: 500 }
        );
    }
}
