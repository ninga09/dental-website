"use client";
import { useState, useEffect } from 'react';
import GoogleMap from '../components/GoogleMap';
import styles from './Contact.module.css';

export default function ContactPage() {
    const [content, setContent] = useState(null);

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(data => setContent(data));
    }, []);

    if (!content) return <div className="container" style={{ padding: '10rem' }}>Loading Contact Info...</div>;

    return (
        <main className="container" style={{ marginTop: '5rem', marginBottom: '8rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 className="fade-in" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Get in Touch</h1>
                <p className="fade-in" style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '700px', margin: '0 auto' }}>
                    Have questions or feedback? We're here to help. Reach out via the form below or visit us at our clinic.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
                <div>
                    <h2 style={{ marginBottom: '1.5rem' }}>Direct Reach</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
                        <a
                            href={`https://wa.me/${content.contact.whatsapp?.replace(/[^\d]/g, '')}`}
                            style={{ background: '#25D366', color: '#fff', padding: '1rem', borderRadius: '12px', textDecoration: 'none', textAlign: 'center', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            <span>WhatsApp</span>
                        </a>
                        <a
                            href={`mailto:${content.contact.email}`}
                            style={{ background: 'var(--color-primary)', color: '#fff', padding: '1rem', borderRadius: '12px', textDecoration: 'none', textAlign: 'center', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            <span>Email Us</span>
                        </a>
                    </div>

                    <h2 style={{ marginBottom: '2rem' }}>Send us a Message</h2>
                    <form className={styles.form} method="POST" action="/api/contact">

                        <div className="form-group">
                            <input type="text" name="name" placeholder="Your Name" required />
                        </div>
                        <div className="form-group">
                            <input type="email" name="email" placeholder="Email Address" required />
                        </div>
                        <div className="form-group">
                            <input type="tel" name="phone" placeholder="Phone Number" />
                        </div>
                        <div className="form-group">
                            <textarea name="message" placeholder="How can we help you?" rows={5} required />
                        </div>
                        <button type="submit" className="button" style={{ width: '100%', padding: '1rem' }}>Send Message</button>
                    </form>

                    <div className={styles.info} style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '15px' }}>
                        <p style={{ marginBottom: '1rem' }}><strong>📞 Phone:</strong> {content.contact.phone}</p>
                        <p style={{ marginBottom: '1rem' }}><strong>✉️ Email:</strong> {content.contact.email}</p>
                        <p><strong>📍 Address:</strong> {content.contact.address}</p>
                    </div>
                </div>

                <div>
                    <h2 style={{ marginBottom: '2rem' }}>Our Location</h2>
                    <GoogleMap address={content.contact.address} />

                    <div style={{ marginTop: '2rem' }}>
                        <h3>Opening Hours</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <span>Monday - Friday</span>
                            <span style={{ color: 'var(--color-primary)' }}>{content.contact.hours?.weekdays || '8:00 AM - 6:00 PM'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <span>Saturday</span>
                            <span style={{ color: 'var(--color-primary)' }}>{content.contact.hours?.saturday || '9:00 AM - 2:00 PM'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0' }}>
                            <span>Sunday</span>
                            <span style={{ color: content.contact.hours?.sunday === 'Closed' ? '#dc3545' : 'var(--color-primary)' }}>
                                {content.contact.hours?.sunday || 'Closed'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
