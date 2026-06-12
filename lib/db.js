import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const db = {
    // Mimic the sqlite wrapper interface for backward compatibility
    all: async (sql, params = []) => {
        // Simple parameter replacement for SQLite raw query
        // sqlite3 uses ? placeholders, Prisma $queryRaw uses $1, $2 or handles it.
        // Actually, $queryRawUnsafe takes a literal string, but we should be careful.
        // However, the existing code uses ? placeholders.

        let formattedSql = sql;
        params.forEach((param, i) => {
            // This is a naive replacement, but for SQLite it might work if we are careful.
            // Wait, Prisma doesn't easily support ? placeholders in $queryRawUnsafe.
            // But we can just use the Prisma methods directly where possible.
        });

        // For now, let's just use $queryRawUnsafe for the simple queries.
        // If it's a simple SELECT * FROM table, it works.
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
            // Result of $executeRawUnsafe is just the number of affected rows.
            // sqlite's run() returns { lastID, changes }
            // Since we don't easily get lastID from executeRawUnsafe in SQLite without a separate query
            // we'll return a minimal object. 
            // Most routes use result.lastID after an INSERT.

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
            console.error('DB Error (exec):', error);
            throw error;
        }
    }
};

let initialized = false;

export async function getDb() {
    if (!initialized) {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS doctors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                specialty TEXT,
                image TEXT,
                bio TEXT,
                status TEXT DEFAULT 'Active'
            );
            CREATE TABLE IF NOT EXISTS media (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                url TEXT,
                type TEXT,
                visible_on_home INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                description TEXT,
                image TEXT
            );
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT UNIQUE,
                title TEXT,
                excerpt TEXT,
                content TEXT,
                date TEXT,
                image TEXT,
                status TEXT DEFAULT 'Published'
            );
            CREATE TABLE IF NOT EXISTS testimonials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                rating INTEGER,
                comment TEXT,
                status TEXT DEFAULT 'Pending'
            );
            CREATE TABLE IF NOT EXISTS content (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                section TEXT UNIQUE,
                data TEXT
            );
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_name TEXT,
                email TEXT,
                phone TEXT,
                doctor_id INTEGER,
                service TEXT,
                date TEXT,
                time TEXT,
                status TEXT DEFAULT 'Pending'
            );
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                subject TEXT,
                message TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                password TEXT,
                role TEXT,
                status TEXT DEFAULT 'Active'
            );
        `);
        initialized = true;
    }
    return db;
}

export { prisma };
export default db;
