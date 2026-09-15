import React from 'react';
import { VisualIdentity } from '../types';

interface LogoProps {
  identity: VisualIdentity;
  variant?: 'color' | 'mono';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ identity, variant = 'color', className = '', size = 'md' }) => {
  const isMono = variant === 'mono';
  const customLogoUrl = isMono ? identity.logoMonoUrl : identity.logoColorUrl;

  const sizeClasses = {
    sm: 'h-8 text-lg',
    md: 'h-10 text-2xl',
    lg: 'h-14 text-3xl',
  }[size];

  if (customLogoUrl) {
    return (
      <div className={`flex items-center ${className}`}>
        <img
          src={customLogoUrl}
          alt={identity.siteName}
          className={`${sizeClasses.split(' ')[0]} w-auto object-contain ${isMono ? 'brightness-0 invert opacity-90' : ''}`}
        />
      </div>
    );
  }

  // Fallback designed SVG + typographic logo
  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      <div className={`flex items-center justify-center rounded-lg shadow-sm font-extrabold ${
        size === 'sm' ? 'w-8 h-8 text-sm' : size === 'lg' ? 'w-12 h-12 text-2xl' : 'w-10 h-10 text-lg'
      } ${
        isMono 
          ? 'bg-slate-200 text-slate-900' 
          : 'bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-red-500/20'
      }`}>
        <span>P</span>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tighter ${
            isMono ? 'text-white' : 'text-slate-900'
          } ${size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'}`}>
            PORTAL
          </span>
          <span className={`font-light tracking-wide ${
            isMono ? 'text-slate-300' : 'text-red-600'
          } ${size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'}`}>
            NOTÍCIAS
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${isMono ? 'bg-white' : 'bg-red-600'}`} />
        </div>
        {size !== 'sm' && (
          <span className={`text-[10px] tracking-widest uppercase font-semibold mt-0.5 ${
            isMono ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Jornalismo em Tempo Real
          </span>
        )}
      </div>
    </div>
  );
};
