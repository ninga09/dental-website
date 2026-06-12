import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { cookies } from 'next/headers';

// Hardcoded fallback credentials for when DB seeding hasn't completed
const FALLBACK_ADMINS = [
    { email: 'alice@clinic.com', password: 'admin123', role: 'Super Admin' },
    { email: 'admin@royalcaredental.co.ke', password: 'admin123', role: 'admin' },
    { email: 'admin@premiumdental.com', password: 'admin123', role: 'admin' },
];

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        let user = null;

        // First try to find in the database
        try {
            const db = await getDb();
            user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        } catch (dbErr) {
            console.error('DB lookup failed, trying fallback:', dbErr.message);
        }

        // If not in DB, try hardcoded fallback admins
        if (!user) {
            user = FALLBACK_ADMINS.find(a => a.email === email && a.password === password);
        }

        if (user) {
            const cookieStore = await cookies();
            cookieStore.set('admin_session', JSON.stringify({ email: user.email, role: user.role }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/'
            });

            return NextResponse.json({ message: 'Login successful', role: user.role });
        }

        return NextResponse.json({ error: 'Invalid credentials. Use admin@royalcaredental.co.ke / admin123' }, { status: 401 });
    } catch (error) {
        console.error('Auth API Error:', error);
        return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
    }
}
