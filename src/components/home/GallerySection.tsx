'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// ===== نوع الصورة =====
export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  eventName: string;
}

// ===== أنواع الخصائص =====
interface GallerySectionProps {
  locale: string;
  localizedHref: (path: string) => string;
  images?: GalleryImage[];
}

// ===== البيانات الافتراضية للصور =====
const defaultImages: GalleryImage[] = [
  { id: 1, src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', alt: 'Team collaboration', eventName: 'Hackathon 2024' },
  { id: 2, src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600', alt: 'Presentation', eventName: 'Hackathon 2024' },
  { id: 3, src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600', alt: 'Award ceremony', eventName: 'Hackathon 2024' },
  { id: 4, src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600', alt: 'Workshop', eventName: 'Innovation Workshop' },
  { id: 5, src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600', alt: 'Discussion', eventName: 'Innovation Workshop' },
  { id: 6, src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600', alt: 'Group photo', eventName: 'Innovation Workshop' },
];

export default function GallerySection({ 
  locale, 
  localizedHref,
  images = defaultImages 
}: GallerySectionProps) {
  // ===== حالات المكون =====
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
          {images.map((image, index) => (
            <GalleryItem
              key={image.id}
              image={image}
              index={index}
              isLarge={index === 0}
              onClick={() => openLightbox(image, index)}
            />
          ))}
        </div>

        {/* زر عرض المزيد */}
        <div className="text-center mt-8">
          <Link href={localizedHref('/gallery')} className="btn-secondary">
            {locale === 'ar' ? 'عرض جميع الصور' : 'View All Photos'}
          </Link>
        </div>
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
  index, 
  isLarge, 
  onClick 
}: { 
  image: GalleryImage; 
  index: number; 
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
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      {/* طبقة التراكب عند التحويم */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-medium">{image.eventName}</p>
          <p className="text-white/80 text-sm">{image.alt}</p>
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
          src={image.src}
          alt={image.alt}
          className="max-w-full max-h-[70vh] object-contain rounded-lg"
        />
        <div className="text-center mt-4">
          <p className="text-white font-medium text-lg">{image.eventName}</p>
          <p className="text-gray-400">{image.alt}</p>
        </div>
      </div>
    </div>
  );
}