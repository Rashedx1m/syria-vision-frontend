'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { eventsAPI } from '@/lib/api';
import { Calendar, Users, MapPin, Loader2, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Registration {
  id: number;
  event: {
    id: number;
    title_en: string;
    title_ar: string;
    start_date: string;
    end_date: string;
    location: string;
    cover_image: string | null;
  };
  team_name: string;
  team_members: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function MyRegistrationsPage() {
  const t = useTranslations('registrations');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const localizedHref = (path: string) => `/${locale}${path}`;
  
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(localizedHref('/login'));
      return;
    }

    if (user) {
      fetchRegistrations();
    }
  }, [user, authLoading]);

  const fetchRegistrations = async () => {
    try {
      const response = await eventsAPI.getMyRegistrations();
      setRegistrations(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (registrationId: number) => {
    if (!confirm(t('cancelConfirm'))) return;

    try {
      await eventsAPI.withdrawRegistration(registrationId);
      setRegistrations(registrations.filter(r => r.id !== registrationId));
    } catch (error) {
      console.error('Error cancelling registration:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <Link href={localizedHref('/events')} className="btn-primary">
            {t('browseEvents')}
          </Link>
        </div>

        {registrations.length === 0 ? (
          <div className="card text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">{t('noRegistrations')}</h3>
            <p className="text-gray-500 mb-6">{t('noRegistrationsDesc')}</p>
            <Link href={localizedHref('/events')} className="btn-primary inline-block">
              {t('browseEvents')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((registration) => (
              <div key={registration.id} className="card">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Event Image */}
                  <div className="w-full md:w-32 h-24 bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    {registration.event.cover_image ? (
                      <img
                        src={registration.event.cover_image}
                        alt={locale === 'ar' ? registration.event.title_ar : registration.event.title_en}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Calendar className="w-8 h-8 text-white/80" />
                    )}
                  </div>

                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {locale === 'ar' ? registration.event.title_ar || registration.event.title_en : registration.event.title_en}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(registration.event.start_date).toLocaleDateString(locale)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {registration.event.location}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(registration.status)}`}>
                        {getStatusIcon(registration.status)}
                        {t(`status.${registration.status}`)}
                      </span>
                    </div>

                    {/* Team Info */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{t('team')}:</span>
                        <span className="text-gray-600">{registration.team_name}</span>
                      </div>
                      {registration.team_members && (
                        <p className="text-sm text-gray-500 mt-1">
                          {t('teamMembers')}: {registration.team_members}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {t('registeredOn')}: {new Date(registration.created_at).toLocaleDateString(locale)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                      <Link
                        href={localizedHref(`/events/${registration.event.id}`)}
                        className="text-primary-600 text-sm font-medium hover:underline"
                      >
                        {t('viewEvent')}
                      </Link>
                      {registration.status === 'pending' && (
                        <button
                          onClick={() => handleCancelRegistration(registration.id)}
                          className="text-red-600 text-sm font-medium hover:underline"
                        >
                          {t('cancelRegistration')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}