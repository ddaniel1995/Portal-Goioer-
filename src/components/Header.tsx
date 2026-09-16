import React, { useState } from 'react';
import { Search, Menu, X, Clock, TrendingUp, Calendar, ArrowRight, Store } from 'lucide-react';
import { Category, VisualIdentity, BusinessGuideConfig } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  identity: VisualIdentity;
  categories: Category[];
  activeCategoryId?: string;
  businessGuideConfig?: BusinessGuideConfig;
  isBusinessGuideActive?: boolean;
  onOpenBusinessGuide?: () => void;
  onSelectCategory: (categoryId: string) => void;
  onGoHome: () => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  identity,
  categories,
  activeCategoryId,
  businessGuideConfig,
  isBusinessGuideActive,
  onOpenBusinessGuide,
  onSelectCategory,
  onGoHome,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Filter out categories marked to be hidden in the menu
  const menuCategories = categories.filter((c) => !c.hideInMenu);

  // Formatted date in Portuguese
  const todayFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const capitalizedDate = todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setShowMobileSearch(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Bar: Date, Economy tickers & Trending */}
      <div 
        className="text-slate-300 text-xs py-1.5 px-4 hidden md:block transition-colors"
        style={{ backgroundColor: identity.colors?.topBarBg || '#0f172a' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{capitalizedDate}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-slate-200">IBOV:</span>
              <span className="text-emerald-400 font-medium">+1.18% (134.250 pts)</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-200">USD:</span>
              <span className="text-slate-300">R$ 5,24</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-red-500 animate-pulse" />
              <span className="text-red-400 font-semibold uppercase tracking-wider text-[10px]">Plantão:</span>
              <span className="text-slate-200 truncate max-w-xs">Cobertura completa em tempo real</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <div onClick={onGoHome} className="cursor-pointer shrink-0 py-1 transition-all">
          <Logo identity={identity} variant="color" />
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Pesquisar notícias, assuntos ou autores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-semibold hover:bg-red-700 transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Mobile search toggle & header actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <div className="hidden lg:flex items-center gap-2">
            <a
              href="#ultimas-noticias"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('cat-ultimas');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold hover:bg-red-100 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              Últimas Notícias
            </a>
          </div>
        </div>
      </div>

      {/* Mobile search bar dropdown */}
      {showMobileSearch && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 bg-white">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Digite sua busca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-16 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <button
              type="submit"
              className="absolute right-2 px-3 py-1 bg-red-600 text-white rounded-md text-xs font-semibold"
            >
              Buscar
            </button>
          </form>
        </div>
      )}

      {/* Categories Navigation Bar (Desktop) */}
      <nav className="border-t border-slate-100 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-sm font-semibold">
            <li>
              <button
                type="button"
                onClick={onGoHome}
                className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  !activeCategoryId
                    ? 'text-red-600 font-bold border-b-2 border-red-600'
                    : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                }`}
              >
                Início
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('cat-ultimas')}
                className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeCategoryId === 'cat-ultimas' || activeCategoryId === 'ultimas'
                    ? 'text-red-600 font-bold border-b-2 border-red-600'
                    : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                Últimas Notícias
              </button>
            </li>
            {businessGuideConfig?.enabled !== false && onOpenBusinessGuide && (
              <li>
                <button
                  type="button"
                  onClick={onOpenBusinessGuide}
                  className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isBusinessGuideActive
                      ? 'text-red-600 font-bold border-b-2 border-red-600'
                      : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                  }`}
                >
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span>{businessGuideConfig?.tabName || 'Guia Empresarial'}</span>
                </button>
              </li>
            )}
            {menuCategories.map((cat) => {
              const isActive = activeCategoryId === cat.id || activeCategoryId === cat.slug;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat.id)}
                    className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'text-red-600 font-bold border-b-2 border-red-600'
                        : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-slate-900/60 backdrop-blur-xs z-50 animate-fadeIn">
          <div className="bg-white w-4/5 max-w-sm h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Menu de Categorias
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ul className="space-y-1">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onGoHome();
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold flex items-center justify-between cursor-pointer ${
                      !activeCategoryId ? 'bg-red-50 text-red-600 font-bold' : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span>Início</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory('cat-ultimas');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold flex items-center justify-between cursor-pointer ${
                      activeCategoryId === 'cat-ultimas' || activeCategoryId === 'ultimas' ? 'bg-red-50 text-red-600 font-bold' : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                      Últimas Notícias
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </button>
                </li>
                {businessGuideConfig?.enabled !== false && onOpenBusinessGuide && (
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenBusinessGuide();
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold flex items-center justify-between cursor-pointer ${
                        isBusinessGuideActive ? 'bg-red-50 text-red-600 font-bold' : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-emerald-600" />
                        <span>{businessGuideConfig?.tabName || 'Guia Empresarial'}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-50" />
                    </button>
                  </li>
                )}
                {menuCategories.map((cat) => {
                  const isActive = activeCategoryId === cat.id || activeCategoryId === cat.slug;
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCategory(cat.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold flex items-center justify-between cursor-pointer ${
                          isActive ? 'bg-red-50 text-red-600 font-bold' : 'text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <ArrowRight className="w-4 h-4 opacity-50" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {identity.showSiteName !== false && (
              <div className="pt-6 mt-6 border-t border-slate-100 text-xs text-slate-500">
                <p className="font-medium text-slate-700">{identity.siteName}</p>
                {identity.tagline && <p className="mt-1">{identity.tagline}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
