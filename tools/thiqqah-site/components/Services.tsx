'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Building2, FileCheck, Landmark, Settings, Globe, ShieldCheck,
  TrendingUp, Home, ClipboardList, Users, User, CalendarClock, Plane,
  FolderOpen, Truck, Scale, Zap, HeartPulse, Tag, Ship, Monitor,
  Factory, Heart, UserCheck, ArrowLeftRight, GraduationCap, BookOpen
} from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import { services, ServiceCategory } from '@/lib/data';
import { SectionHeading } from './SectionHeading';

const iconMap: Record<string, React.ElementType> = {
  Building2, FileCheck, Landmark, Settings, Globe, ShieldCheck,
  TrendingUp, Home, ClipboardList, Users, User, CalendarClock, Plane,
  FolderOpen, Truck, Scale, Zap, HeartPulse, Tag, Ship, Monitor,
  Factory, Heart, UserCheck, ArrowLeftRight, GraduationCap, BookOpen
};

export function Services({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [filter, setFilter] = useState<ServiceCategory>('all');
  const [query, setQuery] = useState('');

  const tabs: { key: ServiceCategory; label: string }[] = [
    { key: 'all', label: t.services.tabs.all },
    { key: 'popular', label: t.services.tabs.popular },
    { key: 'business', label: t.services.tabs.business },
    { key: 'authority', label: t.services.tabs.authority },
    { key: 'finance', label: t.services.tabs.finance },
    { key: 'social', label: t.services.tabs.social },
    { key: 'travel', label: t.services.tabs.travel },
  ];

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesFilter = filter === 'all' || s.category.includes(filter);
      if (!query) return matchesFilter;
      const searchFields = lang === 'ar'
        ? [s.title, s.desc, ...s.features]
        : [s.titleEn, s.descEn, ...s.featuresEn];
      const matchesQuery = searchFields.some((f) =>
        f.toLowerCase().includes(query.toLowerCase())
      );
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, lang]);

  return (
    <section id="services" className="py-16 sm:py-24 bg-ink-50">
      <div className="container-modern">
        <SectionHeading kicker={t.services.kicker} title={t.services.title} description={t.services.desc} />

        <div className="mt-8 sm:mt-10 relative max-w-xl">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400" size={20} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.services.searchPlaceholder}
            className="input-modern pr-12"
          />
        </div>

        <div className="mt-4 sm:mt-5 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                filter === tab.key
                  ? 'bg-saudi-800 text-white shadow-soft'
                  : 'bg-white text-ink-600 border border-ink-200 hover:border-saudi-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-8 sm:mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((s) => {
              const Icon = iconMap[s.icon] || Building2;
              const title = lang === 'ar' ? s.title : s.titleEn;
              const desc = lang === 'ar' ? s.desc : s.descEn;
              const feats = lang === 'ar' ? s.features : s.featuresEn;
              return (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="card-modern p-5 sm:p-6 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-saudi-50 text-saudi-700 flex items-center justify-center group-hover:bg-saudi-800 group-hover:text-white transition-all">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-ink-900">{title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-ink-500 leading-relaxed">{desc}</p>
                  <ul className="mt-4 space-y-2">
                    {feats.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-ink-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-saudi-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-ink-400">{lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}</p>
        )}
      </div>
    </section>
  );
}
