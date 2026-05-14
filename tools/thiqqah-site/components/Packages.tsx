'use client';

import { motion } from 'framer-motion';
import { Check, Star, ArrowLeft } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import { SectionHeading } from './SectionHeading';

export function Packages({ lang }: { lang: Lang }) {
  const t = translations[lang];

  return (
    <section id="packages" className="py-16 sm:py-24 bg-surface-50">
      <div className="container-modern">
        <SectionHeading kicker={t.packages.kicker} title={t.packages.title} description={t.packages.desc} centered />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.packages.items.map((pkg, i) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative card-modern p-7 flex flex-col ${
                ('featured' in pkg && pkg.featured) ? 'border-saudi-400 shadow-card ring-1 ring-saudi-500/20' : ''
              }`}
            >
              {('featured' in pkg && pkg.featured) && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-saudi-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-soft">
                  <Star size={12} /> {lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                </span>
              )}
              <h3 className="text-lg font-bold text-surface-900">{pkg.title}</h3>
              <p className="mt-2 text-sm text-surface-500 leading-relaxed flex-1">{pkg.desc}</p>
              <ul className="mt-5 space-y-2.5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-surface-700">
                    <span className="w-5 h-5 rounded-full bg-saudi-50 text-saudi-600 flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#request"
                className={`mt-7 inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-bold text-sm transition-all ${
                  ('featured' in pkg && pkg.featured)
                    ? 'bg-saudi-500 text-white hover:bg-saudi-600 shadow-soft'
                    : 'border border-surface-200 text-surface-700 hover:border-saudi-400 hover:text-saudi-600'
                }`}
              >
                {lang === 'ar' ? 'اطلب الباقة' : 'Select Package'} <ArrowLeft size={16} className="rtl:rotate-180" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
