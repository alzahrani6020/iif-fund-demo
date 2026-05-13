'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Layers, ShieldCheck, Sparkles, Briefcase, TrendingUp } from 'lucide-react';
import { FAQItem } from '@/components/faq-item';
import { PricingCard } from '@/components/pricing-card';
import { SectionHeading } from '@/components/section-heading';
import { ServiceCard } from '@/components/service-card';

const services = [
  {
    title: 'تأسيس شركات',
    description: 'نحو كيان قانوني واضح من أول خطوة حتى السجل التجاري والغرفة.',
    icon: Layers
  },
  {
    title: 'التراخيص',
    description: 'تنسيق بلدي وبيئي وبناء مع متابعة الجهات الحكومية.',
    icon: ShieldCheck
  },
  {
    title: 'المتابعة الحكومية',
    description: 'تتبع الملفات مع الوزارات والمحاكم والبنوك بشكل موثوق.',
    icon: Briefcase
  },
  {
    title: 'الخدمات المحاسبية',
    description: 'تقارير ضريبية وامتثال مالياً لدعم نمو الشركة.',
    icon: TrendingUp
  },
  {
    title: 'الاستثمار الأجنبي',
    description: 'دعم الأوراق والمسارات للمتوسطين والمستثمرين الأجانب.',
    icon: Sparkles
  }
];

const steps = [
  { title: 'تحليل أساسي', description: 'نحدد الشكل القانوني والنشاط والمنصة المناسبة.' },
  { title: 'تصميم خطة', description: 'نرتب المستندات والخطوات قبل بدء الإجراءات.' },
  { title: 'تنفيذ متسق', description: 'نقدم الطلبات وننسق مع الجهات ونحدثك بالحالة.' },
  { title: 'تسليم جاهز', description: 'نسلمك الملف الجاهز والتوجيه لمرحلة التشغيل.' }
];

const pricing = [
  {
    title: 'Starter',
    price: 'ابتداءً من 5,900 ر.س',
    description: 'للمشاريع الناشئة التي تريد هيكل تأسيس واضح وسريع.',
    features: ['خطوة تأسيس واحدة', 'خطة مستندات مبدئية', 'متابعة الطلبات الأساسية']
  },
  {
    title: 'Business',
    price: 'ابتداءً من 12,900 ر.س',
    description: 'لمن يحتاج تأسيس، تراخيص، ومتابعة مع جهات متعددة.',
    features: ['تحليل نشاط كامل', 'تنسيق تراخيص', 'متابعة حالية', 'تقارير حالة'],
    featured: true
  },
  {
    title: 'Enterprise',
    price: 'ابتداءً من 22,900 ر.س',
    description: 'للمستثمرين والشركات الكبيرة مع ملفات متقدمة.',
    features: ['دعم المستثمر الأجنبي', 'خطة امتثال كاملة', 'متابعة شهرية', 'قنوات اتصال مخصصة']
  }
];

const faqs = [
  { question: 'كيف أبدأ خدمة تأسيس أو ترخيص؟', answer: 'اضغط زر واتساب أو ابدأ الآن لنسجل طلبك مع بيانات النشاط والمدينة.' },
  { question: 'هل توفرون متابعة مع جهات حكومية؟', answer: 'نقوم بمتابعة الملفات في الوزارات والمحاكم والبلديات نيابة عن العميل.' },
  { question: 'ما الفرق بين الباقات؟', answer: 'الباقة الأساسية تركز على البداية، بينما باقة Enterprise تغطي الاستثمار والامتثال الكامل.' }
];

