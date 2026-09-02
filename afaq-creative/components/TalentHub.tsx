'use client';

import { useState, useRef, FormEvent, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, CheckCircle, AlertCircle, Plus, Trash2, MapPin, Star, Search } from 'lucide-react';
import Image from 'next/image';
import {
  sectors,
  getSector,
  getProfession,
  getProfessionsBySector,
  profileTypes,
  getSectorOptionsForProfileType,
  resolveProfession,
  searchProfessions,
  CUSTOM_PROFESSION_ID,
} from '@/lib/catalog';
import { skillLevels } from '@/lib/catalog/skillLevels';
import { serviceAreas } from '@/lib/catalog/serviceAreas';
import { workPlaces } from '@/lib/catalog/workPlaces';
import { countries, getRegion, countryDialCodes } from '@/lib/catalog/locations';
import { CountrySearch } from './CountrySearch';

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)\.]/g, '').replace(/^\+/, '');
}

function stripDialCode(phone: string, dialCode: string): string {
  const normalized = normalizePhone(phone);
  if (normalized.startsWith(dialCode)) {
    return normalized.slice(dialCode.length);
  }
  return normalized;
}

function toE164(phone: string, dialCode: string): string {
  const digits = normalizePhone(phone);
  if (digits.startsWith(dialCode)) return `+${digits}`;
  return `+${dialCode}${digits}`;
}

