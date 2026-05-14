'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { siteConfig } from '@/lib/data';
import { translations, Lang } from '@/lib/i18n';

export function Navbar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#services', label: t.nav.services },
    { href: '#process', label: t.nav.process },
    { href: '#packages', label: t.nav.packages },
    { href: '#faq', label: t.nav.faq },
    { href: '#request', label: t.nav.request },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <>
      <div className="hidden sm:block bg-surface-50 border-b border-surface-200 text-sm">
        <div className="container-modern flex items-center justify-between py-2">
          <div className="flex items-center gap-5 text-surface-500">
            <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-1.5 hover:text-saudi-600 transition-colors" dir="ltr">
              <Phone size={13} />
              <span>{siteConfig.phoneDisplay}</span>
            </a>
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-1.5 hover:text-saudi-600 transition-colors">
              <Mail size={13} />
              <span>{siteConfig.email}</span>
            </a>
          </div>
          <span className="text-surface-400 text-xs font-semibold">{t.footer.cr}</span>
        </div>
      </div>

      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-surface-200' : 'bg-white'
      }`}>
        <div className="container-modern flex items-center justify-between py-3.5">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-saudi-500 flex items-center justify-center text-white font-bold text-xl">
              ث
            </div>
            <div className="leading-tight">
              <span className="block font-bold text-surface-900 text-base">{t.siteName}</span>
              <span className="block text-[11px] text-surface-500">{t.siteTagline}</span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-0.5">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="px-3.5 py-2 text-sm font-semibold text-surface-600 hover:text-saudi-600 transition-colors rounded-lg hover:bg-surface-50">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2.5">
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="px-3.5 py-2 text-sm font-semibold text-surface-500 border border-surface-200 rounded-lg hover:border-saudi-500 hover:text-saudi-600 transition-all">
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            <a href="#request" className="btn-primary text-sm">
              {t.nav.request}
            </a>
          </div>

          <button className="lg:hidden p-2 rounded-lg hover:bg-surface-100 text-surface-600" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden bg-white border-t border-surface-200">
              <div className="container-modern py-3 flex flex-col gap-0.5">
                {links.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2.5 px-3 text-surface-700 font-semibold hover:text-saudi-600 hover:bg-surface-50 rounded-lg transition-all">
                    {l.label}
                  </a>
                ))}
                <div className="flex items-center gap-2 pt-3 mt-2 border-t border-surface-100">
                  <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex-1 py-2.5 text-sm font-semibold text-surface-500 border border-surface-200 rounded-lg hover:border-saudi-500 hover:text-saudi-600 transition-all">
                    {lang === 'ar' ? 'English' : 'العربية'}
                  </button>
                  <a href="#request" className="btn-primary text-sm flex-1" onClick={() => setOpen(false)}>
                    {t.nav.request}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
