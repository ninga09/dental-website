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
                    address: 'Royal Care Dental Service, Sixth Street, Eastleigh, Nairobi, Kenya',
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

                // Seed Comprehensive Services (21 Services)
                const dentalServices = [
                    ['General Dentistry', 'Comprehensive oral health care including examinations, diagnosis, treatment, and prevention of dental diseases.', 'https://images.unsplash.com/photo-1629909608135-4510b6fdb514?auto=format&fit=crop&q=80&w=800'],
                    ['Dental Checkups & Cleaning', 'Routine dental examinations and professional cleaning to maintain healthy teeth and gums.', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800'],
                    ['Teeth Whitening', 'Cosmetic treatment that removes stains and discoloration to improve the appearance of teeth.', 'https://images.unsplash.com/photo-1468493858157-0da44aaf1d13?auto=format&fit=crop&q=80&w=800'],
                    ['Dental Fillings', 'Restoration of teeth damaged by cavities using durable filling materials.', 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800'],
                    ['Root Canal Treatment', 'Treatment of infected tooth pulp to save the natural tooth and relieve pain.', 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=800'],
                    ['Tooth Extraction', 'Safe removal of damaged, decayed, or impacted teeth when necessary.', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800'],
                    ['Dental Implants', 'Permanent replacement of missing teeth using titanium implant technology.', 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800'],
                    ['Orthodontics (Braces)', 'Correction of misaligned teeth and bite issues using braces or aligners.', 'https://images.unsplash.com/photo-1599700403969-fce01d77f563?auto=format&fit=crop&q=80&w=800'],
                    ['Invisalign/Clear Aligners', 'Transparent aligners used to straighten teeth discreetly.', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'],
                    ['Pediatric Dentistry', 'Specialized dental care for infants, children, and adolescents.', 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=800'],
                    ['Gum Disease Treatment', 'Diagnosis and treatment of gingivitis, periodontitis, and other gum conditions.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800'],
                    ['Dentures', 'Custom-made removable replacements for missing teeth.', 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800'],
                    ['Dental Crowns & Bridges', 'Restoration solutions for damaged or missing teeth.', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800'],
                    ['Cosmetic Dentistry', 'Smile enhancement procedures including veneers, bonding, and reshaping.', 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&q=80&w=800'],
                    ['Dental Veneers', 'Thin porcelain shells applied to improve tooth appearance.', 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800'],
                    ['Emergency Dental Care', 'Immediate treatment for dental pain, trauma, broken teeth, and infections.', 'https://images.unsplash.com/photo-1516549221187-df9b4877bc3a?auto=format&fit=crop&q=80&w=800'],
                    ['Oral Surgery', 'Surgical procedures including wisdom tooth removal and corrective jaw treatments.', 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800'],
                    ['Digital Dental X-Rays', 'Advanced imaging technology for accurate diagnosis and treatment planning.', 'https://images.unsplash.com/photo-1516549221187-df9b4877bc3a?auto=format&fit=crop&q=80&w=800'],
                    ['Teeth Scaling & Polishing', 'Removal of plaque, tartar, and stains for improved oral hygiene.', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800'],
                    ['Oral Cancer Screening', 'Early detection and assessment of abnormal oral tissues and lesions.', 'https://images.unsplash.com/photo-1629909608135-4510b6fdb514?auto=format&fit=crop&q=80&w=800'],
                    ['Preventive Dentistry', 'Services focused on preventing cavities, gum disease, and other oral health problems.', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800']
                ];
                for (const s of dentalServices) {
                    await db.run('INSERT INTO services (title, description, image) VALUES (?, ?, ?)', s);
                }

                // Seed Testimonials
                const sampleTestimonials = [
                    ['Sarah J.', 5, 'The best dental experience I have ever had. The team is professional and the facility is top-notch.', 'Approved'],
                    ['Michael R.', 5, 'Highly recommend for orthodontic work. Dr. Alice is fantastic and very detailed throughout the entire process.', 'Approved'],
                    ['Elizabeth W.', 5, 'Very friendly atmosphere and excellent results with my teeth whitening. Will definitely be coming back.', 'Approved'],
                    ['Kamau N.', 5, 'The state-of-the-art technology they use is impressive. My root canal was completely painless.', 'Approved'],
                    ['Jessica M.', 4, 'Excellent pediatric care! My son actually looks forward to his dental visits now. Highly recommend.', 'Approved'],
                    ['David O.', 5, 'Professionalism at its best. They explained every step of my implant surgery clearly. Amazing results!', 'Approved'],
                    ['Linda W.', 5, 'Clean, modern clinic with a very welcoming team. Best dental checkup I have had in years.', 'Approved']
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
