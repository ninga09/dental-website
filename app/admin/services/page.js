"use client";
import { useState, useEffect, useRef } from 'react';

export default function ServicesAdmin() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const fileInputRef = useRef(null);

    const presetImages = [
        "https://images.unsplash.com/photo-1599700403969-fce01d77f563?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1468493858157-0da44aaf1d13?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
    ];

    useEffect(() => {
        fetch('/api/services')
            .then(res => res.json())
            .then(data => {
                setServices(data);
                setLoading(false);
            });
    }, []);

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

    const handleSave = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editing)
        });
        if (res.ok) {
            const updated = await res.json();
            if (editing.id) {
                setServices(services.map(s => s.id === updated.id ? updated : s));
            } else {
                setServices([...services, updated]);
            }
            setEditing(null);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this service?')) return;
        const res = await fetch('/api/services', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (res.ok) {
            setServices(services.filter(s => s.id !== id));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Service Management</h2>
                <button className="button" onClick={() => setEditing({ title: '', description: '', image: presetImages[0] })}>Add New Service</button>
            </div>

            <div className="admin-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Service Title</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((s) => (
                            <tr key={s.id}>
                                <td>
                                    <img src={s.image} alt="" style={{ width: '80px', height: '50px', borderRadius: '4px', objectFit: 'cover' }} />
                                </td>
                                <td><strong>{s.title}</strong></td>
                                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.description}</td>
                                <td>
                                    <button className="btn-small btn-edit" onClick={() => setEditing(s)}>Edit</button>
                                    <button className="btn-small btn-delete" onClick={() => handleDelete(s.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editing && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <form className="admin-form glass" style={{ padding: '2rem', width: '600px' }} onSubmit={handleSave}>
                        <h3>{editing.id ? 'Edit Service' : 'Create Service'}</h3>

                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <img src={editing.image} alt="Preview" style={{ width: '150px', height: '100px', borderRadius: '8px', objectFit: 'cover', border: '2px solid var(--color-primary)', marginBottom: '0.5rem' }} />
                                <button type="button" className="btn-small" style={{ width: '100%' }} onClick={() => fileInputRef.current.click()}>Upload</button>
                                <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="form-group">
                                    <label>Service Title</label>
                                    <input type="text" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} required />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Service Description</label>
                            <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={4} required />
                        </div>

                        <div className="form-group">
                            <label>Or choose preset</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {presetImages.map(img => (
                                    <img key={img} src={img} onClick={() => setEditing({ ...editing, image: img })} style={{ width: '40px', height: '40px', objectFit: 'cover', cursor: 'pointer', borderRadius: '4px', border: editing.image === img ? '2px solid white' : 'none' }} />
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button type="submit" className="button">Save Service</button>
                            <button type="button" className="button" style={{ background: '#6c757d' }} onClick={() => setEditing(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
