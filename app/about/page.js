async function getData() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/content`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}

export default async function AboutPage() {
    const data = await getData();
    const about = data?.about || {
        title: 'About Premium Dental',
        mission: 'We are dedicated to delivering premium dental care...',
        history: 'Founded in 2010...'
    };

    return (
        <main className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            <h1 className="fade-in" style={{ fontSize: '3rem', marginBottom: '2rem' }}>{about.title}</h1>

            <div className="glass fade-in" style={{ padding: '3rem', marginBottom: '3rem' }}>
                <h2 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Our Mission & Vision</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>{about.mission}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <section className="glass fade-in" style={{ padding: '2rem' }}>
                    <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>History</h2>
                    <p>{about.history}</p>
                </section>

                <section className="glass fade-in" style={{ padding: '2rem' }}>
                    <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Our Team</h2>
                    <p style={{ marginBottom: '1.5rem' }}>Our dentists are board‑certified specialists with extensive experience across all dental disciplines.</p>
                    <a href="/doctors" className="button">Meet Our Dentists</a>
                </section>
            </div>
        </main>
    );
}
