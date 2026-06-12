"use client";
import { useState, useEffect } from 'react';

export default function ContentManagement() {
    const [activeTab, setActiveTab] = useState('homepage');
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                setContent(data);
                setLoading(false);
            });
    }, []);

    const handleChange = (section, field, value) => {
        setContent({
            ...content,
            [section]: {
                ...content[section],
                [field]: value
            }
        });
    };

    const handleSave = async () => {
        const res = await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content)
        });
        if (res.ok) alert('Content updated successfully!');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Content Management</h2>
            <div style={{ display: 'flex', gap: '1rem', margin: '2rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', overflowX: 'auto' }}>
                {['homepage', 'about', 'contact'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            background: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                            color: '#fff',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="admin-form">
                <div className="form-group">
                    <label>Dental Clinic Name</label>
                    <input
                        type="text"
                        value={content.clinicName || ''}
                        onChange={(e) => setContent({ ...content, clinicName: e.target.value })}
                    />
                </div>
                {activeTab === 'homepage' && (

                    <>
                        <div className="form-group">
                            <label>Banner Headline</label>
                            <input
                                type="text"
                                value={content.homepage.headline}
                                onChange={(e) => handleChange('homepage', 'headline', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Banner Subtext</label>
                            <textarea
                                value={content.homepage.subtext}
                                onChange={(e) => handleChange('homepage', 'subtext', e.target.value)}
                            />
                        </div>
                    </>
                )}
                {activeTab === 'about' && (
                    <>
                        <div className="form-group">
                            <label>About Title</label>
                            <input
                                type="text"
                                value={content.about.title}
                                onChange={(e) => handleChange('about', 'title', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mission Statement</label>
                            <textarea
                                value={content.about.mission}
                                onChange={(e) => handleChange('about', 'mission', e.target.value)}
                                rows={5}
                            />
                        </div>
                        <div className="form-group">
                            <label>History</label>
                            <textarea
                                value={content.about.history}
                                onChange={(e) => handleChange('about', 'history', e.target.value)}
                                rows={5}
                            />
                        </div>
                    </>
                )}
                {activeTab === 'contact' && (
                    <>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={content.contact.email}
                                onChange={(e) => handleChange('contact', 'email', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number (Public View)</label>
                            <input
                                type="text"
                                value={content.contact.phone}
                                onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>WhatsApp Number (International Format, e.g., 254700000000)</label>
                            <input
                                type="text"
                                value={content.contact.whatsapp || ''}
                                onChange={(e) => handleChange('contact', 'whatsapp', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Physical Address (Used for Google Maps)</label>
                            <input
                                type="text"
                                value={content.contact.address}
                                onChange={(e) => handleChange('contact', 'address', e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                            <label style={{ opacity: 0.7, fontSize: '0.9rem' }}>Opening Hours</label>
                            <div className="form-group">
                                <label>Weekdays</label>
                                <input
                                    type="text"
                                    value={content.contact.hours?.weekdays || ''}
                                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, hours: { ...content.contact.hours, weekdays: e.target.value } } })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Saturdays</label>
                                <input
                                    type="text"
                                    value={content.contact.hours?.saturday || ''}
                                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, hours: { ...content.contact.hours, saturday: e.target.value } } })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Sundays</label>
                                <input
                                    type="text"
                                    value={content.contact.hours?.sunday || ''}
                                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, hours: { ...content.contact.hours, sunday: e.target.value } } })}
                                />
                            </div>
                        </div>

                    </>
                )}
                <button onClick={handleSave} className="button" style={{ width: 'fit-content', marginTop: '2rem' }}>Save All Changes</button>
            </div>
        </div>
    );
}
