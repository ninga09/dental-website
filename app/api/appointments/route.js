import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDb();
        const rows = await db.all('SELECT * FROM appointments ORDER BY date DESC');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const db = await getDb();

        // If data has an ID, it's an update (status change, etc.)
        if (data.id) {
            await db.run(
                'UPDATE appointments SET status = ?, date = ?, time = ? WHERE id = ?',
                [data.status, data.date, data.time, data.id]
            );
            return NextResponse.json({ message: 'Appointment updated successfully' });
        }

        // Otherwise, it's a new booking
        const result = await db.run(
            `INSERT INTO appointments (patient_name, email, phone, doctor_id, service, date, time) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [data.name, data.email, data.phone, data.doctor, data.service, data.date, data.time]
        );

        return NextResponse.json({ message: 'Appointment booked successfully', id: result.lastID }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save appointment' }, { status: 500 });
    }
}
