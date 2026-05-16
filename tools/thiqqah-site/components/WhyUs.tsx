'use client';

import { motion } from 'framer-motion';
import { FileText, ClipboardCheck, ShieldCheck, Scaling } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import { SectionHeading } from './SectionHeading';

export function WhyUs({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const icons = [FileText, ClipboardCheck, ShieldCheck, Scaling];

  return (
    <section id="why" className="py-16 sm:py-24 bg-dark">
      <div className="container-modern">
        <SectionHeading kicker={t.why.kicker} title={t.why.title} description={t.why.desc} />
        <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {t.why.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-modern p-7 text-center group"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-white transition-all duration-300">
                  <Icon size={26} />
                </div>
                <h3 className="mt-5 text-base font-bold text-cream">{item.title}</h3>
                <p className="mt-2 text-sm text-cream/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
