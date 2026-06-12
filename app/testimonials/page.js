import Link from 'next/link';
import styles from './Testimonials.module.css';

// Mock testimonials – replace with real data source later
const testimonials = [
    {
        name: 'Emily R.',
        rating: 5,
        comment: 'The team was incredibly gentle and professional. My smile has never looked better!'
    },
    {
        name: 'Mark T.',
        rating: 4,
        comment: 'Great service and friendly staff. Highly recommend the orthodontics department.'
    },
    {
        name: 'Sofia L.',
        rating: 5,
        comment: 'Emergency appointment was handled quickly and pain‑free. Thank you!'
    }
];

export const metadata = {
    title: 'Testimonials – Premium Dental',
    description: 'What our patients say about their experience at Premium Dental Clinic.'
};

export default function TestimonialsPage() {
    return (
        <main className="container" style={{ marginTop: '2rem' }}>
            <h1 className="fade-in">Patient Testimonials</h1>
            <div className={styles.grid}>
                {testimonials.map((t, i) => (
                    <div key={i} className={styles.card}>
                        <h3>{t.name}</h3>
                        <p>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</p>
                        <p>“{t.comment}”</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
