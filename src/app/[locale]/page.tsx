'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { eventsAPI } from '@/lib/api';
import { Event } from '@/types';
import {
  Calendar, Users, Award, ArrowRight,
  Lightbulb, Target, Rocket, Heart
} from 'lucide-react';

// Helper function to get full image URL
const getImageUrl = (path: string | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://127.0.0.1:8000${path}`;
};

export default function HomePage() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper for localized links
  const localizedHref = (path: string) => {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  };

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

  const stats = [
    { value: '5', label: t('trainingDays'), icon: Calendar },
    { value: '6', label: t('diverseFields'), icon: Lightbulb },
    { value: '10', label: t('teams'), icon: Users },
    { value: '$3500', label: t('inPrizes'), icon: Award },
  ];

  const features = [
    {
      icon: Lightbulb,
      title: t('innovation'),
      description: t('innovationDesc'),
    },
    {
      icon: Target,
      title: t('leadership'),
      description: t('leadershipDesc'),
    },
    {
      icon: Rocket,
      title: t('sustainability'),
      description: t('sustainabilityDesc'),
    },
    {
      icon: Heart,
      title: t('collaboration'),
      description: t('collaborationDesc'),
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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

            {/* Stats Card */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-4 rounded-2xl bg-gray-50"
                    >
                      <stat.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-primary-600 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('nextEvent')}</h4>
                    <p className="text-gray-600">{t('firstEdition')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
              {t('ourVision')}
            </span>
            <h2 className="section-title">{t('buildingTogether')}</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              {t('visionDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card text-center hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
                {tCommon('events')}
              </span>
              <h2 className="section-title">{t('upcomingEvents')}</h2>
            </div>
            <Link
              href={localizedHref('/events')}
              className="hidden md:flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700"
            >
              {tCommon('viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.slice(0, 3).map((event) => (
                <Link key={event.id} href={localizedHref(`/events/${event.id}`)}>
                  <div className="card hover:-translate-y-2 cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                      {event.cover_image ? (
                        <img
                          src={getImageUrl(event.cover_image)!}
                          alt={event.title_en}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Calendar className="w-16 h-16 text-white/80" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.start_date).toLocaleDateString(locale, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {locale === 'ar' ? event.title_ar || event.title_en : event.title_en}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {locale === 'ar' 
                        ? (event.description_ar || event.description_en)?.substring(0, 100)
                        : event.description_en?.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                      <span className="text-sm text-gray-500">
                        <Users className="w-4 h-4 inline mr-1" />
                        {event.registrations_count} {t('registered')}
                      </span>
                      <span className="text-sm text-accent-600 font-medium">
                        {event.total_prize} {event.prize_currency}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('noUpcomingEvents')}</p>
              <p className="text-gray-400">{t('checkBackSoon')}</p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href={localizedHref('/events')} className="btn-primary">
              {tCommon('viewAll')} {tCommon('events')}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('readyMakeDifference')}
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            {t('readyDescription')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={localizedHref('/register')}
              className="bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              {tCommon('getStarted')}
            </Link>
            <Link
              href={localizedHref('/events')}
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              {t('viewEvents')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}