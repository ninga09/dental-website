"use client";
import { useState, useEffect, useRef } from 'react';

export default function MediaManagement() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    const clinicImages = [
        'https://images.unsplash.com/photo-1629909608135-4510b6fdb514',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5',
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118'
    ].map(url => `${url}?auto=format&fit=crop&q=80&w=400`);

    useEffect(() => {
        fetch('/api/media')
            .then(res => res.json())
            .then(data => {
                setMedia(data);
                setLoading(false);
            });
    }, []);

    const addMedia = async (url, name = 'Clinic Photo') => {
        const res = await fetch('/api/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, url, visible_on_home: 1 })
        });
        if (res.ok) {
            const newItem = await res.json();
            setMedia([newItem, ...media]);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                addMedia(reader.result, file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleVisibility = async (item) => {
        const newVisibility = item.visible_on_home ? 0 : 1;
        const res = await fetch('/api/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, visible_on_home: newVisibility })
        });
        if (res.ok) {
            setMedia(media.map(m => m.id === item.id ? { ...m, visible_on_home: newVisibility } : m));
        }
    };

    const deleteMedia = async (id) => {
        if (!confirm('Delete this media?')) return;
        const res = await fetch('/api/media', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (res.ok) {
            setMedia(media.filter(m => m.id !== id));
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading Media Assets...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem' }}>Media Gallery & Home Integration</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button className="button" onClick={() => fileInputRef.current.click()} style={{ background: 'var(--color-primary)' }}>
                        Upload New Photo
                    </button>
                    <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*" />

                    <div className="glass" style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                            {clinicImages.map(img => (
                                <div
                                    key={img}
                                    onClick={() => addMedia(img)}
                                    style={{ width: '40px', height: '40px', backgroundImage: `url(${img})`, backgroundSize: 'cover', borderRadius: '6px', cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {media.map((item) => (
                    <div key={item.id} className="glass" style={{ padding: '1rem', position: 'relative' }}>
                        <div
                            style={{ width: '100%', height: '200px', backgroundImage: `url(${item.url})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '10px', marginBottom: '1.2rem' }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Home Gallery</span>
                            <button
                                onClick={() => toggleVisibility(item)}
                                style={{
                                    padding: '0.4rem 1rem',
                                    background: item.visible_on_home ? '#28a745' : 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    color: '#fff',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                {item.visible_on_home ? 'ACTIVE' : 'HIDDEN'}
                            </button>
                        </div>

                        <button
                            onClick={() => deleteMedia(item.id)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(220, 53, 69, 0.9)', border: 'none', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
