"use client";
import { useState, useEffect, useRef } from 'react';

export default function DoctorsAdmin() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const fileInputRef = useRef(null);

    const clinicImages = [
        'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400'
    ];

    useEffect(() => {
        fetch('/api/doctors')
            .then(res => res.json())
            .then(data => {
                setDoctors(data);
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
        const res = await fetch('/api/doctors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editing)
        });
        if (res.ok) {
            const updatedDoc = await res.json();
            if (editing.id) {
                setDoctors(doctors.map(d => d.id === updatedDoc.id ? updatedDoc : d));
            } else {
                setDoctors([...doctors, updatedDoc]);
            }
            setEditing(null);
        }
    };

    const handleArchive = async (doc) => {
        const newStatus = doc.status === 'Active' ? 'Archived' : 'Active';
        const res = await fetch('/api/doctors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...doc, status: newStatus })
        });
        if (res.ok) {
            setDoctors(doctors.map(d => d.id === doc.id ? { ...d, status: newStatus } : d));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this profile?')) return;
        const res = await fetch('/api/doctors', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (res.ok) {
            setDoctors(doctors.filter(d => d.id !== id));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Dentist Registry</h2>
                <button className="button" onClick={() => setEditing({ name: '', specialty: '', bio: '', image: clinicImages[0], status: 'Active' })}>Add New Dentist</button>
            </div>

            <div className="admin-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((doc) => (
                            <tr key={doc.id}>
                                <td>
                                    <img src={doc.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                </td>
                                <td>{doc.name}</td>
                                <td>
                                    <span className={`badge ${doc.status === 'Active' ? 'badge-approved' : 'badge-cancelled'}`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-small btn-edit" onClick={() => setEditing(doc)}>Edit</button>
                                    <button className="btn-small" style={{ background: '#6c757d' }} onClick={() => handleArchive(doc)}>Archive</button>
                                    <button className="btn-small btn-delete" onClick={() => handleDelete(doc.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editing && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <form className="admin-form glass" style={{ padding: '2rem', width: '600px', maxHeight: '95vh', overflowY: 'auto' }} onSubmit={handleSave}>
                        <h3>{editing.id ? 'Modify Profile' : 'New Specialist'}</h3>

                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <img src={editing.image} alt="Preview" style={{ width: '150px', height: '150px', borderRadius: '12px', objectFit: 'cover', border: '3px solid var(--color-primary)', marginBottom: '1rem' }} />
                                <button type="button" className="button" style={{ width: '100%', fontSize: '0.8rem' }} onClick={() => fileInputRef.current.click()}>Upload Photo</button>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept="image/*" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Specialty</label>
                                    <input type="text" value={editing.specialty} onChange={e => setEditing({ ...editing, specialty: e.target.value })} required />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Professional Bio</label>
                            <textarea value={editing.bio} onChange={e => setEditing({ ...editing, bio: e.target.value })} rows={4} required />
                        </div>

                        <div className="form-group">
                            <label>Or select from Archive Library</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {clinicImages.map(img => (
                                    <img key={img} src={img} onClick={() => setEditing({ ...editing, image: img })} style={{ width: '50px', height: '50px', objectFit: 'cover', cursor: 'pointer', borderRadius: '4px', border: editing.image === img ? '2px solid white' : 'none' }} />
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button type="submit" className="button">Save Profile</button>
                            <button type="button" className="button" style={{ background: '#6c757d' }} onClick={() => setEditing(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
