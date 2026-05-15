'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail } from 'lucide-react';
import { translations, Lang } from '@/lib/i18n';
import { siteConfig } from '@/lib/data';
import { SectionHeading } from './SectionHeading';

export function RequestForm({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [service, setService] = useState('');
  const [city, setCity] = useState('');
  const [clientType, setClientType] = useState<string>(t.request.clientTypes[0]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [toast, setToast] = useState('');

  const handleSubmit = (mode: 'whatsapp' | 'email') => {
    if (!service || !phone) {
      setToast(lang === 'ar' ? 'يرجى تعبئة الحقول المطلوبة' : 'Please fill required fields');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    const lines = [
      `*${t.siteName} — ${t.request.kicker}*`,
      '',
      `*${t.request.serviceLabel}:* ${service}`,
      `*${t.request.cityLabel}:* ${city || '-'}`,
      `*${t.request.clientTypeLabel}:* ${clientType}`,
      `*${t.request.nameLabel}:* ${name || '-'}`,
      `*${t.request.phoneLabel}:* ${phone}`,
      `*${t.request.detailsLabel}:* ${details || '-'}`,
    ];
    const body = lines.join('\n');

    if (mode === 'whatsapp') {
      const url = `https://wa.me/${siteConfig.phone.replace('+', '')}?text=${encodeURIComponent(body)}`;
      window.open(url, '_blank');
    } else {
      const subject = encodeURIComponent(`${t.request.kicker} — ${name || t.siteName}`);
      const mailBody = encodeURIComponent(body);
      window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${mailBody}`;
    }

    setToast(t.request.toastSuccess);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <section id="request" className="py-16 sm:py-24 bg-ink-50">
      <div className="container-modern max-w-3xl">
        <SectionHeading kicker={t.request.kicker} title={t.request.title} description={t.request.desc} centered />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-14 card-modern p-6 sm:p-10"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm font-bold text-ink-800">
              {t.request.serviceLabel}
              <select value={service} onChange={(e) => setService(e.target.value)} className="input-modern mt-2" required>
                <option value="">{lang === 'ar' ? 'اختر' : 'Select'}</option>
                {t.request.options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-bold text-ink-800">
              {t.request.cityLabel}
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder={lang === 'ar' ? 'مثال: جدة' : 'e.g. Jeddah'} className="input-modern mt-2" />
            </label>
            <label className="block text-sm font-bold text-ink-800">
              {t.request.clientTypeLabel}
              <select value={clientType} onChange={(e) => setClientType(e.target.value)} className="input-modern mt-2">
                {t.request.clientTypes.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-bold text-ink-800">
              {t.request.nameLabel}
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === 'ar' ? 'الاسم' : 'Name'} className="input-modern mt-2" />
            </label>
            <label className="block text-sm font-bold text-ink-800 sm:col-span-2">
              {t.request.phoneLabel}
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+9665xxxxxxxx" dir="ltr" className="input-modern mt-2 text-left" required />
            </label>
            <label className="block text-sm font-bold text-ink-800 sm:col-span-2">
              {t.request.detailsLabel}
              <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4} placeholder={lang === 'ar' ? 'اكتب وصف الخدمة باختصار' : 'Briefly describe the service needed'} className="input-modern mt-2 resize-none" />
            </label>
          </div>

          <div className="mt-6 sm:mt-7 flex flex-wrap gap-3">
            <button onClick={() => handleSubmit('whatsapp')} className="btn-primary flex-1">
              <Send size={18} /> {t.request.sendWhatsapp}
            </button>
            <button onClick={() => handleSubmit('email')} className="btn-outline flex-1">
              <Mail size={18} /> {t.request.sendEmail}
            </button>
          </div>

          {toast && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm font-bold text-saudi-700 bg-saudi-50 px-5 py-3 rounded-xl border border-saudi-200">
              {toast}
            </motion.p>
          )}

          <p className="mt-4 text-xs text-ink-400">{t.request.legalNote}</p>
        </motion.div>
      </div>
    </section>
  );
}
