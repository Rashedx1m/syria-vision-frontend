'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// ===== نوع الصورة من API =====
export interface GalleryImage {
  id: number;
  image: string;
  caption: string;
  order: number;
  event_title?: string;
}

// ===== أنواع الخصائص =====
interface GallerySectionProps {
  locale: string;
  localizedHref: (path: string) => string;
}

// ===== دالة مساعدة لرابط الصورة =====
const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://syria-vision-backend-production.up.railway.app';
  return `${BASE_URL}${path}`;
};

export default function GallerySection({ 
  locale, 
  localizedHref 
}: GallerySectionProps) {
  // ===== حالات المكون =====
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ===== جلب الصور من API =====
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://syria-vision-backend-production.up.railway.app/api';
        const response = await fetch(`${API_URL}/events/gallery/`);
        if (!response.ok) throw new Error('Failed to fetch gallery');
        const data = await response.json();
        // التعامل مع الاستجابة سواء كانت مصفوفة أو كائن يحتوي على results
        setImages(data.results || data);
      } catch (err) {
        setError('Failed to load gallery');
        console.error('Gallery fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // ===== التنقل بين الصور =====
  const nextImage = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const prevImage = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  // ===== حالة التحميل =====
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
              {locale === 'ar' ? 'معرض الصور' : 'Gallery'}
            </span>
            <h2 className="section-title">
              {locale === 'ar' ? 'لحظات من فعالياتنا' : 'Moments from Our Events'}
            </h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        </div>
      </section>
    );
  }

  // ===== حالة الخطأ أو عدم وجود صور =====
  if (error || images.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
              {locale === 'ar' ? 'معرض الصور' : 'Gallery'}
            </span>
            <h2 className="section-title">
              {locale === 'ar' ? 'لحظات من فعالياتنا' : 'Moments from Our Events'}
            </h2>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">
              {locale === 'ar' ? 'لا توجد صور حالياً' : 'No photos available yet'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* عنوان القسم */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
            {locale === 'ar' ? 'معرض الصور' : 'Gallery'}
          </span>
          <h2 className="section-title">
            {locale === 'ar' ? 'لحظات من فعالياتنا' : 'Moments from Our Events'}
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'استعرض أجمل اللحظات والذكريات من الفعاليات السابقة'
              : 'Browse the best moments and memories from our past events'}
          </p>
        </div>

        {/* شبكة الصور */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.slice(0, 6).map((image, index) => (
            <GalleryItem
              key={image.id}
              image={image}
              isLarge={index === 0}
              onClick={() => openLightbox(image, index)}
            />
          ))}
        </div>

        {/* زر عرض المزيد */}
        {images.length > 6 && (
          <div className="text-center mt-8">
            <Link href={localizedHref('/gallery')} className="btn-secondary">
              {locale === 'ar' ? 'عرض جميع الصور' : 'View All Photos'}
            </Link>
          </div>
        )}
      </div>

      {/* نافذة عرض الصورة المكبرة */}
      {selectedImage && (
        <Lightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </section>
  );
}

// ===== مكون عنصر المعرض =====
function GalleryItem({ 
  image, 
  isLarge, 
  onClick 
}: { 
  image: GalleryImage; 
  isLarge: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
        isLarge ? 'md:col-span-2 md:row-span-2' : ''
      }`}
      onClick={onClick}
    >
      <div className={`${isLarge ? 'h-64 md:h-full' : 'h-48 md:h-64'} bg-gray-200`}>
        <img
          src={getImageUrl(image.image)}
          alt={image.caption || 'Gallery image'}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image';
          }}
        />
      </div>
      
      {/* طبقة التراكب عند التحويم */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 right-4">
          {image.event_title && (
            <p className="text-white font-medium">{image.event_title}</p>
          )}
          {image.caption && (
            <p className="text-white/80 text-sm">{image.caption}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== مكون نافذة العرض المكبر =====
function Lightbox({ 
  image, 
  onClose, 
  onNext, 
  onPrev 
}: { 
  image: GalleryImage; 
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  // إغلاق بزر Escape والتنقل بالأسهم
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* زر الإغلاق */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <X className="w-8 h-8" />
      </button>
      
      {/* أزرار التنقل */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 text-white hover:text-gray-300"
      >
        <ChevronLeft className="w-10 h-10" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 text-white hover:text-gray-300"
      >
        <ChevronRight className="w-10 h-10" />
      </button>

      {/* الصورة المكبرة */}
      <div className="max-w-4xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
        <img
          src={getImageUrl(image.image)}
          alt={image.caption || 'Gallery image'}
          className="max-w-full max-h-[70vh] object-contain rounded-lg"
        />
        {(image.event_title || image.caption) && (
          <div className="text-center mt-4">
            {image.event_title && (
              <p className="text-white font-medium text-lg">{image.event_title}</p>
            )}
            {image.caption && (
              <p className="text-gray-400">{image.caption}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}