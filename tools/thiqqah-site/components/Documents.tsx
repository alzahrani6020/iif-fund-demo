'use client';

import { motion } from 'framer-motion';
import { Check, FileOutput } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';

export function Documents({ lang }: { lang: Lang }) {
  const t = translations[lang];

  const required = lang === 'ar' ? [
    'نوع النشاط أو وصف مختصر للمشروع',
    'مدينة العمل والفرع المطلوب',
    'بيانات المالك أو الشركاء',
    'أي رخصة أو سجل سابق إن وجد',
  ] : [
    'Activity type or brief project description',
    'City and branch required',
    'Owner or partner details',
    'Any previous license or CR',
  ];

  const outputs = lang === 'ar' ? [
    'خطة إجراءات مختصرة',
    'قائمة مستندات واضحة',
    'متابعة حالة الطلبات',
    'إرشاد لما بعد اكتمال التأسيس',
  ] : [
    'Short action plan',
    'Clear document checklist',
    'Request status follow-up',
    'Post-formation guidance',
  ];

  return (
    <section id="documents" className="py-16 sm:py-24 bg-ink-50">
      <div className="container-modern">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card-modern p-6 sm:p-7">
            <span className="section-kicker mb-3 inline-flex">{t.documents.required.kicker}</span>
            <h3 className="text-xl sm:text-2xl font-bold text-ink-900 mt-3">{t.documents.required.title}</h3>
            <ul className="mt-5 sm:mt-6 space-y-3">
              {required.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-700 text-sm">
                  <Check size={18} className="mt-0.5 text-saudi-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card-modern p-6 sm:p-7">
            <span className="section-kicker mb-3 inline-flex">{t.documents.output.kicker}</span>
            <h3 className="text-xl sm:text-2xl font-bold text-ink-900 mt-3">{t.documents.output.title}</h3>
            <ul className="mt-5 sm:mt-6 space-y-3">
              {outputs.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-700 text-sm">
                  <FileOutput size={18} className="mt-0.5 text-gold-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
