import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Sparkles } from 'lucide-react';
import { SitePopup } from '../types';

interface SitePopupModalProps {
  popup: SitePopup;
  previewMode?: boolean;
  onClose?: () => void;
  isHomePage?: boolean;
}

export const SitePopupModal: React.FC<SitePopupModalProps> = ({
  popup,
  previewMode = false,
  onClose,
  isHomePage = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // If in preview mode (e.g. testing inside Admin), always open
    if (previewMode) {
      setIsOpen(true);
      return;
    }

    // Check if popup is active and has an image attached
    if (!popup.active || !popup.imageUrl) {
      setIsOpen(false);
      return;
    }

    // If configured for home only and we're not on home, don't show
    if (popup.showOnHomeOnly && !isHomePage) {
      setIsOpen(false);
      return;
    }

    // Frequency checking
    if (popup.frequency === 'once_per_session') {
      const alreadySeen = sessionStorage.getItem(`portal_popup_seen_${popup.id}`);
      if (alreadySeen) {
        setIsOpen(false);
        return;
      }
    } else if (popup.frequency === 'once_per_day') {
      const lastSeenDate = localStorage.getItem(`portal_popup_date_${popup.id}`);
      const today = new Date().toDateString();
      if (lastSeenDate === today) {
        setIsOpen(false);
        return;
      }
    }

    // Small delay for pleasant page load entrance
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [popup, previewMode, isHomePage]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleDismiss = () => {
    setIsOpen(false);

    if (!previewMode) {
      if (popup.frequency === 'once_per_session') {
        sessionStorage.setItem(`portal_popup_seen_${popup.id}`, 'true');
      } else if (popup.frequency === 'once_per_day') {
        localStorage.setItem(`portal_popup_date_${popup.id}`, new Date().toDateString());
      }
    }

    if (onClose) {
      onClose();
    }
  };

  const handleImageClick = () => {
    if (popup.targetUrl) {
      if (popup.targetUrl.startsWith('http://') || popup.targetUrl.startsWith('https://')) {
        window.open(popup.targetUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = popup.targetUrl;
      }
      handleDismiss();
    }
  };

  if (!isOpen || !popup.imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-label={popup.title || 'PopUp de Destaque'}
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-white/20 transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all shadow-lg hover:scale-105 cursor-pointer"
          aria-label="Fechar PopUp"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {previewMode && (
          <div className="bg-amber-500 text-white text-[11px] font-bold px-3 py-1 flex items-center justify-center gap-1.5 z-10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MODO DE PRÉ-VISUALIZAÇÃO DO POPUP</span>
          </div>
        )}

        {/* Attached Image Section */}
        <div 
          className={`relative overflow-hidden bg-slate-900 ${popup.targetUrl ? 'cursor-pointer group' : ''}`}
          onClick={handleImageClick}
        >
          <img
            src={popup.imageUrl}
            alt={popup.title || 'Imagem do PopUp'}
            className="w-full max-h-[60vh] sm:max-h-[65vh] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
          />

          {popup.targetUrl && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Clique para acessar</span>
              </span>
            </div>
          )}
        </div>

        {/* Optional Title, Subtitle and Action Row */}
        {(popup.title || popup.subtitle || popup.targetUrl) && (
          <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex flex-col gap-3">
            {popup.title && (
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {popup.title}
              </h3>
            )}
            
            {popup.subtitle && (
              <p className="text-xs text-slate-600 leading-relaxed">
                {popup.subtitle}
              </p>
            )}

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleDismiss}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors cursor-pointer"
              >
                Fechar janela
              </button>

              {popup.targetUrl && (
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{popup.buttonText || 'Saiba Mais'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
