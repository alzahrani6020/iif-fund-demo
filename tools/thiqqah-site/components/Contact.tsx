'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import { siteConfig } from '@/lib/data';
import { SectionHeading } from './SectionHeading';

export function Contact({ lang }: { lang: Lang }) {
  const t = translations[lang];

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white">
      <div className="container-modern">
        <div className="text-center max-w-2xl mx-auto">
          <SectionHeading kicker={t.contact.kicker} title={t.contact.title} description={t.contact.desc} centered />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-3"
        >
          <a href={`https://wa.me/${siteConfig.phone.replace('+', '')}`} className="btn-primary">
            <MessageCircle size={18} /> {t.contact.whatsapp}
          </a>
          <a href={`tel:${siteConfig.phone}`} className="btn-outline">
            <Phone size={18} /> {t.contact.call}
          </a>
          <a href={`mailto:${siteConfig.email}`} className="btn-outline">
            <Mail size={18} /> {t.contact.email}
          </a>
        </motion.div>

        <p className="mt-6 text-center text-sm text-surface-400">{t.contact.replyHint}</p>

        <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <a href={`tel:${siteConfig.phone}`} className="card-modern p-6 text-center hover:border-saudi-300 transition-colors group">
            <Phone size={20} className="mx-auto text-saudi-600 group-hover:scale-110 transition-transform" />
            <strong className="block mt-3 text-surface-900">{t.contact.phoneLabel}</strong>
            <span className="block mt-1 text-sm text-surface-500" dir="ltr">{siteConfig.phoneDisplay}</span>
          </a>
          <a href={`mailto:${siteConfig.email}`} className="card-modern p-6 text-center hover:border-saudi-300 transition-colors group">
            <Mail size={20} className="mx-auto text-primary-600 group-hover:scale-110 transition-transform" />
            <strong className="block mt-3 text-surface-900">{t.contact.emailLabel}</strong>
            <span className="block mt-1 text-sm text-surface-500">{siteConfig.email}</span>
          </a>
        </div>

        <p className="mt-10 text-center text-xs text-surface-400 max-w-2xl mx-auto leading-relaxed">{t.contact.disclaimer}</p>
      </div>
    </section>
  );
}
