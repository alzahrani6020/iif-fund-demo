'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { siteConfig } from '@/lib/data';
import { translations, Lang } from '@/lib/i18n';
import Image from 'next/image';

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
      {/* Top bar */}
      <div className="hidden sm:block bg-saudi-900 text-white/80 text-xs sm:text-sm">
        <div className="container-modern flex items-center justify-between py-2">
          <div className="flex items-center gap-4 sm:gap-5">
            <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors" dir="ltr">
              <Phone size={13} />
              <span>{siteConfig.phoneDisplay}</span>
            </a>
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail size={13} />
              <span className="hidden sm:inline">{siteConfig.email}</span>
            </a>
          </div>
          <span className="text-white/50 text-xs font-semibold">{t.footer.cr}</span>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-ink-200' : 'bg-white'
      }`}>
        <div className="container-modern flex items-center justify-between py-3 sm:py-3.5">
          <a href="/" className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10">
              <Image src="/assets/thiqqah-logo.png" alt="شعار ثقة الذهبية" fill className="object-contain" priority />
            </div>
            <div className="leading-tight">
              <span className="block font-bold text-ink-900 text-sm sm:text-base">{t.siteName}</span>
              <span className="block text-[10px] sm:text-[11px] text-ink-500">{t.siteTagline}</span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-0.5">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="px-3.5 py-2 text-sm font-semibold text-ink-600 hover:text-saudi-700 transition-colors rounded-lg hover:bg-saudi-50">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2.5">
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="px-3.5 py-2 text-sm font-semibold text-ink-500 border border-ink-200 rounded-lg hover:border-saudi-500 hover:text-saudi-700 transition-all">
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            <a href="#request" className="btn-primary text-sm">
              {t.nav.request}
            </a>
          </div>

          <button className="lg:hidden p-2.5 rounded-xl hover:bg-saudi-50 text-ink-600 touch-target" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden bg-white border-t border-ink-200">
              <div className="container-modern py-3 flex flex-col gap-0.5">
                {links.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 px-4 text-ink-700 font-semibold hover:text-saudi-700 hover:bg-saudi-50 rounded-xl transition-all">
                    {l.label}
                  </a>
                ))}
                <div className="flex items-center gap-2 pt-3 mt-2 border-t border-ink-100">
                  <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex-1 py-3 text-sm font-semibold text-ink-500 border border-ink-200 rounded-lg hover:border-saudi-500 hover:text-saudi-700 transition-all">
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
