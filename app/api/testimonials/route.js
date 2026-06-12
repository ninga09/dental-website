import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDb();
        const rows = await db.all('SELECT * FROM testimonials');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const list = await request.json();
        const db = await getDb();

        await db.run('DELETE FROM testimonials');
        for (const t of list) {
            await db.run(
                'INSERT INTO testimonials (id, name, rating, comment, status) VALUES (?, ?, ?, ?, ?)',
                [t.id, t.name, t.rating, t.comment, t.status]
            );
        }

        return NextResponse.json(list, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update testimonials' }, { status: 500 });
    }
}
