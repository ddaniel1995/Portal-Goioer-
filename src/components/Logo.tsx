import React from 'react';
import { VisualIdentity, LogoDisplayMode } from '../types';

interface LogoProps {
  identity: VisualIdentity;
  variant?: 'color' | 'mono';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ identity, variant = 'color', className = '', size = 'md' }) => {
  const isMono = variant === 'mono';
  const customLogoUrl = isMono 
    ? (identity.logoMonoUrl || identity.logoColorUrl) 
    : (identity.logoColorUrl || identity.logoMonoUrl);

  const displayMode: LogoDisplayMode = identity.logoDisplayMode || (customLogoUrl ? 'both' : 'both');
  const siteName = (identity.siteName || 'PORTAL NOTÍCIAS').trim();
  const tagline = (identity.tagline || '').trim();
  const primaryColor = identity.colors?.primary || '#dc2626';

  // Words breakdown for two-tone editorial styling
  const words = siteName.split(/\s+/);
  const firstWord = words[0] || 'PORTAL';
  const remainingWords = words.slice(1).join(' ');

  const initialLetter = siteName.charAt(0).toUpperCase() || 'P';

  const imageSizeClasses = {
    sm: 'h-8 max-h-8 w-auto max-w-[130px]',
    md: 'h-10 max-h-10 w-auto max-w-[190px]',
    lg: 'h-14 max-h-14 w-auto max-w-[260px]',
  }[size];

  const textSizeClasses = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  }[size];

  const badgeSizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-xl',
  }[size];

  // Helper component to render site name text with editorial typography
  const renderTextComponent = (showTagline = true) => (
    <div 
      className="flex flex-col leading-none"
      style={{ fontFamily: 'var(--theme-font-heading, var(--theme-font-body, inherit))' }}
    >
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span 
          className={`font-black tracking-tight ${
            isMono ? 'text-white' : 'text-slate-900'
          } ${textSizeClasses}`}
        >
          {firstWord}
        </span>

        {remainingWords && (
          <span 
            className={`font-semibold tracking-normal transition-colors ${
              isMono ? 'text-slate-300' : ''
            } ${textSizeClasses}`}
            style={!isMono ? { color: primaryColor } : undefined}
          >
            {remainingWords}
          </span>
        )}

        <span 
          className="w-1.5 h-1.5 rounded-full shrink-0" 
          style={{ backgroundColor: isMono ? '#ffffff' : primaryColor }} 
        />
      </div>

      {showTagline && tagline && size !== 'sm' && (
        <span 
          className={`text-[10px] sm:text-[11px] tracking-wider uppercase font-semibold mt-1 line-clamp-1 ${
            isMono ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {tagline}
        </span>
      )}
    </div>
  );

  // 1. MODE: Apenas Logo PNG
  if (displayMode === 'logo_only' && customLogoUrl) {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <img
          src={customLogoUrl}
          alt={siteName}
          className={`${imageSizeClasses} object-contain transition-all ${
            isMono && !identity.logoMonoUrl ? 'brightness-0 invert opacity-90' : ''
          }`}
        />
      </div>
    );
  }

  // 2. MODE: Ambos juntos (Logo PNG + Texto do Nome na Frente/ao lado)
  if (displayMode === 'both') {
    return (
      <div className={`flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
        {/* PNG Logo or Designed Monogram if no PNG uploaded */}
        {customLogoUrl ? (
          <img
            src={customLogoUrl}
            alt={siteName}
            className={`${imageSizeClasses} object-contain shrink-0 transition-all ${
              isMono && !identity.logoMonoUrl ? 'brightness-0 invert opacity-90' : ''
            }`}
          />
        ) : (
          <div 
            className={`flex items-center justify-center rounded-xl shadow-xs font-black shrink-0 transition-all ${badgeSizeClasses} ${
              isMono 
                ? 'bg-slate-700 text-white' 
                : 'text-white'
            }`}
            style={!isMono ? { backgroundColor: primaryColor } : undefined}
          >
            <span>{initialLetter}</span>
          </div>
        )}

        {/* Text in front of the PNG */}
        {renderTextComponent(true)}
      </div>
    );
  }

  // 3. MODE: Apenas Texto
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div 
        className={`flex items-center justify-center rounded-xl shadow-xs font-black shrink-0 transition-all ${badgeSizeClasses} ${
          isMono 
            ? 'bg-slate-700 text-white' 
            : 'text-white'
        }`}
        style={!isMono ? { backgroundColor: primaryColor } : undefined}
      >
        <span>{initialLetter}</span>
      </div>

      {renderTextComponent(true)}
    </div>
  );
};

