import React from 'react';
import { VisualIdentity, LogoDisplayMode } from '../types';

interface LogoProps {
  identity: VisualIdentity;
  variant?: 'color' | 'mono';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  customHeight?: number;
}

export const Logo: React.FC<LogoProps> = ({ 
  identity, 
  variant = 'color', 
  className = '', 
  size,
  customHeight 
}) => {
  const isMono = variant === 'mono';
  const customLogoUrl = isMono 
    ? (identity.logoMonoUrl || identity.logoColorUrl) 
    : (identity.logoColorUrl || identity.logoMonoUrl);

  const displayMode: LogoDisplayMode = identity.logoDisplayMode || (customLogoUrl ? 'both' : 'both');
  const siteName = (identity.siteName || 'PORTAL NOTÍCIAS').trim();
  const tagline = (identity.tagline || '').trim();
  const primaryColor = identity.colors?.primary || '#dc2626';
  const showSiteName = identity.showSiteName !== false;

  // Resolve effective size preset and height
  const effectiveSize = size || (variant === 'color' ? (identity.logoSize || 'md') : 'md');
  const presetHeight = {
    sm: 32,
    md: 44,
    lg: 60,
    xl: 78,
    '2xl': 96,
  }[effectiveSize] || 44;

  const targetHeight = customHeight || (variant === 'color' ? (identity.logoHeight || presetHeight) : presetHeight);

  // Words breakdown for two-tone editorial styling
  const words = siteName.split(/\s+/);
  const firstWord = words[0] || 'PORTAL';
  const remainingWords = words.slice(1).join(' ');

  const initialLetter = siteName.charAt(0).toUpperCase() || 'P';

  // Calculate typography and badge scaling based on targetHeight
  const calculatedBadgeSize = Math.max(28, Math.round(targetHeight * 0.85));
  const calculatedBadgeFontSize = Math.max(12, Math.round(targetHeight * 0.42));
  const calculatedTextFontSize = Math.max(16, Math.min(42, Math.round(targetHeight * 0.46)));
  const calculatedTaglineFontSize = Math.max(10, Math.min(14, Math.round(targetHeight * 0.22)));

  // If portal name is explicitly disabled, render only the brand logo or emblem
  if (!showSiteName) {
    if (customLogoUrl) {
      return (
        <div className={`flex items-center select-none ${className}`}>
          <img
            src={customLogoUrl}
            alt={siteName}
            style={{
              height: `${targetHeight}px`,
              maxHeight: `${targetHeight}px`,
              width: 'auto',
            }}
            className={`object-contain transition-all duration-200 ${
              isMono && !identity.logoMonoUrl ? 'brightness-0 invert opacity-90' : ''
            }`}
          />
        </div>
      );
    }

    return (
      <div className={`flex items-center select-none ${className}`}>
        <div 
          className={`flex items-center justify-center rounded-xl shadow-xs font-black shrink-0 transition-all duration-200 ${
            isMono ? 'bg-slate-700 text-white' : 'text-white'
          }`}
          style={{
            width: `${calculatedBadgeSize}px`,
            height: `${calculatedBadgeSize}px`,
            fontSize: `${calculatedBadgeFontSize}px`,
            backgroundColor: !isMono ? primaryColor : undefined,
          }}
          title={siteName}
        >
          <span>{initialLetter}</span>
        </div>
      </div>
    );
  }

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
          }`}
          style={{ fontSize: `${calculatedTextFontSize}px` }}
        >
          {firstWord}
        </span>

        {remainingWords && (
          <span 
            className={`font-semibold tracking-normal transition-colors ${
              isMono ? 'text-slate-300' : ''
            }`}
            style={{
              fontSize: `${calculatedTextFontSize}px`,
              color: !isMono ? primaryColor : undefined,
            }}
          >
            {remainingWords}
          </span>
        )}

        <span 
          className="rounded-full shrink-0" 
          style={{ 
            width: `${Math.max(4, Math.round(targetHeight * 0.1))}px`,
            height: `${Math.max(4, Math.round(targetHeight * 0.1))}px`,
            backgroundColor: isMono ? '#ffffff' : primaryColor 
          }} 
        />
      </div>

      {showTagline && tagline && targetHeight >= 36 && (
        <span 
          className={`tracking-wider uppercase font-semibold mt-1 line-clamp-1 ${
            isMono ? 'text-slate-400' : 'text-slate-500'
          }`}
          style={{ fontSize: `${calculatedTaglineFontSize}px` }}
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
          style={{
            height: `${targetHeight}px`,
            maxHeight: `${targetHeight}px`,
            width: 'auto',
          }}
          className={`object-contain transition-all duration-200 ${
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
            style={{
              height: `${targetHeight}px`,
              maxHeight: `${targetHeight}px`,
              width: 'auto',
            }}
            className={`object-contain shrink-0 transition-all duration-200 ${
              isMono && !identity.logoMonoUrl ? 'brightness-0 invert opacity-90' : ''
            }`}
          />
        ) : (
          <div 
            className={`flex items-center justify-center rounded-xl shadow-xs font-black shrink-0 transition-all duration-200 ${
              isMono 
                ? 'bg-slate-700 text-white' 
                : 'text-white'
            }`}
            style={{
              width: `${calculatedBadgeSize}px`,
              height: `${calculatedBadgeSize}px`,
              fontSize: `${calculatedBadgeFontSize}px`,
              backgroundColor: !isMono ? primaryColor : undefined,
            }}
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
        className={`flex items-center justify-center rounded-xl shadow-xs font-black shrink-0 transition-all duration-200 ${
          isMono 
            ? 'bg-slate-700 text-white' 
            : 'text-white'
        }`}
        style={{
          width: `${calculatedBadgeSize}px`,
          height: `${calculatedBadgeSize}px`,
          fontSize: `${calculatedBadgeFontSize}px`,
          backgroundColor: !isMono ? primaryColor : undefined,
        }}
      >
        <span>{initialLetter}</span>
      </div>

      {renderTextComponent(true)}
    </div>
  );
};

