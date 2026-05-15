import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/lib/data';

export const metadata: Metadata = {
  title: 'ثقة الذهبية | تأسيس شركات وخدمات عامة في السعودية',
  description: 'ثقة الذهبية مكتب خدمات عامة في السعودية لتأسيس الشركات، التراخيص البلدية والبناء، متابعة الجهات الحكومية ومدن الصناعية، إدارة الأملاك والمشاريع، خدمات الأفراد، وتأشيرات السفر.',
  keywords: 'تأسيس شركة في السعودية, تأسيس شركة في جدة, مكتب خدمات عامة في جدة, تراخيص بلدية, تراخيص بناء, متابعة الجهات الحكومية, متابعة مدن الصناعية, إدارة الأملاك, إدارة المشاريع, خدمات المستثمر الأجنبي, تأشيرات السفر للخارج',
  authors: [{ name: 'ثقة الذهبية' }],
  creator: 'ثقة الذهبية',
  publisher: 'ثقة الذهبية',
  robots: 'index, follow',
  alternates: {
    canonical: siteConfig.url,
    languages: { 'ar': siteConfig.url, 'en': `${siteConfig.url}/?lang=en` },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    url: siteConfig.url,
    siteName: 'ثقة الذهبية',
    title: 'ثقة الذهبية | تأسيس شركات وخدمات عامة في السعودية',
    description: 'ثقة الذهبية مكتب خدمات عامة في السعودية لتأسيس الشركات، التراخيص البلدية والبناء، متابعة الجهات الحكومية ومدن الصناعية، إدارة الأملاك والمشاريع، خدمات الأفراد، وتأشيرات السفر.',
    images: [{ url: `${siteConfig.url}/assets/thiqqah-logo-full.png`, width: 1200, height: 630, alt: 'شعار ثقة الذهبية' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ثقة الذهبية | تأسيس شركات وخدمات عامة في السعودية',
    description: 'ثقة الذهبية مكتب خدمات عامة في السعودية لتأسيس الشركات، التراخيص البلدية والبناء، متابعة الجهات الحكومية ومدن الصناعية، إدارة الأملاك والمشاريع، خدمات الأفراد، وتأشيرات السفر.',
    images: [`${siteConfig.url}/assets/thiqqah-logo-full.png`],
  },
  other: {
    'apple-mobile-web-app-title': 'ثقة الذهبية',
    'application-name': 'ثقة الذهبية',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/#webpage`,
      url: siteConfig.url,
      name: 'ثقة الذهبية | تأسيس شركات وخدمات عامة في السعودية',
      datePublished: '2024-11-30T13:24:38.658Z',
      dateModified: new Date().toISOString(),
      isPartOf: { '@type': 'WebSite', url: siteConfig.url, name: 'ثقة الذهبية للخدمات العامة وتأسيس الأعمال' },
      about: { '@id': `${siteConfig.url}/#business` },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${siteConfig.url}/#business`,
      name: 'ثقة الذهبية للخدمات العامة وتأسيس الأعمال',
      alternateName: ['Thiqah Golden', 'Thiqah Al Dhahabiyah'],
      url: siteConfig.url,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      areaServed: { '@type': 'Country', name: 'المملكة العربية السعودية' },
      address: { '@type': 'PostalAddress', addressCountry: 'SA', addressRegion: 'منطقة مكة المكرمة', addressLocality: 'جدة' },
      identifier: { '@type': 'PropertyValue', propertyID: 'commercial_registration', name: 'السجل التجاري', value: siteConfig.cr },
      description: 'خدمات عامة وتأسيس شركات وتراخيص ومتابعة جهات حكومية في السعودية.',
      logo: `${siteConfig.url}/assets/thiqqah-logo-full.png`,
      image: `${siteConfig.url}/assets/thiqqah-logo-full.png`,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="canonical" href={siteConfig.url} />
        <link rel="alternate" hrefLang="ar" href={siteConfig.url} />
        <link rel="alternate" hrefLang="en" href={`${siteConfig.url}/?lang=en`} />
        <link rel="alternate" hrefLang="x-default" href={siteConfig.url} />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://api.whatsapp.com" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/thiqqah-logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preload" href="/assets/fonts/noto-naskh-arabic-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/thiqqah-logo-full.png" as="image" type="image/png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');` }} />
          </>
        )}
      </head>
      <body className="antialiased bg-white text-ink-900">
        {children}
      </body>
    </html>
  );
}
