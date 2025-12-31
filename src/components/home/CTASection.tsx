'use client';

import Link from 'next/link';

// ===== أنواع الخصائص =====
interface CTASectionProps {
  t: (key: string) => string;
  tCommon: (key: string) => string;
  localizedHref: (path: string) => string;
}

export default function CTASection({ 
  t, 
  tCommon, 
  localizedHref 
}: CTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* العنوان */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t('readyMakeDifference')}
        </h2>
        
        {/* الوصف */}
        <p className="text-primary-100 text-lg mb-8">
          {t('readyDescription')}
        </p>
        
        {/* الأزرار */}
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
  );
}