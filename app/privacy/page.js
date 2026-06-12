import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <main className="container" style={{ marginTop: '5rem', marginBottom: '8rem', maxWidth: '800px' }}>
            <h1 className="fade-in" style={{ fontSize: '3rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>Privacy Policy</h1>

            <div className="glass fade-in" style={{ padding: '3rem', lineHeight: '1.8' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <h3>1. Information Collection</h3>
                    <p>We collect information from you when you book an appointment, subscribe to our newsletter, or fill out a form. This may include your name, email address, phone number, and medical history relevant to your visit.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h3>2. How We Use Your Information</h3>
                    <p>Any of the information we collect from you may be used to personalize your experience, improve our website, improve customer service, and process your appointments.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h3>3. Data Protection</h3>
                    <p>We implement a variety of security measures to maintain the safety of your personal information. Your clinical data is handled with strict confidentiality in accordance with HIPAA/GDPR standards.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h3>4. Cookies</h3>
                    <p>We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction.</p>
                </section>

                <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                    <p style={{ opacity: 0.6 }}>Last Updated: June 2026</p>
                    <Link href="/" className="button" style={{ marginTop: '1rem' }}>Back to Home</Link>
                </div>
            </div>
        </main>
    );
}
