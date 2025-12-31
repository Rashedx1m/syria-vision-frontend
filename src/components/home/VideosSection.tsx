'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, X } from 'lucide-react';

// ===== نوع الفيديو =====
export interface Video {
  id: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
  eventName: string;
}

// ===== أنواع الخصائص =====
interface VideosSectionProps {
  locale: string;
  localizedHref: (path: string) => string;
  videos?: Video[];
}

// ===== البيانات الافتراضية للفيديوهات =====
const defaultVideos: Video[] = [
  {
    id: 1,
    title: 'Hackathon 2024 Highlights',
    thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    eventName: 'Hackathon 2024',
  },
  {
    id: 2,
    title: 'Winners Interview',
    thumbnail: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=600',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    eventName: 'Hackathon 2024',
  },
  {
    id: 3,
    title: 'Best Moments',
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    eventName: 'Hackathon 2023',
  },
];

export default function VideosSection({ 
  locale, 
  localizedHref,
  videos = defaultVideos 
}: VideosSectionProps) {
  // ===== حالة الفيديو المشغل =====
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* عنوان القسم */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full font-medium mb-4">
            {locale === 'ar' ? 'فيديوهات' : 'Videos'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {locale === 'ar' ? 'شاهد فعالياتنا' : 'Watch Our Events'}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'اكتشف أجواء الفعاليات من خلال مقاطع الفيديو'
              : 'Discover the event atmosphere through our video highlights'}
          </p>
        </div>

        {/* شبكة الفيديوهات */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onClick={() => setPlayingVideo(video)}
            />
          ))}
        </div>

        {/* زر عرض المزيد */}
        <div className="text-center mt-12">
          <Link
            href={localizedHref('/videos')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            <Play className="w-5 h-5" />
            {locale === 'ar' ? 'شاهد المزيد' : 'Watch More'}
          </Link>
        </div>
      </div>

      {/* نافذة تشغيل الفيديو */}
      {playingVideo && (
        <VideoModal 
          video={playingVideo} 
          onClose={() => setPlayingVideo(null)} 
        />
      )}
    </section>
  );
}

// ===== مكون بطاقة الفيديو =====
function VideoCard({ 
  video, 
  onClick 
}: { 
  video: Video; 
  onClick: () => void;
}) {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      {/* صورة مصغرة للفيديو */}
      <div className="relative rounded-2xl overflow-hidden mb-4">
        <div className="h-48 bg-gray-800">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* زر التشغيل */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      </div>
      
      {/* معلومات الفيديو */}
      <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-primary-400 transition-colors">
        {video.title}
      </h3>
      <p className="text-gray-500 text-sm">{video.eventName}</p>
    </div>
  );
}

// ===== مكون نافذة تشغيل الفيديو =====
function VideoModal({ 
  video, 
  onClose 
}: { 
  video: Video; 
  onClose: () => void;
}) {
  return (
    <div 
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* زر الإغلاق */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <X className="w-8 h-8" />
      </button>

      {/* مشغل الفيديو */}
      <div 
        className="w-full max-w-4xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={video.videoUrl}
          title={video.title}
          className="w-full h-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}