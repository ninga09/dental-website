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
                console.warn('Skipping DB exec during build phase');
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
            console.log('Database tables verified/created successfully.');
        } catch (e) {
            if (process.env.NEXT_PHASE === 'phase-production-build') {
                console.warn('DB initialization failed during build, ignoring...');
            } else {
                console.error('CRITICAL: DB initialization failed!', e);
                initializationPromise = null; // Allow retry on next request
                throw e;
            }
        }
        return db;
    })();

    return initializationPromise;
}

export { prisma };
export default db;
