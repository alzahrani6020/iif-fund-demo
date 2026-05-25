'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Lang } from '@/lib/i18n';

const testimonials = {
  ar: [
    {
      name: 'أحمد السبيعي',
      role: 'مدير عام، شركة السبيعي للتجارة',
      text: 'أنجزوا تأسيس شركتنا في ٤ أيام فقط. التواصل كان احترافياً والإجراءات سلسة بشكل مذهل.',
      rating: 5,
    },
    {
      name: 'فاطمة الزهراني',
      role: 'صاحبة مؤسسة، مجال التجميل',
      text: 'ساعدوني في استخراج الترخيص البلدي والاشتراطات الصحية. ما كنت أتصور أنه يصير بهالسرعة.',
      rating: 5,
    },
    {
      name: 'خالد العتيبي',
      role: 'مستثمر، قطاع المقاولات',
      text: 'تعاملت معهم في تأسيس فرع لشركتنا في جدة. الدقة في المواعيد والمتابعة اليومية ممتازة.',
      rating: 5,
    },
    {
      name: 'نورة القحطاني',
      role: 'مديرة مالية، شركة ناشئة',
      text: 'الخدمة المالية والمحاسبية من ثقة الذهبية وفرت علينا وقت وجهد كبير. أنصح فيهم بقوة.',
      rating: 5,
    },
  ],
  en: [
    {
      name: 'Ahmad Al-Subaie',
      role: 'GM, Al-Subaie Trading Co.',
      text: 'They established our company in just 4 days. Communication was professional and procedures were amazingly smooth.',
      rating: 5,
    },
    {
      name: 'Fatima Al-Zahrani',
      role: 'Owner, Beauty Startup',
      text: 'They helped me obtain the municipal license and health requirements. I never imagined it could be this fast.',
      rating: 5,
    },
    {
      name: 'Khaled Al-Otaibi',
      role: 'Investor, Construction Sector',
      text: 'We worked with them to establish our branch in Jeddah. Precision in deadlines and daily follow-up is excellent.',
      rating: 5,
    },
    {
      name: 'Noura Al-Qahtani',
      role: 'CFO, Startup Company',
      text: 'Thiqqah\'s financial and accounting services saved us a lot of time and effort. Highly recommended.',
      rating: 5,
    },
  ],
};

export function Testimonials({ lang }: { lang: Lang }) {
  const [index, setIndex] = useState(0);
  const items = testimonials[lang];

  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#0A1628] via-[#0d1e30] to-[#0A1628] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container-modern relative">
        <div className="text-center mb-14">
          <span className="section-kicker mb-3">{lang === 'ar' ? 'آراء عملائنا' : 'Client Testimonials'}</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4">
            {lang === 'ar' ? 'يثقون بنا' : 'They Trust Us'}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="card-modern p-8 md:p-10 text-center relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[#D4AF37]/20 rotate-180" />

              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: items[index].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>

              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 font-medium">
                "{items[index].text}"
              </p>

              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8960B] flex items-center justify-center text-[#0A1628] font-bold text-lg">
                  {items[index].name.charAt(0)}
                </div>
                <div className="text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <p className="font-bold text-white">{items[index].name}</p>
                  <p className="text-sm text-white/50">{items[index].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={20} className={lang === 'ar' ? '' : 'rotate-180'} />
            </button>

            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === index ? 'bg-[#D4AF37] w-8' : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all"
              aria-label="Next"
            >
              <ChevronRight size={20} className={lang === 'ar' ? '' : 'rotate-180'} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
