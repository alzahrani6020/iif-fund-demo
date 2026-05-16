'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Building2, Users, Clock, Award } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

function useTypewriter(text: string, speed: number = 70, delay: number = 0) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    setDisplayed('');
    const timer = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, started]);

  return displayed;
}

export function Hero({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const line1 = lang === 'ar' ? 'نؤسس شركتك' : 'We establish your';
  const line2 = lang === 'ar' ? 'بثقة ووضوح' : 'company with trust';
  const typed1 = useTypewriter(line1, 80, 400);
  const typed2 = useTypewriter(line2, 80, 400 + line1.length * 80 + 300);

  const stats = [
    { icon: Clock, value: t.stats.years, label: t.stats.yearsLabel },
    { icon: Building2, value: t.stats.entities, label: t.stats.entitiesLabel },
    { icon: Users, value: '1000+', label: lang === 'ar' ? 'عميل راضٍ' : 'Happy Clients' },
    { icon: Award, value: '50+', label: lang === 'ar' ? 'جهة حكومية' : 'Government Entities' },
  ];

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          src="/assets/modern-building.jpg"
          alt=""
          fill
          className="object-cover scale-110"
          priority
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] via-[#0A1628]/90 to-[#0A1628]/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-[#0A1628]/30" />

      {/* Decorative gold glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/[0.06] rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Content */}
      <div className="container-modern relative flex-1 flex items-center pt-32 pb-12">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-bold mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            {t.hero.eyebrow}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-white min-h-[2.2em]"
          >
            <span className="block">{typed1}</span>
            <span className="block text-[#D4AF37]">{typed2}</span>
            <span className="inline-block w-[3px] h-[0.9em] bg-[#D4AF37] ml-1 animate-pulse align-middle" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 text-lg sm:text-xl text-white/60 leading-relaxed max-w-xl"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="#request"
              className="inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-[#0A1628] bg-gradient-to-r from-[#D4AF37] to-[#B8960B] rounded-2xl shadow-[0_8px_30px_rgba(212,160,55,0.4)] hover:shadow-[0_12px_40px_rgba(212,160,55,0.6)] hover:scale-[1.02] transition-all duration-300"
            >
              {t.hero.ctaPrimary}
              <ArrowLeft size={20} className="rtl:rotate-180" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-white border border-white/20 rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all duration-300"
            >
              {t.hero.ctaSecondary}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Trust Bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="relative z-10"
      >
        <div className="container-modern pb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all duration-300"
              >
                <stat.icon size={24} className="mx-auto text-[#D4AF37] mb-3" />
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="text-sm text-white/50 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A1628] to-transparent pointer-events-none" />
    </section>
  );
}
