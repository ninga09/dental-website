import Link from 'next/link';
import styles from './Doctors.module.css';

async function getDoctors() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/doctors`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export default async function DoctorsPage() {
    const allDoctors = await getDoctors();
    const doctors = allDoctors.filter(d => d.status === 'Active');


    return (
        <main className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="fade-in" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Expert Dentists</h1>
                <p className="fade-in" style={{ fontSize: '1.2rem', opacity: 0.7 }}>A team of dedicated professionals committed to your oral health.</p>
            </div>
            <div className={styles.grid}>
                {doctors.map((doc, i) => (
                    <div key={i} className={styles.card}>
                        <img src={doc.image} alt={doc.name} className={styles.avatar} />
                        <h3>{doc.name}</h3>
                        <p><strong>{doc.specialty}</strong></p>
                        <p style={{ minHeight: '60px' }}>{doc.bio}</p>
                        <Link href="/booking" className="button">Book Appointment</Link>
                    </div>
                ))}
            </div>
        </main>
    );
}
