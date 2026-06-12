"use client";
import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header({ clinicName }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className="container">
                <nav className={styles.nav}>
                    <Link href="/" className={styles.logo}>{clinicName || 'Premium Dental'}</Link>

                    {/* Mobile Toggle */}
                    <button className={styles.toggle} onClick={() => setIsOpen(!isOpen)}>
                        <span className={styles.bar}></span>
                        <span className={styles.bar}></span>
                        <span className={styles.bar}></span>
                    </button>

                    <ul className={`${styles.menu} ${isOpen ? styles.active : ''}`}>
                        <li><Link href="/" className={styles.link} onClick={() => setIsOpen(false)}>Home</Link></li>
                        <li><Link href="/about" className={styles.link} onClick={() => setIsOpen(false)}>About</Link></li>
                        <li><Link href="/services" className={styles.link} onClick={() => setIsOpen(false)}>Services</Link></li>
                        <li><Link href="/doctors" className={styles.link} onClick={() => setIsOpen(false)}>Dentists</Link></li>
                        <li><Link href="/booking" className={styles.link} onClick={() => setIsOpen(false)}>Book</Link></li>
                        <li><Link href="/contact" className={styles.link} onClick={() => setIsOpen(false)}>Contact</Link></li>
                        <li><Link href="/blog" className={styles.link} onClick={() => setIsOpen(false)}>Blog</Link></li>
                        <li><Link href="/admin" className={styles.link} onClick={() => setIsOpen(false)}>Admin</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
