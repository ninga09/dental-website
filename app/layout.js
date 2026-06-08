import './globals.css';

export const metadata = {
  title: 'Dental Clinic – Premium Care',
  description: 'Modern dental clinic website with online booking, services, doctors, and patient reviews.',
  viewport: 'width=device-width, initial-scale=1',
  charset: 'utf-8',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="glass">
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
