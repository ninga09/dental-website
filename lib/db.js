import { PrismaClient } from '@prisma/client';
import path from 'path';
import os from 'os';

// Use /tmp for the database on Render to ensure write access
const dbPath = path.join(os.tmpdir(), 'dental.db');

const prisma = new PrismaClient({
    datasourceUrl: `file:${dbPath}`
});

const db = {
    all: async (sql, params = []) => {
        try {
            return await prisma.$queryRawUnsafe(sql, ...params);
        } catch (error) {
            console.error('DB Error (all):', error, sql);
            throw error;
        }
    },
    run: async (sql, params = []) => {
        try {
            const result = await prisma.$executeRawUnsafe(sql, ...params);
            let lastID = null;
            if (sql.toLowerCase().includes('insert')) {
                const lastIdResult = await prisma.$queryRawUnsafe('SELECT last_insert_rowid() as id');
                lastID = Number(lastIdResult[0].id);
            }
            return { lastID, changes: result };
        } catch (error) {
            console.error('DB Error (run):', error, sql);
            throw error;
        }
    },
    get: async (sql, params = []) => {
        try {
            const results = await prisma.$queryRawUnsafe(sql, ...params);
            return results[0] || null;
        } catch (error) {
            console.error('DB Error (get):', error, sql);
            throw error;
        }
    },
    exec: async (sql) => {
        try {
            return await prisma.$executeRawUnsafe(sql);
        } catch (error) {
            if (process.env.NEXT_PHASE === 'phase-production-build') {
                return null;
            }
            console.error('DB Error (exec):', error);
            throw error;
        }
    }
};

let initializationPromise = null;

export async function getDb() {
    if (initializationPromise) return initializationPromise;

    initializationPromise = (async () => {
        const tables = [
            `CREATE TABLE IF NOT EXISTS doctors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, specialty TEXT, image TEXT, bio TEXT, status TEXT DEFAULT 'Active')`,
            `CREATE TABLE IF NOT EXISTS media (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, url TEXT, type TEXT, visible_on_home INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
            `CREATE TABLE IF NOT EXISTS services (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, image TEXT)`,
            `CREATE TABLE IF NOT EXISTS blog_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE, title TEXT, excerpt TEXT, content TEXT, date TEXT, image TEXT, status TEXT DEFAULT 'Published')`,
            `CREATE TABLE IF NOT EXISTS testimonials (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, rating INTEGER, comment TEXT, status TEXT DEFAULT 'Pending')`,
            `CREATE TABLE IF NOT EXISTS content (id INTEGER PRIMARY KEY AUTOINCREMENT, section TEXT UNIQUE, data TEXT)`,
            `CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY AUTOINCREMENT, patient_name TEXT, email TEXT, phone TEXT, doctor_id INTEGER, service TEXT, date TEXT, time TEXT, status TEXT DEFAULT 'Pending')`,
            `CREATE TABLE IF NOT EXISTS contact_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, subject TEXT, message TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
            `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT, status TEXT DEFAULT 'Active')`
        ];

        try {
            for (const query of tables) {
                await db.exec(query);
            }

            // EXTENSIVE AUTO-SEEDING FOR RENDER
            const userCount = await db.get('SELECT COUNT(*) as count FROM users');
            if (userCount.count === 0) {
                console.log('Detected fresh database. Performing comprehensive auto-seeding...');

                // Seed Essential Content
                await db.run('INSERT INTO content (section, data) VALUES (?, ?)', ['clinicName', JSON.stringify('Royal Care Dental')]);
                await db.run('INSERT INTO content (section, data) VALUES (?, ?)', ['contact', JSON.stringify({
                    phone: '+254 700 000 000',
                    email: 'info@royalcaredental.co.ke',
                    address: 'Nairobi, Kenya',
                    whatsapp: '254700000000',
                    hours: {
                        weekdays: '8:00 AM - 6:00 PM',
                        saturday: '9:00 AM - 2:00 PM',
                        sunday: 'Closed'
                    }
                })]);
                await db.run('INSERT INTO content (section, data) VALUES (?, ?)', ['homepage', JSON.stringify({
                    headline: 'Welcome to Royal Care Dental',
                    subtext: 'Your smile, our passion. Expert care for a lifetime of healthy teeth.'
                })]);
                await db.run('INSERT INTO content (section, data) VALUES (?, ?)', ['about', JSON.stringify({
                    title: 'Excellence in Dental Care',
                    mission: 'To provide premium, personalized dental care...',
                    history: 'Established with a vision to redefine oral healthcare...'
                })]);

                // Seed Users
                const usersToSeed = [
                    ['Super Admin', 'alice@clinic.com', 'admin123', 'Super Admin'],
                    ['Clinic Admin', 'admin@royalcaredental.co.ke', 'admin123', 'admin'],
                    ['Global Admin', 'admin@premiumdental.com', 'admin123', 'admin']
                ];
                for (const u of usersToSeed) {
                    await db.run('INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', u);
                }

                // Seed Sample Doctors
                const sampleDoctors = [
                    ['Dr. Alice Smith', 'Orthodontics', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400', '15 years of experience creating beautiful smiles.'],
                    ['Dr. Bob Johnson', 'Implantology', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400', 'Specialist in dental implants and restorative dentistry.'],
                    ['Dr. Clara Lee', 'Pediatric Dentistry', 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=400', 'Passionate about gentle care for children.'],
                    ['Dr. Kamau', 'Dentist', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400', 'Expert in family dentistry and oral health education.']
                ];
                for (const d of sampleDoctors) {
                    await db.run('INSERT INTO doctors (name, specialty, image, bio) VALUES (?, ?, ?, ?)', d);
                }

                // Seed Sample Services
                const sampleServices = [
                    ['Orthodontics', 'Professional braces and alignment treatments for all ages.', 'https://images.unsplash.com/photo-1599700403969-fce01d77f563?auto=format&fit=crop&q=80&w=800'],
                    ['Dental Implants', 'Permanent solutions for missing teeth with high-quality implants.', 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800'],
                    ['Teeth Whitening', 'Brighten your smile with our professional whitening procedures.', 'https://images.unsplash.com/photo-1468493858157-0da44aaf1d13?auto=format&fit=crop&q=80&w=800']
                ];
                for (const s of sampleServices) {
                    await db.run('INSERT INTO services (title, description, image) VALUES (?, ?, ?)', s);
                }

                // Seed Testimonials
                const sampleTestimonials = [
                    ['Sarah J.', 5, 'The best dental experience I have ever had. The team is professional and the facility is top-notch.', 'Approved'],
                    ['Michael R.', 5, 'Highly recommend for orthodontic work. Dr. Alice is fantastic and very detailed throughout the entire process.', 'Approved'],
                    ['Elizabeth W.', 4, 'Very friendly atmosphere and excellent results with my teeth whitening. Will definitely be coming back.', 'Approved']
                ];
                for (const t of sampleTestimonials) {
                    await db.run('INSERT INTO testimonials (name, rating, comment, status) VALUES (?, ?, ?, ?)', t);
                }

                console.log('Auto-seeding completed successfully.');
            }

            console.log('Database tables verified/created successfully.');
        } catch (e) {
            if (process.env.NEXT_PHASE === 'phase-production-build') {
                console.warn('DB initialization failed during build, ignoring...');
            } else {
                console.error('CRITICAL: DB initialization failed!', e);
                initializationPromise = null;
                throw e;
            }
        }
        return db;
    })();

    return initializationPromise;
}

export { prisma };
export default db;
