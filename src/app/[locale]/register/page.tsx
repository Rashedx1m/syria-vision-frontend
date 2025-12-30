'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { register } = useAuth();
  const t = useTranslations('auth');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    password_confirm: '',
  });

  const locale = pathname.split('/')[1] || 'en';
  const localizedHref = (path: string) => `/${locale}${path}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      router.push(`/${locale}/login`);
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData) {
        const firstError = Object.values(errorData)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('createAccount')}</h1>
          <p className="text-gray-600 mt-2">{t('joinCommunity')}</p>
        </div>

        <div className="card">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">{t('username')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder={t('username')}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">{t('fullName')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder={t('fullName')}
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">{t('email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="input pl-10"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  className="input pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <label className="label">{t('confirmPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  className="input pl-10"
                  placeholder="••••••••"
                  value={formData.password_confirm}
                  onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('creatingAccount')}
                </>
              ) : (
                t('register')
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            {t('agreeTerms')}
          </p>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('hasAccount')}{' '}
              <Link href={localizedHref('/login')} className="text-primary-600 font-medium hover:underline">
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}