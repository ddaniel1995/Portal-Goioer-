import React, { useState, useEffect } from 'react';
import { 
  Article, 
  Category, 
  Banner, 
  VisualIdentity, 
  FacebookConfig,
  SitePopup,
  BusinessGuideConfig,
  BusinessStore,
  BusinessProductService
} from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BannerSlideshow } from './components/BannerSlideshow';
import { SidebarBanners, SupporterBannerCard } from './components/SidebarBanners';
import { ArticleCard } from './components/ArticleCard';
import { ArticleView } from './components/ArticleView';
import { SearchResults } from './components/SearchResults';
import { RecentArticlesCarousel } from './components/RecentArticlesCarousel';
import { PodcastGallery } from './components/PodcastGallery';
import { SitePopupModal } from './components/SitePopupModal';
import { BusinessDirectory } from './components/business/BusinessDirectory';
import { BusinessMinisite } from './components/business/BusinessMinisite';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLogin } from './components/admin/AdminLogin';
import { ArrowRight, Sparkles, TrendingUp, Newspaper, ChevronRight, Home as HomeIcon, Store } from 'lucide-react';

type ViewMode = 'home' | 'article' | 'search' | 'category' | 'business_guide' | 'business_store';

export default function App() {
  // Application Data States (synced with storageService)
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [identity, setIdentity] = useState<VisualIdentity>(storageService.getVisualIdentity());
  const [facebookConfig, setFacebookConfig] = useState<FacebookConfig>(storageService.getFacebookConfig());
  const [sitePopup, setSitePopup] = useState<SitePopup>(storageService.getSitePopup());

  // Business Guide Data States
  const [businessConfig, setBusinessConfig] = useState<BusinessGuideConfig>(storageService.getBusinessGuideConfig());
  const [businessStores, setBusinessStores] = useState<BusinessStore[]>([]);
  const [businessProducts, setBusinessProducts] = useState<BusinessProductService[]>([]);

  // Routing and Navigation States
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);
  const [selectedStoreSlug, setSelectedStoreSlug] = useState<string | null>(null);
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
    setSitePopup(storageService.getSitePopup());
    setBusinessConfig(storageService.getBusinessGuideConfig());
    setBusinessStores(storageService.getBusinessStores());
    setBusinessProducts(storageService.getBusinessProducts());
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
    setSelectedStoreSlug(null);
    setSearchQuery('');
    setSelectedCategoryFilter('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBusinessGuide = () => {
    setCurrentView('business_guide');
    setSelectedArticleSlug(null);
    setSelectedStoreSlug(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStore = (storeSlug: string) => {
    setSelectedStoreSlug(storeSlug);
    setSelectedArticleSlug(null);
    setCurrentView('business_store');
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

  // Selected store for Business Minisite
  const currentStore = selectedStoreSlug
    ? businessStores.find(s => s.slug === selectedStoreSlug || s.id === selectedStoreSlug) || null
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
        onOpenStorePreview={(slug) => {
          setIsAdminOpen(false);
          handleSelectStore(slug);
        }}
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
        businessGuideConfig={businessConfig}
        isBusinessGuideActive={currentView === 'business_guide' || currentView === 'business_store'}
        onOpenBusinessGuide={handleOpenBusinessGuide}
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
                      {categoryArticles.map((article, idx) => (
                        <React.Fragment key={article.id}>
                          <ArticleCard
                            article={article}
                            onSelect={handleOpenArticle}
                          />

                          {/* On reduced screen: place supporter banner separately between articles */}
                          {(idx + 1) % 3 === 0 && sidebarBanners.length > 0 && (
                            <div className="lg:hidden col-span-full my-3">
                              <SupporterBannerCard
                                banner={sidebarBanners[Math.floor(idx / 3) % sidebarBanners.length]}
                                onBannerClick={handleBannerClick}
                              />
                            </div>
                          )}
                        </React.Fragment>
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

                {/* Sidebar - on desktop appears here; on reduced screens banners are placed separately between articles */}
                <div className="hidden lg:block lg:col-span-4">
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
                  .map((category, catIndex) => {
                  const catArticles = publishedArticles.filter(
                    (a) => a.categoryId === category.id
                  );

                  // Show category section even if few articles
                  if (catArticles.length === 0) return null;

                  const [leadArticle, ...restArticles] = catArticles;
                  const supporterBannerForThisSection = sidebarBanners.length > 0 
                    ? sidebarBanners[catIndex % sidebarBanners.length] 
                    : null;

                  return (
                    <React.Fragment key={category.id}>
                      <section className="space-y-3.5">
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

                      {/* On reduced screen: place supporter banners separately between the category sections */}
                      {supporterBannerForThisSection && (
                        <div className="lg:hidden my-6">
                          <SupporterBannerCard
                            banner={supporterBannerForThisSection}
                            onBannerClick={handleBannerClick}
                          />
                        </div>
                      )}
                    </React.Fragment>
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

                {/* Guia Empresarial Quick Spotlight Widget in Sidebar */}
                {businessConfig.enabled !== false && businessStores.length > 0 && (
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/60">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-amber-400" />
                        <h3 className="text-sm font-bold tracking-tight">
                          {businessConfig.tabName || 'Guia Empresarial'}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenBusinessGuide}
                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        Ver Guia →
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 mb-3.5 leading-relaxed">
                      Conheça os melhores comércios e serviços da cidade com atendimento direto no WhatsApp.
                    </p>

                    <div className="space-y-2.5">
                      {businessStores.slice(0, 3).map((store) => (
                        <div
                          key={store.id}
                          onClick={() => handleSelectStore(store.slug)}
                          className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 transition-colors cursor-pointer group border border-slate-700/40"
                        >
                          <img
                            src={store.logoUrl}
                            alt={store.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-600"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                              {store.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate">
                              {store.segment || store.category}
                            </p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sidebar Advertising Banners - on desktop appears here; on reduced screens banners are placed separately between sections */}
                <div className="hidden lg:block">
                  <SidebarBanners
                    banners={sidebarBanners}
                    onBannerClick={handleBannerClick}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* VIEW 4: GUIA EMPRESARIAL (DIRETÓRIO DE LOJAS) */}
        {currentView === 'business_guide' && (
          <BusinessDirectory
            config={businessConfig}
            stores={businessStores}
            onSelectStore={handleSelectStore}
            onGoHome={handleOpenHome}
          />
        )}

        {/* VIEW 5: MINISITE DA LOJA / PRODUTOS / SERVIÇOS */}
        {currentView === 'business_store' && currentStore && (
          <BusinessMinisite
            store={currentStore}
            products={businessProducts.filter(p => p.businessId === currentStore.id)}
            onBackToGuide={handleOpenBusinessGuide}
            onGoHome={handleOpenHome}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        identity={identity}
        categories={categories}
        businessGuideConfig={businessConfig}
        onOpenBusinessGuide={handleOpenBusinessGuide}
        onSelectCategory={handleSelectCategory}
        onGoHome={handleOpenHome}
        onOpenAdmin={handleOpenAdminFromFooter}
      />

      {/* Global Site PopUp with Attached Image */}
      <SitePopupModal
        popup={sitePopup}
        isHomePage={currentView === 'home'}
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
