import React from 'react';
import { ExternalLink, Sparkles, Heart, Palette, Handshake } from 'lucide-react';
import { Banner } from '../types';
import { storageService } from '../services/storageService';

interface SidebarBannersProps {
  banners: Banner[];
  className?: string;
}

export const SidebarBanners: React.FC<SidebarBannersProps> = ({ banners, className = '' }) => {
  const activeBanners = banners
    .filter(b => b.position === 'sidebar' && b.active)
    .sort((a, b) => a.order - b.order);

  if (activeBanners.length === 0) {
    return null;
  }

  const handleBannerClick = (banner: Banner) => {
    storageService.recordBannerClick(banner.id);
    if (banner.targetUrl) {
      window.open(banner.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const renderBadge = (banner: Banner) => {
    const text = banner.badgeText || (
      banner.type === 'art' ? 'Arte & Cultura' :
      banner.type === 'supporter' ? 'Apoiador Oficial' :
      banner.type === 'partner' ? 'Parceiro' :
      'Publicidade'
    );

    if (banner.type === 'art') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 shadow-2xs">
          <Palette className="w-2.5 h-2.5 text-purple-600" />
          <span>{text}</span>
        </span>
      );
    }

    if (banner.type === 'supporter') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
          <Heart className="w-2.5 h-2.5 text-rose-600" />
          <span>{text}</span>
        </span>
      );
    }

    if (banner.type === 'partner') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
          <Handshake className="w-2.5 h-2.5 text-blue-600" />
          <span>{text}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
        <Sparkles className="w-2.5 h-2.5 text-amber-600" />
        <span>{text}</span>
      </span>
    );
  };

  return (
    <aside className={`space-y-5 ${className}`} aria-label="Apoiadores, Artes e Banners">
      {/* Header for supporter/art section */}
      <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>Apoiadores & Artes</span>
        </span>
        <span className="text-[10px] text-slate-400 uppercase font-semibold">Parcerias</span>
      </div>

      {/* Render each sidebar banner */}
      <div className="space-y-4">
        {activeBanners.map((banner) => {
          return (
            <div
              key={banner.id}
              onClick={() => handleBannerClick(banner)}
              className={`group block bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-300 ${
                banner.targetUrl ? 'cursor-pointer' : ''
              }`}
            >
              {/* Badge & Info Bar on top */}
              <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                {renderBadge(banner)}
                {banner.targetUrl && (
                  <span className="text-[10px] font-medium text-slate-400 group-hover:text-red-600 flex items-center gap-1 transition-colors">
                    <span>Visitar</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              {/* Image container preserving natural aspect ratio without distortion */}
              <div className="relative w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-auto max-h-[500px] object-contain transition-transform duration-500 group-hover:scale-101"
                  loading="lazy"
                  style={{
                    aspectRatio: banner.width && banner.height ? `${banner.width} / ${banner.height}` : 'auto'
                  }}
                />
              </div>

              {/* Banner info */}
              {(banner.title || banner.description) && (
                <div className="p-3.5 bg-white border-t border-slate-100">
                  {banner.title && (
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2">
                      {banner.title}
                    </h4>
                  )}
                  {banner.description && (
                    <p className="mt-1 text-[11px] sm:text-xs text-slate-500 line-clamp-3 leading-relaxed font-normal">
                      {banner.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
