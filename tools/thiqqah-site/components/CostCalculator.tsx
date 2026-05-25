'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Building2, FileCheck, Landmark, Users, Plane, ArrowLeft } from 'lucide-react';
import { Lang } from '@/lib/i18n';

const options = {
  ar: {
    title: 'حاسبة التكلفة التقريبية',
    subtitle: 'احسب تكلفة تأسيس شركتك في دقيقة واحدة',
    companyType: 'نوع الشركة',
    types: [
      { id: 'llc', label: 'ذات مسؤولية محدودة', base: 5000 },
      { id: 'jsc', label: 'مساهمة مقفلة', base: 12000 },
      { id: 'sp', label: 'مؤسسة فردية', base: 2500 },
      { id: 'branch', label: 'فرع شركة أجنبية', base: 15000 },
    ],
    extras: [
      { id: 'license', label: 'الترخيص البلدي', price: 3000, icon: FileCheck },
      { id: 'cr', label: 'السجل التجاري', price: 1500, icon: Landmark },
      { id: 'visa', label: 'تأشيرة عامل واحد', price: 2500, icon: Users },
      { id: 'address', label: 'العنوان الوطني', price: 800, icon: Building2 },
      { id: 'travel', label: 'تأشيرة سفر', price: 1800, icon: Plane },
    ],
    total: 'التكلفة التقريبية',
    currency: 'ريال سعودي',
    cta: 'اطلب عرض سعر دقيق',
    note: 'الأسعار تقريبية وتخضع للتغيير حسب متطلبات كل حالة.',
  },
  en: {
    title: 'Cost Estimator',
    subtitle: 'Calculate your company formation cost in one minute',
    companyType: 'Company Type',
    types: [
      { id: 'llc', label: 'Limited Liability', base: 5000 },
      { id: 'jsc', label: 'Closed JSC', base: 12000 },
      { id: 'sp', label: 'Sole Proprietorship', base: 2500 },
      { id: 'branch', label: 'Foreign Branch', base: 15000 },
    ],
    extras: [
      { id: 'license', label: 'Municipal License', price: 3000, icon: FileCheck },
      { id: 'cr', label: 'Commercial Registration', price: 1500, icon: Landmark },
      { id: 'visa', label: 'Work Visa (1)', price: 2500, icon: Users },
      { id: 'address', label: 'National Address', price: 800, icon: Building2 },
      { id: 'travel', label: 'Travel Visa', price: 1800, icon: Plane },
    ],
    total: 'Estimated Cost',
    currency: 'SAR',
    cta: 'Request Exact Quote',
    note: 'Prices are approximate and subject to change based on case requirements.',
  },
};

export function CostCalculator({ lang }: { lang: Lang }) {
  const t = options[lang];
  const [selectedType, setSelectedType] = useState(t.types[0].id);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const type = t.types.find((x) => x.id === selectedType)!;
  const extrasTotal = t.extras
    .filter((x) => selectedExtras.includes(x.id))
    .reduce((sum, x) => sum + x.price, 0);
  const total = type.base + extrasTotal;

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#0A1628] via-[#0d1e30] to-[#0A1628] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container-modern relative">
        <div className="text-center mb-14">
          <span className="section-kicker mb-3">{lang === 'ar' ? 'التكلفة' : 'Pricing'}</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4">{t.title}</h2>
          <p className="mt-3 text-white/50 max-w-lg mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Left: Options */}
          <div className="space-y-6">
            {/* Company Type */}
            <div>
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#D4AF37]" />
                {t.companyType}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {t.types.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-xl border text-right transition-all ${
                      selectedType === type.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <p className="font-bold text-sm">{type.label}</p>
                    <p className="text-[#D4AF37] font-bold mt-1">
                      {type.base.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en')}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div>
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#D4AF37]" />
                {lang === 'ar' ? 'الخدمات الإضافية' : 'Additional Services'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {t.extras.map((extra) => {
                  const Icon = extra.icon;
                  const isSelected = selectedExtras.includes(extra.id);
                  return (
                    <button
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      className={`p-4 rounded-xl border text-right transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm">{extra.label}</p>
                        <p className="text-[#D4AF37] font-bold mt-1">
                          +{extra.price.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en')}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Total */}
          <motion.div
            layout
            className="card-modern p-8 flex flex-col justify-center sticky top-24 h-fit"
          >
            <div className="text-center mb-8">
              <p className="text-white/50 text-sm mb-2">{t.total}</p>
              <motion.p
                key={total}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-extrabold text-[#D4AF37]"
              >
                {total.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en')}
              </motion.p>
              <p className="text-white/40 text-sm mt-1">{t.currency}</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">{type.label}</span>
                <span className="text-white font-bold">{type.base.toLocaleString()}</span>
              </div>
              {t.extras
                .filter((x) => selectedExtras.includes(x.id))
                .map((extra) => (
                  <div key={extra.id} className="flex justify-between text-sm">
                    <span className="text-white/50">{extra.label}</span>
                    <span className="text-white font-bold">+{extra.price.toLocaleString()}</span>
                  </div>
                ))}
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-white font-bold">{t.total}</span>
                <span className="text-[#D4AF37] font-extrabold">{total.toLocaleString()}</span>
              </div>
            </div>

            <a href="#request" className="btn-primary text-center w-full">
              {t.cta}
              <ArrowLeft size={18} className="rtl:rotate-180" />
            </a>

            <p className="text-white/30 text-xs text-center mt-4">{t.note}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
