import { Suspense } from 'react';
import BookingForm from './BookingForm';

export default function BookingPage() {
    return (
        <main className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            <Suspense fallback={<div>Loading form...</div>}>
                <BookingForm />
            </Suspense>
        </main>
    );
}

