'use client';

import Link from 'next/link';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { Event } from '@/types';

// ===== دالة مساعدة للحصول على رابط الصورة =====
const getImageUrl = (path: string | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://127.0.0.1:8000${path}`;
};

// ===== أنواع الخصائص =====
interface EventsSectionProps {
  locale: string;
  t: (key: string) => string;
  tCommon: (key: string) => string;
  featuredEvents: Event[];
  loading: boolean;
  localizedHref: (path: string) => string;
}

export default function EventsSection({ 
  locale, 
  t, 
  tCommon, 
  featuredEvents, 
  loading,
  localizedHref 
}: EventsSectionProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* عنوان القسم مع رابط "عرض الكل" */}
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

        {/* محتوى الفعاليات */}
        {loading ? (
          <EventsLoadingSkeleton />
        ) : featuredEvents.length > 0 ? (
          <EventsGrid 
            events={featuredEvents} 
            locale={locale} 
            t={t}
            localizedHref={localizedHref}
          />
        ) : (
          <EmptyEventsState t={t} />
        )}

        {/* زر عرض الكل للموبايل */}
        <div className="mt-8 text-center md:hidden">
          <Link href={localizedHref('/events')} className="btn-primary">
            {tCommon('viewAll')} {tCommon('events')}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ===== مكون هيكل التحميل =====
function EventsLoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-48 bg-gray-200 rounded-xl mb-4" />
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

// ===== مكون شبكة الفعاليات =====
function EventsGrid({ 
  events, 
  locale, 
  t,
  localizedHref 
}: { 
  events: Event[]; 
  locale: string; 
  t: (key: string) => string;
  localizedHref: (path: string) => string;
}) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.slice(0, 3).map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          locale={locale} 
          t={t}
          localizedHref={localizedHref}
        />
      ))}
    </div>
  );
}

// ===== مكون بطاقة الفعالية =====
function EventCard({ 
  event, 
  locale, 
  t,
  localizedHref 
}: { 
  event: Event; 
  locale: string; 
  t: (key: string) => string;
  localizedHref: (path: string) => string;
}) {
  return (
    <Link href={localizedHref(`/events/${event.id}`)}>
      <div className="card hover:-translate-y-2 cursor-pointer">
        {/* صورة الفعالية */}
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
        
        {/* تاريخ الفعالية */}
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
        
        {/* عنوان الفعالية */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {locale === 'ar' ? event.title_ar || event.title_en : event.title_en}
        </h3>
        
        {/* وصف مختصر */}
        <p className="text-gray-600 line-clamp-2">
          {locale === 'ar' 
            ? (event.description_ar || event.description_en)?.substring(0, 100)
            : event.description_en?.substring(0, 100)}...
        </p>
        
        {/* معلومات إضافية */}
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
  );
}

// ===== مكون حالة عدم وجود فعاليات =====
function EmptyEventsState({ t }: { t: (key: string) => string }) {
  return (
    <div className="text-center py-12">
      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">{t('noUpcomingEvents')}</p>
      <p className="text-gray-400">{t('checkBackSoon')}</p>
    </div>
  );
}