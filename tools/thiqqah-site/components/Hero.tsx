'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, ArrowLeft } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import Image from 'next/image';

export function Hero({ lang }: { lang: Lang }) {
  const t = translations[lang];

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-saudi-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="container-modern relative pt-10 sm:pt-16 pb-20 sm:pb-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="tag-green mb-6"
            >
              <Sparkles size={14} />
              {t.hero.eyebrow}
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight text-ink-900">
              {lang === 'ar' ? (
                <>
                  نؤسس شركتك في{' '}
                  <span className="text-saudi-600">السعودية</span>{' '}
                  بثقة ووضوح من أول خطوة
                </>
              ) : (
                <>
                  We establish your company in{' '}
                  <span className="text-saudi-600">Saudi Arabia</span>{' '}
                  with trust and clarity from day one
                </>
              )}
            </h1>

            <p className="mt-5 sm:mt-7 text-base sm:text-lg text-ink-500 leading-relaxed max-w-lg">
              {t.hero.subtitle}
            </p>

            <div className="mt-8 sm:mt-10 flex flex-wrap gap-3">
              <a href="#request" className="btn-primary">
                {t.hero.ctaPrimary}
                <ArrowLeft size={18} className="rtl:rotate-180" />
              </a>
              <a href="#services" className="btn-ghost">
                {t.hero.ctaSecondary}
              </a>
            </div>
          </motion.div>

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-glow border-2 border-saudi-100">
              <Image
                src="/assets/modern-building.webp"
                alt="مبنى حديث"
                width={700}
                height={520}
                className="w-full h-[340px] xl:h-[400px] object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-saudi-900/30 to-transparent" />
              {/* Floating badge */}
              <div className="absolute bottom-5 right-5">
                <span className="inline-flex items-center gap-2 bg-white/95 backdrop-blur text-saudi-700 text-sm font-bold px-5 py-2.5 rounded-xl shadow-card">
                  {lang === 'ar' ? 'تأسيس · تراخيص · متابعة' : 'Formation · Licenses · Follow-up'}
                </span>
              </div>
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-float border border-saudi-100 z-10"
            >
              <p className="text-3xl font-extrabold text-gradient">{t.stats.years}</p>
              <p className="text-sm text-ink-500 mt-1">{t.stats.yearsLabel}</p>
            </motion.div>

            {/* Floating entities card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-float border border-saudi-100 z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-saudi-50 flex items-center justify-center">
                  <Sparkles size={20} className="text-saudi-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-ink-900">{t.stats.entities}</p>
                  <p className="text-xs text-ink-500">{t.stats.entitiesLabel}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="hidden sm:flex justify-center mt-16 sm:mt-20"
        >
          <a href="#stats" className="animate-bounce text-ink-300 hover:text-saudi-500 transition-colors">
            <ArrowDown size={24} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
