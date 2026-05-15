'use client';

import { translations, Lang } from '@/lib/i18n';
import { siteConfig } from '@/lib/data';
import Image from 'next/image';

export function Footer({ lang }: { lang: Lang }) {
  const t = translations[lang];

  const links = [
    { href: '#services', label: t.nav.services },
    { href: '#pick-path', label: lang === 'ar' ? 'اختر مسارك' : 'Choose Path' },
    { href: '#company-formation', label: lang === 'ar' ? 'مسار التأسيس' : 'Formation' },
    { href: '#process', label: t.nav.process },
    { href: '#faq', label: t.nav.faq },
    { href: '#privacy', label: lang === 'ar' ? 'الخصوصية' : 'Privacy' },
  ];

  return (
    <footer className="bg-ink-900 text-ink-300 py-12 sm:py-14">
      <div className="container-modern">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-9 h-9">
                <Image src="/assets/thiqqah-logo.png" alt="شعار ثقة الذهبية" fill className="object-contain" />
              </div>
              <h3 className="text-white font-bold text-base">{t.footer.title}</h3>
            </div>
            <p className="text-sm text-ink-400 leading-relaxed">{t.footer.desc}</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs mb-4 uppercase tracking-wider">{t.footer.links}</h4>
            <div className="space-y-2">
              {links.map((l) => (
                <a key={l.href} href={l.href} className="block text-sm text-ink-400 hover:text-white transition-colors">{l.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs mb-4 uppercase tracking-wider">{t.footer.data}</h4>
            <div className="space-y-2 text-sm text-ink-400">
              <p>{t.footer.cr}</p>
              <p>{lang === 'ar' ? 'الجوال:' : 'Phone:'} <a href={`tel:${siteConfig.phone}`} className="text-ink-300 hover:text-white transition-colors" dir="ltr">{siteConfig.phoneDisplay}</a></p>
              <p>{lang === 'ar' ? 'البريد:' : 'Email:'} <a href={`mailto:${siteConfig.email}`} className="text-ink-300 hover:text-white transition-colors">{siteConfig.email}</a></p>
              <p className="text-ink-500 text-xs mt-4">{t.footer.publishNote}</p>
            </div>
          </div>
        </div>
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/5 text-center text-xs text-ink-600">
          © {new Date().getFullYear()} {t.siteName}. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  );
}
