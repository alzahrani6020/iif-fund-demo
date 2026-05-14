'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { siteConfig } from '@/lib/data';
import { translations, Lang } from '@/lib/i18n';

export function WhatsAppFloat({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const t = translations[lang];

  const quick = [
    lang === 'ar' ? 'طلب خدمة الآن' : 'Request service now',
    lang === 'ar' ? 'تأسيس وتعديل الشركات' : 'Company formation',
    lang === 'ar' ? 'التراخيص والبلديات' : 'Licenses & municipal',
    lang === 'ar' ? 'المتابعة الحكومية' : 'Government liaison',
  ];

  const send = (text: string) => {
    const url = `https://wa.me/${siteConfig.phone.replace('+', '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50" dir="ltr">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[320px] bg-white rounded-3xl shadow-elevated border border-surface-200 overflow-hidden"
          >
            <div className="bg-saudi-600 text-white p-5 flex items-center justify-between">
              <div>
                <strong className="block text-sm">{lang === 'ar' ? 'مساعد ثقة الذهبية' : 'Thiqqah Assistant'}</strong>
                <span className="block text-xs text-emerald-100 mt-0.5">{lang === 'ar' ? 'أسئلة متتابعة وتجهيز طلب واتساب' : 'Quick questions & WhatsApp request'}</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition"><X size={18} /></button>
            </div>
            <div className="p-4 max-h-[320px] overflow-y-auto">
              <p className="text-xs text-surface-500 bg-surface-50 rounded-xl p-3 leading-relaxed border border-surface-100">
                {lang === 'ar'
                  ? 'أهلا بك. اختر نوع الخدمة أو اكتب طلبك، وسأجهز رسالة واتساب واضحة إلى رقم ثقة الذهبية.'
                  : 'Welcome. Choose a service type or type your request, and we will prepare a clear WhatsApp message.'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {quick.map((q) => (
                  <button key={q} onClick={() => send(q)} className="text-xs bg-saudi-50 text-saudi-700 font-semibold px-3 py-1.5 rounded-full hover:bg-saudi-100 transition border border-saudi-100">
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 border-t border-surface-100 flex gap-2">
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && msg && send(msg)}
                placeholder={lang === 'ar' ? 'اكتب سؤالك...' : 'Type your question...'}
                className="flex-1 text-sm bg-surface-50 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-saudi-200 border border-surface-100 text-surface-800 placeholder:text-surface-400"
              />
              <button onClick={() => msg && send(msg)} className="w-9 h-9 rounded-full bg-saudi-500 text-white flex items-center justify-center hover:bg-saudi-600 transition">
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-saudi-500 text-white shadow-lg shadow-saudi-500/25 flex items-center justify-center hover:bg-saudi-600 transition"
        aria-label="WhatsApp chat"
      >
        {open ? <X size={24} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
}
