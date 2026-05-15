'use client';

import { motion } from 'framer-motion';
import { translations, Lang } from '@/lib/i18n';
import { SectionHeading } from './SectionHeading';

export function Process({ lang }: { lang: Lang }) {
  const t = translations[lang];

  return (
    <section id="process" className="py-16 sm:py-24 bg-white">
      <div className="container-modern">
        <SectionHeading kicker={t.process.kicker} title={t.process.title} centered />
        <div className="mt-10 sm:mt-14 relative">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-saudi-200 via-saudi-400 to-saudi-200 rounded-full" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {t.process.steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-surface border-2 border-saudi-200 flex items-center justify-center shadow-card relative z-10">
                  <span className="text-2xl font-extrabold text-gradient">{step.num}</span>
                </div>
                <h3 className="mt-6 text-base font-bold text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm text-ink-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
