'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Target, Users, Lightbulb, Heart, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const localizedHref = (path: string) => `/${locale}${path}`;

  const values = [
    {
      icon: Lightbulb,
      title: t('innovation'),
      description: t('innovationDesc'),
    },
    {
      icon: Target,
      title: t('excellence'),
      description: t('excellenceDesc'),
    },
    {
      icon: Users,
      title: t('collaboration'),
      description: t('collaborationDesc'),
    },
    {
      icon: Heart,
      title: t('integrity'),
      description: t('integrityDesc'),
    },
  ];

  const stats = [
    { value: '500+', label: t('participants') },
    { value: '50+', label: t('projects') },
    { value: '20+', label: t('mentors') },
    { value: '5', label: t('eventsCount') },
  ];

  const fields = [
    { title: t('techAI'), desc: t('techAIDesc') },
    { title: t('healthcare'), desc: t('healthcareDesc') },
    { title: t('education'), desc: t('educationDesc') },
    { title: t('environment'), desc: t('environmentDesc') },
    { title: t('business'), desc: t('businessDesc') },
    { title: t('socialImpact'), desc: t('socialImpactDesc') },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
                {t('ourMission')}
              </span>
              <h2 className="section-title mb-6">{t('buildingLeaders')}</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {t('missionDesc1')}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('missionDesc2')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="card text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
              {t('ourValues')}
            </span>
            <h2 className="section-title">{t('whatWeStandFor')}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center hover:-translate-y-2">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-3xl p-12 text-white text-center">
            <Globe className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('ourVision')}</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t('visionDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* Competition Fields */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
              {t('competitionFields')}
            </span>
            <h2 className="section-title">{t('areasOfInnovation')}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field, index) => (
              <div key={index} className="card flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{field.title}</h3>
                  <p className="text-gray-600 text-sm">{field.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('joinMovement')}</h2>
          <p className="text-gray-400 text-lg mb-8">
            {t('joinDesc')}
          </p>
          <Link href={localizedHref('/events')} className="btn-primary inline-block">
            {tCommon('exploreEvents')}
          </Link>
        </div>
      </section>
    </div>
  );
}