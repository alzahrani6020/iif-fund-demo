'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import { siteConfig } from '@/lib/data';
import { SectionHeading } from './SectionHeading';

export function Contact({ lang }: { lang: Lang }) {
  const t = translations[lang];

  return (
    <section id="contact" className="py-16 sm:py-24 bg-dark-800/50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-modern relative">
        <div className="text-center max-w-2xl mx-auto">
          <SectionHeading kicker={t.contact.kicker} title={t.contact.title} description={t.contact.desc} centered />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-14 flex flex-wrap justify-center gap-3"
        >
          <a href={`https://wa.me/${siteConfig.phone.replace('+', '')}`} className="btn-primary">
            <MessageCircle size={18} /> {t.contact.whatsapp}
          </a>
          <a href={`tel:${siteConfig.phone}`} className="btn-outline">
            <Phone size={18} /> {t.contact.call}
          </a>
          <a href={`mailto:${siteConfig.email}`} className="btn-ghost">
            <Mail size={18} /> {t.contact.email}
          </a>
        </motion.div>

        <p className="mt-6 sm:mt-8 text-center text-sm text-cream/40">{t.contact.replyHint}</p>

        <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 gap-5 max-w-xl mx-auto">
          <a href={`tel:${siteConfig.phone}`} className="card-modern p-6 sm:p-7 text-center hover:border-gold-500/40 transition-colors group">
            <Phone size={22} className="mx-auto text-gold-500 group-hover:scale-110 transition-transform" />
            <strong className="block mt-4 text-cream">{t.contact.phoneLabel}</strong>
            <span className="block mt-1 text-sm text-cream/50" dir="ltr">{siteConfig.phoneDisplay}</span>
          </a>
          <a href={`mailto:${siteConfig.email}`} className="card-modern p-6 sm:p-7 text-center hover:border-gold-500/40 transition-colors group">
            <Mail size={22} className="mx-auto text-gold-500 group-hover:scale-110 transition-transform" />
            <strong className="block mt-4 text-cream">{t.contact.emailLabel}</strong>
            <span className="block mt-1 text-sm text-cream/50">{siteConfig.email}</span>
          </a>
        </div>

        <p className="mt-10 sm:mt-12 text-center text-xs text-cream/30 max-w-2xl mx-auto leading-relaxed">{t.contact.disclaimer}</p>
      </div>
    </section>
  );
}
