'use client';

import Image from 'next/image';
import { translations, Lang } from '@/lib/i18n';
import { siteConfig } from '@/lib/data';

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
    <footer className="bg-saudi-900 text-white/70 py-14 sm:py-16">
      <div className="container-modern">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-10 h-10">
                <Image src="/assets/thiqqah-logo.png" alt="شعار ثقة الذهبية" fill className="object-contain" />
              </div>
              <h3 className="text-white font-bold text-base">{t.footer.title}</h3>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">{t.footer.desc}</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs mb-5 uppercase tracking-wider">{t.footer.links}</h4>
            <div className="space-y-2.5">
              {links.map((l) => (
                <a key={l.href} href={l.href} className="block text-sm text-white/50 hover:text-white transition-colors">{l.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs mb-5 uppercase tracking-wider">{t.footer.data}</h4>
            <div className="space-y-2.5 text-sm text-white/50">
              <p>{t.footer.cr}</p>
              <p>{lang === 'ar' ? 'الجوال:' : 'Phone:'} <a href={`tel:${siteConfig.phone}`} className="text-white/70 hover:text-white transition-colors" dir="ltr">{siteConfig.phoneDisplay}</a></p>
              <p>{lang === 'ar' ? 'البريد:' : 'Email:'} <a href={`mailto:${siteConfig.email}`} className="text-white/70 hover:text-white transition-colors">{siteConfig.email}</a></p>
              <p className="text-white/30 text-xs mt-5">{t.footer.publishNote}</p>
            </div>
          </div>
        </div>
        <div className="mt-12 sm:mt-14 pt-8 border-t border-white/10 text-center text-xs text-white/30">
          © {new Date().getFullYear()} {t.siteName}. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  );
}
