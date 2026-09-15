import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Banner } from '../types';
import { storageService } from '../services/storageService';

interface BannerSlideshowProps {
  banners: Banner[];
  position?: 'slideshow' | 'body_slideshow';
  sectionTitle?: string;
  onBannerClick?: (banner: Banner) => void;
}

export const BannerSlideshow: React.FC<BannerSlideshowProps> = ({ 
  banners, 
  position = 'slideshow',
  sectionTitle,
  onBannerClick 
}) => {
  const activeBanners = banners
    .filter(b => b.position === position && b.active)
    .sort((a, b) => a.order - b.order);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (activeBanners.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const prevSlide = useCallback(() => {
    if (activeBanners.length <= 1) return;
    setCurrentIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(interval);
  }, [activeBanners.length, isPaused, nextSlide]);

  if (activeBanners.length === 0) {
    return null;
  }

  const currentBanner = activeBanners[currentIndex];

  const handleBannerClick = (banner: Banner) => {
    if (onBannerClick) {
      onBannerClick(banner);
    } else {
      storageService.recordBannerClick(banner.id);
      if (banner.targetUrl) {
        window.open(banner.targetUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto my-4 md:my-6 px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-md bg-slate-900 aspect-16/9 sm:aspect-21/9 md:aspect-24/9 max-h-[460px] group">
        {/* Slides */}
        {activeBanners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with responsive sizing and aspect preservation */}
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover object-center transform transition-transform duration-1000 scale-100 group-hover:scale-102"
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* Gradient Scrim for readable high-contrast text */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-5 sm:p-8 md:p-10">
                <div className="max-w-3xl">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-xs">
                    <span>Destaque Especial</span>
                  </div>

                  {/* Title */}
                  <h2 
                    onClick={() => banner.targetUrl && handleBannerClick(banner)}
                    className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-xs ${
                      banner.targetUrl ? 'cursor-pointer hover:text-red-300 transition-colors' : ''
                    }`}
                  >
                    {banner.title}
                  </h2>

                  {/* Description */}
                  {banner.description && (
                    <p className="mt-2 text-slate-200 text-xs sm:text-sm md:text-base line-clamp-2 max-w-2xl font-normal drop-shadow-xs">
                      {banner.description}
                    </p>
                  )}

                  {/* Optional Action Button */}
                  {banner.targetUrl && (
                    <button
                      onClick={() => handleBannerClick(banner)}
                      className="mt-3.5 inline-flex items-center gap-2 px-4 py-1.5 bg-white text-slate-900 rounded-lg text-xs md:text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-md"
                    >
                      <span>Saiba mais</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Slide anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Próximo slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicators Dots */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1.5 rounded-full">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir para slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-6 h-2 bg-red-600'
                    : 'w-2 h-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
