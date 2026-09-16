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
      className="relative w-full max-w-[1350px] mx-auto my-3 md:my-5 px-2 sm:px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1350x250px Aspect Ratio Container */}
      <div 
        className="relative w-full overflow-hidden rounded-xl md:rounded-2xl shadow-md bg-slate-950 aspect-[1350/250] max-h-[250px] group select-none border border-slate-200/40"
      >
        {/* Slides */}
        {activeBanners.map((banner, index) => {
          const isActive = index === currentIndex;
          const showTextOverlay = banner.showText !== false && Boolean(banner.title?.trim() || banner.description?.trim());

          return (
            <div
              key={banner.id}
              onClick={() => banner.targetUrl && handleBannerClick(banner)}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              } ${banner.targetUrl ? 'cursor-pointer' : ''}`}
            >
              {/* Banner Image Presentation: Backdrop blur prevents empty space for non-exact ratios while main image displays accurately */}
              <div 
                className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-40 scale-105 pointer-events-none"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              />

              {/* Main Banner Image maintaining 1350x250 proportion and rendering attached art cleanly */}
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src={banner.imageUrl}
                  alt={banner.title || 'Banner'}
                  className="w-full h-full object-contain md:object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>

              {/* Optional Text Overlay (Only rendered if showText is enabled) */}
              {showTextOverlay && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-3 sm:p-5 md:p-7 pointer-events-none">
                  <div className="max-w-3xl pointer-events-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 sm:mb-1.5 backdrop-blur-xs">
                      <span>Destaque Especial</span>
                    </div>

                    {/* Title */}
                    <h2 
                      className={`text-sm sm:text-lg md:text-xl lg:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-xs line-clamp-1 sm:line-clamp-2 ${
                        banner.targetUrl ? 'hover:text-red-300 transition-colors' : ''
                      }`}
                    >
                      {banner.title}
                    </h2>

                    {/* Description */}
                    {banner.description && (
                      <p className="mt-0.5 sm:mt-1 text-slate-200 text-[11px] sm:text-xs md:text-sm line-clamp-1 max-w-2xl font-normal drop-shadow-xs hidden sm:block">
                        {banner.description}
                      </p>
                    )}

                    {/* Optional Action Button */}
                    {banner.targetUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBannerClick(banner);
                        }}
                        className="mt-1.5 sm:mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-white text-slate-900 rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-md cursor-pointer"
                      >
                        <span>Saiba mais</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Slide anterior"
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Próximo slide"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-md"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Indicators Dots */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-2 right-3 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2 py-1 rounded-full">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                aria-label={`Ir para slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-5 h-1.5 bg-red-600'
                    : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
