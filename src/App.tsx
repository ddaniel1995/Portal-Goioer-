import React, { useState, useEffect } from 'react';
import { 
  Routes, 
  Route, 
  useNavigate, 
  useLocation, 
  Navigate 
} from 'react-router-dom';
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
import { SitePopupModal } from './components/SitePopupModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLogin } from './components/admin/AdminLogin';
import { ScrollToTop } from './components/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { CategoryPage } from './pages/CategoryPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { BusinessGuidePage } from './pages/BusinessGuidePage';
import { BusinessStorePage } from './pages/BusinessStorePage';
import { SearchPage } from './pages/SearchPage';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Listen to /adm and /admin routes directly
  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/adm', { replace: true });
      return;
    }

    if (location.pathname === '/adm') {
      if (isAdminAuthenticated) {
        setIsAdminOpen(true);
      } else {
        setIsLoginModalOpen(true);
      }
    } else {
      setIsAdminOpen(false);
      setIsLoginModalOpen(false);
    }
  }, [location.pathname, isAdminAuthenticated, navigate]);

  // Handlers for Navigation
  const handleBannerClick = (banner: Banner) => {
    storageService.incrementBannerClicks(banner.id);
    if (banner.targetUrl) {
      window.open(banner.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSelectCategory = (categoryIdentifier: string) => {
    if (!categoryIdentifier || categoryIdentifier === 'all') {
      navigate('/');
      return;
    }

    if (categoryIdentifier === 'cat-ultimas' || categoryIdentifier === 'ultimas') {
      navigate('/noticias');
      return;
    }

    const matched = categories.find(
      c => c.id === categoryIdentifier || c.slug === categoryIdentifier
    );

    if (matched) {
      navigate(`/noticias/${matched.slug || matched.id}`);
    } else {
      navigate(`/noticias/${categoryIdentifier}`);
    }
  };

  const handleSearch = (query: string) => {
    navigate(`/busca?q=${encodeURIComponent(query)}`);
  };

  // Admin Access Handling - Navigate to /adm
  const handleOpenAdminFromFooter = () => {
    navigate('/adm');
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
    if (location.pathname !== '/adm') {
      navigate('/adm');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portal_admin_session');
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
    setIsLoginModalOpen(false);
    navigate('/');
  };

  // Compute active category ID for Header navigation styling
  const activeCategoryId = React.useMemo(() => {
    if (location.pathname === '/noticias') {
      return 'cat-ultimas';
    }
    if (location.pathname.startsWith('/noticias/')) {
      const parts = location.pathname.split('/').filter(Boolean);
      const catSlug = parts[1];
      if (catSlug) {
        if (catSlug === 'ultimas' || catSlug === 'cat-ultimas') return 'cat-ultimas';
        const found = categories.find(c => c.slug === catSlug || c.id === catSlug);
        if (found) return found.id;
      }
    }
    return undefined;
  }, [location.pathname, categories]);

  const isBusinessGuideActive = location.pathname.startsWith('/guia-empresarial');

  // If Admin Panel is open and authenticated
  if (isAdminOpen && isAdminAuthenticated) {
    return (
      <AdminPanel
        articles={articles}
        categories={categories}
        banners={banners}
        identity={identity}
        facebookConfig={facebookConfig}
        sitePopup={sitePopup}
        businessConfig={businessConfig}
        businessStores={businessStores}
        businessProducts={businessProducts}
        onRefreshData={loadPortalData}
        onDataChanged={loadPortalData}
        onCloseAdmin={() => {
          setIsAdminOpen(false);
          navigate('/');
        }}
        onClose={() => {
          setIsAdminOpen(false);
          navigate('/');
        }}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <ScrollToTop />

      {/* Main Responsive Header */}
      <Header
        identity={identity}
        categories={categories}
        activeCategoryId={activeCategoryId}
        businessGuideConfig={businessConfig}
        isBusinessGuideActive={isBusinessGuideActive}
        onOpenBusinessGuide={() => navigate('/guia-empresarial')}
        onSelectCategory={handleSelectCategory}
        onGoHome={() => navigate('/')}
        onSearch={handleSearch}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <HomePage
                articles={articles}
                categories={categories}
                banners={banners}
                businessConfig={businessConfig}
                businessStores={businessStores}
                onBannerClick={handleBannerClick}
              />
            }
          />

          {/* All News / Latest News Route */}
          <Route
            path="/noticias"
            element={
              <NewsPage
                articles={articles}
                categories={categories}
                banners={banners}
                onBannerClick={handleBannerClick}
              />
            }
          />

          {/* Category Route: /noticias/:categorySlug (e.g. /noticias/politica, /noticias/goioere) */}
          <Route
            path="/noticias/:categorySlug"
            element={
              <CategoryPage
                articles={articles}
                categories={categories}
                banners={banners}
                onBannerClick={handleBannerClick}
              />
            }
          />

          {/* Article Detail Route: /noticias/:categorySlug/:articleSlug */}
          <Route
            path="/noticias/:categorySlug/:articleSlug"
            element={
              <ArticleDetailPage
                articles={articles}
                categories={categories}
                banners={banners}
              />
            }
          />

          {/* Direct Article Route fallback: /noticia/:articleSlug */}
          <Route
            path="/noticia/:articleSlug"
            element={
              <ArticleDetailPage
                articles={articles}
                categories={categories}
                banners={banners}
              />
            }
          />

          {/* Guia Empresarial Directory Route */}
          <Route
            path="/guia-empresarial"
            element={
              <BusinessGuidePage
                config={businessConfig}
                stores={businessStores}
                products={businessProducts}
              />
            }
          />

          {/* Guia Empresarial Store Minisite Route */}
          <Route
            path="/guia-empresarial/:storeSlug"
            element={
              <BusinessStorePage
                stores={businessStores}
                products={businessProducts}
              />
            }
          />

          {/* Search Route */}
          <Route
            path="/busca"
            element={
              <SearchPage
                articles={articles}
                categories={categories}
              />
            }
          />

          {/* Admin Routes: /adm and /admin */}
          <Route
            path="/adm"
            element={
              <div className="py-20 text-center">
                <p className="text-slate-600 font-medium">Carregando painel administrativo...</p>
              </div>
            }
          />
          <Route path="/admin" element={<Navigate to="/adm" replace />} />

          {/* Fallback wildcard: redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer
        identity={identity}
        categories={categories}
        businessGuideConfig={businessConfig}
        onOpenBusinessGuide={() => navigate('/guia-empresarial')}
        onSelectCategory={handleSelectCategory}
        onGoHome={() => navigate('/')}
        onOpenAdmin={handleOpenAdminFromFooter}
      />

      {/* Global Site PopUp with Attached Image */}
      <SitePopupModal
        popup={sitePopup}
        isHomePage={location.pathname === '/'}
      />

      {/* Admin Login Modal (When not authenticated) */}
      {isLoginModalOpen && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => {
            setIsLoginModalOpen(false);
            if (location.pathname === '/adm' || location.pathname === '/admin') {
              navigate('/');
            }
          }}
        />
      )}
    </div>
  );
}
