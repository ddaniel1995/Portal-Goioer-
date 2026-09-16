import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Check, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Store, 
  Sparkles, 
  Tag, 
  Share2,
  ShieldCheck
} from 'lucide-react';
import { BusinessProductService, BusinessStore } from '../../types';

interface ProductDetailModalProps {
  product: BusinessProductService;
  store: BusinessStore;
  onClose: () => void;
  onOpenStore?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  store,
  onClose,
  onOpenStore,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : [store.logoUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Clean WhatsApp phone number (keep only digits)
  const cleanPhone = store.whatsapp ? store.whatsapp.replace(/\D/g, '') : '';
  
  // Format WhatsApp message
  const defaultMessage = product.whatsappMessage || 
    `Olá! Vi o ${product.type === 'service' ? 'serviço' : 'produto'} *${product.name}* no Guia Empresarial (${store.name}) e gostaria de mais informações.`;
  
  const whatsappUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`
    : '#';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} - ${store.name}`,
        text: `Confira ${product.name} em ${store.name} no Guia Empresarial!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs transition-opacity duration-200 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col md:flex-row border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-all shadow-md hover:scale-105 cursor-pointer"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Photo Gallery */}
        <div className="md:w-1/2 bg-slate-950 flex flex-col justify-between relative overflow-hidden shrink-0">
          {/* Main Active Photo */}
          <div className="relative h-64 sm:h-80 md:h-[420px] flex items-center justify-center p-4 bg-slate-900">
            <img
              src={images[activeImageIndex]}
              alt={`${product.name} - Imagem ${activeImageIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded-xl transition-all duration-300"
            />

            {/* Previous / Next buttons if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                  title="Imagem anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                  title="Próxima imagem"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs ${
                product.type === 'service' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-emerald-600 text-white'
              }`}>
                {product.type === 'service' ? 'Serviço' : 'Produto'}
              </span>
              {product.featured && (
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>Destaque</span>
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex gap-2 overflow-x-auto scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx 
                      ? 'border-red-600 scale-105 shadow-md' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & WhatsApp Action */}
        <div className="md:w-1/2 flex flex-col justify-between p-5 sm:p-7 overflow-y-auto max-h-[70vh] md:max-h-[92vh] bg-white">
          <div className="space-y-4">
            {/* Store Link & Category */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div 
                onClick={onOpenStore}
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                      {store.name}
                    </span>
                    {store.verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    {store.category}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Compartilhar"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Product Category Tag */}
            {product.category && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Tag className="w-3.5 h-3.5 text-red-600" />
                <span>{product.category}</span>
              </div>
            )}

            {/* Title & Price */}
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                {product.name}
              </h2>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-emerald-600">
                  {product.priceFormatted || (product.price ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : 'Sob Consulta')}
                </span>
                {product.type === 'service' && (
                  <span className="text-xs text-slate-500 font-medium">/ atendimento ou serviço</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Descrição Detalhada
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {product.description || product.shortDescription || 'Entre em contato com o estabelecimento para consultar mais detalhes e disponibilidades deste item.'}
              </p>
            </div>

            {/* Store Information Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{store.address} - {store.city}/{store.state || 'SP'}</span>
              </div>

              {store.workingHours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{store.workingHours}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button: WhatsApp */}
          <div className="pt-6 mt-4 border-t border-slate-100 space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chamar no WhatsApp da Loja</span>
            </a>

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span>Atendimento direto pelo estabelecimento</span>
              {onOpenStore && (
                <button
                  type="button"
                  onClick={onOpenStore}
                  className="font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Ver Minisite da Loja</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
