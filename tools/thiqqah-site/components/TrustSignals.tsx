'use client';

import { motion } from 'framer-motion';
import { FileCheck, Route, Layers } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import { SectionHeading } from './SectionHeading';

const signalsData = {
  ar: [
    { icon: FileCheck, title: 'متطلبات قبل البدء', desc: 'توضيح ما يُطلب عادة قبل الصرف أو الإرسال حتى لا تُضاعف الزيارات غير المجدية للجهات.' },
    { icon: Route, title: 'متابعة بأسطر واضحة', desc: 'ذكر الجهة والغرض في كل خطوة متابعة يسهّل على العميل فهم حالة ملفه.' },
    { icon: Layers, title: 'خبرة في مسارات متنوعة', desc: 'مسارات حكومية وتجارية وصناعية وسياحية وخدمات أفراد وفق نطاق عمل المكتب.' },
  ],
  en: [
    { icon: FileCheck, title: 'Requirements Before Starting', desc: 'Clarifying what is usually required before spending or submitting to avoid unnecessary visits.' },
    { icon: Route, title: 'Clear Step-by-Step Follow-up', desc: 'Mentioning the authority and purpose at each step makes it easy for the client to understand their file status.' },
    { icon: Layers, title: 'Experience in Diverse Paths', desc: 'Government, commercial, industrial, tourism, and individual services according to the office scope.' },
  ]
};

export function TrustSignals({ lang }: { lang: Lang }) {
  const data = signalsData[lang];

  return (
    <section id="trust-signals" className="py-16 sm:py-24 bg-white">
      <div className="container-modern">
        <SectionHeading
          kicker={lang === 'ar' ? 'ثقة منظمة' : 'Organized Trust'}
          title={lang === 'ar' ? 'لماذا يهمّ العملاء وضوح المسار؟' : 'Why does clarity matter to clients?'}
          description={lang === 'ar' ? 'لا نعرض شهادات وهمية؛ نركز على أسلوب عمل يقلل الغموض ويوضح الخطوات أمام صاحب المنشأة.' : 'We do not display fake certificates; we focus on a work approach that reduces ambiguity and clarifies steps.'}
        />

        <div className="mt-10 sm:mt-14 grid sm:grid-cols-3 gap-5 sm:gap-6">
          {data.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-modern p-7 sm:p-8 text-center group"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-saudi-50 text-saudi-600 flex items-center justify-center group-hover:bg-saudi-600 group-hover:text-white transition-all duration-300 mb-5">
                  <Icon size={28} />
                </div>
                <h3 className="text-base font-bold text-ink-900">{item.title}</h3>
                <p className="mt-3 text-sm text-ink-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
