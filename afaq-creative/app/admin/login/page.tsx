'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        router.push('/admin/talents');
      } else {
        setError(json.message || 'بيانات الدخول غير صحيحة.');
      }
    } catch (err) {
      setError('حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-afaq-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">لوحة إدارة أفاق</h1>
          <p className="text-white/60 mt-2">تسجيل دخول المشرفين</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-white/80 mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pr-10 pl-4 text-white placeholder-white/30 focus:outline-none focus:border-afaq-teal"
                placeholder="admin@afaq-global.com"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pr-10 pl-4 text-white placeholder-white/30 focus:outline-none focus:border-afaq-teal"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-afaq-teal hover:bg-afaq-blue2 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
