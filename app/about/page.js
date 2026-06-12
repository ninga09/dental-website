import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getData() {
    try {
        const db = await getDb();
        const contentRows = await db.all('SELECT * FROM content WHERE section = ?', ['about']);
        if (contentRows.length === 0) return null;
        return JSON.parse(contentRows[0].data);
    } catch (e) {
        console.error('Failed to fetch about data:', e);
        return null;
    }
}

export default async function AboutPage() {
    const aboutData = await getData();
    const about = aboutData || {
        title: 'Excellence in Dental Care',
        mission: 'At Royal Care Dental, our mission is to provide premium, personalized dental care that enhances the lives and smiles of our patients. We combine state-of-the-art technology with a compassionate approach to ensure your comfort and health.',
        history: 'Established with a vision to redefine oral healthcare in the community, Royal Care Dental has grown into a leading specialty clinic. Our journey is defined by a commitment to clinical excellence and a passion for creating healthy, confident smiles.'
    };

    return (
        <main style={{ marginTop: '5rem', marginBottom: '8rem' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h1 className="fade-in" style={{
                        fontSize: '4.5rem',
                        marginBottom: '1.5rem',
                        fontWeight: '850',
                        background: 'linear-gradient(135deg, #fff 0%, var(--color-primary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em'
                    }}>
                        {about.title}
                    </h1>
                    <p className="fade-in" style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', opacity: 0.8, lineHeight: '1.6' }}>
                        Providing world-class dentistry with a personal touch since 2010.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', alignItems: 'stretch' }}>
                    <div className="glass fade-in" style={{ padding: '4rem', borderRadius: '30px' }}>
                        <h2 style={{
                            fontSize: '2rem',
                            color: 'var(--color-primary)',
                            marginBottom: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            Our Mission & Vision
                        </h2>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.9', color: '#e2e8f0' }}>
                            {about.mission}
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <section className="glass fade-in" style={{ padding: '3rem', borderRadius: '30px', flex: 1 }}>
                            <h3 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Our Heritage</h3>
                            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', opacity: 0.9 }}>{about.history}</p>
                        </section>

                        <section className="glass fade-in" style={{
                            padding: '3rem',
                            borderRadius: '30px',
                            flex: 1,
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(30, 41, 59, 0.4) 100%)'
                        }}>
                            <h3 style={{ fontSize: '1.8rem', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>Expert Clinical Team</h3>
                            <p style={{ marginBottom: '2.5rem', fontSize: '1.05rem', opacity: 0.9 }}>Our dentists are board‑certified specialists with extensive international experience across all dental disciplines.</p>
                            <a href="/doctors" className="button" style={{ width: '100%', textAlign: 'center', padding: '1rem' }}>Meet the Specialists</a>
                        </section>
                    </div>
                </div>

                <div className="glass fade-in" style={{ marginTop: '5rem', padding: '4rem', borderRadius: '30px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Our Core Values</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        {[
                            { title: 'Integrity', desc: 'Honest and transparent clinical advice.' },
                            { title: 'Excellence', desc: 'Highest standards in every procedure.' },
                            { title: 'Compassion', desc: 'Patient-first care and gentle approach.' },
                            { title: 'Innovation', desc: 'Latest technology and modern techniques.' }
                        ].map((v, i) => (
                            <div key={i}>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>{v.title}</h4>
                                <p style={{ opacity: 0.7 }}>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
