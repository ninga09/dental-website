"use client";
import { useState, useEffect } from 'react';

export default function AppointmentManagement() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/appointments')
            .then(res => res.json())
            .then(data => {
                setAppointments(data);
                setLoading(false);
            });
    }, []);

    const updateStatus = async (id, status) => {
        const appointment = appointments.find(a => a.id === id);
        const res = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...appointment, status })
        });
        if (res.ok) {
            setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Appointments Management</h2>
            </div>

            <div className="admin-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Contact</th>
                            <th>Service</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((app) => (
                            <tr key={app.id}>
                                <td>{app.patient_name}</td>
                                <td>{app.email}<br /><small>{app.phone}</small></td>
                                <td>{app.service}</td>
                                <td>{app.date} | {app.time}</td>
                                <td>
                                    <span className={`badge badge-${app.status.toLowerCase()}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td>
                                    {app.status === 'Pending' && (
                                        <>
                                            <button className="btn-small btn-edit" style={{ background: '#28a745' }} onClick={() => updateStatus(app.id, 'Approved')}>Approve</button>
                                            <button className="btn-small btn-delete" onClick={() => updateStatus(app.id, 'Cancelled')}>Cancel</button>
                                        </>
                                    )}
                                    <a
                                        href={`https://wa.me/${app.phone ? app.phone.replace(/[^\d]/g, '') : ''}?text=Hi ${app.patient_name}, this is Premium Dental Clinic regarding your appointment for ${app.service}.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-small"
                                        style={{ background: '#25D366', color: '#fff', textDecoration: 'none', display: 'inline-block' }}
                                    >
                                        WhatsApp
                                    </a>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
