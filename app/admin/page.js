"use client";
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [stats, setStats] = useState([
        { label: 'Total Appointments', value: '...' },
        { label: "Today's Appointments", value: '...' },
        { label: 'Pending Appointments', value: '...' },
        { label: 'Total Reviews', value: '...' },
        { label: 'Website Visitors', value: '5,420' }, // Placeholder for now
    ]);
    const [recentAppointments, setRecentAppointments] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const [appRes, reviewRes] = await Promise.all([
                fetch('/api/appointments'),
                fetch('/api/testimonials')
            ]);

            const apps = await appRes.json();
            const reviews = await reviewRes.json();

            const today = new Date().toISOString().split('T')[0];
            const todayApps = apps.filter(a => a.date === today);
            const pendingApps = apps.filter(a => a.status === 'Pending');

            setStats([
                { label: 'Total Appointments', value: apps.length.toString() },
                { label: "Today's Appointments", value: todayApps.length.toString() },
                { label: 'Pending Appointments', value: pendingApps.length.toString() },
                { label: 'Total Reviews', value: reviews.length.toString() },
                { label: 'Website Visitors', value: '5,420' },
            ]);

            setRecentAppointments(apps.slice(0, 5));
        };

        fetchDashboardData();
    }, []);

    return (
        <div>
            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-card">
                        <h3>{stat.label}</h3>
                        <div className="value">{stat.value}</div>
                    </div>
                ))}
            </div>

            <section style={{ marginTop: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Recent Appointment Requests</h2>
                <div className="admin-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Service</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAppointments.map((app) => (
                                <tr key={app.id}>
                                    <td>{app.patient_name}</td>
                                    <td>{app.service}</td>
                                    <td>{app.date}</td>
                                    <td>
                                        <span className={`badge badge-${app.status.toLowerCase()}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
