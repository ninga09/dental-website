"use client";
import { useState, useEffect } from 'react';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            });
    }, []);

    const toggleStatus = async (user) => {
        const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...user, status: newStatus })
        });
        if (res.ok) {
            setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>User Management</h2>
                <button className="button">Add New User</button>
            </div>

            <div className="admin-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <span style={{
                                        color: user.status === 'Active' ? '#28a745' : '#dc3545',
                                        fontWeight: '600'
                                    }}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-small btn-edit">Edit</button>
                                    <button className="btn-small btn-delete" onClick={() => toggleStatus(user)}>
                                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
