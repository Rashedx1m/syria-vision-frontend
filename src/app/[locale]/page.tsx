'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { eventsAPI } from '@/lib/api';
import { Event } from '@/types';

// ===== استيراد المكونات =====
import {
  HeroSection,
  FeaturesSection,
  EventsSection,
  GallerySection,
  VideosSection,
  JudgesSection,
  SponsorsSection,
  CTASection,
} from '@/components/home';

export default function HomePage() {
  // ===== الترجمة واللغة =====
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  
  // ===== حالات البيانات =====
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // ===== دالة مساعدة للروابط المحلية =====
  const localizedHref = (path: string) => {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  };

  // ===== جلب الفعاليات من API =====
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsAPI.getUpcomingEvents();
        setFeaturedEvents(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      {/* قسم البطل - Hero Section */}
      <HeroSection
        locale={locale}
        t={t}
        tCommon={tCommon}
        featuredEvents={featuredEvents}
        localizedHref={localizedHref}
      />

      {/* قسم المميزات - Features Section */}
      <FeaturesSection t={t} />

      {/* قسم الفعاليات القادمة - Events Section */}
      <EventsSection
        locale={locale}
        t={t}
        tCommon={tCommon}
        featuredEvents={featuredEvents}
        loading={loading}
        localizedHref={localizedHref}
      />

      {/* قسم معرض الصور - Gallery Section */}
      <GallerySection
        locale={locale}
        localizedHref={localizedHref}
      />

      {/* قسم الفيديوهات - Videos Section */}
      <VideosSection
        locale={locale}
        localizedHref={localizedHref}
      />

      {/* قسم الحكام - Judges Section */}
      <JudgesSection locale={locale} />

      {/* قسم الشركات الداعمة - Sponsors Section */}
      <SponsorsSection
        locale={locale}
        localizedHref={localizedHref}
      />

      {/* قسم الدعوة للعمل - CTA Section */}
      <CTASection
        t={t}
        tCommon={tCommon}
        localizedHref={localizedHref}
      />
    </div>
  );
}