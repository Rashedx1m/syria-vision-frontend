'use client';

import { Star } from 'lucide-react';

// ===== نوع الحكم =====
export interface Judge {
  id: number;
  name: string;
  title: string;
  company: string;
  image: string;
  bio: string;
}

// ===== أنواع الخصائص =====
interface JudgesSectionProps {
  locale: string;
  judges?: Judge[];
}

// ===== البيانات الافتراضية للحكام =====
const defaultJudges: Judge[] = [
  {
    id: 1,
    name: 'Dr. Ahmad Mohammad',
    title: 'CEO',
    company: 'Advanced Tech Co.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    bio: 'Over 15 years of experience in technology and innovation',
  },
  {
    id: 2,
    name: 'Eng. Sarah Ahmed',
    title: 'Innovation Director',
    company: 'Future Group',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    bio: 'Specialist in entrepreneurship and startup development',
  },
  {
    id: 3,
    name: 'Mr. Khalid Al-Ali',
    title: 'Investor & Advisor',
    company: 'Tech Investment Fund',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    bio: 'Invested in over 50 successful startups',
  },
  {
    id: 4,
    name: 'Dr. Noura Al-Saeed',
    title: 'Professor',
    company: 'Damascus University',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    bio: 'Researcher in AI and machine learning',
  },
];

export default function JudgesSection({ 
  locale,
  judges = defaultJudges 
}: JudgesSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* عنوان القسم */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
            {locale === 'ar' ? 'لجنة التحكيم' : 'Jury Panel'}
          </span>
          <h2 className="section-title">
            {locale === 'ar' ? 'تعرف على حكامنا' : 'Meet Our Judges'}
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'نخبة من الخبراء والمتخصصين في مختلف المجالات'
              : 'A distinguished panel of experts and specialists in various fields'}
          </p>
        </div>

        {/* شبكة الحكام */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {judges.map((judge) => (
            <JudgeCard key={judge.id} judge={judge} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== مكون بطاقة الحكم =====
function JudgeCard({ judge }: { judge: Judge }) {
  return (
    <div className="group text-center">
      {/* صورة الحكم */}
      <div className="relative mb-6 mx-auto w-40 h-40">
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-primary-200 transition-colors">
          <img
            src={judge.image}
            alt={judge.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* أيقونة النجمة */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
          <Star className="w-5 h-5 text-white" />
        </div>
      </div>
      
      {/* معلومات الحكم */}
      <h3 className="text-xl font-semibold text-gray-900 mb-1">
        {judge.name}
      </h3>
      <p className="text-primary-600 font-medium mb-1">{judge.title}</p>
      <p className="text-gray-500 text-sm mb-3">{judge.company}</p>
      <p className="text-gray-600 text-sm leading-relaxed">
        {judge.bio}
      </p>
    </div>
  );
}