export default function Home() {
  return (
    <main className="page-container text-white">
      <header className="mb-16 space-y-8">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-brand-gold/80">ثقة الذهبية</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-emerald/10 px-4 py-2 text-sm text-brand-emerald">تجربة SaaS مع طابع فخم</span>
              <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200">Dark Luxury</span>
            </div>
          </div>
          <nav className="flex flex-wrap items-center justify-end gap-4 text-sm text-slate-300">
            <a href="#services" className="transition hover:text-white">الخدمات</a>
            <a href="#process" className="transition hover:text-white">المسار</a>
            <a href="#pricing" className="transition hover:text-white">الباقات</a>
            <a href="#faq" className="transition hover:text-white">الأسئلة</a>
          </nav>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex rounded-full bg-brand-gold/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-brand-gold">واجهة جديدة</span>
            <h1 className="mt-6 text-5xl font-semibold leading-tight text-white sm:text-6xl">نحو موقع خدمات حكومية فخم وواضح يناسب العملاء والشركات.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">تصميم احترافي، تجربة مستخدم مبسطة، ومحتوى خدمات منظم يقلل تشتت العميل ويزيد معدل التحويل.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="https://wa.me/966567566616" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110">واتساب مباشر</a>
              <a href="#pricing" className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-gold/50 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition hover:border-brand-gold">اطلب العرض <ArrowRight size={16} /></a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="glass-card border-brand-glass p-8 shadow-glow">
            <div className="space-y-6">
              <div className="rounded-[2rem] bg-brand-card/90 p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-brand-gold/70">مؤشرات الثقة</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
                    <p className="text-3xl font-semibold text-brand-gold">12+</p>
                    <p className="mt-2">سنوات خبرة</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
                    <p className="text-3xl font-semibold text-brand-gold">24/7</p>
                    <p className="mt-2">استجابة سريعة</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="glass-card rounded-3xl border-brand-glass p-5 text-slate-300">
                  <p className="text-sm uppercase tracking-[0.32em] text-brand-gold/75">سجل تجاري</p>
                  <p className="mt-4 text-3xl font-semibold text-white">4030506321</p>
                </div>
                <div className="glass-card rounded-3xl border-brand-glass p-5 text-slate-300">
                  <p className="text-sm uppercase tracking-[0.32em] text-brand-gold/75">الخدمات</p>
                  <p className="mt-4 text-3xl font-semibold text-white">5+ منتجات</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <section id="services" className="mt-16">
        <SectionHeading
          title="خدمات مرتبة بوضوح في بطاقات"
          description="ابدأ بخمس خدمات رئيسية تم تصميمها بشكل واضح ومسمّى لتسريع اختيار العميل لطلب الخدمة."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <motion.div key={service.title} whileHover={{ y: -6 }} className="">
              <ServiceCard icon={service.icon} title={service.title} description={service.description} />
            </motion.div>
          ))}
        </div>
      </section>

      <section id="process" className="mt-20 rounded-[3rem] bg-brand-card/80 p-10 shadow-glow">
        <SectionHeading
          title="المسار في 4 خطوات فقط"
          description="نقلّل التعقيد إلى مسار واضح من الطلب إلى التسليم مع تحديثات حالة منظمة."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-3xl border-brand-glass p-6 text-slate-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gold/10 text-brand-gold">{index + 1}</div>
              <h3 className="mt-5 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mt-20">
        <SectionHeading
          title="باقات واضحة لبدء الخدمة"
          description="اختر العرض المناسب من باقاتنا المصممة لتناسب البدايات الصغيرة والشركات والنمو المؤسسي."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {pricing.map((plan) => (
            <PricingCard key={plan.title} title={plan.title} price={plan.price} description={plan.description} features={plan.features} featured={plan.featured} />
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-[3rem] bg-brand-card/80 p-10 shadow-glow">
        <SectionHeading
          title="ثقة مرئية وأرقام قوية"
          description="قسم الثقة يعرض مؤشرات الخدمة والشروط التي تدعم صورة الشركة الموثوقة."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card rounded-3xl border-brand-glass p-6 text-center text-slate-300">
            <p className="text-4xl font-semibold text-brand-gold">12+</p>
            <p className="mt-3 text-sm">سنوات خبرة</p>
          </div>
          <div className="glass-card rounded-3xl border-brand-glass p-6 text-center text-slate-300">
            <p className="text-4xl font-semibold text-brand-gold">24/7</p>
            <p className="mt-3 text-sm">دعم واتساب واستجابة سريعة</p>
          </div>
          <div className="glass-card rounded-3xl border-brand-glass p-6 text-center text-slate-300">
            <p className="text-4xl font-semibold text-brand-gold">8.9</p>
            <p className="mt-3 text-sm">تقييم جودة افتراضي</p>
          </div>
          <div className="glass-card rounded-3xl border-brand-glass p-6 text-center text-slate-300">
            <p className="text-4xl font-semibold text-brand-gold">4030506321</p>
            <p className="mt-3 text-sm">السجل التجاري</p>
          </div>
        </div>
      </section>

      <section className="mt-20 rounded-[3rem] bg-brand-card/80 p-10 shadow-glow">
        <SectionHeading
          title="تقييمات العملاء"
          description="آراء سريعة لصورة أقوى حول التعاطي مع الخدمة والاحترافية."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div className="glass-card rounded-3xl border-brand-glass p-6 text-slate-300" whileHover={{ y: -4 }}>
            <p className="text-lg font-semibold text-white">خدمة سريعة وواضحة.</p>
            <p className="mt-4 text-sm leading-7">"تجربة الموقع أكسبتنا وقتاً ووضوحاً في الطلب. التصميم الجديد يعطي ثقة أكبر للعميل."</p>
            <p className="mt-6 text-sm font-semibold text-brand-gold">أحمد محمد</p>
          </motion.div>
          <motion.div className="glass-card rounded-3xl border-brand-glass p-6 text-slate-300" whileHover={{ y: -4 }}>
            <p className="text-lg font-semibold text-white">محتوى مرتب للمستخدم.</p>
            <p className="mt-4 text-sm leading-7">"الصفحة الآن تبدو أكثر تنظيمًا، والخدمات أصبحت تشرح نفسها بنفسها دون حشو زائد."</p>
            <p className="mt-6 text-sm font-semibold text-brand-gold">سارة الربيعي</p>
          </motion.div>
          <motion.div className="glass-card rounded-3xl border-brand-glass p-6 text-slate-300" whileHover={{ y: -4 }}>
            <p className="text-lg font-semibold text-white">مظهر فخم وحديث.</p>
            <p className="mt-4 text-sm leading-7">"التصميم الجديد يلائم صورة شركة خدمات احترافية، خصوصاً مع الألوان الداكنة والزخارف الزمردية."</p>
            <p className="mt-6 text-sm font-semibold text-brand-gold">يوسف العلي</p>
          </motion.div>
        </div>
      </section>

      <section id="faq" className="mt-20">
        <SectionHeading
          title="الأسئلة الشائعة"
          description="أجوبة مباشرة تساعد الزوار على فهم سير الخدمة بدون انتظار طويل."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-[3rem] bg-brand-card/90 p-10 shadow-glow">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-brand-gold/80">جاهز للتطوير</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">نحو صفحة نهائية جاهزة للنشر على GitHub و Cloudflare Pages.</h2>
            <p className="mt-6 max-w-xl text-slate-300">يمكنني متابعة العمل على إضافة صفحة تواصل، نماذج مخصصة، وتحسين الموبايل لتصبح الواجهة متكاملة بنسبة 100٪.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card rounded-3xl border-brand-glass p-6 text-slate-300">
              <p className="text-sm uppercase tracking-[0.32em] text-brand-gold/80">GitHub</p>
              <p className="mt-4 text-xl font-semibold text-white">نشر وإدارة الكود</p>
            </div>
            <div className="glass-card rounded-3xl border-brand-glass p-6 text-slate-300">
              <p className="text-sm uppercase tracking-[0.32em] text-brand-gold/80">Cloudflare Pages</p>
              <p className="mt-4 text-xl font-semibold text-white">استضافة سريعة وآمنة</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-20 rounded-[3rem] border border-white/10 bg-brand-card/70 p-10 text-slate-300">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-brand-gold/80">ثقة الذهبية</p>
            <p className="mt-4 max-w-lg text-sm leading-7">واجهة جديدة ومحتوى منظم تساعد العميل على الفهم السريع والثقة بالتواصل مع المكتب.</p>
          </div>
          <div className="space-y-2 text-right">
            <p className="font-semibold text-white">info@thiqqah.live</p>
            <p>+966 56 756 6616</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
