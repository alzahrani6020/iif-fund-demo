'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Stats } from '@/components/Stats';
import { PathPicker } from '@/components/PathPicker';
import { Formation } from '@/components/Formation';
import { WhyUs } from '@/components/WhyUs';
import { Services } from '@/components/Services';
import { Packages } from '@/components/Packages';
import { Sectors } from '@/components/Sectors';
import { Process } from '@/components/Process';
import { Documents } from '@/components/Documents';
import { FAQ } from '@/components/FAQ';
import { RequestForm } from '@/components/RequestForm';
import { Contact } from '@/components/Contact';
import { Privacy } from '@/components/Privacy';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { Lang } from '@/lib/i18n';

export default function Home() {
  const [lang, setLang] = useState<Lang>('ar');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('lang');
      if (q === 'en' || q === 'ar') {
        localStorage.setItem('thiqqah-site-lang', q);
        setLang(q);
      } else {
        const saved = localStorage.getItem('thiqqah-site-lang') as Lang | null;
        if (saved === 'en' || saved === 'ar') setLang(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('thiqqah-site-lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <main>
        <Hero lang={lang} />
        <Stats lang={lang} />
        <PathPicker lang={lang} />
        <Formation lang={lang} />
        <WhyUs lang={lang} />
        <Services lang={lang} />
        <Packages lang={lang} />
        <Sectors lang={lang} />
        <Process lang={lang} />
        <Documents lang={lang} />
        <FAQ lang={lang} />
        <RequestForm lang={lang} />
        <Contact lang={lang} />
        <Privacy lang={lang} />
      </main>
      <Footer lang={lang} />
      <WhatsAppFloat lang={lang} />
    </>
  );
}
