import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const db = await getDb();
        const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

        if (user) {
            // Await cookies() for modern Next.js versions
            const cookieStore = await cookies();
            cookieStore.set('admin_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/'
            });

            return NextResponse.json({ message: 'Login successful', role: user.role });
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        console.error('Auth API Error:', error);
        return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
    }
}
