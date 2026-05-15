'use client';

import { motion } from 'framer-motion';
import { Check, Star, ArrowLeft } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import { SectionHeading } from './SectionHeading';

export function Packages({ lang }: { lang: Lang }) {
  const t = translations[lang];

  return (
    <section id="packages" className="py-16 sm:py-24 bg-white">
      <div className="container-modern">
        <SectionHeading kicker={t.packages.kicker} title={t.packages.title} description={t.packages.desc} centered />

        <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
          {t.packages.items.map((pkg, i) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative card-modern p-7 sm:p-8 flex flex-col ${
                ('featured' in pkg && pkg.featured)
                  ? 'bg-gradient-to-br from-saudi-700 to-saudi-900 text-white border-transparent shadow-glow lg:-mt-4 lg:mb-4'
                  : ''
              }`}
            >
              {('featured' in pkg && pkg.featured) && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-gold-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-soft">
                  <Star size={12} /> {lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                </span>
              )}
              <h3 className={`text-lg font-bold ${('featured' in pkg && pkg.featured) ? 'text-white' : 'text-ink-900'}`}>{pkg.title}</h3>
              <p className={`mt-2 text-sm leading-relaxed flex-1 ${('featured' in pkg && pkg.featured) ? 'text-white/80' : 'text-ink-500'}`}>{pkg.desc}</p>
              <ul className="mt-6 sm:mt-7 space-y-3">
                {pkg.features.map((f) => (
                  <li key={f} className={`flex items-center gap-3 text-sm ${('featured' in pkg && pkg.featured) ? 'text-white/90' : 'text-ink-700'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${('featured' in pkg && pkg.featured) ? 'bg-white/20 text-white' : 'bg-saudi-50 text-saudi-600'}`}>
                      <Check size={12} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#request"
                className={`mt-7 sm:mt-8 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all ${
                  ('featured' in pkg && pkg.featured)
                    ? 'bg-white text-saudi-800 hover:bg-gold-50 shadow-soft'
                    : 'border border-saudi-600 text-saudi-600 hover:bg-saudi-600 hover:text-white'
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
