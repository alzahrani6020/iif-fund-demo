'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Upload, User, Phone, Mail, MapPin, Link2, FileText, CheckCircle, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

const steps = ['معلوماتك', 'موهبتك', 'أعمالك', 'الإرسال'];

const talentTypes = [
  'ممثل / ممثلة',
  'مغني / عازف',
  'مقدم / إذاعي',
  'مصور / مونتير',
  'مصمم / جرافيك',
  'مبرمج / مطور',
  'كاتب / سيناريست',
  'مخرج / منتج',
  'مؤثر رقمي',
  'موهبة أخرى',
];

interface TalentModalProps {
  open: boolean;
  onClose: () => void;
}

export function TalentModal({ open, onClose }: TalentModalProps) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    talent: '',
    experience: '',
    goal: 'training',
    portfolio: '',
    social: '',
    fileLink: '',
    details: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await fetch('https://file.io', { method: 'POST', body: data });
      const json = await res.json();
      if (json.link) setForm({ ...form, fileLink: json.link });
    } catch {
      alert('تعذر رفع الملف. يمكنك إرساله لاحقاً عبر الواتساب.');
    }
    setUploading(false);
  };

  const handleSubmit = () => {
    const text = `🌟 *تقديم موهبة جديدة* 🌟%0A%0A` +
      `👤 *الاسم:* ${form.name}%0A` +
      `📱 *الجوال:* ${form.phone}%0A` +
      `📧 *البريد:* ${form.email}%0A` +
      `📍 *المدينة:* ${form.city}%0A` +
      `🎭 *الموهبة:* ${form.talent}%0A` +
      `⭐ *الخبرة:* ${form.experience}%0A` +
      `🎯 *الهدف:* ${form.goal === 'training' ? 'تدريب' : 'عمل فوري'}%0A` +
      `🔗 *رابط الأعمال:* ${form.portfolio || '—'}%0A` +
      `📎 *رابط الملف:* ${form.fileLink || '—'}%0A` +
      `💬 *التفاصيل:* ${form.details || '—'}`;
    window.open(`https://wa.me/966567566616?text=${text}`, '_blank');
    setSubmitted(true);
  };

  const next = () => setStep(s => Math.min(s + 1, 3));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const canProceed = () => {
    if (step === 0) return form.name && form.phone && form.email && form.city;
    if (step === 1) return form.talent && form.experience;
    return true;
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-lg bg-afaq-bg border border-afaq-gold/20 rounded-3xl overflow-hidden shadow-2xl shadow-afaq-gold/10"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Sparkles size={20} className="text-afaq-gold" />
                اكتشف موهبتك
              </h3>
              <p className="text-white/30 text-xs mt-1">خطوة {step + 1} من 4</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Progress */}
          <div className="px-6 pt-4 flex gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-afaq-gold' : 'bg-white/10'}`} />
                <div className={`text-[10px] mt-1 text-center ${i <= step ? 'text-afaq-gold' : 'text-white/20'}`}>{s}</div>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="p-6 min-h-[320px]">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle size={64} className="text-afaq-gold mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-white mb-2">تم الإرسال بنجاح!</h4>
                <p className="text-white/40 text-sm">سنتواصل معك خلال 48 ساعة عبر الواتساب</p>
                <button onClick={onClose} className="mt-6 px-6 py-2 rounded-full bg-afaq-gold text-afaq-bg font-bold text-sm">
                  إغلاق
                </button>
              </div>
            ) : (
              <>
                {step === 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-afaq-gold/5 border border-afaq-gold/10">
                      <User size={18} className="text-afaq-gold" />
                      <span className="text-white/60 text-sm">أخبرنا عن نفسك</span>
                    </div>
                    <input required placeholder="الاسم الكامل" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-afaq-gold/50" />
                    <div className="grid grid-cols-2 gap-3">
                      <input required type="tel" placeholder="رقم الجوال" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-afaq-gold/50" />
                      <input required type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-afaq-gold/50" />
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-afaq-gold" />
                      <input required placeholder="المدينة / الدولة" value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-afaq-gold/50" />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-afaq-gold/5 border border-afaq-gold/10">
                      <Sparkles size={18} className="text-afaq-gold" />
                      <span className="text-white/60 text-sm">ما هي موهبتك؟</span>
                    </div>
                    <select required value={form.talent} onChange={e => setForm({...form, talent: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-afaq-gold/50 appearance-none">
                      <option value="" className="bg-afaq-bg">اختر نوع الموهبة</option>
                      {talentTypes.map(t => <option key={t} value={t} className="bg-afaq-bg">{t}</option>)}
                    </select>
                    <select value={form.experience} onChange={e => setForm({...form, experience: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-afaq-gold/50 appearance-none">
                      <option value="" className="bg-afaq-bg">مستوى الخبرة</option>
                      <option value="مبتدئ" className="bg-afaq-bg">مبتدئ (0-1 سنة)</option>
                      <option value="متوسط" className="bg-afaq-bg">متوسط (2-5 سنوات)</option>
                      <option value="محترف" className="bg-afaq-bg">محترف (5+ سنوات)</option>
                    </select>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setForm({...form, goal: 'training'})}
                        className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${form.goal === 'training' ? 'bg-afaq-gold/20 border-afaq-gold text-afaq-gold' : 'border-white/10 text-white/40'}`}>
                        🎓 أريد تدريباً
                      </button>
                      <button type="button" onClick={() => setForm({...form, goal: 'work'})}
                        className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${form.goal === 'work' ? 'bg-afaq-gold/20 border-afaq-gold text-afaq-gold' : 'border-white/10 text-white/40'}`}>
                        💼 أريد عملاً فورياً
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-afaq-gold/5 border border-afaq-gold/10">
                      <Link2 size={18} className="text-afaq-gold" />
                      <span className="text-white/60 text-sm">أرنا أعمالك (اختياري)</span>
                    </div>
                    <input placeholder="رابط Portfolio أو موقعك" value={form.portfolio} onChange={e => setForm({...form, portfolio: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-afaq-gold/50" />
                    <input placeholder="رابط Instagram / TikTok / YouTube" value={form.social} onChange={e => setForm({...form, social: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-afaq-gold/50" />

                    <div className="p-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-center">
                      <input ref={fileInputRef} type="file" accept="image/*,video/*,.pdf" onChange={handleFileUpload} className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 w-full py-4 text-white/40 hover:text-afaq-gold transition-colors">
                        <Upload size={24} />
                        <span className="text-xs">{uploading ? 'جاري الرفع...' : form.fileLink ? '✓ تم رفع الملف' : 'ارفع CV أو صورة أو فيديو (اختياري)'}</span>
                      </button>
                    </div>

                    <textarea rows={3} placeholder="اخبرنا عن موهبتك بالتفصيل..." value={form.details} onChange={e => setForm({...form, details: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-afaq-gold/50 resize-none" />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-afaq-gold/5 border border-afaq-gold/10">
                      <FileText size={18} className="text-afaq-gold" />
                      <span className="text-white/60 text-sm">مراجعة بياناتك</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-white/[0.06]">
                        <span className="text-white/30">الاسم</span>
                        <span className="text-white">{form.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/[0.06]">
                        <span className="text-white/30">الجوال</span>
                        <span className="text-white">{form.phone}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/[0.06]">
                        <span className="text-white/30">الموهبة</span>
                        <span className="text-white">{form.talent}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/[0.06]">
                        <span className="text-white/30">الخبرة</span>
                        <span className="text-white">{form.experience}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/[0.06]">
                        <span className="text-white/30">الهدف</span>
                        <span className="text-white">{form.goal === 'training' ? 'تدريب' : 'عمل فوري'}</span>
                      </div>
                      {form.fileLink && (
                        <div className="flex justify-between py-2 border-b border-white/[0.06]">
                          <span className="text-white/30">الملف</span>
                          <a href={form.fileLink} target="_blank" className="text-afaq-gold text-xs truncate max-w-[150px]">عرض الملف</a>
                        </div>
                      )}
                    </div>
                    <p className="text-white/20 text-xs text-center">
                      سيتم إرسال بياناتك عبر واتساب مباشرة لفريقنا
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!submitted && (
            <div className="p-6 border-t border-white/[0.06] flex justify-between">
              <button onClick={prev} disabled={step === 0}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1 transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'text-white/60 hover:text-white border border-white/10'}`}>
                <ChevronRight size={16} />
                السابق
              </button>
              {step < 3 ? (
                <button onClick={next} disabled={!canProceed()}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1 transition-all ${canProceed() ? 'bg-afaq-gold text-afaq-bg hover:shadow-lg' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
                  التالي
                  <ChevronLeft size={16} />
                </button>
              ) : (
                <button onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-afaq-gold to-afaq-gold2 text-afaq-bg font-bold text-sm flex items-center gap-2 hover:shadow-lg transition-all">
                  <Send size={16} />
                  إرسال عبر واتساب
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
