'use client';

import Link from 'next/link';
import { Building2 } from 'lucide-react';

// ===== نوع الراعي =====
export interface Sponsor {
  id: number;
  name: string;
  logo: string;
  website: string;
  tier: 'platinum' | 'gold' | 'silver';
}

// ===== أنواع الخصائص =====
interface SponsorsSectionProps {
  locale: string;
  localizedHref: (path: string) => string;
  sponsors?: Sponsor[];
}

// ===== البيانات الافتراضية للرعاة =====
const defaultSponsors: Sponsor[] = [
  { id: 1, name: 'Tech Company', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200', website: 'https://example.com', tier: 'platinum' },
  { id: 2, name: 'Innovation Bank', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200', website: 'https://example.com', tier: 'platinum' },
  { id: 3, name: 'Future Group', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200', website: 'https://example.com', tier: 'gold' },
  { id: 4, name: 'Solutions Co.', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200', website: 'https://example.com', tier: 'gold' },
  { id: 5, name: 'Development Foundation', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200', website: 'https://example.com', tier: 'silver' },
  { id: 6, name: 'Software Inc.', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200', website: 'https://example.com', tier: 'silver' },
];

export default function SponsorsSection({ 
  locale, 
  localizedHref,
  sponsors = defaultSponsors 
}: SponsorsSectionProps) {
  // ===== تصنيف الرعاة حسب المستوى =====
  const platinumSponsors = sponsors.filter(s => s.tier === 'platinum');
  const goldSponsors = sponsors.filter(s => s.tier === 'gold');
  const silverSponsors = sponsors.filter(s => s.tier === 'silver');

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* عنوان القسم */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
            {locale === 'ar' ? 'شركاؤنا' : 'Our Partners'}
          </span>
          <h2 className="section-title">
            {locale === 'ar' ? 'الشركات الداعمة' : 'Our Sponsors'}
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'نفتخر بشراكتنا مع هذه المؤسسات الرائدة'
              : 'We are proud to partner with these leading organizations'}
          </p>
        </div>

        {/* الرعاة البلاتينيون */}
        {platinumSponsors.length > 0 && (
          <SponsorTier
            title={locale === 'ar' ? 'الرعاة البلاتينيون' : 'Platinum Sponsors'}
            sponsors={platinumSponsors}
            size="large"
            showIcon
          />
        )}

        {/* الرعاة الذهبيون */}
        {goldSponsors.length > 0 && (
          <SponsorTier
            title={locale === 'ar' ? 'الرعاة الذهبيون' : 'Gold Sponsors'}
            sponsors={goldSponsors}
            size="medium"
          />
        )}

        {/* الرعاة الفضيون */}
        {silverSponsors.length > 0 && (
          <SponsorTier
            title={locale === 'ar' ? 'الرعاة الفضيون' : 'Silver Sponsors'}
            sponsors={silverSponsors}
            size="small"
          />
        )}

        {/* دعوة للشراكة */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            {locale === 'ar' 
              ? 'هل تريد أن تكون شريكاً في نجاحنا؟'
              : 'Want to become a partner in our success?'}
          </p>
          <Link href={localizedHref('/contact')} className="btn-secondary">
            {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ===== مكون مستوى الرعاية =====
function SponsorTier({ 
  title, 
  sponsors, 
  size,
  showIcon = false
}: { 
  title: string; 
  sponsors: Sponsor[]; 
  size: 'large' | 'medium' | 'small';
  showIcon?: boolean;
}) {
  // ===== تحديد أحجام البطاقات =====
  const sizeClasses = {
    large: 'w-48 h-24 p-4',
    medium: 'w-40 h-20 p-3',
    small: 'w-32 h-16 p-2',
  };

  const gapClasses = {
    large: 'gap-8',
    medium: 'gap-6',
    small: 'gap-4',
  };

  return (
    <div className="mb-12">
      <h3 className="text-center text-lg font-semibold text-gray-500 mb-6 flex items-center justify-center gap-2">
        {showIcon && <Building2 className="w-5 h-5" />}
        {title}
      </h3>
      <div className={`flex flex-wrap justify-center ${gapClasses[size]}`}>
        {sponsors.map((sponsor) => (
          <SponsorCard 
            key={sponsor.id} 
            sponsor={sponsor} 
            sizeClass={sizeClasses[size]}
          />
        ))}
      </div>
    </div>
  );
}

// ===== مكون بطاقة الراعي =====
function SponsorCard({ 
  sponsor, 
  sizeClass 
}: { 
  sponsor: Sponsor; 
  sizeClass: string;
}) {
  return (
    <a
      href={sponsor.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <div className={`${sizeClass} bg-white rounded-xl shadow-md flex items-center justify-center border-2 border-transparent hover:border-primary-200 transition-all hover:shadow-lg`}>
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all"
        />
      </div>
    </a>
  );
}