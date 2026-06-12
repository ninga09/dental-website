"use client";
import { useState, useEffect } from 'react';

export default function TestimonialsManagement() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/testimonials')
            .then(res => res.json())
            .then(data => {
                setTestimonials(data);
                setLoading(false);
            });
    }, []);

    const updateStatus = async (id, status) => {
        const updatedList = testimonials.map(t => t.id === id ? { ...t, status } : t);
        const res = await fetch('/api/testimonials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList)
        });
        if (res.ok) {
            setTestimonials(updatedList);
        }
    };

    const handleDelete = async (id) => {
        const updatedList = testimonials.filter(t => t.id !== id);
        const res = await fetch('/api/testimonials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList)
        });
        if (res.ok) {
            setTestimonials(updatedList);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Testimonials Moderation</h2>
            </div>

            <div className="admin-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Rating</th>
                            <th>Comment</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testimonials.map((t) => (
                            <tr key={t.id}>
                                <td>{t.name}</td>
                                <td style={{ color: 'gold' }}>{'★'.repeat(t.rating)}</td>
                                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.comment}</td>
                                <td>
                                    <span className={`badge ${t.status === 'Approved' ? 'badge-approved' : 'badge-pending'}`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td>
                                    {t.status === 'Pending' ? (
                                        <button className="btn-small btn-edit" style={{ background: '#28a745' }} onClick={() => updateStatus(t.id, 'Approved')}>Approve</button>
                                    ) : (
                                        <button className="btn-small" style={{ background: '#6c757d' }} onClick={() => updateStatus(t.id, 'Pending')}>Unapprove</button>
                                    )}
                                    <button className="btn-small btn-delete" onClick={() => handleDelete(t.id)}>Reject / Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
