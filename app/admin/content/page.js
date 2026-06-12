"use client";
import { useState, useEffect } from 'react';

export default function ContentManagement() {
    const [activeTab, setActiveTab] = useState('homepage');
    const [content, setContent] = useState({
        clinicName: '',
        homepage: { headline: '', subtext: '' },
        about: { title: '', mission: '', history: '' },
        contact: { email: '', phone: '', whatsapp: '', address: '', hours: { weekdays: '', saturday: '', sunday: '' } }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                // Merge loaded data with defaults to prevent "undefined" errors
                setContent(prev => ({
                    ...prev,
                    ...data,
                    homepage: { ...prev.homepage, ...data.homepage },
                    about: { ...prev.about, ...data.about },
                    contact: {
                        ...prev.contact,
                        ...data.contact,
                        hours: { ...prev.contact.hours, ...data.contact?.hours }
                    }
                }));
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load content:', err);
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
        else alert('Failed to save changes.');
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <p style={{ opacity: 0.6 }}>Loading content settings...</p>
        </div>
    );

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Content Management</h2>

            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '2rem',
                background: 'rgba(255,255,255,0.05)',
                padding: '0.5rem',
                borderRadius: '12px',
                width: 'fit-content'
            }}>
                {['homepage', 'about', 'contact'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            background: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                            color: '#fff',
                            border: 'none',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            fontWeight: activeTab === tab ? '600' : '400',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="glass" style={{ padding: '2.5rem', borderRadius: '20px' }}>
                <div className="form-group" style={{ marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', color: 'var(--color-primary)' }}>Dental Clinic Name</label>
                    <input
                        type="text"
                        value={content.clinicName || ''}
                        onChange={(e) => setContent({ ...content, clinicName: e.target.value })}
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                </div>

                {activeTab === 'homepage' && (
                    <div className="fade-in">
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Hero Headline</label>
                            <input
                                type="text"
                                value={content.homepage?.headline || ''}
                                onChange={(e) => handleChange('homepage', 'headline', e.target.value)}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Hero Subtext</label>
                            <textarea
                                value={content.homepage?.subtext || ''}
                                onChange={(e) => handleChange('homepage', 'subtext', e.target.value)}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', minHeight: '100px' }}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="fade-in">
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>About Page Title</label>
                            <input
                                type="text"
                                value={content.about?.title || ''}
                                onChange={(e) => handleChange('about', 'title', e.target.value)}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Mission Statement</label>
                            <textarea
                                value={content.about?.mission || ''}
                                onChange={(e) => handleChange('about', 'mission', e.target.value)}
                                rows={5}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Clinic History</label>
                            <textarea
                                value={content.about?.history || ''}
                                onChange={(e) => handleChange('about', 'history', e.target.value)}
                                rows={5}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                                <input
                                    type="email"
                                    value={content.contact?.email || ''}
                                    onChange={(e) => handleChange('contact', 'email', e.target.value)}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone Number</label>
                                <input
                                    type="text"
                                    value={content.contact?.phone || ''}
                                    onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>WhatsApp (e.g. 254700000000)</label>
                            <input
                                type="text"
                                value={content.contact?.whatsapp || ''}
                                onChange={(e) => handleChange('contact', 'whatsapp', e.target.value)}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Physical Address</label>
                            <input
                                type="text"
                                value={content.contact?.address || ''}
                                onChange={(e) => handleChange('contact', 'address', e.target.value)}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                            />
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '15px' }}>
                            <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--color-primary)' }}>Opening Hours</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', opacity: 0.8 }}>Weekdays</label>
                                    <input
                                        type="text"
                                        value={content.contact?.hours?.weekdays || ''}
                                        onChange={(e) => setContent({ ...content, contact: { ...content.contact, hours: { ...content.contact.hours, weekdays: e.target.value } } })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', opacity: 0.8 }}>Saturdays</label>
                                    <input
                                        type="text"
                                        value={content.contact?.hours?.saturday || ''}
                                        onChange={(e) => setContent({ ...content, contact: { ...content.contact, hours: { ...content.contact.hours, saturday: e.target.value } } })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', opacity: 0.8 }}>Sundays</label>
                                    <input
                                        type="text"
                                        value={content.contact?.hours?.sunday || ''}
                                        onChange={(e) => setContent({ ...content, contact: { ...content.contact, hours: { ...content.contact.hours, sunday: e.target.value } } })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                    <button onClick={handleSave} className="button" style={{
                        padding: '1.2rem 2.5rem',
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                    }}>
                        Save All Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
