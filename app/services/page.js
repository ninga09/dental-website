"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Services.module.css';

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        fetch('/api/services')
            .then(res => res.json())
            .then(data => {
                setServices(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="container" style={{ padding: '5rem' }}>Loading services...</div>;

    return (
        <main className="container" style={{ marginTop: '5rem', marginBottom: '8rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 className="fade-in" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(45deg, #fff, var(--color-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Our Specialized Treatments
                </h1>
                <p className="fade-in" style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', opacity: 0.7 }}>
                    Expert clinical care tailored to your specific dental needs.
                </p>
            </div>

            <div className={styles.grid}>
                {services.map((service, i) => (
                    <div key={service.id} className={`${styles.card} fade-in`} style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className={styles.cardImg} style={{ backgroundImage: `url(${service.image || 'https://images.unsplash.com/photo-1599700403969-fce01d77f563?auto=format&fit=crop&q=80&w=800'})` }}></div>
                        <div className={styles.content}>
                            <h3>{service.title}</h3>
                            <p style={{ marginBottom: '1.5rem' }}>{service.description.substring(0, 100)}...</p>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    className="button"
                                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
                                    onClick={() => setSelectedService(service)}
                                >
                                    View Details
                                </button>
                                <Link
                                    href={`/booking?service=${encodeURIComponent(service.title)}`}
                                    className="button"
                                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', background: 'var(--color-accent)' }}
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedService && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '1rem' }}>
                    <div className="glass" style={{ maxWidth: '800px', width: '100%', overflow: 'hidden' }}>
                        <div style={{ height: '300px', backgroundImage: `url(${selectedService.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                            <button
                                onClick={() => setSelectedService(null)}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </div>
                        <div style={{ padding: '3rem' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>{selectedService.title}</h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.8, marginBottom: '2.5rem' }}>{selectedService.description}</p>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <Link href={`/booking?service=${encodeURIComponent(selectedService.title)}`} className="button" style={{ padding: '1rem 2rem' }}>
                                    Book an Appointment for {selectedService.title}
                                </Link>
                                <button onClick={() => setSelectedService(null)} className="button" style={{ background: '#6c757d', padding: '1rem 2rem' }}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
