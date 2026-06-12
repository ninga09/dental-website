import Link from 'next/link';

export default function TermsPage() {
    return (
        <main className="container" style={{ marginTop: '5rem', marginBottom: '8rem', maxWidth: '800px' }}>
            <h1 className="fade-in" style={{ fontSize: '3rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>Terms of Service</h1>

            <div className="glass fade-in" style={{ padding: '3rem', lineHeight: '1.8' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <h3>1. Acceptance of Terms</h3>
                    <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h3>2. Medical Disclaimer</h3>
                    <p>The information provided on this website is for general informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h3>3. Appointment Cancellation</h3>
                    <p>Users who wish to cancel scheduled appointments must notify the clinic at least 24 hours in advance to avoid a cancellation fee.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h3>4. Intellectual Property</h3>
                    <p>All content included on this site, such as text, graphics, logos, and images, is the property of the clinic and protected by international copyright laws.</p>
                </section>

                <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                    <p style={{ opacity: 0.6 }}>Last Updated: June 2026</p>
                    <Link href="/" className="button" style={{ marginTop: '1rem' }}>Back to Home</Link>
                </div>
            </div>
        </main>
    );
}
