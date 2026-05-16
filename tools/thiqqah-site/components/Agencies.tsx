'use client';

import { motion } from 'framer-motion';
import {
  Landmark, HeartPulse, Building2, Scale, TrendingUp, FileCheck, Truck, Hotel, ShieldCheck, Ship
} from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import { SectionHeading } from './SectionHeading';

const agenciesData = {
  ar: [
    { icon: Landmark, title: 'الوزارات والجهات الحكومية', desc: 'وزارة المالية، وزارة الصحة، وزارة التجارة، وزارة الحج، وزارة الاستثمار، وزارة الإعلام، ووزارة العمل.', hint: 'نحدد جهة الاختصاص لطلبك ونبني مساراً للمستندات والمواعيد حسب الجهة دون تشتيت بين المنصات.' },
    { icon: HeartPulse, title: 'الجهات الاجتماعية والمدنية', desc: 'مصلحة التقاعد، الضمان الاجتماعي، الأحوال المدنية، الجوازات، والمرور.', hint: 'نساعد في ترتيب الطلبات الشخصية والاعتمادات المطلوبة لدى الجهات المدنية وفق الاشتراطات الحالية.' },
    { icon: Building2, title: 'البلديات والمرافق', desc: 'الأمانات، البلديات الفرعية، مصلحة المياه، شركة الكهرباء، وشركات الاتصالات.', hint: 'نوازن بين اشتراطات البلدية والمرافق حتى تكتمل إجراءات التشغيل أو الربط بأقل تعثر ممكن.' },
    { icon: Scale, title: 'القضاء والتنفيذ', desc: 'المحكمة التجارية، محكمة التنفيذ، المحاكم العامة، وكتابات العدل.', hint: 'ننظم المستندات والمواعيد العدلية ونبقيك على اطلاع دون تتبع كل مسار على حدة بمفردك.' },
    { icon: TrendingUp, title: 'القطاع المالي والتمويلي', desc: 'البنك المركزي، البنوك، شركات التمويل، شركات التأمين، والصناديق التنموية والتمويلية.', hint: 'ننسّق ملفات التواصل مع الجهات التمويلية وفقاً لطبيعة نشاطك والغرض من الطلب.' },
    { icon: FileCheck, title: 'منصات الأعمال والتراخيص', desc: 'المركز السعودي للأعمال، بلدي، السجلات والأنشطة، وتعديل بيانات المنشأة.', hint: 'نقلّص خطوات السجلات والتراخيص عبر المنصات المعتمدة مع توضيح ما يخص منشأتك فقط.' },
    { icon: Truck, title: 'الموردون والتشغيل', desc: 'التنسيق مع الموردين، متابعة عروض الأسعار، وتنظيم المخاطبات التشغيلية.', hint: 'نرتب المخاطبات التشغيلية مع الموردين حتى تبقى حالة الطلبات واضحة لإدارة المنشأة.' },
    { icon: Hotel, title: 'الصحة والحج والضيافة', desc: 'متطلبات وزارة الصحة، وزارة الحج، الأنشطة الصحية، والسياحة والضيافة.', hint: 'نوازن بين اشتراطات القطاع الصحي أو الحج والسياحة وبين ملف نشاطك قبل رفع الطلبات.' },
    { icon: ShieldCheck, title: 'الزكاة والضريبة والجمارك', desc: 'هيئة الزكاة والضريبة والجمارك، الجمارك، الميناء، والمنافذ ذات العلاقة.', hint: 'ننسّق مسارات المنافذ والالتزامات المالية حسب نوع النشاط والبضائع أو الخدمات.' },
    { icon: Ship, title: 'النقل والخدمات اللوجستية', desc: 'وزارة النقل والخدمات اللوجستية، وزارة المواصلات، والتصاريح التشغيلية.', hint: 'نرتب متطلبات التصاريح والتحديثات لأنشطة النقل والخدمات اللوجستية ذات الصلة.' },
  ],
  en: [
    { icon: Landmark, title: 'Government Ministries', desc: 'Ministry of Finance, Health, Commerce, Hajj, Investment, Media, and Labor.', hint: 'We identify the relevant authority for your request and build a document and appointment path accordingly.' },
    { icon: HeartPulse, title: 'Social & Civil Entities', desc: 'Retirement authority, social security, civil affairs, passports, and traffic.', hint: 'We help organize personal requests and required approvals at civil entities.' },
    { icon: Building2, title: 'Municipalities & Utilities', desc: 'Municipalities, water authority, electricity, and telecom companies.', hint: 'We balance municipality and utility requirements for smooth operations.' },
    { icon: Scale, title: 'Judiciary & Enforcement', desc: 'Commercial court, enforcement court, general courts, and notaries.', hint: 'We organize judicial documents and deadlines so you stay informed.' },
    { icon: TrendingUp, title: 'Financial Sector', desc: 'Central bank, banks, financing, insurance, and development funds.', hint: 'We coordinate communication files with financial entities per your activity.' },
    { icon: FileCheck, title: 'Business Platforms & Licenses', desc: 'Saudi Business Center, Balady, records, activities, and entity updates.', hint: 'We shorten licensing steps through approved platforms with clarity.' },
    { icon: Truck, title: 'Suppliers & Operations', desc: 'Supplier coordination, quotation follow-up, and operational correspondence.', hint: 'We organize operational correspondence to keep request status clear.' },
    { icon: Hotel, title: 'Health, Hajj & Hospitality', desc: 'Ministry of Health, Hajj, health activities, tourism and hospitality.', hint: 'We balance health/hajj requirements with your activity profile.' },
    { icon: ShieldCheck, title: 'Zakat, Tax & Customs', desc: 'ZATCA, customs, ports, and related border crossings.', hint: 'We coordinate port pathways and financial obligations by activity type.' },
    { icon: Ship, title: 'Transport & Logistics', desc: 'Ministry of Transport, logistics, and operating permits.', hint: 'We arrange permit requirements for transport and logistics activities.' },
  ]
};

export function Agencies({ lang }: { lang: Lang }) {
  const data = agenciesData[lang];

  return (
    <section id="agencies" className="py-16 sm:py-24 bg-dark-800/50">
      <div className="container-modern">
        <SectionHeading
          kicker={lang === 'ar' ? 'جهات نخدمك أمامها' : 'Authorities We Serve'}
          title={lang === 'ar' ? 'نختصر عليك التشتت بين المنصات والجهات.' : 'We save you the hassle of juggling platforms and authorities.'}
          description={lang === 'ar' ? 'نوضح مسار المتابعة ونجهز المعلومات الأساسية قبل التواصل مع الجهات المطلوبة.' : 'We clarify the follow-up path and prepare essential information before contacting authorities.'}
        />

        <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {data.map((agency, i) => {
            const Icon = agency.icon;
            return (
              <motion.div
                key={agency.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-modern p-6 sm:p-7 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-white transition-all duration-300 mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="text-base font-bold text-cream">{agency.title}</h3>
                <p className="mt-2 text-sm text-cream/50 leading-relaxed">{agency.desc}</p>
                <p className="mt-3 text-xs text-cream/40 leading-relaxed border-t border-cream/10 pt-3">{agency.hint}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