function isValidEmail(email: string): boolean {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUrl(value: string): boolean {
  if (!value) return true;
  try {
    new URL(value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`);
    return true;
  } catch {
    return false;
  }
}

function normalizeUrl(value: string): string {
  if (!value) return value;
  const trimmed = value.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

const yearsExperienceOptions = [
  'أقل من سنة',
  '1-3 سنوات',
  '3-5 سنوات',
  '5-10 سنوات',
  'أكثر من 10 سنوات',
];

const MAX_PROFILES = 5;

interface SkillProfile {
  id: string;
  profileType: string;
  sector: string;
  profession: string;
  specializations: string[];
  services: string[];
  skillLevel: string;
  yearsExperience: string;
  description: string;
  isPrimary: boolean;
  isCustomProfession: boolean;
  customProfessionName: string;
  customProfessionLocalName: string;
  customProfessionDescription: string;
  customProfessionClosestSector: string;
}

interface LocationInfo {
  country: string;
  region: string;
  city: string;
  district: string;
  serviceArea: string[];
  workPlace: string[];
}

interface PersonalInfo {
  full_name: string;
  phone: string;
  email: string;
  social_link: string;
  privacy: boolean;
  country?: string;
}

interface Files {
  profile_photo: File | null;
  work_photos: File[];
  work_video: File | null;
  cv: File | null;
}

interface PortfolioLinks {
  portfolio_url: string;
  behance_url: string;
  instagram_url: string;
  github_url: string;
  website_url: string;
}

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function CustomTagInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState('');
  const add = () => {
    const val = input.trim();
    if (val && !values.includes(val)) {
      onChange([...values, val]);
    }
    setInput('');
  };
  const remove = (val: string) => onChange(values.filter((v) => v !== val));
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <span key={v} className="chip active items-center">
            {v}
            <button
              type="button"
              onClick={() => remove(v)}
              className="mr-1 text-afaq-gold hover:text-white leading-none"
              aria-label="إزالة"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50 text-sm"
        />
        <button
          type="button"
          onClick={add}
          className="px-4 py-2.5 rounded-xl bg-afaq-gold/20 text-afaq-gold text-sm font-semibold hover:bg-afaq-gold/30"
        >
          إضافة
        </button>
      </div>
    </div>
  );
}

function ProfessionSearch({
  value,
  profileType,
  onSelect,
  currentSectorId,
}: {
  value: string;
  profileType: string;
  onSelect: (professionId: string, sectorId: string) => void;
  currentSectorId: string;
}) {
  const [query, setQuery] = useState('');
  const searchResults = useMemo(
    () =>
      searchProfessions(query, 12).filter((r) => {
        const prof = getProfession(r.id);
        return prof ? prof.profileTypes.includes(profileType as any) : false;
      }),
    [query, profileType]
  );
  const sectorProfessions = useMemo(
    () => (currentSectorId ? getProfessionsBySector(currentSectorId) : []),
    [currentSectorId]
  );
  const selectedProfession = useMemo(() => getProfession(value), [value]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث بالاسم العربي أو الإنجليزي أو المسمى المحلي..."
          className="w-full pr-10 pl-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50 text-sm"
        />
      </div>

      {query.trim() && searchResults.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          {searchResults.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                onSelect(r.id, r.sectorId);
                setQuery('');
              }}
              className={`w-full text-right px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 flex items-center justify-between ${value === r.id ? 'bg-afaq-gold/10' : ''}`}
            >
              <span className="text-white text-sm">{r.nameAr}</span>
              <span className="text-white/40 text-xs">{r.sectorLabelAr}</span>
            </button>
          ))}
        </div>
      )}

      {query.trim() && searchResults.length === 0 && (
        <p className="text-white/40 text-xs">لا توجد نتائج. جرّب كلمة أخرى أو اختر من قائمة المهن أدناه.</p>
      )}

      {selectedProfession && (
        <div className="text-sm text-afaq-gold">
          المهنة المختارة: <span className="text-white">{selectedProfession.nameAr}</span>
        </div>
      )}

      <div>
        <label className="block text-white/60 text-xs mb-2">أو اختر من مهن المجال الحالي</label>
        <select
          value={value}
          onChange={(e) => {
            const id = e.target.value;
            const prof = id ? getProfession(id) : undefined;
            onSelect(id, prof?.sectorId || currentSectorId);
          }}
          className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-afaq-gold/50 appearance-none"
        >
          <option value="" className="bg-afaq-bg">اختر المهنة</option>
          {sectorProfessions.map((p) => (
            <option key={p.id} value={p.id} className="bg-afaq-bg">{p.nameAr}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function emptyProfile(fixedId?: string): SkillProfile {
  return {
    id: fixedId || makeId(),
    profileType: '',
    sector: '',
    profession: '',
    specializations: [],
    services: [],
    skillLevel: '',
    yearsExperience: '',
    description: '',
    isPrimary: false,
    isCustomProfession: false,
    customProfessionName: '',
    customProfessionLocalName: '',
    customProfessionDescription: '',
    customProfessionClosestSector: '',
  };
}

export function TalentHub() {
  const [step, setStep] = useState(1);
  const [profiles, setProfiles] = useState<SkillProfile[]>([emptyProfile('primary')]);
  const [editingIndex, setEditingIndex] = useState(0);
  const [location, setLocation] = useState<LocationInfo>({
    country: '', region: '', city: '', district: '', serviceArea: [], workPlace: [],
  });
  const [sanaieeConsent, setSanaieeConsent] = useState(false);
  const [personal, setPersonal] = useState<PersonalInfo>({
    full_name: '', phone: '', email: '', social_link: '', privacy: false, country: '',
  });
  const [files, setFiles] = useState<Files>({
    profile_photo: null, work_photos: [], work_video: null, cv: null,
  });
  const [portfolioLinks, setPortfolioLinks] = useState<PortfolioLinks>({
    portfolio_url: '', behance_url: '', instagram_url: '', github_url: '', website_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; applicationNumber?: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');

  const eligibleSanaieeTypes = ['حرفي', 'فني', 'مهني', 'متخصص', 'خبير / مستشار', 'مقدم خدمة'];
  const showSanaieeStep = profiles.some((p) => eligibleSanaieeTypes.includes(p.profileType));

  const currentProfile = profiles[editingIndex];

  const availableSectors = useMemo(() => {
    if (!currentProfile.profileType) return [];
    return getSectorOptionsForProfileType(currentProfile.profileType as any);
  }, [currentProfile.profileType]);

  const currentSector = useMemo(() => getSector(currentProfile.sector), [currentProfile.sector]);
  const currentProfession = useMemo(
    () => resolveProfession(currentProfile.profession),
    [currentProfile.profession]
  );

  const selectedCountry = useMemo(() => countries.find((c) => c.value === location.country), [location.country]);
  const selectedRegion = useMemo(
    () => (selectedCountry ? selectedCountry.regions.find((r) => r.value === location.region) : undefined),
    [selectedCountry, location.region]
  );

  const updateProfile = (index: number, patch: Partial<SkillProfile>) => {
    setProfiles((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
    // Clear errors for the fields being updated
    const changedKeys = Object.keys(patch);
    if (changedKeys.length > 0) {
      setErrors((prev) => {
        const next = { ...prev };
        changedKeys.forEach((k) => delete next[k]);
        return next;
      });
    }
  };

  const setPrimary = (index: number) => {
    setProfiles((prev) => prev.map((p, i) => ({ ...p, isPrimary: i === index })));
  };

  const removeProfile = (index: number) => {
    setProfiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 1) next[0].isPrimary = true;
      return next;
    });
    if (editingIndex >= index && editingIndex > 0) setEditingIndex(editingIndex - 1);
  };

  const addNewProfile = () => {
    if (profiles.length >= MAX_PROFILES) return;
    const next = [...profiles, emptyProfile()];
    setProfiles(next);
    setEditingIndex(next.length - 1);
    setStep(1);
  };

  const startEditProfile = (index: number) => {
    setEditingIndex(index);
    setStep(1);
  };

  const validateStep = (): boolean => {
    const p = currentProfile;
    const nextErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!p.profileType) nextErrors.profileType = 'اختر تصنيفك';
        if (!p.sector) nextErrors.sector = 'اختر المجال';
        break;
      case 2:
        if (p.isCustomProfession) {
          if (!p.customProfessionName.trim()) nextErrors.customProfessionName = 'أدخل اسم المهنة / الحرفة / الموهبة';
          if (!p.customProfessionClosestSector) nextErrors.customProfessionClosestSector = 'اختر أقرب مجال';
        } else {
          if (!p.profession) nextErrors.profession = 'اختر المهنة';
          const hasSpecs = (currentProfession?.specializations?.length || 0) > 0;
          const hasServices = (currentProfession?.services?.length || 0) > 0;
          if (hasSpecs && p.specializations.length === 0) nextErrors.specializations = 'اختر تخصصًا واحدًا على الأقل';
          if (hasServices && p.services.length === 0) nextErrors.services = 'اختر خدمة واحدة على الأقل';
        }
        break;
      case 3:
        if (!p.skillLevel) nextErrors.skillLevel = 'اختر مستوى الخبرة';
        if (!p.yearsExperience) nextErrors.yearsExperience = 'اختر سنوات الخبرة';
        if (p.description.length > 500) nextErrors.description = 'الوصف يجب ألا يتجاوز 500 حرف';
        break;
      case 5:
        if (!location.country) nextErrors.country = 'اختر الدولة';
        if (!location.region) nextErrors.region = 'اختر المنطقة / المحافظة';
        if (!location.city) nextErrors.city = 'اختر المدينة';
        if (location.serviceArea.length === 0) nextErrors.serviceArea = 'اختر نطاق الخدمة';
        break;
      case 6:
        if (location.workPlace.length === 0) nextErrors.workPlace = 'اختر مقر العمل';
        break;
      case 8:
        if (!personal.full_name) nextErrors.full_name = 'أدخل الاسم الكامل';
        if (!personal.phone) {
          nextErrors.phone = 'أدخل رقم الجوال';
        } else {
          const dialCode = countryDialCodes[personal.country || location.country || ''];
          const digitsOnly = normalizePhone(personal.phone).replace(/^0+/, '').replace(new RegExp(`^${dialCode}`), '');
          if (!dialCode || digitsOnly.length < 7) {
            nextErrors.phone = 'رقم الجوال غير صحيح';
          }
        }
        if (personal.email && !isValidEmail(personal.email)) nextErrors.email = 'أدخل بريدًا إلكترونيًا صحيحًا، مثال: name@example.com';
        if (personal.social_link && !isValidUrl(personal.social_link)) nextErrors.social_link = 'أدخل رابطًا صحيحًا، مثال: https://example.com';
        if (!personal.privacy) nextErrors.privacy = 'الموافقة على سياسة الخصوصية مطلوبة';
        break;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setErrors({});

    if (step === 3) {
      // After experience, ensure at least one primary
      if (!profiles.some((p) => p.isPrimary)) {
        updateProfile(editingIndex, { isPrimary: true });
      }
      setStep(4);
      return;
    }

    if (step === 4) {
      setStep(5);
      return;
    }

    if (step === 6) {
      setStep(showSanaieeStep ? 7 : 8);
      return;
    }

    if (step < 10) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step === 8 && !showSanaieeStep) {
      setStep(6);
      return;
    }
    if (step > 1) setStep(step - 1);
  };

  const handleFileChange = (key: keyof Files, e: FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    if (!target.files) return;
    if (key === 'work_photos') {
      setFiles((prev) => ({ ...prev, work_photos: Array.from(target.files as FileList) }));
    } else {
      setFiles((prev) => ({ ...prev, [key]: target.files![0] || null }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    const primary = profiles.find((p) => p.isPrimary) || profiles[0];

    const dialCode = countryDialCodes[personal.country || location.country || ''];
    let phoneE164 = personal.phone;
    if (dialCode) {
      let digits = normalizePhone(personal.phone);
      if (digits.startsWith(dialCode)) {
        digits = digits.slice(dialCode.length);
      } else if (digits.startsWith('0')) {
        digits = digits.replace(/^0+/, '');
      }
      phoneE164 = `+${dialCode}${digits}`;
    }

    const personalPayload: PersonalInfo = {
      ...personal,
      country: personal.country || location.country,
      phone: phoneE164,
      social_link: normalizeUrl(personal.social_link),
    };

    const data = new FormData();
    // Backward-compatible fields derived from primary profile
    data.append('category', primary.profileType);
    data.append('fields', primary.specializations.join(', '));
    data.append('specialized', JSON.stringify({
      profileType: primary.profileType,
      sector: primary.sector,
      profession: primary.profession,
      customProfession: primary.isCustomProfession,
      skillLevel: primary.skillLevel,
      yearsExperience: primary.yearsExperience,
      description: primary.description,
    }));
    data.append('personal', JSON.stringify(personalPayload));

    // Store human-readable Arabic labels in the database while keeping the selection IDs internal
    const profilesForStorage = profiles.map((p) => {
      const sectorLabel = getSector(p.sector)?.labelAr || p.sector;
      const professionLabel = p.isCustomProfession
        ? p.customProfessionName
        : getProfession(p.profession)?.nameAr || p.profession;
      const closestSectorLabel = getSector(p.customProfessionClosestSector)?.labelAr || p.customProfessionClosestSector;
      return {
        ...p,
        sector: sectorLabel,
        profession: professionLabel,
        customProfessionClosestSector: closestSectorLabel,
      };
    });

    data.append('skillProfiles', JSON.stringify(profilesForStorage));
    data.append('location', JSON.stringify(location));
    data.append('sanaieeConsent', String(sanaieeConsent));

    if (files.profile_photo) data.append('profile_photo', files.profile_photo);
    files.work_photos.forEach((f) => data.append('work_photos', f));
    if (files.work_video) data.append('work_video', files.work_video);
    if (files.cv) data.append('cv', files.cv);

    data.append('portfolio_url', portfolioLinks.portfolio_url);
    data.append('behance_url', portfolioLinks.behance_url);
    data.append('instagram_url', portfolioLinks.instagram_url);
    data.append('github_url', portfolioLinks.github_url);
    data.append('website_url', portfolioLinks.website_url);

    try {
      const res = await fetch('/api/talents/register', { method: 'POST', body: data });
      const json = await res.json();

      if (res.ok && json.success) {
        setResult({ success: true, message: json.message, applicationNumber: json.applicationNumber });
      } else {
        setResult({ success: false, message: json.message || 'تعذر حفظ البيانات' });
      }
    } catch (err) {
      setResult({ success: false, message: 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.' });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'التصنيف' },
    { num: 2, label: 'المهنة' },
    { num: 3, label: 'الخبرة' },
    { num: 4, label: 'المجالات' },
    { num: 5, label: 'الموقع' },
    { num: 6, label: 'مقر العمل' },
    { num: 7, label: 'صنايعي' },
    { num: 8, label: 'البيانات' },
    { num: 9, label: 'المرفقات' },
    { num: 10, label: 'المراجعة' },
  ];

  const toggleInArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  if (result?.success) {
    const whatsappNumber = normalizePhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || '966567566616');
    const whatsappText = `السلام عليكم، أرغب في إرسال السيرة الذاتية / نماذج من أعمالي للطلب رقم ${result.applicationNumber}.`;
    return (
      <section id="talents" className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-afaq-gold/5 rounded-full blur-[150px]" />
        <div className="max-w-3xl mx-auto px-6 relative">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-12 text-center">
            <CheckCircle size={64} className="text-afaq-gold mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">تم تسجيل طلبك بنجاح</h2>
            <p className="text-white/60 mb-2">رقم الطلب</p>
            <p className="text-3xl font-bold text-afaq-gold mb-6" dir="ltr">{result.applicationNumber}</p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(result.applicationNumber || '')}
              className="mb-4 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors text-sm"
            >
              نسخ رقم الطلب
            </button>
            <p className="text-white/50 text-sm mb-6">{result.message}</p>
            {personal.email && (
              <div className="mb-6">
                {resendStatus === 'success' ? (
                  <p className="text-afaq-gold text-sm">{resendMessage}</p>
                ) : resendStatus === 'error' ? (
                  <p className="text-red-300 text-sm">{resendMessage}</p>
                ) : (
                  <button
                    type="button"
                    disabled={resendStatus === 'loading'}
                    onClick={async () => {
                      setResendStatus('loading');
                      setResendMessage('');
                      try {
                        const res = await fetch('/api/talents/resend-verification', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            applicationNumber: result.applicationNumber,
                            email: personal.email,
                          }),
                        });
                        const json = await res.json();
                        if (res.ok && json.success) {
                          setResendStatus('success');
                          setResendMessage(json.message || 'تم إرسال رسالة التأكيد.');
                        } else {
                          setResendStatus('error');
                          setResendMessage(json.message || 'تعذر إعادة إرسال الرسالة.');
                        }
                      } catch (err) {
                        setResendStatus('error');
                        setResendMessage('حدث خطأ أثناء الإرسال. حاول لاحقاً.');
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors text-sm disabled:opacity-50"
                  >
                    {resendStatus === 'loading' && <Loader2 size={16} className="animate-spin" />}
                    لم يصلك البريد؟ إعادة إرسال رسالة التأكيد
                  </button>
                )}
              </div>
            )}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-afaq-blue to-afaq-teal text-white font-bold hover:shadow-lg hover:shadow-afaq-blue/30 transition-all"
            >
              إرسال نماذج أعمالي عبر واتساب
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="talents" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-afaq-gold/5 rounded-full blur-[150px]" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-afaq-gold/10 text-afaq-gold font-bold text-sm tracking-wider border border-afaq-gold/20 mb-4">
            <Sparkles size={14} className="inline-block ml-1" />
            تبنّي المواهب والخبرات
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">تبنّي المواهب والخبرات</h2>
          <p className="mt-4 text-white/40 max-w-2xl mx-auto">
            اكتشف مكانك في منظومة أفاق، وسجّل خبرتك أو موهبتك للوصول إلى الفرص المناسبة.
          </p>
        </motion.div>

        <div id="talent-wizard" className="max-w-3xl mx-auto bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8 text-xs md:text-sm">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className={`wizard-progress-item ${step >= s.num ? 'active' : ''}`}>
                  <span className="num">{s.num}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className="wizard-progress-line" />}
              </div>
            ))}
          </div>

          {result && !result.success && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <span>{result.message}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-2">ماذا تمثل؟</h3>
                  <p className="text-white/50 text-sm">اختر التصنيف الذي يمثلك بشكل أساسي.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profileTypes.map((type) => (
                      <label key={type} className={`cat-card ${currentProfile.profileType === type ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="profileType"
                          value={type}
                          checked={currentProfile.profileType === type}
                          onChange={() => updateProfile(editingIndex, { profileType: type, sector: '', profession: '', specializations: [], services: [] })}
                          className="w-5 h-5 accent-afaq-gold"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                  {errors.profileType && <p className="text-red-400 text-xs mt-2">{errors.profileType}</p>}
                  {currentProfile.profileType && (
                    <div className="space-y-3 pt-4">
                      <label className="block text-white/80 text-sm">المجال *</label>
                      <select
                        value={currentProfile.sector}
                        onChange={(e) => updateProfile(editingIndex, { sector: e.target.value, profession: '', specializations: [], services: [] })}
                        className={`w-full px-5 py-3 rounded-xl bg-white/5 border ${errors.sector ? 'border-red-500/50' : 'border-white/10'} text-white focus:outline-none focus:border-afaq-gold/50 appearance-none`}
                      >
                        <option value="" className="bg-afaq-bg">اختر المجال</option>
                        {availableSectors.map((s) => (
                          <option key={s.id} value={s.id} className="bg-afaq-bg">{s.labelAr}</option>
                        ))}
                      </select>
                      {errors.sector && <p className="text-red-400 text-xs mt-1">{errors.sector}</p>}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-white mb-2">اختر مهنتك أو حرفتك</h3>
                  {!currentProfile.isCustomProfession && (
                    <div className="space-y-3">
                      <ProfessionSearch
                        value={currentProfile.profession}
                        profileType={currentProfile.profileType}
                        onSelect={(id, sectorId) =>
                          updateProfile(editingIndex, {
                            profession: id,
                            sector: sectorId,
                            specializations: [],
                            services: [],
                          })
                        }
                        currentSectorId={currentProfile.sector}
                      />
                      {errors.profession && <p className="text-red-400 text-xs mt-1">{errors.profession}</p>}
                    </div>
                  )}

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentProfile.isCustomProfession}
                      onChange={(e) => updateProfile(editingIndex, {
                        isCustomProfession: e.target.checked,
                        profession: e.target.checked ? '' : currentProfile.profession,
                        specializations: [],
                        services: [],
                      })}
                      className="w-5 h-5 accent-afaq-gold"
                    />
                    <span className="text-white/80 text-sm">لم أجد مهنتي / حرفتي / موهبتي</span>
                  </label>

                  {currentProfile.isCustomProfession && (
                    <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-4">
                      <div>
                        <input
                          type="text"
                          placeholder="اسم المهنة / الحرفة / الموهبة *"
                          value={currentProfile.customProfessionName}
                          onChange={(e) => updateProfile(editingIndex, { customProfessionName: e.target.value })}
                          className={`w-full px-5 py-3 rounded-xl bg-white/5 border ${errors.customProfessionName ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50`}
                        />
                        {errors.customProfessionName && <p className="text-red-400 text-xs mt-1">{errors.customProfessionName}</p>}
                      </div>
                      <input
                        type="text"
                        placeholder="المسمى المحلي (إن وجد)"
                        value={currentProfile.customProfessionLocalName}
                        onChange={(e) => updateProfile(editingIndex, { customProfessionLocalName: e.target.value })}
                        className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50"
                      />
                      <textarea
                        rows={2}
                        placeholder="وصف مختصر (اختياري)"
                        value={currentProfile.customProfessionDescription}
                        onChange={(e) => updateProfile(editingIndex, { customProfessionDescription: e.target.value })}
                        className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50 resize-none"
                      />
                      <div>
                        <select
                          value={currentProfile.customProfessionClosestSector}
                          onChange={(e) => updateProfile(editingIndex, { customProfessionClosestSector: e.target.value })}
                          className={`w-full px-5 py-3 rounded-xl bg-white/5 border ${errors.customProfessionClosestSector ? 'border-red-500/50' : 'border-white/10'} text-white focus:outline-none focus:border-afaq-gold/50 appearance-none`}
                        >
                          <option value="" className="bg-afaq-bg">أقرب مجال *</option>
                          {sectors.map((s) => (
                            <option key={s.id} value={s.id} className="bg-afaq-bg">{s.labelAr}</option>
                          ))}
                        </select>
                        {errors.customProfessionClosestSector && <p className="text-red-400 text-xs mt-1">{errors.customProfessionClosestSector}</p>}
                      </div>
                    </div>
                  )}

                  {(currentProfile.isCustomProfession || (currentProfession?.specializations?.length || 0) > 0) && (
                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        {currentProfile.isCustomProfession ? 'ما تخصصك الدقيق؟' : 'التخصصات *'}
                      </label>
                      {currentProfile.isCustomProfession ? (
                        <CustomTagInput
                          values={currentProfile.specializations}
                          onChange={(vals) => updateProfile(editingIndex, { specializations: vals })}
                          placeholder="مثال: تصوير منتجات، تصوير عقاري، تصوير مناسبات"
                        />
                      ) : (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {(currentProfession?.specializations || []).map((spec) => (
                              <label key={spec.id} className={`chip ${currentProfile.specializations.includes(spec.nameAr) ? 'active' : ''}`}>
                                <input
                                  type="checkbox"
                                  checked={currentProfile.specializations.includes(spec.nameAr)}
                                  onChange={() => updateProfile(editingIndex, { specializations: toggleInArray(currentProfile.specializations, spec.nameAr) })}
                                  className="hidden"
                                />
                                <span>{spec.nameAr}</span>
                              </label>
                            ))}
                          </div>
                          {errors.specializations && <p className="text-red-400 text-xs mt-2">{errors.specializations}</p>}
                        </>
                      )}
                    </div>
                  )}

                  {(currentProfile.isCustomProfession || (currentProfession?.services?.length || 0) > 0) && (
                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        {currentProfile.isCustomProfession ? 'ما الخدمات التي تقدمها؟' : 'الخدمات *'}
                      </label>
                      {currentProfile.isCustomProfession ? (
                        <CustomTagInput
                          values={currentProfile.services}
                          onChange={(vals) => updateProfile(editingIndex, { services: vals })}
                          placeholder="مثال: تصوير، مونتاج، معالجة صور"
                        />
                      ) : (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {(currentProfession?.services || []).map((svc) => (
                              <label key={svc.id} className={`chip ${currentProfile.services.includes(svc.nameAr) ? 'active' : ''}`}>
                                <input
                                  type="checkbox"
                                  checked={currentProfile.services.includes(svc.nameAr)}
                                  onChange={() => updateProfile(editingIndex, { services: toggleInArray(currentProfile.services, svc.nameAr) })}
                                  className="hidden"
                                />
                                <span>{svc.nameAr}</span>
                              </label>
                            ))}
                          </div>
                          {errors.services && <p className="text-red-400 text-xs mt-2">{errors.services}</p>}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-white mb-2">خبرتك</h3>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">مستوى الخبرة *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {skillLevels.map((level) => (
                        <label key={level.value} className={`chip ${currentProfile.skillLevel === level.value ? 'active' : ''}`}>
                          <input
                            type="radio"
                            name="skillLevel"
                            value={level.value}
                            checked={currentProfile.skillLevel === level.value}
                            onChange={() => updateProfile(editingIndex, { skillLevel: level.value })}
                            className="hidden"
                          />
                          <span>{level.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.skillLevel && <p className="text-red-400 text-xs mt-2">{errors.skillLevel}</p>}
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">سنوات الخبرة *</label>
                    <select
                      value={currentProfile.yearsExperience}
                      onChange={(e) => updateProfile(editingIndex, { yearsExperience: e.target.value })}
                      className={`w-full px-5 py-3 rounded-xl bg-white/5 border ${errors.yearsExperience ? 'border-red-500/50' : 'border-white/10'} text-white focus:outline-none focus:border-afaq-gold/50 appearance-none`}
                    >
                      <option value="" className="bg-afaq-bg">اختر</option>
                      {yearsExperienceOptions.map((o) => (
                        <option key={o} value={o} className="bg-afaq-bg">{o}</option>
                      ))}
                    </select>
                    {errors.yearsExperience && <p className="text-red-400 text-xs mt-1">{errors.yearsExperience}</p>}
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">عرّفنا أكثر بما تتقنه</label>
                    <p className="text-white/40 text-xs mb-2">اكتب باختصار عن خبرتك، الأعمال التي تتميز بها، والخدمات التي تستطيع تقديمها.</p>
                    <textarea
                      rows={4}
                      maxLength={500}
                      value={currentProfile.description}
                      onChange={(e) => updateProfile(editingIndex, { description: e.target.value })}
                      className={`w-full px-5 py-3 rounded-xl bg-white/5 border ${errors.description ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50 resize-none`}
                    />
                    <p className="text-white/40 text-xs mt-1 text-left">{currentProfile.description.length} / 500</p>
                    {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-white mb-2">مجالاتك</h3>
                  <div className="space-y-3">
                    {profiles.map((p, idx) => (
                      <div key={p.id} className={`p-4 rounded-xl border ${p.isPrimary ? 'border-afaq-gold bg-afaq-gold/10' : 'border-white/10 bg-white/5'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-semibold">
                              {p.isPrimary && <Star size={14} className="inline text-afaq-gold ml-1" />}
                              {p.isCustomProfession ? p.customProfessionName : (getProfession(p.profession)?.nameAr || p.profession)}
                            </p>
                            <p className="text-white/50 text-sm">{p.profileType} · {getSector(p.sector)?.labelAr || getSector(p.customProfessionClosestSector)?.labelAr || p.customProfessionClosestSector}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!p.isPrimary && (
                              <button
                                type="button"
                                onClick={() => setPrimary(idx)}
                                className="text-xs px-3 py-1 rounded-lg border border-white/20 text-white/70 hover:bg-white/10"
                              >
                                اجعلها رئيسية
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => startEditProfile(idx)}
                              className="text-xs px-3 py-1 rounded-lg bg-afaq-gold/20 text-afaq-gold hover:bg-afaq-gold/30"
                            >
                              تعديل
                            </button>
                            {profiles.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeProfile(idx)}
                                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {profiles.length < MAX_PROFILES && (
                    <button
                      type="button"
                      onClick={addNewProfile}
                      className="w-full py-3 rounded-xl border border-dashed border-afaq-gold/40 text-afaq-gold hover:bg-afaq-gold/10 flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      أضف مهنة، حرفة أو موهبة أخرى
                    </button>
                  )}
                </div>
              )}

              {step === 5 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-white mb-2">موقعك ونطاق خدماتك</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <CountrySearch
                        value={location.country}
                        onChange={(country) => {
                          setLocation({ ...location, country: country.value, region: '', city: '' });
                          setPersonal((prev) => ({ ...prev, country: country.value }));
                        }}
                        error={errors.country}
                      />
                    </div>
                    <div>
                      <select
                        value={location.region}
                        onChange={(e) => setLocation({ ...location, region: e.target.value, city: '' })}
                        disabled={!selectedCountry}
                        className={`w-full px-5 py-3 rounded-xl bg-white/5 border ${errors.region ? 'border-red-500/50' : 'border-white/10'} text-white focus:outline-none focus:border-afaq-gold/50 appearance-none disabled:opacity-40`}
                      >
                        <option value="" className="bg-afaq-bg">المنطقة / المحافظة *</option>
                        {selectedCountry?.regions.map((r) => (
                          <option key={r.value} value={r.value} className="bg-afaq-bg">{r.label}</option>
                        ))}
                      </select>
                      {errors.region && <p className="text-red-400 text-xs mt-1">{errors.region}</p>}
                    </div>
                    <div>
                      <select
                        value={location.city}
                        onChange={(e) => setLocation({ ...location, city: e.target.value })}
                        disabled={!selectedRegion}
                        className={`w-full px-5 py-3 rounded-xl bg-white/5 border ${errors.city ? 'border-red-500/50' : 'border-white/10'} text-white focus:outline-none focus:border-afaq-gold/50 appearance-none disabled:opacity-40`}
                      >
                        <option value="" className="bg-afaq-bg">المدينة *</option>
                        {selectedRegion?.cities.map((c) => (
                          <option key={c.value} value={c.value} className="bg-afaq-bg">{c.label}</option>
                        ))}
                      </select>
                      {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <input
                      type="text"
                      placeholder="الحي (اختياري)"
                      value={location.district}
                      onChange={(e) => setLocation({ ...location, district: e.target.value })}
                      className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">أين تستطيع تقديم خدماتك؟ *</label>
                    <div className="flex flex-wrap gap-2">
                      {serviceAreas.map((area) => (
                        <label key={area.value} className={`chip ${location.serviceArea.includes(area.value) ? 'active' : ''}`}>
                          <input
                            type="checkbox"
                            checked={location.serviceArea.includes(area.value)}
                            onChange={() => setLocation({ ...location, serviceArea: toggleInArray(location.serviceArea, area.value) })}
                            className="hidden"
                          />
                          <span>{area.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.serviceArea && <p className="text-red-400 text-xs mt-2">{errors.serviceArea}</p>}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-white mb-2">كيف تقدم خدماتك؟</h3>
                  <div className="flex flex-wrap gap-2">
                    {workPlaces.map((place) => (
                      <label key={place.value} className={`chip ${location.workPlace.includes(place.value) ? 'active' : ''}`}>
                        <input
                          type="checkbox"
                          checked={location.workPlace.includes(place.value)}
                          onChange={() => setLocation({ ...location, workPlace: toggleInArray(location.workPlace, place.value) })}
                          className="hidden"
                        />
                        <span>{place.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.workPlace && <p className="text-red-400 text-xs mt-2">{errors.workPlace}</p>}
                </div>
              )}

              {step === 7 && (
                <div className="space-y-5">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start gap-4">
                    <div className="shrink-0">
                      <Image src="/brands/sanaiee/sanaiee-logo.png" alt="صنايعي" width={64} height={64} className="rounded-lg" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">الانضمام إلى منظومة صنايعي</h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        صنايعي منظومة للمهن والحرف والخدمات، تساعد أصحاب الخبرات على الوصول إلى الفرص والعملاء والمبادرات المناسبة.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sanaieeConsent}
                      onChange={(e) => setSanaieeConsent(e.target.checked)}
                      className="mt-1 w-5 h-5 accent-afaq-gold rounded"
                    />
                    <span className="text-white/70 text-sm">
                      أرغب بالانضمام إلى منظومة صنايعي وأوافق على استخدام بيانات تسجيلي اللازمة لإنشاء ملفي المبدئي والتواصل معي بشأن استكماله.
                    </span>
                  </label>
                </div>
              )}

              {step === 8 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-2">البيانات الأساسية</h3>
                  <p className="text-white/50 text-sm mb-4">معلومات التواصل.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="الاسم الكامل *"
                        value={personal.full_name}
                        onChange={(e) => setPersonal({ ...personal, full_name: e.target.value })}
                        className={`w-full px-5 py-3 rounded-xl bg-white/5 border ${errors.full_name ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50`}
                      />
                      {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>}
                    </div>

                    <div>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-r-xl bg-white/10 border border-l-0 border-white/10 text-white/70 text-sm">
                          +{countryDialCodes[personal.country || location.country || ''] || '---'}
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder="رقم الجوال *"
                          value={personal.phone}
                          onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                          className={`flex-1 px-5 py-3 rounded-l-xl bg-white/5 border ${errors.phone ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        value={personal.email}
                        onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                        className={`w-full px-5 py-3 rounded-xl bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50`}
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="رابط حسابات التواصل أو الأعمال"
                        value={personal.social_link}
                        onChange={(e) => setPersonal({ ...personal, social_link: e.target.value })}
                        className={`w-full px-5 py-3 rounded-xl bg-white/5 border ${errors.social_link ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50`}
                      />
                      {errors.social_link && <p className="text-red-400 text-xs mt-1">{errors.social_link}</p>}
                    </div>
                  </div>
                  <label className="flex items-start gap-3 mt-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={personal.privacy}
                      onChange={(e) => setPersonal({ ...personal, privacy: e.target.checked })}
                      className="mt-1 w-5 h-5 accent-afaq-gold rounded"
                    />
                    <span className="text-white/70 text-sm">
                      أوافق على <a href="/privacy" target="_blank" className="text-afaq-gold hover:underline">سياسة الخصوصية</a> وعلى مشاركة بياناتي لأغراض التقييم والربط بالفرص.
                    </span>
                  </label>
                  {errors.privacy && <p className="text-red-400 text-xs mt-1">{errors.privacy}</p>}
                </div>
              )}

              {step === 9 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-2">السيرة الذاتية / نماذج وسابقة الأعمال</h3>
                  <p className="text-white/50 text-sm mb-4">هل ترغب في إضافة ما يدعم خبرتك؟ جميع الحقول اختيارية.</p>
                  <div className="space-y-4">
                    <FileInput label="صورة شخصية" name="profile_photo" accept="image/*" onChange={(e) => handleFileChange('profile_photo', e)} />
                    <FileInput label="صور الأعمال" name="work_photos" accept="image/*" multiple onChange={(e) => handleFileChange('work_photos', e)} />
                    <FileInput label="فيديو للأعمال إن وجد" name="work_video" accept="video/*" onChange={(e) => handleFileChange('work_video', e)} />
                    <FileInput label="السيرة الذاتية (CV) إن وجدت" name="cv" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange('cv', e)} />

                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <p className="text-white/70 text-sm">روابط سابقة الأعمال (اختيارية)</p>
                      <input
                        type="text"
                        placeholder="رابط Portfolio"
                        value={portfolioLinks.portfolio_url}
                        onChange={(e) => setPortfolioLinks({ ...portfolioLinks, portfolio_url: e.target.value })}
                        className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Behance"
                        value={portfolioLinks.behance_url}
                        onChange={(e) => setPortfolioLinks({ ...portfolioLinks, behance_url: e.target.value })}
                        className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Instagram"
                        value={portfolioLinks.instagram_url}
                        onChange={(e) => setPortfolioLinks({ ...portfolioLinks, instagram_url: e.target.value })}
                        className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="GitHub"
                        value={portfolioLinks.github_url}
                        onChange={(e) => setPortfolioLinks({ ...portfolioLinks, github_url: e.target.value })}
                        className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="موقع شخصي"
                        value={portfolioLinks.website_url}
                        onChange={(e) => setPortfolioLinks({ ...portfolioLinks, website_url: e.target.value })}
                        className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-afaq-gold/50 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 10 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-2">مراجعة الطلب</h3>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-h-[400px] overflow-y-auto text-sm space-y-3">
                    <div className="text-afaq-gold font-semibold">المهنة الرئيسية</div>
                    {(() => {
                      const primary = profiles.find((p) => p.isPrimary) || profiles[0];
                      return (
                        <>
                          <ReviewRow label="التصنيف" value={primary.profileType} />
                          <ReviewRow label="المجال" value={getSector(primary.sector)?.labelAr || getSector(primary.customProfessionClosestSector)?.labelAr || primary.customProfessionClosestSector} />
                          <ReviewRow label="المهنة" value={primary.isCustomProfession ? primary.customProfessionName : (getProfession(primary.profession)?.nameAr || primary.profession)} />
                          <ReviewRow label="التخصصات" value={primary.specializations.join('، ')} />
                          <ReviewRow label="الخدمات" value={primary.services.join('، ')} />
                          <ReviewRow label="مستوى الخبرة" value={primary.skillLevel} />
                          <ReviewRow label="سنوات الخبرة" value={primary.yearsExperience} />
                        </>
                      );
                    })()}

                    {profiles.filter((p) => !p.isPrimary).length > 0 && (
                      <>
                        <div className="text-afaq-gold font-semibold mt-2">المهن الإضافية</div>
                        {profiles.filter((p) => !p.isPrimary).map((p, idx) => (
                          <ReviewRow
                            key={p.id}
                            label={`#${idx + 1}`}
                            value={p.isCustomProfession ? p.customProfessionName : (getProfession(p.profession)?.nameAr || p.profession)}
                          />
                        ))}
                      </>
                    )}

                    <div className="text-afaq-gold font-semibold mt-2">الموقع</div>
                    <ReviewRow label="الدولة" value={countries.find((c) => c.value === location.country)?.label || location.country} />
                    <ReviewRow label="المدينة" value={selectedRegion?.cities.find((c) => c.value === location.city)?.label || location.city} />
                    <ReviewRow label="نطاق الخدمة" value={location.serviceArea.join('، ')} />

                    <div className="text-afaq-gold font-semibold mt-2">صنايعي</div>
                    <ReviewRow label="الرغبة بالانضمام" value={sanaieeConsent ? 'نعم' : 'لا'} />

                    <div className="text-afaq-gold font-semibold mt-2">البيانات الشخصية</div>
                    <ReviewRow label="الاسم" value={personal.full_name} />
                    <ReviewRow label="الجوال" value={personal.phone} />
                    {personal.email && <ReviewRow label="البريد" value={personal.email} />}

                    <div className="text-afaq-gold font-semibold mt-2">المرفقات:</div>
                    <ReviewRow label="صورة شخصية" value={files.profile_photo?.name || '—'} />
                    <ReviewRow label="صور الأعمال" value={files.work_photos.map((f) => f.name).join(', ') || '—'} />
                    <ReviewRow label="فيديو" value={files.work_video?.name || '—'} />
                    <ReviewRow label="السيرة الذاتية" value={files.cv?.name || '—'} />
                    <ReviewRow label="Portfolio" value={portfolioLinks.portfolio_url || '—'} />
                    <ReviewRow label="Behance" value={portfolioLinks.behance_url || '—'} />
                    <ReviewRow label="Instagram" value={portfolioLinks.instagram_url || '—'} />
                    <ReviewRow label="GitHub" value={portfolioLinks.github_url || '—'} />
                    <ReviewRow label="موقع شخصي" value={portfolioLinks.website_url || '—'} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
            <button type="button" onClick={handleBack} disabled={step === 1 || loading} className={`px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 transition ${step === 1 ? 'invisible' : ''}`}>
              السابق
            </button>
            <button type="button" onClick={handleNext} disabled={loading} className="px-6 py-3 rounded-xl bg-gradient-to-r from-afaq-gold to-afaq-gold2 text-afaq-bg font-bold hover:shadow-lg hover:shadow-afaq-gold/30 transition flex items-center gap-2">
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'جاري الإرسال...' : step === 10 ? <><Send size={18} /> إرسال الطلب</> : 'التالي'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FileInput({ label, name, accept, multiple, onChange }: { label: string; name: string; accept: string; multiple?: boolean; onChange: (e: FormEvent<HTMLInputElement>) => void }) {
  return (
    <label className="block">
      <span className="text-white/80 text-sm mb-1 block">{label}</span>
      <input
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        className="block w-full text-white/70 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-afaq-gold/20 file:text-afaq-gold hover:file:bg-afaq-gold/30"
      />
    </label>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-afaq-gold shrink-0">{label}:</span>
      <span className="text-white/80 break-all">{value || '—'}</span>
    </div>
  );
}
