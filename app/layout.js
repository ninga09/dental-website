import './globals.css';
import LayoutWrapper from './LayoutWrapper';

export const metadata = {
  title: 'Royal Care Dental – Premium Oral Healthcare',
  description: 'Royal Care Dental Clinic in Kenya - Modern dental services, expert doctors, and seamless online booking for your perfect smile.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
