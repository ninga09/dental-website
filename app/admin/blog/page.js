"use client";
import { useState, useEffect, useRef } from 'react';

export default function BlogAdmin() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch('/api/blog')
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            });
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        // Auto-generate slug if missing
        if (!editing.slug) {
            editing.slug = editing.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        const res = await fetch('/api/blog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editing)
        });

        if (res.ok) {
            const result = await res.json();
            if (editing.id) {
                setPosts(posts.map(p => p.id === result.id ? result : p));
            } else {
                setPosts([result, ...posts]);
            }
            setEditing(null);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditing({ ...editing, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const deletePost = async (id) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        const res = await fetch('/api/blog', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (res.ok) {
            setPosts(posts.filter(p => p.id !== id));
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading Blog Manager...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Blog & Article Manager</h2>
                <button className="button" onClick={() => setEditing({ title: '', excerpt: '', content: '', status: 'Published', slug: '', image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&q=80&w=800' })}>
                    Write New Post
                </button>
            </div>

            <div className="admin-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Cover</th>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td>
                                    <img src={post.image} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                </td>
                                <td>
                                    <strong>{post.title}</strong>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>/{post.slug}</div>
                                </td>
                                <td>{post.date}</td>
                                <td>
                                    <span className={`badge badge-${post.status.toLowerCase()}`}>
                                        {post.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-small btn-edit" onClick={() => setEditing(post)}>Edit</button>
                                    <button className="btn-small btn-delete" onClick={() => deletePost(post.id)}>Trash</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editing && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '2rem' }}>
                    <form className="admin-form glass" style={{ width: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '3rem' }} onSubmit={handleSave}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3>{editing.id ? 'Edit Article' : 'New Clinical Article'}</h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <select
                                    value={editing.status}
                                    onChange={e => setEditing({ ...editing, status: e.target.value })}
                                    style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px' }}
                                >
                                    <option value="Published">Published</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Archived">Archived</option>
                                </select>
                                <button type="button" onClick={() => setEditing(null)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Cover Image</label>
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    style={{ width: '100%', height: '200px', background: `url(${editing.image}) center/cover`, borderRadius: '8px', cursor: 'pointer', border: '2px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    {!editing.image && <span>Upload Image</span>}
                                </div>
                                <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*" />
                                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.5 }}>Recommended: 1200x800px</p>
                            </div>
                            <div>
                                <div className="form-group">
                                    <label>Article Title</label>
                                    <input type="text" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="e.g. 5 Tips for a Brighter Smile" required />
                                </div>
                                <div className="form-group" style={{ marginTop: '1rem' }}>
                                    <label>URL Slug (Optional)</label>
                                    <input type="text" value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} placeholder="brighter-smile-tips" />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Short Excerpt (Shows on list page)</label>
                            <textarea value={editing.excerpt} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} rows={2} required />
                        </div>

                        <div className="form-group" style={{ marginTop: '2rem' }}>
                            <label>Article Content (Full Body)</label>
                            <textarea value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })} rows={10} style={{ fontFamily: 'inherit', lineHeight: '1.6' }} required />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                            <button type="submit" className="button" style={{ padding: '1rem 3rem' }}>Save & Update Blog</button>
                            <button type="button" className="button" style={{ background: '#6c757d' }} onClick={() => setEditing(null)}>Discard Changes</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
