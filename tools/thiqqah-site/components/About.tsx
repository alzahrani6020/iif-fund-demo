'use client';

import { motion } from 'framer-motion';
import { translations, Lang } from '@/lib/i18n';
import { SectionHeading } from './SectionHeading';

export function About({ lang }: { lang: Lang }) {
  const t = translations[lang];

  const pills = lang === 'ar'
    ? ['وضوح قبل التنفيذ', 'متابعة خطوة بخطوة', 'تجهيز مستندات', 'تجربة عربية بالكامل']
    : ['Clarity before execution', 'Step-by-step follow-up', 'Document preparation', 'Fully Arabic experience'];

  return (
    <section id="about" className="py-16 sm:py-24 bg-dark relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gold-500/[0.04] rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      
      <div className="container-modern relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden border border-gold-500/20 shadow-glow">
              <div className="w-full h-[300px] sm:h-[360px] bg-gradient-to-br from-dark-600/50 to-dark-800/50 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-dark/80 border border-gold-500/20 flex items-center justify-center mb-4 shadow-glow">
                    <span className="text-3xl font-extrabold text-gold-400">ث</span>
                  </div>
                  <p className="text-cream font-bold text-lg">{t.siteName}</p>
                  <p className="text-cream/50 text-sm mt-1">{t.siteTagline}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeading
              kicker={lang === 'ar' ? 'من نحن' : 'About Us'}
              title={lang === 'ar' ? 'شريك إداري يختصر عليك تعقيد الإجراءات.' : 'An administrative partner that simplifies procedures for you.'}
            />
            <p className="mt-5 text-cream/60 leading-relaxed">
              {lang === 'ar'
                ? 'نعمل كحلقة وصل منظمة بين العميل والجهات ذات العلاقة. هدفنا أن يعرف صاحب المشروع ماذا يحتاج، لماذا يحتاجه، ومتى يكتمل، بدون تشتيت بين المتطلبات والمنصات المختلفة.'
                : 'We serve as an organized link between the client and relevant authorities. Our goal is for the project owner to know what they need, why they need it, and when it will be completed—without distraction between requirements and different platforms.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {pills.map((pill) => (
                <span key={pill} className="px-4 py-2 bg-gold-500/10 text-gold-300 text-sm font-semibold rounded-full border border-gold-500/20">
                  {pill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
