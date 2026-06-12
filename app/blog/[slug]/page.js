import { getDb } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getPost(slug) {
    const db = await getDb();
    return db.get('SELECT * FROM blog_posts WHERE slug = ?', [slug]);
}

export default async function BlogPostPage({ params }) {
    // Await params for modern Next.js compatibility
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return (
            <div className="container" style={{ padding: '10rem 2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Post Not Found</h1>
                <p style={{ marginBottom: '2rem', opacity: 0.7 }}>The article you are looking for might have been moved or removed.</p>
                <Link href="/blog" className="button">Back to Blog</Link>
            </div>
        );
    }

    return (
        <main className="container" style={{ marginTop: '5rem', marginBottom: '8rem', maxWidth: '900px' }}>
            <Link href="/blog" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontWeight: '600' }}>
                ← Back to Blog
            </Link>

            <article className="glass" style={{ padding: '4rem', overflow: 'hidden' }}>
                {post.image && (
                    <img
                        src={post.image}
                        alt={post.title}
                        style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '3rem' }}
                    />
                )}

                <div style={{ marginBottom: '3rem' }}>
                    <p style={{ color: 'var(--color-primary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                        Clinical Advice • {post.date}
                    </p>
                    <h1 style={{ fontSize: '3.5rem', lineHeight: '1.1', fontWeight: '800' }}>{post.title}</h1>
                </div>

                <div style={{ lineHeight: '1.8', fontSize: '1.2rem', opacity: 0.9, color: '#e2e8f0' }}>
                    {/* Render the actual content from the database */}
                    <div dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br/>') || post.excerpt }} />

                    {!post.content && (
                        <div style={{ marginTop: '2rem' }}>
                            <p>Consistent dental hygiene is the foundation of a great smile. Beyond just brushing twice a day,
                                incorporating flossing and regular professional cleanings can prevent long-term issues such as
                                periodontal disease and tooth decay.</p>
                        </div>
                    )}
                </div>
            </article>
        </main>
    );
}
