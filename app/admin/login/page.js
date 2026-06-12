"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            router.push('/admin');
            router.refresh();
        } else {
            setError('Invalid email or password');
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
            <form onSubmit={handleSubmit} className="glass" style={{ width: '400px', padding: '3rem', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Admin Login</h1>
                <p style={{ opacity: 0.6, marginBottom: '2rem' }}>Please enter your clinical credentials</p>

                {error && <div style={{ color: '#dc3545', background: 'rgba(220, 53, 69, 0.1)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

                <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                        required
                    />
                </div>

                <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="button"
                    disabled={loading}
                    style={{ width: '100%', padding: '1rem' }}
                >
                    {loading ? 'Authenticating...' : 'Login to Portal'}
                </button>

                <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.4 }}>
                    Secure Clinical Access Point
                </div>
            </form>
        </div>
    );
}
