"use client";
import { useState, useEffect } from 'react';
import styles from './GallerySlider.module.css';

export default function GallerySlider({ items }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % items.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [items]);

    if (!items || items.length === 0) return (
        <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
            <p>No gallery images available yet.</p>
        </div>
    );

    return (
        <div className={styles.sliderContainer}>
            <div
                className={styles.track}
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {items.map((item, i) => (
                    <div key={i} className={styles.slide}>
                        <div
                            style={{
                                width: '100%',
                                height: '500px',
                                backgroundImage: `url(${item.url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '12px'
                            }}
                            role="img"
                            aria-label={item.name}
                        ></div>
                        <div className={styles.caption}>
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>

            {items.length > 1 && (
                <div className={styles.dots}>
                    {items.map((_, i) => (
                        <span
                            key={i}
                            className={`${styles.dot} ${current === i ? styles.active : ''}`}
                            onClick={() => setCurrent(i)}
                        ></span>
                    ))}
                </div>
            )}
        </div>
    );
}
