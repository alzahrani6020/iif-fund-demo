'use client';

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import { SectionHeading } from './SectionHeading';

export function Privacy({ lang }: { lang: Lang }) {
  const t = translations[lang];

  return (
    <section id="privacy" className="py-16 sm:py-24 bg-dark-800/50">
      <div className="container-modern max-w-3xl">
        <SectionHeading kicker={t.privacy.kicker} title={t.privacy.title} centered />
        <div className="mt-10 sm:mt-14 space-y-3">
          {t.privacy.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 card-modern p-6"
            >
              <div className="w-11 h-11 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>
              <p className="text-sm text-cream/70 leading-relaxed pt-2">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
