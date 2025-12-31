'use client';

import Link from 'next/link';
import { Calendar, Lightbulb, Users, Award, ArrowRight } from 'lucide-react';
import { Event } from '@/types';

// ===== أنواع الخصائص =====
interface HeroSectionProps {
  locale: string;
  t: (key: string) => string;
  tCommon: (key: string) => string;
  featuredEvents: Event[];
  localizedHref: (path: string) => string;
}

// ===== بيانات الإحصائيات =====
const stats = [
  { value: '5', labelKey: 'trainingDays', icon: Calendar },
  { value: '6', labelKey: 'diverseFields', icon: Lightbulb },
  { value: '10', labelKey: 'teams', icon: Users },
  { value: '500,000', labelKey: 'inPrizes', icon: Award },
];

export default function HeroSection({ 
  locale, 
  t, 
  tCommon, 
  featuredEvents, 
  localizedHref 
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* المحتوى النصي */}
          <div className="animate-fadeIn">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-6">
              {t('heroTagline')}
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t('heroTitle')}
              <br />
              <span className="text-gradient">{t('heroSubtitle')}</span>
            </h1>

            <p className="text-lg text-gray-600 mb-4">
              {t('heroBelieve')}
            </p>

            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl">
              {t('heroDescription')}
            </p>

            {/* أزرار الإجراءات */}
            <div className="flex flex-wrap gap-4">
              <Link href={localizedHref('/events')} className="btn-primary flex items-center gap-2">
                <span>{t('viewEvents')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href={localizedHref('/about')} className="btn-secondary">
                {tCommon('learnMore')}
              </Link>
            </div>
          </div>

          {/* بطاقة الإحصائيات */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              {/* شبكة الإحصائيات */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 rounded-2xl bg-gray-50">
                    <stat.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-primary-600 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{t(stat.labelKey)}</div>
                  </div>
                ))}
              </div>

              {/* عرض الفعالية القادمة */}
              <NextEventCard 
                locale={locale} 
                t={t} 
                featuredEvents={featuredEvents} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== مكون بطاقة الفعالية القادمة =====
function NextEventCard({ 
  locale, 
  t, 
  featuredEvents 
}: { 
  locale: string; 
  t: (key: string) => string; 
  featuredEvents: Event[];
}) {
  if (featuredEvents.length > 0) {
    const event = featuredEvents[0];
    return (
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100">
        <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">
            {locale === 'ar' ? event.title_ar || event.title_en : event.title_en}
          </h4>
          <p className="text-gray-600">
            {new Date(event.start_date).toLocaleDateString(locale, {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100">
      <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
        <Calendar className="w-6 h-6 text-primary-600" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{t('nextEvent')}</h4>
        <p className="text-gray-600">
          {locale === 'ar' ? 'قريباً' : 'Coming Soon'}
        </p>
      </div>
    </div>
  );
}