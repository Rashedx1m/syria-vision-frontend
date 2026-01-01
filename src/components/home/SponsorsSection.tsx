'use client';

import Image from 'next/image';

// ===== نوع الراعي =====
export interface Sponsor {
  id: number;
  name: string;
  logo: string;
}

// ===== أنواع الخصائص =====
interface SponsorsSectionProps {
  locale: string;
  sponsors?: Sponsor[];
}

// ===== البيانات الافتراضية للرعاة =====
// ضع الشعارات في مجلد: public/sponsors/
const defaultSponsors: Sponsor[] = [
  { id: 1, name: 'Tech Company', logo: '/sponsors/claude.svg' },
  { id: 2, name: 'Innovation Bank', logo: '/sponsors/adobe-icon.svg' },
  { id: 3, name: 'Future Group', logo: '/sponsors/apidog.svg' },
  { id: 4, name: 'Solutions Co.', logo: '/sponsors/async-api-icon.svg' },
  { id: 5, name: 'Development Foundation', logo: '/sponsors/claude-icon.svg' },
  { id: 6, name: 'Software Inc.', logo: '/sponsors/daisyUI-icon.svg' },
   { id: 7, name: 'Software Inc.', logo: '/sponsors/effector.svg' },
    { id: 8, name: 'Software Inc.', logo: '/sponsors/faker.svg' },
     { id: 9, name: 'Software Inc.', logo: '/sponsors/fastapi.svg' },
      { id: 10, name: 'Software Inc.', logo: '/sponsors/gradio-icon.svg' },
       { id: 11, name: 'Software Inc.', logo: '/sponsors/importio-icon.svg' },
        { id: 12, name: 'Software Inc.', logo: '/sponsors/internet-computer-icon.svg' },
         { id: 13, name: 'Software Inc.', logo: '/sponsors/meta-icon.svg' },
         { id: 14, name: 'Software Inc.', logo: '/sponsors/obsidian-icon.svg' },
         { id: 15, name: 'Software Inc.', logo: '/sponsors/okta-icon.svg' },
         { id: 16, name: 'Software Inc.', logo: '/sponsors/perplexity.svg' },
         { id: 17, name: 'Software Inc.', logo: '/sponsors/replay-icon.svg' },
         { id: 18, name: 'Software Inc.', logo: '/sponsors/sonarlint-icon.svg' },
         { id: 19, name: 'Software Inc.', logo: '/sponsors/tor-browser.svg' },
         { id: 20, name: 'Software Inc.', logo: '/sponsors/waypoint-icon.svg' },
         { id: 21, name: 'Software Inc.', logo: '/sponsors/x.svg' },
         { id: 22, name: 'Software Inc.', logo: '/sponsors/zoho.svg' },
         
];

export default function SponsorsSection({ 
  locale, 
  sponsors = defaultSponsors 
}: SponsorsSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* عنوان القسم */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            {locale === 'ar' ? 'شركاؤنا في النجاح' : 'Trusted By'}
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">
            {locale === 'ar' ? 'الشركات الداعمة' : 'Our Partners'}
          </h2>
        </div>

        {/* شريط الرعاة المتحرك */}
        <div className="relative overflow-hidden group">
          {/* تأثير التلاشي على الأطراف */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          {/* الشريط المتحرك */}
          <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
            {/* المجموعة الأولى */}
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="flex-shrink-0 mx-8 flex items-center justify-center"
              >
                <div className="w-32 h-16 relative grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
            {/* المجموعة المكررة للتمرير المستمر */}
            {sponsors.map((sponsor) => (
              <div
                key={`dup-${sponsor.id}`}
                className="flex-shrink-0 mx-8 flex items-center justify-center"
              >
                <div className="w-32 h-16 relative grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}