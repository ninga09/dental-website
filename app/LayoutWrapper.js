"use client";
import { usePathname } from 'next/navigation';
import Header from './components/Header';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');
    const [clinicName, setClinicName] = useState('Royal Care Dental');
    const [whatsapp, setWhatsapp] = useState('');

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    if (data.clinicName) setClinicName(data.clinicName);
                    if (data.contact && typeof data.contact.whatsapp === 'string') {
                        setWhatsapp(data.contact.whatsapp.replace(/[^\d]/g, ''));
                    }
                }
            })
            .catch(err => console.error('Failed to fetch layout content:', err));
    }, []);

    return (
        <>
            {!isAdmin && <Header clinicName={clinicName} />}
            {children}
            {!isAdmin && (
                <>
                    <Footer clinicName={clinicName} />
                    {whatsapp && (
                        <a
                            href={`https://wa.me/${whatsapp}?text=Hi ${clinicName}, I'd like to inquire about your dental services.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                position: 'fixed',
                                bottom: '2rem',
                                right: '2rem',
                                background: '#25D366',
                                padding: '1rem',
                                borderRadius: '50%',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                zIndex: 1000,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid rgba(255,255,255,0.2)',
                                transition: 'transform 0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.012 2c-5.508 0-9.987 4.479-9.987 9.987 0 1.763.46 3.42 1.262 4.853L2 22l5.335-1.4c1.39.758 2.966 1.187 4.646 1.187 5.508 0 9.987-4.479 9.987-9.987 0-5.508-4.479-9.987-9.987-9.987zM6.822 17.07l-.3-.178a8.275 8.275 0 01-3.184-6.905c0-4.568 3.717-8.285 8.285-8.285 4.568 0 8.285 3.717 8.285 8.285 0 4.568-3.717 8.285-8.285 8.285-1.528 0-3.023-.418-4.327-1.21l-.31-.19L4.1 18.06l1.012-3.14-.19-.31zM15.967 12.04c-.234-.117-1.385-.683-1.6-.762-.215-.078-.37-.117-.527.117-.156.234-.605.762-.742.918-.137.156-.273.176-.508.059-.234-.117-.985-.363-1.875-1.157-.694-.619-1.163-1.385-1.299-1.62-.137-.234-.014-.361.103-.477.105-.105.234-.273.351-.41.117-.137.156-.234.234-.39.078-.156.039-.293-.02-.41-.059-.117-.527-1.27-.723-1.738-.19-.46-.38-.398-.527-.406-.134-.007-.29-.007-.445-.007s-.41.059-.625.293c-.215.234-.82.801-.82 1.953s.84 2.266.957 2.422c.117.156 1.652 2.523 4.004 3.539.559.242.996.387 1.336.494.562.178 1.074.152 1.48.09.452-.068 1.385-.566 1.581-1.113.195-.547.195-1.016.137-1.113-.059-.098-.215-.156-.45-.273z" />
                            </svg>
                        </a>
                    )}
                </>
            )}
        </>
    );
}
