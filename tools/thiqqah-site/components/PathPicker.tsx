'use client';

import { motion } from 'framer-motion';
import { Building2, FileCheck, Landmark, ArrowLeft } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import { SectionHeading } from './SectionHeading';

export function PathPicker({ lang }: { lang: Lang }) {
  const t = translations[lang];

  const paths = [
    { icon: Building2, title: t.paths.formation, desc: t.paths.formationDesc, href: '#company-formation' },
    { icon: FileCheck, title: t.paths.licenses, desc: t.paths.licensesDesc, href: '#request' },
    { icon: Landmark, title: t.paths.followup, desc: t.paths.followupDesc, href: '#request' },
  ];

  return (
    <section id="pick-path" className="py-16 sm:py-24 bg-dark">
      <div className="container-modern">
        <SectionHeading kicker={t.paths.title} title={t.paths.title} description={t.paths.subtitle} centered />
        <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {paths.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group card-modern p-7 sm:p-8 flex flex-col gap-4 hover:border-gold-500/40"
            >
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-white transition-all duration-300">
                <p.icon size={26} />
              </div>
              <h3 className="text-lg font-bold text-cream">{p.title}</h3>
              <p className="text-cream/50 text-sm leading-relaxed flex-1">{p.desc}</p>
              <span className="inline-flex items-center gap-2 text-gold-400 font-bold text-sm group-hover:gap-3 transition-all">
                {lang === 'ar' ? 'استكشف المسار' : 'Explore path'} <ArrowLeft size={16} className="rtl:rotate-180" />
              </span>
            </motion.a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="#services" className="inline-flex items-center gap-2 text-gold-400 font-bold hover:text-gold-300 transition-colors text-sm">
            {t.paths.allServices} <ArrowLeft size={16} className="rtl:rotate-180" />
          </a>
        </div>
      </div>
    </section>
  );
}
