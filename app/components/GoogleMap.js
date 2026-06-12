"use client";

export default function GoogleMap({ address = "123 Smile Avenue, Dental City", height = "450px" }) {
    // We'll use a standard Google Maps iframe embed for an "Address"
    // For a real app, users would provide their specific CID or API key, 
    // but a search embed is perfect for a starter.
    const encodedAddress = encodeURIComponent(address);
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_API_KEY&q=${encodedAddress}`;

    // Since we don't have an API key, we'll use the free "Search" output which is standard for quick embeds
    const freeMapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return (
        <div style={{ width: '100%', height: height, borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={freeMapUrl}
                allowFullScreen
            ></iframe>
        </div>
    );
}
