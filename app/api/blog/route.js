import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const db = await getDb();
        const rows = await db.all('SELECT * FROM blog_posts ORDER BY date DESC');
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
            // Update
            await db.run(
                'UPDATE blog_posts SET title = ?, excerpt = ?, content = ?, image = ?, status = ?, slug = ? WHERE id = ?',
                [data.title, data.excerpt, data.content, data.image, data.status, data.slug, data.id]
            );
            return NextResponse.json(data);
        } else {
            // Create
            const result = await db.run(
                'INSERT INTO blog_posts (title, excerpt, content, image, status, slug, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [data.title, data.excerpt, data.content, data.image, data.status || 'Published', data.slug, new Date().toISOString().split('T')[0]]
            );
            return NextResponse.json({ ...data, id: result.lastID }, { status: 201 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        const db = await getDb();
        await db.run('DELETE FROM blog_posts WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
