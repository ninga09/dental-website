import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDb();
        const doctors = await db.all('SELECT * FROM doctors');
        return NextResponse.json(doctors);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { id, name, specialty, bio, image, status } = await request.json();
        const db = await getDb();

        if (id) {
            await db.run(
                'UPDATE doctors SET name = ?, specialty = ?, bio = ?, image = ?, status = ? WHERE id = ?',
                [name, specialty, bio, image, status || 'Active', id]
            );
            return NextResponse.json({ id, name, specialty, bio, image, status: status || 'Active' });
        } else {
            const result = await db.run(
                'INSERT INTO doctors (name, specialty, bio, image, status) VALUES (?, ?, ?, ?, ?)',
                [name, specialty, bio, image, status || 'Active']
            );
            return NextResponse.json({ id: result.lastID, name, specialty, bio, image, status: status || 'Active' }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update doctors' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        const db = await getDb();
        await db.run('DELETE FROM doctors WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
