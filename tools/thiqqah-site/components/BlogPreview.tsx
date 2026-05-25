'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { Lang } from '@/lib/i18n';

const posts = {
  ar: [
    {
      title: 'دليلك الشامل لتأسيس شركة في السعودية 2026',
      excerpt: 'خطوات تأسيس الشركة من اختيار النشاط إلى استخراج السجل التجاري — كل ما تحتاج معرفته في دليل واحد.',
      date: '15 مايو 2026',
      readTime: '8 دقائق',
      tag: 'تأسيس الشركات',
    },
    {
      title: 'التراخيص البلدية: أنواعها ومتطلباتها',
      excerpt: 'ما الفرق بين رخصة البناء والترخيص البلدي والترخيص الصناعي؟ وكم تستغرق كل منها؟',
      date: '10 مايو 2026',
      readTime: '6 دقائق',
      tag: 'التراخيص',
    },
    {
      title: 'كيف تختار العنوان الوطني المناسب لشركتك',
      excerpt: 'العنوان الوطني ليس مجرد عنوان — إنه بابك للحصول على تراخيص وتصاريح حكومية متعددة.',
      date: '2 مايو 2026',
      readTime: '5 دقائق',
      tag: 'العنوان الوطني',
    },
  ],
  en: [
    {
      title: 'Complete Guide to Company Formation in Saudi Arabia 2026',
      excerpt: 'Step-by-step guide from selecting activity to obtaining CR — everything you need in one place.',
      date: 'May 15, 2026',
      readTime: '8 min read',
      tag: 'Company Formation',
    },
    {
      title: 'Municipal Licenses: Types & Requirements',
      excerpt: 'What is the difference between building permit, municipal license, and industrial license?',
      date: 'May 10, 2026',
      readTime: '6 min read',
      tag: 'Licenses',
    },
    {
      title: 'How to Choose the Right National Address',
      excerpt: 'National Address is not just an address — it is your gateway to multiple government licenses.',
      date: 'May 2, 2026',
      readTime: '5 min read',
      tag: 'National Address',
    },
  ],
};

export function BlogPreview({ lang }: { lang: Lang }) {
  const items = posts[lang];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#0A1628] via-[#0d1e30] to-[#0A1628] relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container-modern relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
          <div>
            <span className="section-kicker mb-3">{lang === 'ar' ? 'المدونة' : 'Blog'}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4">
              {lang === 'ar' ? 'أحدث المقالات' : 'Latest Articles'}
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-modern group cursor-pointer"
            >
              <div className="p-6">
                <span className="tag-gold text-xs mb-4 inline-block">{post.tag}</span>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{post.excerpt}</p>

                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>
              </div>

              <div className="px-6 pb-5">
                <span className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-bold group-hover:gap-3 transition-all">
                  {lang === 'ar' ? 'اقرأ المقال' : 'Read Article'}
                  <ArrowLeft size={16} className="rtl:rotate-180" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
