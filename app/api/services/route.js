import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDb();
        const services = await db.all('SELECT * FROM services');
        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { id, title, description, image } = await request.json();
        const db = await getDb();

        if (id) {
            await db.run(
                'UPDATE services SET title = ?, description = ?, image = ? WHERE id = ?',
                [title, description, image, id]
            );
            return NextResponse.json({ id, title, description, image });
        } else {
            const result = await db.run(
                'INSERT INTO services (title, description, image) VALUES (?, ?, ?)',
                [title, description, image]
            );
            return NextResponse.json({ id: result.lastID, title, description, image }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update services' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        const db = await getDb();
        await db.run('DELETE FROM services WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Service deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
