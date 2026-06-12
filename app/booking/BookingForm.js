"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './BookingForm.module.css';

export default function BookingForm() {
    const searchParams = useSearchParams();
    const initialService = searchParams.get('service') || '';

    const [services, setServices] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [form, setForm] = useState({
        service: initialService,
        doctor: '',
        date: '',
        time: '',
        name: '',
        email: '',
        phone: '',
    });
    const [status, setStatus] = useState(null);

    useEffect(() => {
        // Fetch Services
        fetch('/api/services')
            .then(res => res.json())
            .then(data => setServices(data));

        // Fetch Active Doctors
        fetch('/api/doctors')
            .then(res => res.json())
            .then(data => setDoctors(data.filter(d => d.status === 'Active')));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setStatus('success');
                setForm({ service: '', doctor: '', date: '', time: '', name: '', email: '', phone: '' });
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className="fade-in">Schedule Your Visit</h2>

            <div className="form-group">
                <label>Treatment Category</label>
                <select name="service" value={form.service} onChange={handleChange} required>
                    <option value="" disabled>Select Service</option>
                    {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                    {!services.length && <option>General Dentistry</option>}
                </select>
            </div>

            <div className="form-group">
                <label>Preferred Specialist</label>
                <select name="doctor" value={form.doctor} onChange={handleChange} required>
                    <option value="" disabled>Select Doctor</option>
                    {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    {!doctors.length && <option>Any Available Doctor</option>}
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label>Preferred Date</label>
                    <input type="date" name="date" value={form.date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Time Slot</label>
                    <input type="time" name="time" value={form.time} onChange={handleChange} required />
                </div>
            </div>

            <div className="form-group">
                <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
            </div>

            <button type="submit" className="button" style={{ width: '100%', padding: '1rem' }} disabled={status === 'sending'}>
                {status === 'sending' ? 'Processing...' : 'Confirm Appointment'}
            </button>
            {status === 'success' && <p className={styles.success}>✅ Success! We will contact you shortly.</p>}
            {status === 'error' && <p className={styles.error}>❌ Failed to book. Please try again.</p>}
        </form>
    );
}
