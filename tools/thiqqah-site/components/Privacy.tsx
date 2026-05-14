'use client';

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import { SectionHeading } from './SectionHeading';

export function Privacy({ lang }: { lang: Lang }) {
  const t = translations[lang];

  return (
    <section id="privacy" className="py-16 sm:py-24 bg-surface-50">
      <div className="container-modern max-w-3xl">
        <SectionHeading kicker={t.privacy.kicker} title={t.privacy.title} centered />
        <div className="mt-12 space-y-3">
          {t.privacy.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 card-modern p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-saudi-50 text-saudi-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <p className="text-sm text-surface-700 leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
