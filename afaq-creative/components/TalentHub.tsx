'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Star, Users, Clapperboard, Music, Camera, Palette, Code, Mic } from 'lucide-react';

const talentTypes = [
  { icon: Clapperboard, label: 'ممثل / ممثلة' },
  { icon: Music, label: 'مغني / عازف' },
  { icon: Mic, label: 'مقدم / إذاعي' },
  { icon: Camera, label: 'مصور / مونتير' },
  { icon: Palette, label: 'مصمم / جرافيك' },
  { icon: Code, label: 'مبرمج / مطور' },
];

export function TalentHub() {
  const [form, setForm] = useState({ name: '', phone: '', talent: '', experience: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `تقديم موهبة جديدة:%0Aالاسم: ${form.name}%0Aالجوال: ${form.phone}%0Aالموهبة: ${form.talent}%0Aالخبرة: ${form.experience}%0Aالرسالة: ${form.message}`;
    window.open(`https://wa.me/966567566616?text=${text}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="talents" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-afaq-gold/5 rounded-full blur-[150px]" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-afaq-gold/10 text-afaq-gold font-bold text-sm tracking-wider border border-afaq-gold/20 mb-4">
            <Sparkles size={14} className="inline-block ml-1" />
            نبني المواهب
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            اكتشف موهبتك <span className="text-afaq-gold">معنا</span>
          </h2>
          <p className="mt-4 text-white/40 max-w-2xl mx-auto">
            نحن نؤمن بأن كل موهبة تستحق فرصة. سواء كنت ممثلاً، مغنياً، مصوراً، أو مبرمجاً — 
            نحن هنا لنبني معك مستقبلك الإبداعي من خلال التدريب والتوجيه والعمل على مشاريع حقيقية.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: Why join */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {talentTypes.map((t, i) => (
                <motion.div key={t.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-afaq-gold/20 transition-all text-center">
                  <t.icon size={28} className="text-afaq-gold mx-auto mb-3" />
                  <div className="text-white font-semibold text-sm">{t.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-afaq-blue/5 border border-afaq-blue/20">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Star size={18} className="text-afaq-gold" />
                لماذا تنضم لنا؟
              </h3>
              <ul className="space-y-3 text-white/50 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-afaq-gold mt-1">✓</span>
                  <span>تدريب عملي من خبراء بأكثر من 20 سنة في المجال</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-afaq-gold mt-1">✓</span>
                  <span>فرصة العمل على مشاريع حقيقية مع عملائنا</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-afaq-gold mt-1">✓</span>
                  <span>ترخيص رسمي من GCAM و GEA يضمن لك الاحترافية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-afaq-gold mt-1">✓</span>
                  <span>شهادات معتمدة بعد إكمال التدريب</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-afaq-gold mt-1">✓</span>
                  <span>فرصة الانضمام لفريقنا الدائم</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.form initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} onSubmit={handleSubmit}
            className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] space-y-4">
            <h3 className="text-white font-bold text-xl mb-2">قدّم موهبتك الآن</h3>
            <p className="text-white/30 text-xs mb-4">املأ البيانات وسنتواصل معك خلال 48 ساعة</p>

            <input required type="text" placeholder="الاسم الكامل" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50" />
            <input required type="tel" placeholder="رقم الجوال (مع كود الدولة)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50" />
            <select required value={form.talent} onChange={e => setForm({...form, talent: e.target.value})}
              className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-afaq-gold/50 appearance-none">
              <option value="" className="bg-afaq-bg">اختر نوع الموهبة</option>
              {talentTypes.map(t => <option key={t.label} value={t.label} className="bg-afaq-bg">{t.label}</option>)}
              <option value="أخرى" className="bg-afaq-bg">موهبة أخرى</option>
            </select>
            <select value={form.experience} onChange={e => setForm({...form, experience: e.target.value})}
              className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-afaq-gold/50 appearance-none">
              <option value="" className="bg-afaq-bg">مستوى الخبرة</option>
              <option value="مبتدئ" className="bg-afaq-bg">مبتدئ</option>
              <option value="متوسط" className="bg-afaq-bg">متوسط</option>
              <option value="محترف" className="bg-afaq-bg">محترف</option>
            </select>
            <textarea rows={3} placeholder="اخبرنا عن موهبتك..." value={form.message} onChange={e => setForm({...form, message: e.target.value})}
              className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50 resize-none" />
            <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-afaq-gold to-afaq-gold2 text-afaq-bg font-bold hover:shadow-lg hover:shadow-afaq-gold/30 transition-all flex items-center justify-center gap-2">
              <Send size={18} />
              {submitted ? 'تم الإرسال!' : 'أرسل موهبتك'}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
