"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './admin.css';

export default function AdminLayout({ children }) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <Link href="/admin">Admin Portal</Link>
                </div>
                <nav className="admin-nav" style={{ flex: 1 }}>
                    <ul>
                        <li><Link href="/admin">📊 Dashboard</Link></li>
                        <li><Link href="/admin/appointments">📅 Appointments</Link></li>
                        <li><Link href="/admin/doctors">👨‍⚕️ Manage Dentists</Link></li>
                        <li><Link href="/admin/services">🦷 Manage Services</Link></li>
                        <li><Link href="/admin/blog">📝 Blog Manager</Link></li>
                        <li><Link href="/admin/media">🖼️ Media Gallery</Link></li>
                        <li><Link href="/admin/content">⚙️ Content Manager</Link></li>
                        <li><Link href="/admin/testimonials">💬 Testimonials</Link></li>
                    </ul>
                </nav>
                <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        onClick={handleLogout}
                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(220, 53, 69, 0.2)', color: '#dc3545', border: '1px solid rgba(220, 53, 69, 0.4)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '1rem' }}
                    >
                        Sign Out
                    </button>
                    <Link href="/" style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.9rem', display: 'block', textAlign: 'center' }}>
                        ← Back to Website
                    </Link>
                </div>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <h1>Clinic Administration</h1>
                    <div className="admin-user" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ opacity: 0.7 }}>Logged in: <strong>Clinic Admin</strong></span>
                    </div>
                </header>
                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
