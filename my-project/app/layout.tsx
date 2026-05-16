import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { TypographyControls } from '@/components/typography-controls'
import { Tajawal, Amiri } from 'next/font/google'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap',
})

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2e1065',
}

export const metadata: Metadata = {
  title: 'محمد عيضة الزهراني | شاعر وباحث في التراث الشعبي',
  description: 'منصة ثقافية تجمع الشعر النبطي والقصائد الصوتية ومفردات ولهجات زهران والأمثال الشعبية والمقالات الثقافية',
  // generator removed — production ready
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
      <body className={`${tajawal.variable} ${amiri.variable} font-sans antialiased`}>
        {children}
        <TypographyControls />
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        {/* Cloudflare Web Analytics — أضف التوكن الحقيقي قبل النشر */}
        {/* <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "YOUR_CF_ANALYTICS_TOKEN"}'></script> */}
      </body>
    </html>
  )
}
