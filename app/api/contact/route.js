import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDb();
        const rows = await db.all('SELECT * FROM contact_messages ORDER BY created_at DESC');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const db = await getDb();

        await db.run(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [data.name, data.email, data.subject, data.message]
        );

        return NextResponse.json({ message: 'Message sent successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
