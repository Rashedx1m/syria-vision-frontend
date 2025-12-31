'use client';

import { Lightbulb, Target, Rocket, Heart, LucideIcon } from 'lucide-react';

// ===== أنواع الخصائص =====
interface FeaturesSectionProps {
  t: (key: string) => string;
}

// ===== نوع الميزة =====
interface Feature {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
}

// ===== بيانات المميزات =====
const features: Feature[] = [
  {
    icon: Lightbulb,
    titleKey: 'innovation',
    descriptionKey: 'innovationDesc',
  },
  {
    icon: Target,
    titleKey: 'leadership',
    descriptionKey: 'leadershipDesc',
  },
  {
    icon: Rocket,
    titleKey: 'sustainability',
    descriptionKey: 'sustainabilityDesc',
  },
  {
    icon: Heart,
    titleKey: 'collaboration',
    descriptionKey: 'collaborationDesc',
  },
];

export default function FeaturesSection({ t }: FeaturesSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* عنوان القسم */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
            {t('ourVision')}
          </span>
          <h2 className="section-title">{t('buildingTogether')}</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {t('visionDescription')}
          </p>
        </div>

        {/* شبكة المميزات */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              feature={feature} 
              t={t} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== مكون بطاقة الميزة =====
function FeatureCard({ 
  feature, 
  t 
}: { 
  feature: Feature; 
  t: (key: string) => string;
}) {
  const Icon = feature.icon;
  
  return (
    <div className="card text-center hover:-translate-y-2">
      <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-primary-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {t(feature.titleKey)}
      </h3>
      <p className="text-gray-600">{t(feature.descriptionKey)}</p>
    </div>
  );
}