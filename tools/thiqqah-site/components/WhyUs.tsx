'use client';

import { motion } from 'framer-motion';
import { FileText, ClipboardCheck, ShieldCheck, Scaling } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import { SectionHeading } from './SectionHeading';

export function WhyUs({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const icons = [FileText, ClipboardCheck, ShieldCheck, Scaling];

  return (
    <section id="why" className="py-16 sm:py-24 bg-white">
      <div className="container-modern">
        <SectionHeading kicker={t.why.kicker} title={t.why.title} description={t.why.desc} />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.why.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-modern p-6 text-center group"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-surface-50 text-surface-600 flex items-center justify-center group-hover:bg-saudi-500 group-hover:text-white transition-all">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 text-base font-bold text-surface-900">{item.title}</h3>
                <p className="mt-2 text-sm text-surface-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
