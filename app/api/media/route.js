import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDb();
        const rows = await db.all('SELECT * FROM media ORDER BY created_at DESC');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const db = await getDb();

        if (data.id) {
            // Update visibility
            await db.run(
                'UPDATE media SET visible_on_home = ? WHERE id = ?',
                [data.visible_on_home, data.id]
            );
            return NextResponse.json(data);
        } else {
            // Add new media
            const result = await db.run(
                'INSERT INTO media (name, url, type, visible_on_home) VALUES (?, ?, ?, ?)',
                [data.name, data.url, 'image', data.visible_on_home || 0]
            );
            return NextResponse.json({ ...data, id: result.lastID }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        const db = await getDb();
        await db.run('DELETE FROM media WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
