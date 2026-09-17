import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Store, 
  MapPin, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Phone, 
  ArrowRight,
  Filter,
  ShoppingBag,
  ExternalLink,
  Layers
} from 'lucide-react';
import { BusinessStore, BusinessProductService, BusinessGuideConfig } from '../../types';
import { useNavigate } from 'react-router-dom';

interface BusinessDirectoryProps {
  config: BusinessGuideConfig;
  stores?: BusinessStore[];
  products?: BusinessProductService[];
  onOpenStore?: (storeSlug: string) => void;
  onSelectStore?: (storeSlug: string) => void;
  onGoHome?: () => void;
}

export const BusinessDirectory: React.FC<BusinessDirectoryProps> = ({
  config,
  stores = [],
  products = [],
  onOpenStore,
  onSelectStore,
  onGoHome,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const safeStores = stores || [];
  const safeProducts = products || [];

  const handleOpenStoreClick = (slug: string) => {
    if (onOpenStore) onOpenStore(slug);
    if (onSelectStore) onSelectStore(slug);
    navigate(`/guia-empresarial/${slug}`);
  };

  // Available categories from active stores
  const categories = useMemo(() => {
    const set = new Set<string>();
    safeStores.forEach(s => {
      if (s.active !== false && s.category) {
        set.add(s.category);
      }
    });
    return Array.from(set);
  }, [safeStores]);

  // Filtered stores
  const filteredStores = useMemo(() => {
    return safeStores.filter(store => {
      if (store.active === false) return false;

      // Category filter
      if (selectedCategory !== 'all' && store.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = (store.name || '').toLowerCase().includes(query);
        const matchesDesc = (store.description || '').toLowerCase().includes(query);
        const matchesCat = (store.category || '').toLowerCase().includes(query);
        const matchesSegment = (store.segment || '').toLowerCase().includes(query);
        const matchesCity = (store.city || '').toLowerCase().includes(query);

        // Also check if any product in this store matches
        const storeProds = safeProducts.filter(p => p.businessId === store.id);
        const matchesProduct = storeProds.some(p => 
          (p.name || '').toLowerCase().includes(query) || 
          (p.description || '').toLowerCase().includes(query)
        );

        if (!matchesName && !matchesDesc && !matchesCat && !matchesSegment && !matchesCity && !matchesProduct) {
          return false;
        }
      }

      return true;
    });
  }, [safeStores, safeProducts, selectedCategory, searchQuery]);

  // Featured stores
  const featuredStores = useMemo(() => {
    return safeStores.filter(s => s.active !== false && s.featured);
  }, [safeStores]);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 animate-fadeIn">
      {/* Directory Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold tracking-wide uppercase">
            <Store className="w-3.5 h-3.5" />
            <span>Comércio & Serviços Locais</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            {config.tabName || 'Guia Empresarial'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {config.description || 'Encontre as melhores empresas, lojas e prestadores de serviços da cidade. Acesse minisites exclusivos com catálogo de produtos e atendimento rápido no WhatsApp.'}
          </p>

          {/* Search Box */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busque por loja, produto, serviço, pizza, roupa, mecânica..."
                className="w-full pl-12 pr-28 py-3.5 sm:py-4 bg-white text-slate-900 placeholder-slate-400 rounded-2xl text-xs sm:text-sm shadow-xl focus:outline-hidden focus:ring-4 focus:ring-red-500/30 font-medium"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Category Filters Menu */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Todas as Lojas ({safeStores.filter(s => s.active !== false).length})
          </button>

          {categories.map((cat) => {
            const count = safeStores.filter(s => s.active !== false && s.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Featured Stores Spotlight (If any and no search active) */}
        {!searchQuery && selectedCategory === 'all' && featuredStores.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Empresas em Destaque na Cidade</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                Minisites Recomendados
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featuredStores.slice(0, 2).map((store) => {
                const cleanPhone = (store.whatsapp || '').replace(/\D/g, '');
                const directWhatsapp = cleanPhone 
                  ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá ${store.name}! Vi seu destaque no ${config.tabName || 'Guia Empresarial'}.`)}` 
                  : '#';
                const storeProds = safeProducts.filter(p => p.businessId === store.id && p.active !== false);

                return (
                  <div
                    key={store.id}
                    onClick={() => handleOpenStoreClick(store.slug)}
                    className="group bg-white rounded-2xl border border-amber-200/80 hover:border-red-300 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Destaque</span>
                    </div>

                    <div className="flex items-start gap-4">
                      <img
                        src={store.logoUrl}
                        alt={store.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-red-50 text-red-600">
                            {store.category}
                          </span>
                          {store.verified && (
                            <ShieldCheck className="w-4 h-4 text-blue-600" title="Verificada" />
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors truncate">
                          {store.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {store.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-red-600" />
                        <span>{storeProds.length} produtos/serviços</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <a
                          href={directWhatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white transition-colors"
                          title="Falar no WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                        </a>
                        <span className="font-bold text-red-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Acessar Minisite</span>
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Directory Stores Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {selectedCategory === 'all' ? 'Todas as Empresas Cadastradas' : `Empresas em ${selectedCategory}`}
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              {filteredStores.length} {filteredStores.length === 1 ? 'loja encontrada' : 'lojas encontradas'}
            </span>
          </div>

          {filteredStores.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Nenhuma empresa encontrada
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Não localizamos estabelecimentos para os termos buscados. Tente usar outras palavras-chave ou limpe os filtros.
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Limpar Busca
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => {
                const cleanPhone = (store.whatsapp || '').replace(/\D/g, '');
                const directWhatsapp = cleanPhone 
                  ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá ${store.name}! Vi seu minisite no ${config.tabName || 'Guia Empresarial'}.`)}` 
                  : '#';
                const storeProds = safeProducts.filter(p => p.businessId === store.id && p.active !== false);

                return (
                  <div
                    key={store.id}
                    onClick={() => handleOpenStoreClick(store.slug)}
                    className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
                  >
                    {/* Store Card Banner */}
                    <div className="relative h-32 w-full bg-slate-800 overflow-hidden">
                      {store.coverBannerUrl ? (
                        <img
                          src={store.coverBannerUrl}
                          alt={store.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                          <Store className="w-8 h-8 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Store Logo floating over banner */}
                      <div className="absolute -bottom-4 left-4 w-16 h-16 rounded-2xl bg-white p-1 shadow-lg border-2 border-white overflow-hidden">
                        <img
                          src={store.logoUrl}
                          alt={store.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>

                      {/* Badges on Banner */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        {store.verified && (
                          <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verificada</span>
                          </span>
                        )}
                        {store.featured && (
                          <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                            Destaque
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Store Card Details */}
                    <div className="p-5 pt-7 space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {store.category}
                        </span>
                        {store.segment && (
                          <span className="text-[10px] text-slate-400 font-medium truncate">
                            • {store.segment}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-black text-slate-900 group-hover:text-red-600 transition-colors leading-snug">
                        {store.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {store.description}
                      </p>

                      <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span className="truncate">{store.address}, {store.city}</span>
                      </div>
                    </div>

                    {/* Store Card Footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-red-600" />
                        <span>{storeProds.length} itens</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <a
                          href={directWhatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                          title="WhatsApp da Loja"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          className="px-3 py-1.5 bg-slate-900 group-hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Minisite</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
