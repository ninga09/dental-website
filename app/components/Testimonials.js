"use client";
import { useState, useEffect } from 'react';
import styles from './Testimonials.module.css';

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        fetch('/api/testimonials')
            .then(res => res.json())
            .then(data => setTestimonials(data.filter(t => t.status === 'Approved')));
    }, []);

    return (
        <section className={styles.section}>
            <h2 className="fade-in">Patient Testimonials</h2>
            <div className={styles.grid}>
                {testimonials.map((t, i) => (
                    <div key={i} className={styles.card}>
                        <h3>{t.name}</h3>
                        <p>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</p>
                        <p>“{t.comment}”</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
