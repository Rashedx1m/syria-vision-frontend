'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  
  const localizedHref = (path: string) => {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href={localizedHref('/')} className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">SV</span>
              </div>
              <span className="font-bold text-xl">
                Syria <span className="text-primary-400">Vision</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              {t('description')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={localizedHref('/events')} className="text-gray-400 hover:text-primary-400 transition-colors">
                  {tNav('events')}
                </Link>
              </li>
              <li>
                <Link href={localizedHref('/forum')} className="text-gray-400 hover:text-primary-400 transition-colors">
                  {tNav('forum')}
                </Link>
              </li>
              <li>
                <Link href={localizedHref('/about')} className="text-gray-400 hover:text-primary-400 transition-colors">
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link href={localizedHref('/contact')} className="text-gray-400 hover:text-primary-400 transition-colors">
                  {tNav('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('connect')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>info@syriavision.org</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+963 XXX XXX XXX</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Damascus, Syria</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Syria Vision. {t('rights')}</p>
          <p className="mt-2 md:mt-0">
            {locale === 'ar' ? 'لأننا نؤمن بمستقبل سوريا' : 
             locale === 'fr' ? "Parce que nous croyons en l'avenir de la Syrie" :
             locale === 'tr' ? "Suriye'nin geleceğine inandığımız için" :
             "Because We Believe in Syria's Future"}
          </p>
        </div>
      </div>
    </footer>
  );
}