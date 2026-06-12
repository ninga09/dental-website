import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const db = await getDb();
        const rows = await db.all('SELECT * FROM content');
        const content = {};
        rows.forEach(row => {
            content[row.section] = JSON.parse(row.data);
        });
        return NextResponse.json(content);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const newContent = await request.json();
        const db = await getDb();

        for (const section in newContent) {
            await db.run(
                'INSERT INTO content (section, data) VALUES (?, ?) ON CONFLICT(section) DO UPDATE SET data = excluded.data',
                [section, JSON.stringify(newContent[section])]
            );
        }

        return NextResponse.json(newContent, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }
}
