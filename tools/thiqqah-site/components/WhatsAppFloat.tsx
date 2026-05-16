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
    <div className="fixed bottom-5 sm:bottom-6 left-5 sm:left-6 z-50" dir="ltr">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[300px] sm:w-[320px] bg-dark rounded-3xl shadow-float border border-cream/20 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-gold-700 to-gold-900 text-white p-5 flex items-center justify-between">
              <div>
                <strong className="block text-sm">{lang === 'ar' ? 'مساعد ثقة الذهبية' : 'Thiqqah Assistant'}</strong>
                <span className="block text-xs text-gold-200 mt-0.5">{lang === 'ar' ? 'أسئلة متتابعة وتجهيز طلب واتساب' : 'Quick questions & WhatsApp request'}</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-dark/10 rounded-lg transition touch-target"><X size={18} /></button>
            </div>
            <div className="p-4 max-h-[320px] overflow-y-auto">
              <p className="text-xs text-cream/50 bg-dark-800/50 rounded-xl p-3 leading-relaxed border border-cream/10">
                {lang === 'ar'
                  ? 'أهلا بك. اختر نوع الخدمة أو اكتب طلبك، وسأجهز رسالة واتساب واضحة إلى رقم ثقة الذهبية.'
                  : 'Welcome. Choose a service type or type your request, and we will prepare a clear WhatsApp message.'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {quick.map((q) => (
                  <button key={q} onClick={() => send(q)} className="text-xs bg-gold-500/10 text-gold-300 font-semibold px-3 py-1.5 rounded-full hover:bg-gold-500/10 transition border border-gold-500/20 touch-target">
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 border-t border-cream/10 flex gap-2">
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && msg && send(msg)}
                placeholder={lang === 'ar' ? 'اكتب سؤالك...' : 'Type your question...'}
                className="flex-1 text-sm bg-dark-800/50 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-gold-500/20 border border-cream/10 text-cream placeholder:text-cream/40"
              />
              <button onClick={() => msg && send(msg)} className="w-9 h-9 rounded-full bg-gold-600 text-dark flex items-center justify-center hover:bg-gold-500 transition touch-target">
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
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 text-dark shadow-lg shadow-gold-500/30 flex items-center justify-center hover:shadow-gold-500/50 transition touch-target"
        aria-label="WhatsApp chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={26} />}
      </motion.button>
    </div>
  );
}
