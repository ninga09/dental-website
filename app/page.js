import BannerCarousel from './components/BannerCarousel';
import Testimonials from './components/Testimonials';
import GallerySlider from './components/GallerySlider';
import GoogleMap from './components/GoogleMap';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getData() {
    try {
        const db = await getDb();

        const [services, media, contentRows] = await Promise.all([
            db.all('SELECT * FROM services'),
            db.all('SELECT * FROM media'),
            db.all('SELECT * FROM content')
        ]);

        const content = {
            clinicName: 'Royal Care Dental',
            contact: {
                address: 'Loading...',
                phone: 'Loading...'
            }
        };

        contentRows.forEach(row => {
            try {
                content[row.section] = JSON.parse(row.data);
            } catch (e) {
                console.error('Failed to parse content row:', row.section);
            }
        });

        return {
            content,
            services: services || [],
            media: media || []
        };
    } catch (error) {
        console.error('Failed to fetch home page data:', error);
        return {
            content: { clinicName: 'Royal Care Dental', contact: {} },
            services: [],
            media: []
        };
    }
}

export default async function HomePage() {
    const data = await getData();
    const { content, services, media } = data;

    return (
        <main>
            <BannerCarousel clinicName={content.clinicName || 'Royal Care Dental'} />

            {/* Featured Services */}
            <section className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="fade-in" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Premium Services</h2>
                    <p className="fade-in" style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' }}>Experience the highest standard of dental care with our expert team.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {services.length > 0 ? services.slice(0, 6).map((s, i) => (
                        <div key={i} className="glass fade-in" style={{ padding: '2rem', transition: 'transform 0.3s' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{s.title}</h3>
                            <p style={{ fontSize: '0.95rem', lineHeight: '1.5', opacity: 0.8 }}>{s.description}</p>
                            <a href={`/services#${s.title?.toLowerCase().replace(/ /g, '-')}`} style={{ marginTop: '1.5rem', display: 'inline-block', color: 'var(--color-accent)', fontWeight: '600', textDecoration: 'none' }}>Learn More →</a>
                        </div>
                    )) : (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center', opacity: 0.5 }}>Our specialists are preparing our list of services.</p>
                    )}
                </div>
            </section>

            {/* Why Choose Us */}
            <section style={{ background: 'var(--color-surface)', padding: '4rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                        <div>
                            <h2 className="fade-in" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Choose Our Clinic?</h2>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    'State-of-the-art dental technology',
                                    'Experienced and compassionate team',
                                    'Personalized treatment plans',
                                    'Comfortable and relaxing environment',
                                    'Flexible scheduling and emergency care'
                                ].map((item, i) => (
                                    <li key={i} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                                        <span style={{ color: 'var(--color-primary)', marginRight: '1rem', fontSize: '1.5rem' }}>✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div style={{ marginTop: '2rem' }}>
                                <a href="/about" className="button">About Our Clinic</a>
                            </div>
                        </div>
                        <div className="glass" style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <h3 style={{ color: 'var(--color-primary)' }}>Trusted by 5000+ Patients</h3>
                                <p>Providing exceptional care for over 15 years.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Testimonials />

            {/* Clinic Gallery Section */}
            <section className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="fade-in" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Clinic Gallery</h2>
                    <p style={{ opacity: 0.7 }}>A glimpse into our modern facilities and happy patient smiles.</p>
                </div>

                <GallerySlider items={media ? media.filter(m => m.visible_on_home) : []} />
            </section>

            {/* Location Section */}
            <section style={{ padding: '6rem 0', background: 'rgba(0,0,0,0.2)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Find Us</h2>
                            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.8 }}>
                                We are conveniently located in the heart of the community. Visit our state-of-the-art facility for a consultation.
                            </p>
                            <div className="glass" style={{ padding: '2rem' }}>
                                <p style={{ marginBottom: '1rem' }}><strong>📍 Address:</strong> {content.contact?.address || 'Royal Care Dental Service, Sixth Street, Eastleigh, Nairobi, Kenya'}</p>
                                <p style={{ marginBottom: '1rem' }}><strong>📞 Phone:</strong> {content.contact?.phone || '+254 700 000 000'}</p>
                                <p><strong>Parking:</strong> Free visitor parking available behind the building.</p>
                            </div>
                        </div>
                        <div style={{ height: '400px' }}>
                            <GoogleMap address={content.contact?.address || 'Royal Care Dental Service, Sixth Street, Eastleigh, Nairobi, Kenya'} height="100%" />
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container" style={{ margin: '5rem auto', textAlign: 'center' }}>
                <div className="glass" style={{ padding: '4rem 2rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to Transform Your Smile?</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem' }}>Book your appointment today and experience the difference of premium dental care.</p>
                    <a href="/booking" className="button" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>Book Now</a>
                </div>
            </section>
        </main>
    );
}
