"use client";
import { useState } from 'react';
import styles from './Review.module.css';

export default function PatientReview() {
    const [form, setForm] = useState({ name: '', rating: 5, comment: '' });
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        // Fetch current testimonials first to append
        const getRes = await fetch('/api/testimonials');
        const current = await getRes.json();

        const newTestimonial = {
            id: Date.now(),
            name: form.name,
            rating: parseInt(form.rating),
            comment: form.comment,
            status: 'Pending' // Requires admin approval
        };

        const res = await fetch('/api/testimonials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([...current, newTestimonial])
        });

        if (res.ok) {
            setStatus('success');
            setForm({ name: '', rating: 5, comment: '' });
        } else {
            setStatus('error');
        }
    };

    return (
        <main className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '3rem', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '1rem' }}>Share Your Experience</h1>
                <p style={{ opacity: 0.7, marginBottom: '2rem' }}>Your feedback helps us provide the best care for our patients.</p>

                {status === 'success' ? (
                    <div style={{ padding: '2rem' }}>
                        <h2 style={{ color: 'var(--color-primary)' }}>Thank You!</h2>
                        <p>Your review has been submitted for moderation. We appreciate your feedback!</p>
                        <button className="button" style={{ marginTop: '1rem' }} onClick={() => setStatus(null)}>Add Another</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label>Your Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label>Rating</label>
                            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '1.5rem', color: 'gold', cursor: 'pointer' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span
                                        key={star}
                                        onClick={() => setForm({ ...form, rating: star })}
                                        style={{ opacity: form.rating >= star ? 1 : 0.3 }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label>Your Comment</label>
                            <textarea
                                value={form.comment}
                                onChange={e => setForm({ ...form, comment: e.target.value })}
                                placeholder="Tell us about your visit..."
                                rows={5}
                                required
                            />
                        </div>

                        <button type="submit" className="button" style={{ width: '100%', padding: '1rem' }} disabled={status === 'sending'}>
                            {status === 'sending' ? 'Submitting...' : 'Submit Review'}
                        </button>
                        {status === 'error' && <p style={{ color: '#dc3545', marginTop: '1rem' }}>Failed to submit. Please try again.</p>}
                    </form>
                )}
            </div>
        </main>
    );
}
