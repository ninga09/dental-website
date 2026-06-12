import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDb();
        const users = await db.all('SELECT id, name, email, role, status FROM users');
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const db = await getDb();

        if (data.id) {
            await db.run(
                'UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?',
                [data.name, data.email, data.role, data.status, data.id]
            );
            return NextResponse.json(data);
        } else {
            const result = await db.run(
                'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
                [data.name, data.email, data.password || 'password123', data.role, data.status]
            );
            return NextResponse.json({ ...data, id: result.lastID }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
