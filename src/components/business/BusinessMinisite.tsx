import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Store, 
  MapPin, 
  MessageCircle, 
  Phone, 
  Clock, 
  Globe, 
  Instagram, 
  Facebook, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Home, 
  Share2, 
  Check, 
  Navigation,
  Info,
  Tag
} from 'lucide-react';
import { BusinessStore, BusinessProductService } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';

interface BusinessMinisiteProps {
  store: BusinessStore;
  products: BusinessProductService[];
  onBackToGuide: () => void;
  onGoHome: () => void;
}

export const BusinessMinisite: React.FC<BusinessMinisiteProps> = ({
  store,
  products,
  onBackToGuide,
  onGoHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'product' | 'service'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<BusinessProductService | null>(null);
  const [copied, setCopied] = useState(false);

  // Active products of this store
  const storeProducts = useMemo(() => {
    return products.filter(p => p.businessId === store.id && p.active !== false);
  }, [products, store.id]);

  // Dynamic list of categories from products
  const productCategories = useMemo(() => {
    const set = new Set<string>();
    storeProducts.forEach(p => {
      if (p.category) set.add(p.category);
    });
    if (store.productCategories) {
      store.productCategories.forEach(c => set.add(c));
    }
    return Array.from(set);
  }, [storeProducts, store.productCategories]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return storeProducts.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Type filter
      if (typeFilter !== 'all' && p.type !== typeFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = (p.description || '').toLowerCase().includes(query) || 
                            (p.shortDescription || '').toLowerCase().includes(query);
        const matchesCategory = (p.category || '').toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }
      return true;
    });
  }, [storeProducts, selectedCategory, typeFilter, searchQuery]);

  // Clean WhatsApp number
  const cleanWhatsapp = store.whatsapp ? store.whatsapp.replace(/\D/g, '') : '';
  const defaultStoreMessage = `Olá ${store.name}! Vi seu minisite no Guia Empresarial e gostaria de tirar uma dúvida.`;
  const whatsappStoreUrl = cleanWhatsapp 
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(defaultStoreMessage)}`
    : '#';

  // Google Maps embed URL
  const mapQuery = encodeURIComponent(store.googleMapsEmbedQuery || `${store.address}, ${store.city} - ${store.state || ''}`);
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const googleMapsDirectionsUrl = store.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${store.name} - Minisite Oficial`,
        text: `Conheça ${store.name} no Guia Empresarial!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16 animate-fadeIn">
      {/* Minisite Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToGuide}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar ao Guia Empresarial</span>
              <span className="sm:hidden">Guia</span>
            </button>

            <button
              type="button"
              onClick={onGoHome}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Ir para a Home do Portal de Notícias"
            >
              <Home className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden md:inline">Portal Home</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Compartilhar Minisite"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>

            <a
              href={whatsappStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp da Loja</span>
            </a>
          </div>
        </div>
      </div>

      {/* Minisite Cover Banner & Store Identity */}
      <div className="relative bg-slate-900 text-white">
        {/* Cover Banner */}
        <div className="h-44 sm:h-64 md:h-72 w-full relative overflow-hidden bg-slate-800">
          {store.coverBannerUrl ? (
            <img
              src={store.coverBannerUrl}
              alt={`Capa ${store.name}`}
              className="w-full h-full object-cover opacity-75"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 flex items-center justify-center opacity-70">
              <Store className="w-16 h-16 text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
        </div>

        {/* Store Profile Header (Logo Home, Title, Badges) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20 pb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/10">
            {/* Logo Home & Store Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white p-1 shadow-2xl border-4 border-white/90 overflow-hidden shrink-0">
                  <img
                    src={store.logoUrl}
                    alt={`Logo ${store.name}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                {store.verified && (
                  <div 
                    className="absolute -bottom-1.5 -right-1.5 bg-blue-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white"
                    title="Empresa Verificada no Guia"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-600 text-white">
                    {store.category}
                  </span>
                  {store.segment && (
                    <span className="text-[11px] font-medium text-slate-300">
                      • {store.segment}
                    </span>
                  )}
                  {store.featured && (
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Empresa em Destaque</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  {store.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {store.description}
                </p>
              </div>
            </div>

            {/* Direct Contact Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
              <a
                href={whatsappStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Pedir / Falar no WhatsApp</span>
              </a>

              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Abrir Rota no Google Maps"
              >
                <Navigation className="w-4 h-4 text-red-400" />
                <span>Como Chegar</span>
              </a>
            </div>
          </div>

            {/* Quick Contact & Details Strip */}
          <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-red-400 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Endereço</span>
                <span className="font-semibold text-white truncate block">{store.address}, {store.city}</span>
              </div>
            </div>

            {store.workingHours && (
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-amber-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Funcionamento</span>
                  <span className="font-semibold text-white truncate block">{store.workingHours}</span>
                </div>
              </div>
            )}

            {store.phone && (
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Telefone</span>
                  <span className="font-semibold text-white truncate block">{store.phone}</span>
                </div>
              </div>
            )}

            {(store.instagram || store.website) && (
              <div className="flex items-center gap-3">
                {store.instagram && (
                  <a
                    href={`https://instagram.com/${store.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-pink-600/30 border border-white/10 text-pink-400 hover:text-pink-300 transition-colors"
                    title={`Instagram: ${store.instagram}`}
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {store.facebook && (
                  <a
                    href={store.facebook.startsWith('http') ? store.facebook : `https://${store.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-blue-600/30 border border-white/10 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {store.website && (
                  <a
                    href={store.website.startsWith('http') ? store.website : `https://${store.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/20 border border-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Site Oficial</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Minisite Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Menu de Categorias & Busca de Produtos / Serviços */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Tag className="w-4 h-4 text-red-600" />
                <span>Catálogo de Produtos & Serviços</span>
              </h2>
              <p className="text-xs text-slate-500">
                Selecione uma categoria ou pesquise o que procura para ver detalhes e solicitar no WhatsApp.
              </p>
            </div>

            {/* Search Input inside the Store */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar nesta loja..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white transition-colors"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Pills Menu ("menu de categorias") */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Todos ({storeProducts.length})
            </button>

            {productCategories.map((cat) => {
              const count = storeProducts.filter(p => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat} {count > 0 ? `(${count})` : ''}
                </button>
              );
            })}
          </div>

          {/* Subfilter: Tipo (Todos, Produtos, Serviços) */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-semibold text-[11px] uppercase">Tipo:</span>
            {(['all', 'product', 'service'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  typeFilter === type
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {type === 'all' ? 'Tudo' : type === 'product' ? 'Somente Produtos' : 'Somente Serviços'}
              </button>
            ))}
          </div>
        </div>

        {/* Corpo com Box de Produtos / Serviços */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Nenhum produto ou serviço encontrado
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Não localizamos itens com os filtros atuais. Tente buscar outro termo ou selecione a categoria "Todos".
              </p>
              {(selectedCategory !== 'all' || searchQuery || typeFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setTypeFilter('all');
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => {
                const coverImage = (product.images && product.images[0]) || store.logoUrl;
                const cleanPhone = store.whatsapp.replace(/\D/g, '');
                const directMsg = product.whatsappMessage || 
                  `Olá! Vi o ${product.type === 'service' ? 'serviço' : 'produto'} *${product.name}* no Guia Empresarial (${store.name}) e gostaria de mais informações.`;
                const directWhatsapp = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(directMsg)}` : '#';

                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
                  >
                    <div>
                      {/* Product Image Box */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                        <img
                          src={coverImage}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-xs ${
                            product.type === 'service' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-emerald-600 text-white'
                          }`}>
                            {product.type === 'service' ? 'Serviço' : 'Produto'}
                          </span>
                          {product.featured && (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-xs">
                              Destaque
                            </span>
                          )}
                        </div>

                        {/* Number of Photos Indicator */}
                        {product.images && product.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                            +{product.images.length} fotos
                          </div>
                        )}
                      </div>

                      {/* Content Box */}
                      <div className="p-4 space-y-2">
                        {product.category && (
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {product.category}
                          </span>
                        )}

                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                          {product.name}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {product.shortDescription || product.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer / Price & WhatsApp Action */}
                    <div className="p-4 pt-0 space-y-3">
                      <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Valor</span>
                          <span className="text-base font-black text-emerald-600">
                            {product.priceFormatted || (product.price ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : 'Sob Consulta')}
                          </span>
                        </div>

                        <span className="text-[11px] font-bold text-red-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          <span>Ver mais</span>
                          <span>→</span>
                        </span>
                      </div>

                      {/* Direct WhatsApp button */}
                      <a
                        href={directWhatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>Pedir no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Seção: Localização com Google Maps & Sobre a Loja */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          {/* Sobre Nós */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-red-600" />
                <span>Sobre a Empresa</span>
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {store.aboutText || store.description}
            </p>

            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{store.address} - {store.neighborhood ? `${store.neighborhood}, ` : ''}{store.city}/{store.state || 'SP'}</span>
              </div>

              {store.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{store.phone}</span>
                </div>
              )}

              {store.workingHours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{store.workingHours}</span>
                </div>
              )}
            </div>

            <a
              href={whatsappStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>

          {/* Localização com Google Maps */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>Localização no Google Maps</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Visite o estabelecimento ou trace sua rota pelo Google Maps.
                </p>
              </div>

              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Abrir no Google Maps</span>
              </a>
            </div>

            {/* Embedded Google Maps iFrame */}
            <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
              <iframe
                title={`Mapa de Localização - ${store.name}`}
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Product Detail Modal (Opens when accessing a product/service) */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          store={store}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
