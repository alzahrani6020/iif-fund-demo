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
    <section id="documents" className="py-16 sm:py-24 bg-dark-800/50">
      <div className="container-modern">
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card-modern p-7 sm:p-8">
            <span className="section-kicker mb-4 inline-flex">{t.documents.required.kicker}</span>
            <h3 className="text-xl sm:text-2xl font-bold text-cream mt-4">{t.documents.required.title}</h3>
            <ul className="mt-6 sm:mt-7 space-y-3.5">
              {required.map((item) => (
                <li key={item} className="flex items-start gap-3 text-cream/70 text-sm">
                  <Check size={18} className="mt-0.5 text-gold-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card-modern p-7 sm:p-8">
            <span className="section-kicker mb-4 inline-flex">{t.documents.output.kicker}</span>
            <h3 className="text-xl sm:text-2xl font-bold text-cream mt-4">{t.documents.output.title}</h3>
            <ul className="mt-6 sm:mt-7 space-y-3.5">
              {outputs.map((item) => (
                <li key={item} className="flex items-start gap-3 text-cream/70 text-sm">
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
