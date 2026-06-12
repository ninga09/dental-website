"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './BannerCarousel.module.css';

const getSlides = (clinicName) => [
    {
        src: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55',
        title: 'Sleep Apnoea / Snoring',
        text: 'Do you wake up feeling grogy and exhausted? We can help! Consult our specialists today.',
    },
    {
        src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95',
        title: 'Cosmetic Dentistry',
        text: 'Porcelain veneers, crowns and bridges with a 5-Year warranty. Transform your smile with confidence.',
    },
    {
        src: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5',
        title: clinicName || 'Premium Dental Practice',
        text: `Welcome to ${clinicName || 'our clinic'}. We offer a wide range of dental services, from simple treatments to highly advanced procedures!`,
    },
    {
        src: 'https://images.unsplash.com/photo-1516549221187-df9b4877bc3a',
        title: 'Dental Aligners',
        text: 'Experience the Power of Dental Aligners for a perfectly aligned, Picture-Perfect Smile.',
    },
    {
        src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118',
        title: 'Missing Teeth',
        text: 'We replace these with dental bridges or dental implants (with or without bone grafts).',
    }
];

export default function BannerCarousel({ clinicName }) {
    const slides = getSlides(clinicName);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrent((current + 1) % slides.length);
    const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);

    return (
        <section className={styles.carousel}>
            {slides.map((s, i) => (
                <div
                    key={i}
                    className={`${styles.slide} ${current === i ? styles.active : ''}`}
                    style={{ backgroundImage: `url(${s.src}?auto=format&fit=crop&q=80&w=1600)` }}
                >
                    <div className={styles.overlay}>
                        <div className={`${styles.captionBox} fade-in`}>
                            <h2>{s.title}</h2>
                            <p>{s.text}</p>
                            <Link href="/booking" className="button" style={{ marginTop: '1.5rem', background: '#fff', color: '#4a7c2c' }}>
                                Book Appointment
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            <button className={`${styles.navButton} ${styles.prev}`} onClick={prevSlide}>←</button>
            <button className={`${styles.navButton} ${styles.next}`} onClick={nextSlide}>→</button>
        </section>
    );
}
