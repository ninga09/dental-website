import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db = null;

export async function getDb() {
    if (db) return db;

    db = await open({
        filename: path.join(process.cwd(), 'database.sqlite'),
        driver: sqlite3.Database
    });

    // Initialize tables
    await db.exec(`
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            specialty TEXT,
            image TEXT,
            bio TEXT,
            status TEXT DEFAULT 'Active' -- Active, Archived
        );

        CREATE TABLE IF NOT EXISTS media (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            url TEXT,
            type TEXT, -- image, video
            visible_on_home INTEGER DEFAULT 0, -- 0 for no, 1 for yes
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

    // Ensure blog columns exist for older DBs
    try { await db.run('ALTER TABLE blog_posts ADD COLUMN content TEXT'); } catch (e) { }
    try { await db.run('ALTER TABLE blog_posts ADD COLUMN image TEXT'); } catch (e) { }

    return db;
}

