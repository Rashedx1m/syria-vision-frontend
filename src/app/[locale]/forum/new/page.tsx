'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { forumAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/types';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function NewPostPage() {
  const t = useTranslations('forum');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const localizedHref = (path: string) => `/${locale}${path}`;

  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    content: '',
  });

  useEffect(() => {
    if (!user) {
      router.push(localizedHref('/login'));
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await forumAPI.getCategories();
        setCategories(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forumAPI.createPost({
        category: Number(formData.category),
        title: formData.title,
        content: formData.content,
      });
      router.push(localizedHref(`/forum/${response.data.id}`));
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={localizedHref('/forum')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {tCommon('forum')}
        </Link>

        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('writePost')}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">{t('categories')}</label>
              <select
                className="input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">{t('selectCategory')}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {locale === 'ar' ? cat.name_ar || cat.name_en : cat.name_en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">{t('postTitle')}</label>
              <input
                type="text"
                className="input"
                placeholder={t('titlePlaceholder')}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">{t('postContent')}</label>
              <textarea
                className="input min-h-[200px]"
                placeholder={t('contentPlaceholder')}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('creating')}
                  </>
                ) : (
                  t('createPost')
                )}
              </button>
              <Link href={localizedHref('/forum')} className="btn-secondary">
                {tCommon('cancel')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}