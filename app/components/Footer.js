import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer({ clinicName }) {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p>© {new Date().getFullYear()} {clinicName || 'Premium Dental'} Clinic. All rights reserved.</p>

                <nav className={styles.links}>
                    <Link href="/review" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Leave a Review</Link>
                    <Link href="/privacy">Privacy Policy</Link>
                    <Link href="/terms">Terms of Service</Link>
                </nav>

            </div>
        </footer>
    );
}
