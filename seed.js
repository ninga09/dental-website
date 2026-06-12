import { getDb } from './lib/db.js';
import fs from 'fs/promises';
import path from 'path';

async function seed() {
    const db = await getDb();
    const dataDir = path.join(process.cwd(), 'data');

    // Clear existing data to avoid conflicts with new schema
    await db.run('DELETE FROM doctors');
    await db.run('DELETE FROM content');
    await db.run('DELETE FROM services');
    await db.run('DELETE FROM users');

    // Seed Doctors
    const doctors = JSON.parse(await fs.readFile(path.join(dataDir, 'doctors.json'), 'utf8'));
    for (const doc of doctors) {
        await db.run(
            'INSERT INTO doctors (id, name, specialty, image, bio, status) VALUES (?, ?, ?, ?, ?, ?)',
            [doc.id, doc.name, doc.specialty, doc.image, doc.bio, doc.status || 'Active']
        );
    }

    // Seed Services
    const services = JSON.parse(await fs.readFile(path.join(dataDir, 'services.json'), 'utf8'));
    for (const s of services) {
        await db.run(
            'INSERT INTO services (id, title, description, image) VALUES (?, ?, ?, ?)',
            [s.id, s.title, s.description, s.image]
        );
    }


    // Seed Content
    const content = JSON.parse(await fs.readFile(path.join(dataDir, 'content.json'), 'utf8'));
    // We store clinicName as a separate row or inside a general settings section
    // but our API expects content[section]
    for (const key in content) {
        if (key === 'clinicName') {
            await db.run('INSERT INTO content (section, data) VALUES (?, ?)', [key, JSON.stringify(content[key])]);
        } else {
            await db.run('INSERT INTO content (section, data) VALUES (?, ?)', [key, JSON.stringify(content[key])]);
        }
    }

    // Seed Users
    await db.run(
        'INSERT OR IGNORE INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
        ['Admin Alice', 'alice@clinic.com', 'admin123', 'Super Admin', 'Active']
    );

    // Initial Media
    const initialMedia = [
        { name: 'Modern Clinic', url: 'https://images.unsplash.com/photo-1629909608135-4510b6fdb514?auto=format&fit=crop&q=80&w=1000', visible: 1 },
        { name: 'Our Team', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1000', visible: 1 },
        { name: 'Treatment Room', url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1000', visible: 1 },
        { name: 'Patient Smile', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000', visible: 0 }
    ];

    for (const m of initialMedia) {
        await db.run(
            'INSERT OR IGNORE INTO media (name, url, type, visible_on_home) VALUES (?, ?, ?, ?)',
            [m.name, m.url, 'image', m.visible]
        );
    }


    // Create admin user
    await db.run('INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Clinic Admin', 'admin@premiumdental.com', 'admin123', 'admin']);

    console.log('Database seeded successfully with clean data!');
    process.exit(0);

}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
