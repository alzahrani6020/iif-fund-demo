import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thiqqah | تأسيس شركات وخدمات حكومية',
  description: 'موقع خدمات ثقة الذهبية بنمط Dark Luxury لتأسيس الشركات والتراخيص والمتابعة في السعودية.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
