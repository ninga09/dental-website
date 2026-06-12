import Link from 'next/link';
import styles from './Blog.module.css';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getPosts() {
    try {
        const db = await getDb();
        const posts = await db.all('SELECT * FROM blog_posts WHERE status = ?', ['Published']);
        return posts;
    } catch (e) {
        console.error('Failed to fetch posts from DB:', e);
        return [];
    }
}

export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <main className="container" style={{ marginTop: '5rem', marginBottom: '8rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <h1 className="fade-in" style={{ fontSize: '4rem', marginBottom: '1.5rem', fontWeight: '800' }}>Clinical Blog & News</h1>
                <p className="fade-in" style={{ fontSize: '1.2rem', opacity: 0.7, maxWidth: '700px', margin: '0 auto' }}>
                    Stay informed with the latest dental health tips, clinical updates, and news from our expert team.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
                {posts.length === 0 && <p style={{ textAlign: 'center', gridColumn: '1/-1', opacity: 0.5 }}>No published articles yet.</p>}
                {posts.map((post) => (
                    <article key={post.id} className="glass fade-in blog-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '240px', overflow: 'hidden' }}>
                            <img
                                src={post.image || 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&q=80&w=800'}
                                alt={post.title}
                                className="blog-image"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '1rem' }}>{post.date}</p>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', lineHeight: '1.3' }}>{post.title}</h2>
                            <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem', flex: 1 }}>{post.excerpt}</p>
                            <Link href={`/blog/${post.slug}`} className="button" style={{ width: 'fit-content' }}>
                                Read Article
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .blog-card:hover .blog-image {
                    transform: scale(1.1);
                }
                .blog-image {
                    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
            `}} />
        </main>
    );
}
