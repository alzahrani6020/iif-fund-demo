'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import Image from 'next/image';

export function Hero({ lang }: { lang: Lang }) {
  const t = translations[lang];

  return (
    <section className="relative bg-surface-50 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-saudi-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-900/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="container-modern relative pt-10 pb-16 sm:pt-14 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="tag-green mb-6">
              <Sparkles size={14} />
              {t.hero.eyebrow}
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.15] tracking-tight text-surface-900">
              {lang === 'ar' ? 'نؤسس شركتك في ' : 'We establish your company in '}
              <span className="text-gradient">{lang === 'ar' ? 'السعودية' : 'Saudi Arabia'}</span>
              {lang === 'ar' ? ' بثقة ووضوح من أول خطوة.' : ' with trust and clarity from day one.'}
            </h1>

            <p className="mt-6 text-lg text-surface-600 leading-relaxed max-w-lg">
              {t.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#request" className="btn-primary">
                {t.hero.ctaPrimary}
              </a>
              <a href="#services" className="btn-outline">
                {t.hero.ctaSecondary}
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="relative hidden lg:block">
            <div className="relative rounded-[1.5rem] overflow-hidden shadow-elevated border border-surface-200">
              <Image src="/assets/modern-building.webp" alt="مبنى حديث" width={800} height={600} className="w-full h-[380px] object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-900/50 to-transparent" />
              <div className="absolute bottom-5 right-5">
                <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur text-saudi-700 text-sm font-bold px-4 py-2 rounded-xl shadow-soft">
                  {lang === 'ar' ? 'تأسيس، تراخيص، متابعة' : 'Formation, Licenses, Follow-up'}
                </span>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-5 shadow-card border border-surface-200 z-10">
              <p className="text-3xl font-extrabold text-gradient">{t.stats.years}</p>
              <p className="text-sm text-surface-500 mt-1">{t.stats.yearsLabel}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="absolute -top-3 -right-3 bg-white rounded-2xl p-4 shadow-card border border-surface-200 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-saudi-50 flex items-center justify-center">
                  <Sparkles size={18} className="text-saudi-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-surface-900">{t.stats.entities}</p>
                  <p className="text-xs text-surface-500">{t.stats.entitiesLabel}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="hidden sm:flex justify-center mt-14">
          <a href="#stats" className="animate-bounce text-surface-400 hover:text-saudi-600 transition-colors">
            <ArrowDown size={22} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
