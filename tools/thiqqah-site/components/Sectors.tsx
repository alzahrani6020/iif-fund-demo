'use client';

import { motion } from 'framer-motion';
import { HardHat, Utensils, Factory, Plane } from 'lucide-react';
import Image from 'next/image';
import { translations, Lang } from '@/lib/i18n';
import { SectionHeading } from './SectionHeading';

const sectorImages = [
  '/assets/construction-crane.webp',
  '/assets/tower-city.webp',
  '/assets/modern-building.webp',
  '/assets/tower-city.webp',
];

export function Sectors({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const icons = [HardHat, Utensils, Factory, Plane];

  return (
    <section id="sectors" className="py-16 sm:py-24 bg-dark-800/50">
      <div className="container-modern">
        <SectionHeading kicker={t.sectors.kicker} title={t.sectors.title} />
        <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {t.sectors.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-modern overflow-hidden text-center group"
              >
                <div className="relative h-40 sm:h-44 overflow-hidden">
                  <Image
                    src={sectorImages[i]}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority={i < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />
                  <div className="absolute bottom-3 right-3 w-11 h-11 rounded-xl bg-dark/95 text-gold-400 flex items-center justify-center shadow-card">
                    <Icon size={22} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-base font-bold text-cream">{item.title}</h3>
                  <p className="mt-2 text-sm text-cream/50 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
