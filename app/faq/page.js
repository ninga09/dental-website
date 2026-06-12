export default function FAQPage() {
    const faqs = [
        {
            q: 'What are your opening hours?',
            a: 'We are open Monday‑Friday 8:00 AM – 6:00 PM, Saturday 9:00 AM – 2:00 PM.'
        },
        {
            q: 'Do you accept insurance?',
            a: 'Yes, we work with most major dental insurance providers.'
        },
        {
            q: 'How can I book an emergency appointment?',
            a: 'Call our emergency line at +1 (555) 123‑4567 or use the online booking form and select “Emergency Services”.'
        },
        {
            q: 'What payment methods do you accept?',
            a: 'Cash, credit cards, and major digital wallets. We also offer financing options.'
        }
    ];

    return (
        <main className="container" style={{ marginTop: '2rem' }}>
            <h1 className="fade-in">Frequently Asked Questions</h1>
            <dl>
                {faqs.map((item, i) => (
                    <div key={i} className="glass" style={{ padding: '1rem', marginBottom: '1rem' }}>
                        <dt style={{ fontWeight: '600' }}>{item.q}</dt>
                        <dd>{item.a}</dd>
                    </div>
                ))}
            </dl>
        </main>
    );
}
