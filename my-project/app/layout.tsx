import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { TypographyControls } from '@/components/typography-controls'
import './globals.css'

export const metadata: Metadata = {
  title: 'محمد عيضة الزهراني | شاعر وباحث في التراث الشعبي',
  description: 'منصة ثقافية تجمع الشعر النبطي والقصائد الصوتية ومفردات ولهجات زهران والأمثال الشعبية والمقالات الثقافية',
  generator: 'v0.app',
  keywords: ['شعر نبطي', 'تراث زهران', 'شعر شعبي', 'محمد عيضة الزهراني', 'أمثال شعبية', 'لهجة زهرانية'],
  authors: [{ name: 'محمد عيضة الزهراني' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        <TypographyControls />
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
