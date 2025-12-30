'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import { authAPI } from '@/lib/api';
import { User, Mail, Phone, MapPin, Globe, Camera, Loader2, Save } from 'lucide-react';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
      return;
    }

    if (user) {
      setFormData({
        full_name: user.full_name || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        website: user.website || '',
      });
    }
  }, [user, authLoading, router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await authAPI.updateProfile(formData);
      await refreshUser();
      setMessage({ type: 'success', text: t('profileUpdated') });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.detail || tCommon('error') });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('avatar', file);

    try {
      await authAPI.uploadAvatar(formDataUpload);
      await refreshUser();
      setMessage({ type: 'success', text: t('photoUpdated') });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.detail || tCommon('error') });
    }
  };

  const getMediaUrl = (path: string | null): string | null => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('/api', '');
    return `${baseUrl}${path}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user) return null;

  const avatarUrl = getMediaUrl(user.avatar);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('title')}</h1>

        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-xl ${
            message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {message.text}
          </div>
        )}

        <div className="card">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={user.full_name || user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-primary-600" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.full_name || user.username}
              </h2>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-400 mt-1">{t('clickToChangePhoto')}</p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">{tAuth('fullName')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder={tAuth('fullName')}
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">{t('bio')}</label>
              <textarea
                className="input min-h-[100px]"
                placeholder={t('aboutMe')}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div>
              <label className="label">{t('phone')}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  className="input pl-10"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">{t('location')}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder={t('cityCountry')}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">{t('website')}</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  className="input pl-10"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
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
                  {t('saving')}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {t('saveChanges')}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}