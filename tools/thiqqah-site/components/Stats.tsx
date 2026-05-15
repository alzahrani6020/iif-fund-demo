'use client';

import { motion } from 'framer-motion';
import { translations, Lang } from '@/lib/i18n';

export function Stats({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const items = [
    { value: t.stats.years, label: t.stats.yearsLabel },
    { value: t.stats.entities, label: t.stats.entitiesLabel },
    { value: t.stats.packages, label: t.stats.packagesLabel },
    { value: t.stats.support, label: t.stats.supportLabel },
  ];

  return (
    <section id="stats" className="relative py-10 sm:py-12 -mt-4 sm:-mt-6 z-10">
      <div className="container-modern">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 sm:p-8 text-center shadow-card border border-ink-200"
            >
              <p className="text-2xl sm:text-4xl font-extrabold text-gradient">{item.value}</p>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-ink-500 font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
