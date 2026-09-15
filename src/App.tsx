import React, { useState, useEffect } from 'react';
import { 
  Article, 
  Category, 
  Banner, 
  VisualIdentity, 
  FacebookConfig 
} from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BannerSlideshow } from './components/BannerSlideshow';
import { SidebarBanners } from './components/SidebarBanners';
import { ArticleCard } from './components/ArticleCard';
import { ArticleView } from './components/ArticleView';
import { SearchResults } from './components/SearchResults';
import { RecentArticlesCarousel } from './components/RecentArticlesCarousel';
import { PodcastGallery } from './components/PodcastGallery';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLogin } from './components/admin/AdminLogin';
import { ArrowRight, Sparkles, TrendingUp, Newspaper, ChevronRight, Home as HomeIcon } from 'lucide-react';

type ViewMode = 'home' | 'article' | 'search' | 'category';

export default function App() {
  // Application Data States (synced with storageService)
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [identity, setIdentity] = useState<VisualIdentity>(storageService.getVisualIdentity());
  const [facebookConfig, setFacebookConfig] = useState<FacebookConfig>(storageService.getFacebookConfig());

  // Routing and Navigation States
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Admin Access & Authentication
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Initialize and load data
  const loadPortalData = () => {
    setArticles(storageService.getArticles());
    setCategories(storageService.getCategories());
    setBanners(storageService.getBanners());
    setIdentity(storageService.getVisualIdentity());
    setFacebookConfig(storageService.getFacebookConfig());
  };

  useEffect(() => {
    loadPortalData();

    const handlePortalUpdate = () => {
      loadPortalData();
    };
    window.addEventListener('portal_data_updated', handlePortalUpdate);

    // Check saved admin session
    const savedSession = localStorage.getItem('portal_admin_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed?.logged) {
          setIsAdminAuthenticated(true);
        }
      } catch (e) {
        console.error(e);
      }
    }

    return () => {
      window.removeEventListener('portal_data_updated', handlePortalUpdate);
    };
  }, []);

  // Handlers for Navigation
  const handleOpenArticle = (slug: string) => {
    setSelectedArticleSlug(slug);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategoryFilter('all');
    setCurrentView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categoryIdentifier: string) => {
    if (!categoryIdentifier || categoryIdentifier === 'all') {
      handleOpenHome();
      return;
    }

    if (categoryIdentifier === 'cat-ultimas' || categoryIdentifier === 'ultimas') {
      setSelectedCategoryFilter('cat-ultimas');
      setSelectedArticleSlug(null);
      setSearchQuery('');
      setCurrentView('category');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const matched = categories.find(
      c => c.id === categoryIdentifier || c.slug === categoryIdentifier
    );

    setSelectedCategoryFilter(matched ? matched.id : categoryIdentifier);
    setSelectedArticleSlug(null);
    setSearchQuery('');
    setCurrentView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenHome = () => {
    setCurrentView('home');
    setSelectedArticleSlug(null);
    setSearchQuery('');
    setSelectedCategoryFilter('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBannerClick = (banner: Banner) => {
    storageService.incrementBannerClicks(banner.id);
    if (banner.targetUrl) {
      window.open(banner.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Admin Access Handling
  const handleOpenAdminFromFooter = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsLoginModalOpen(false);
    setIsAdminOpen(true);
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
    localStorage.removeItem('portal_admin_session');
  };

  // Published articles only for public views
  const publishedArticles = articles.filter(a => a.status === 'published');
  const slideshowBanners = banners.filter(b => b.position === 'slideshow' && b.active);
  const sidebarBanners = banners.filter(b => b.position === 'sidebar' && b.active);
  const bodySlideshowBanners = banners.filter(b => b.position === 'body_slideshow' && b.active);

  // Selected article for ArticleView
  const currentArticle = selectedArticleSlug
    ? articles.find(a => a.slug === selectedArticleSlug || a.id === selectedArticleSlug) || null
    : null;

  // Filtered articles for Category View
  const isUltimasActive = selectedCategoryFilter === 'cat-ultimas' || selectedCategoryFilter === 'ultimas';

  const categoryActive: Category | null = isUltimasActive
    ? {
        id: 'cat-ultimas',
        name: 'Últimas Notícias',
        slug: 'ultimas',
        description: 'Acompanhe as notícias mais recentes e acontecimentos em tempo real.',
        color: '#dc2626',
        order: 0,
        showOnHome: true,
      }
    : (categories.find(c => c.id === selectedCategoryFilter || c.slug === selectedCategoryFilter) || null);

  const isPodcastCategory = Boolean(
    categoryActive && (
      categoryActive.id === 'cat-podcast' ||
      categoryActive.slug === 'podcast' ||
      categoryActive.name.toLowerCase().includes('podcast')
    )
  );

  const categoryArticles = isUltimasActive
    ? [...publishedArticles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    : categoryActive
    ? publishedArticles.filter(
        a => a.categoryId === categoryActive.id ||
             (categoryActive.name && a.categoryName?.toLowerCase() === categoryActive.name.toLowerCase()) ||
             (isPodcastCategory && (a.categoryId === 'cat-podcast' || a.categoryName?.toLowerCase().includes('podcast') || Boolean(a.youtubeUrl)))
      )
    : publishedArticles;

  // If Admin Panel is open, render Admin Screen
  if (isAdminOpen && isAdminAuthenticated) {
    return (
      <AdminPanel
        articles={articles}
        categories={categories}
        banners={banners}
        identity={identity}
        facebookConfig={facebookConfig}
        onRefreshData={loadPortalData}
        onCloseAdmin={() => setIsAdminOpen(false)}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col text-slate-900 selection:bg-red-600 selection:text-white transition-colors"
      style={{ backgroundColor: identity.colors?.pageBg || '#f8fafc' }}
    >
      {/* Top Header */}
      <Header
        identity={identity}
        categories={categories}
        activeCategoryId={
          currentView === 'category'
            ? (categoryActive?.id || selectedCategoryFilter)
            : (currentView === 'home' ? '' : undefined)
        }
        onSelectCategory={handleSelectCategory}
        onSearch={handleSearch}
        onGoHome={handleOpenHome}
      />

      {/* Main Public Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: SINGLE ARTICLE FULL VIEW */}
        {currentView === 'article' && currentArticle && (
          <ArticleView
            article={currentArticle}
            allArticles={publishedArticles}
            categories={categories}
            banners={sidebarBanners}
            onSelectArticle={handleOpenArticle}
            onSelectCategory={handleSelectCategory}
            onGoHome={handleOpenHome}
          />
        )}

        {/* VIEW 2: SEARCH RESULTS VIEW */}
        {currentView === 'search' && (
          <SearchResults
            articles={publishedArticles}
            categories={categories}
            initialQuery={searchQuery}
            onSelectArticle={handleOpenArticle}
            onGoHome={handleOpenHome}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {/* VIEW 3: CATEGORY FILTER VIEW */}
        {currentView === 'category' && (
          categoryActive ? (
            <div className="space-y-8 animate-fadeIn">
              {/* Breadcrumbs Navigation */}
              <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={handleOpenHome}
                  className="flex items-center gap-1 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <HomeIcon className="w-3.5 h-3.5" />
                  <span>Início</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Editorias</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-800">{categoryActive.name}</span>
              </nav>

              {/* Category Header Banner */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: categoryActive.color || '#dc2626' }}
                      />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        {isPodcastCategory ? 'Galeria & Vídeos' : 'Editoria'}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
                      {categoryActive.name}
                    </h1>
                    {categoryActive.description && (
                      <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
                        {categoryActive.description}
                      </p>
                    )}
                  </div>

                  <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {categoryArticles.length} {categoryArticles.length === 1 ? 'publicação' : 'publicações'}
                  </span>
                </div>
              </div>

              {/* If Podcast Category, render the dedicated PodcastGallery first */}
              {isPodcastCategory && (
                <section aria-label="Galeria de Podcasts" className="space-y-4">
                  <PodcastGallery
                    articles={publishedArticles}
                    onSelectArticle={handleOpenArticle}
                  />
                </section>
              )}

              {/* Layout with Articles + Sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  {categoryArticles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {categoryArticles.map((article) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          onSelect={handleOpenArticle}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                      <p className="text-slate-500 font-medium">
                        Nenhuma matéria cadastrada nesta categoria no momento.
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenHome}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        Voltar para a Página Inicial
                      </button>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4">
                  <SidebarBanners
                    banners={sidebarBanners}
                    onBannerClick={handleBannerClick}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <h2 className="text-xl font-bold text-slate-800">Categoria não encontrada</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Não conseguimos localizar a editoria solicitada. Escolha uma das categorias disponíveis abaixo ou retorne à página inicial.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleOpenHome}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Ir para a Home
                </button>
              </div>
            </div>
          )
        )}

        {/* VIEW 4: HOME VIEW */}
        {currentView === 'home' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. Large Top Slideshow Carousel */}
            {slideshowBanners.length > 0 && (
              <section aria-label="Slideshow de Destaques">
                <BannerSlideshow
                  banners={slideshowBanners}
                  onBannerClick={handleBannerClick}
                />
              </section>
            )}

            {/* 2. Carrossel de Matérias Recentes */}
            {publishedArticles.length > 0 && (
              <RecentArticlesCarousel
                articles={publishedArticles}
                onSelectArticle={handleOpenArticle}
              />
            )}

            {/* 3. Main Content Grid: Categories Sections + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Categorized News Sections (8 cols) */}
              <div className="lg:col-span-8 space-y-10">
                {/* Independent Sections per Category */}
                {categories
                  .filter((category) => category.showOnHome !== false)
                  .map((category) => {
                  const catArticles = publishedArticles.filter(
                    (a) => a.categoryId === category.id
                  );

                  // Show category section even if few articles
                  if (catArticles.length === 0) return null;

                  const [leadArticle, ...restArticles] = catArticles;

                  return (
                    <section key={category.id} className="space-y-3.5">
                      {/* Section Header with Category Color Accent */}
                      <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-3.5 h-3.5 rounded-xs shrink-0" 
                            style={{ backgroundColor: category.color || '#dc2626' }}
                          />
                          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                            {category.name}
                          </h2>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectCategory(category.id)}
                          className="text-xs font-bold text-slate-600 hover:text-red-600 flex items-center gap-1 transition-colors group cursor-pointer"
                        >
                          <span>Ver todas</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>

                      {/* Lead Article if available (Modern compact split card) */}
                      {leadArticle && (
                        <ArticleCard
                          article={leadArticle}
                          featured={true}
                          onSelect={handleOpenArticle}
                        />
                      )}

                      {/* Secondary Cards in this category (Compact grid) */}
                      {restArticles.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 pt-1">
                          {restArticles.slice(0, 6).map((article) => (
                            <ArticleCard
                              key={article.id}
                              article={article}
                              onSelect={handleOpenArticle}
                            />
                          ))}
                        </div>
                      )}
                    </section>
                  );
                })}

                {/* Body Slideshow Carousel below the category blocks */}
                {bodySlideshowBanners.length > 0 && (
                  <section aria-label="Banners em Destaque no Corpo" className="pt-2">
                    <BannerSlideshow
                      banners={bodySlideshowBanners}
                      position="body_slideshow"
                      onBannerClick={handleBannerClick}
                    />
                  </section>
                )}
              </div>

              {/* Right Column: Responsive Sidebar with Banners & Latest News (4 cols) */}
              <div className="lg:col-span-4 space-y-8">
                {/* Trending / Fast News Block */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Mais Lidas do Momento
                    </h3>
                  </div>

                  <div className="space-y-3.5">
                    {publishedArticles.slice(0, 5).map((art, idx) => (
                      <div
                        key={art.id}
                        onClick={() => handleOpenArticle(art.slug)}
                        className="group flex items-start gap-3 cursor-pointer py-1.5 border-b border-slate-50 last:border-0"
                      >
                        <span className="text-xl font-black text-slate-300 group-hover:text-red-600 transition-colors w-6 shrink-0 leading-none mt-1">
                          0{idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase text-red-600">
                            {art.categoryName}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition-colors line-clamp-2 mt-0.5 leading-snug">
                            {art.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar Advertising Banners */}
                <SidebarBanners
                  banners={sidebarBanners}
                  onBannerClick={handleBannerClick}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        identity={identity}
        categories={categories}
        onSelectCategory={handleSelectCategory}
        onGoHome={handleOpenHome}
        onOpenAdmin={handleOpenAdminFromFooter}
      />

      {/* Admin Login Modal (When not authenticated) */}
      {isLoginModalOpen && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setIsLoginModalOpen(false)}
        />
      )}
    </div>
  );
}
