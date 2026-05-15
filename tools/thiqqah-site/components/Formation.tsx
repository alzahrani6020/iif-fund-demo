'use client';

import { motion } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import { SectionHeading } from './SectionHeading';

export function Formation({ lang }: { lang: Lang }) {
  const t = translations[lang];

  return (
    <section id="company-formation" className="py-16 sm:py-24 bg-surface">
      <div className="container-modern">
        <SectionHeading kicker={t.formation.kicker} title={t.formation.title} description={t.formation.desc} />

        <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 gap-5 sm:gap-6">
          {t.formation.cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-modern p-7 group hover:border-saudi-400"
            >
              <h3 className="text-lg font-bold text-ink-900">{card.title}</h3>
              <p className="mt-3 text-ink-500 text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-5 sm:mt-6 card-modern p-7 bg-white"
        >
          <ul className="grid sm:grid-cols-2 gap-4">
            {t.formation.checklist.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-saudi-50 text-saudi-600 flex items-center justify-center shrink-0 border border-saudi-200">
                  <Check size={12} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#request" className="btn-primary">{t.formation.cta}</a>
          <a href="#services" className="btn-outline">{t.formation.ctaSecondary} <ArrowLeft size={16} className="rtl:rotate-180" /></a>
        </div>
      </div>
    </section>
  );
}
