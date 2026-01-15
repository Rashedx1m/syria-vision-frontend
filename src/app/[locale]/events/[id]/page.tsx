'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { eventsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types';
import {
  Calendar, MapPin, Users, Award, Clock, User,
  Linkedin, Twitter, ArrowLeft, Loader2, CheckCircle,
} from 'lucide-react';

export default function EventDetailPage() {
  const t = useTranslations('events');
  const tCommon = useTranslations('common');
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const localizedHref = (path: string) => `/${locale}${path}`;

  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    team_name: '',
    team_members: '',
    project_idea: '',
    field: '',
  });

  // Translations for this page
  const content = {
    en: {
      backToEvents: 'Back to events',
      inPrizes: 'in prizes',
      aboutEvent: 'About This Event',
      eventSchedule: 'Event Schedule',
      day: 'Day',
      speakers: 'Speakers & Mentors',
      registration: 'Registration',
      youRegistered: "You're registered!",
      team: 'Team',
      status: 'Status',
      teamName: 'Team Name',
      teamMembers: 'Team Members (comma separated)',
      teamMembersPlaceholder: 'Name 1, Name 2, Name 3',
      projectIdea: 'Project Idea',
      field: 'Field',
      selectField: 'Select field',
      technology: 'Technology',
      healthcare: 'Healthcare',
      education: 'Education',
      environment: 'Environment',
      business: 'Business',
      socialImpact: 'Social Impact',
      submitRegistration: 'Submit Registration',
      registering: 'Registering...',
      cancel: 'Cancel',
      spotsAvailable: 'Spots Available',
      teamSize: 'Team Size',
      members: 'members',
      deadline: 'Deadline',
      registerNow: 'Register Now',
      registrationClosed: 'Registration Closed',
      eventNotFound: 'Event not found',
    },
    ar: {
      backToEvents: 'العودة للفعاليات',
      inPrizes: 'جوائز',
      aboutEvent: 'عن هذه الفعالية',
      eventSchedule: 'جدول الفعالية',
      day: 'اليوم',
      speakers: 'المتحدثون والمرشدون',
      registration: 'التسجيل',
      youRegistered: 'أنت مسجل!',
      team: 'الفريق',
      status: 'الحالة',
      teamName: 'اسم الفريق',
      teamMembers: 'أعضاء الفريق (مفصولين بفاصلة)',
      teamMembersPlaceholder: 'اسم 1، اسم 2، اسم 3',
      projectIdea: 'فكرة المشروع',
      field: 'المجال',
      selectField: 'اختر المجال',
      technology: 'التقنية',
      healthcare: 'الرعاية الصحية',
      education: 'التعليم',
      environment: 'البيئة',
      business: 'الأعمال',
      socialImpact: 'التأثير الاجتماعي',
      submitRegistration: 'إرسال التسجيل',
      registering: 'جاري التسجيل...',
      cancel: 'إلغاء',
      spotsAvailable: 'الأماكن المتاحة',
      teamSize: 'حجم الفريق',
      members: 'أعضاء',
      deadline: 'آخر موعد',
      registerNow: 'سجّل الآن',
      registrationClosed: 'التسجيل مغلق',
      eventNotFound: 'الفعالية غير موجودة',
    }
  };

  const c = content[locale as keyof typeof content] || content.en;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsAPI.getEvent(Number(params.id));
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [params.id]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(localizedHref('/login'));
      return;
    }

    setRegistering(true);
    try {
      const members = formData.team_members
        .split(',')
        .map((m) => m.trim())
        .filter((m) => m);

      await eventsAPI.registerForEvent({
        event: Number(params.id),
        team_name: formData.team_name,
        team_members: members,
        project_idea: formData.project_idea,
        field: formData.field,
      });

      // Refresh event data
      const response = await eventsAPI.getEvent(Number(params.id));
      setEvent(response.data);
      setShowRegisterForm(false);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  // Get localized event title and description
  const getEventTitle = () => {
    if (!event) return '';
    if (locale === 'ar' && event.title_ar) return event.title_ar;
    return event.title_en;
  };

  const getEventDescription = () => {
    if (!event) return '';
    if (locale === 'ar' && event.description_ar) return event.description_ar;
    return event.description_en;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{c.eventNotFound}</h2>
          <Link href={localizedHref('/events')} className="text-primary-600 hover:underline">
            {c.backToEvents}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={localizedHref('/events')}
            className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {c.backToEvents}
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  event.status === 'upcoming'
                    ? 'bg-green-500/20 text-green-100'
                    : 'bg-white/20 text-white'
                }`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{getEventTitle()}</h1>
              <div className="flex flex-wrap gap-4 text-primary-100">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {new Date(event.start_date).toLocaleDateString(locale, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {event.location}
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{event.total_prize}</div>
                <div className="text-primary-100">{event.prize_currency} {c.inPrizes}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{c.aboutEvent}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {getEventDescription()}
              </p>
            </div>

            {/* Schedule */}
            {event.schedule && event.schedule.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">{c.eventSchedule}</h2>
                <div className="space-y-4">
                  {event.schedule.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-sm text-primary-600 font-medium">{c.day} {item.day}</div>
                        <div className="text-xs text-gray-500">
                          {item.start_time} - {item.end_time}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {locale === 'ar' && item.title_ar ? item.title_ar : item.title_en}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {locale === 'ar' && item.description_ar ? item.description_ar : item.description_en}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">{c.speakers}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {event.speakers.map((speaker) => (
                    <div key={speaker.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {speaker.photo ? (
                          <img
                            src={speaker.photo}
                            alt={speaker.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{speaker.name}</h3>
                        <p className="text-sm text-primary-600">{speaker.title}</p>
                        <div className="flex gap-2 mt-2">
                          {speaker.linkedin && (
                            <a href={speaker.linkedin} target="_blank" className="text-gray-400 hover:text-primary-600">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          {speaker.twitter && (
                            <a href={speaker.twitter} target="_blank" className="text-gray-400 hover:text-primary-600">
                              <Twitter className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="card sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{c.registration}</h3>

              {event.user_registration ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="font-medium text-gray-900">{c.youRegistered}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {c.team}: {event.user_registration.team_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {c.status}: <span className="capitalize">{event.user_registration.status}</span>
                  </p>
                </div>
              ) : showRegisterForm ? (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="label">{c.teamName}</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.team_name}
                      onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">{c.teamMembers}</label>
                    <input
                      type="text"
                      className="input"
                      placeholder={c.teamMembersPlaceholder}
                      value={formData.team_members}
                      onChange={(e) => setFormData({ ...formData, team_members: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">{c.projectIdea}</label>
                    <textarea
                      className="input"
                      rows={3}
                      value={formData.project_idea}
                      onChange={(e) => setFormData({ ...formData, project_idea: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">{c.field}</label>
                    <select
                      className="input"
                      value={formData.field}
                      onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    >
                      <option value="">{c.selectField}</option>
                      <option value="tech">{c.technology}</option>
                      <option value="health">{c.healthcare}</option>
                      <option value="education">{c.education}</option>
                      <option value="environment">{c.environment}</option>
                      <option value="business">{c.business}</option>
                      <option value="social">{c.socialImpact}</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={registering}
                    className="btn-primary w-full"
                  >
                    {registering ? c.registering : c.submitRegistration}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegisterForm(false)}
                    className="btn-secondary w-full"
                  >
                    {c.cancel}
                  </button>
                </form>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      {/* <span className="text-gray-600">{c.spotsAvailable}</span> */}
                      {/* <span className="font-medium">{event.available_spots} / {event.max_participants}</span> */}
                    </div>
                    {/* <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{c.teamSize}</span>
                      <span className="font-medium">{event.min_team_size} - {event.max_team_size} {c.members}</span>
                    </div> */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{c.deadline}</span>
                      <span className="font-medium">
                        {new Date(event.registration_deadline).toLocaleDateString(locale)}
                      </span>
                    </div>
                  </div>

                  {event.is_registration_open ? (
                    <button
                      onClick={() => user ? setShowRegisterForm(true) : router.push(localizedHref('/login'))}
                      className="btn-primary w-full"
                    >
                      {c.registerNow}
                    </button>
                  ) : (
                    <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed">
                      {c.registrationClosed}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}