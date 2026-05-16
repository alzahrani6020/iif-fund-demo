'use client';

import { motion } from 'framer-motion';
import { translations, Lang } from '@/lib/i18n';
import { SectionHeading } from './SectionHeading';

export function Process({ lang }: { lang: Lang }) {
  const t = translations[lang];

  return (
    <section id="process" className="py-16 sm:py-24 bg-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-modern relative">
        <SectionHeading kicker={t.process.kicker} title={t.process.title} centered />
        <div className="mt-10 sm:mt-14 relative">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-gold-500/20 via-gold-500/40 to-gold-500/20 rounded-full" />
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
                <div className="w-24 h-24 mx-auto rounded-full bg-dark/80 border-2 border-gold-500/30 flex items-center justify-center shadow-glow relative z-10 backdrop-blur-sm">
                  <span className="text-2xl font-extrabold text-gradient">{step.num}</span>
                </div>
                <h3 className="mt-6 text-base font-bold text-cream">{step.title}</h3>
                <p className="mt-2 text-sm text-cream/50 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
