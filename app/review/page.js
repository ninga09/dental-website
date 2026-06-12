"use client";
import { useState } from 'react';
import styles from './Review.module.css';

const SAMPLE_REVIEWS = [
    "The staff was incredibly friendly and the care I received was top-notch. Highly recommend!",
    "Clean, modern facility and very professional dentists. My procedure was quick and painless.",
    "Great experience for my kids. The pediatric care here is exceptional and very gentle.",
    "Professionalism at its best. They explained everything clearly and the results are amazing."
];

export default function PatientReview() {
    const [form, setForm] = useState({ name: '', rating: 5, comment: '' });
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('/api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    rating: parseInt(form.rating),
                    comment: form.comment
                })
            });

            if (res.ok) {
                setStatus('success');
                setForm({ name: '', rating: 5, comment: '' });
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error('Submit error:', err);
            setStatus('error');
        }
    };

    const applyTemplate = (text) => {
        setForm(prev => ({ ...prev, comment: text }));
    };

    return (
        <main className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '4rem', textAlign: 'center', borderRadius: '30px' }}>
                <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Share Your Experience</h1>
                <p style={{ opacity: 0.7, marginBottom: '3rem' }}>Your feedback helps us provide the best care for our patients.</p>

                {status === 'success' ? (
                    <div className="fade-in" style={{ padding: '2rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
                        <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Thank You!</h2>
                        <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>Your review has been submitted for moderation. We truly appreciate your feedback!</p>
                        <button className="button" style={{ padding: '1rem 2.5rem' }} onClick={() => setStatus(null)}>Add Another Review</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ textAlign: 'left' }} className="fade-in">
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>Your Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Enter your full name"
                                style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>Your Rating</label>
                            <div style={{ display: 'flex', gap: '0.8rem', fontSize: '2rem', color: 'gold', cursor: 'pointer' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span
                                        key={star}
                                        onClick={() => setForm({ ...form, rating: star })}
                                        style={{
                                            opacity: form.rating >= star ? 1 : 0.2,
                                            transform: form.rating >= star ? 'scale(1.1)' : 'scale(1)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                <label style={{ fontWeight: '600' }}>Your Experience</label>
                                <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Select a template below to start</span>
                            </div>

                            <textarea
                                value={form.comment}
                                onChange={e => setForm({ ...form, comment: e.target.value })}
                                placeholder="Tell us about your visit..."
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '1.2rem',
                                    borderRadius: '12px',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    resize: 'vertical',
                                    marginBottom: '1.5rem'
                                }}
                                required
                            />

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {SAMPLE_REVIEWS.map((text, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => applyTemplate(text)}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: '#fff',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    >
                                        {text.substring(0, 20)}...
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="button"
                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                fontSize: '1.1rem',
                                marginTop: '1rem',
                                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                            }}
                            disabled={status === 'sending'}
                        >
                            {status === 'sending' ? 'Submitting...' : 'Submit Reliable Review'}
                        </button>

                        {status === 'error' && (
                            <p style={{ color: '#ff4d4d', marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                                Oops! Something went wrong. Please try again.
                            </p>
                        )}
                    </form>
                )}
            </div>
        </main>
    );
}
