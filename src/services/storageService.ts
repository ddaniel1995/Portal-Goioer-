import { Article, Category, Banner, VisualIdentity, FacebookConfig, FacebookLog, BannerPosition, SitePopup, BusinessGuideConfig, BusinessStore, BusinessProductService } from '../types';
import { initialArticles, initialCategories, initialBanners, initialVisualIdentity, initialFacebookConfig, initialSitePopup } from '../data/initialData';
import { initialBusinessGuideConfig, initialBusinessStores, initialBusinessProducts } from '../data/initialBusinesses';
import { applyThemeColors, applyThemeTypography, DEFAULT_COLORS, DEFAULT_TYPOGRAPHY } from './themeService';

const STORAGE_KEYS = {
  ARTICLES: 'portal_news_articles_v1',
  CATEGORIES: 'portal_news_categories_v1',
  BANNERS: 'portal_news_banners_v1',
  IDENTITY: 'portal_news_identity_v1',
  FB_CONFIG: 'portal_news_fb_config_v1',
  FB_LOGS: 'portal_news_fb_logs_v1',
  ADMIN_AUTH: 'portal_news_admin_auth_v1',
  POPUP: 'portal_news_site_popup_v1',
  BUSINESS_CONFIG: 'portal_news_business_config_v1',
  BUSINESS_STORES: 'portal_news_business_stores_v1',
  BUSINESS_PRODUCTS: 'portal_news_business_products_v1',
};

// YouTube ID Extractor helper
export function extractYoutubeId(url?: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

// Generate slug
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Storage helpers
export const storageService = {
  // Articles
  getArticles(): Article[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (data) {
        const parsed: Article[] = JSON.parse(data);
        // Ensure initial podcast episodes exist if none are found in current storage
        const hasPodcastArticles = parsed.some(a => a.categoryId === 'cat-podcast');
        if (!hasPodcastArticles) {
          const podcastArticles = initialArticles.filter(a => a.categoryId === 'cat-podcast');
          if (podcastArticles.length > 0) {
            const merged = [...parsed, ...podcastArticles];
            this.saveArticles(merged);
            return merged;
          }
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load articles from storage', e);
    }
    this.saveArticles(initialArticles);
    return initialArticles;
  },

  saveArticles(articles: Article[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
      window.dispatchEvent(new Event('portal_data_updated'));
    } catch (e) {
      console.error('Failed to save articles to storage', e);
    }
  },

  getArticleById(id: string): Article | undefined {
    return this.getArticles().find(a => a.id === id);
  },

  getArticleBySlug(slug: string): Article | undefined {
    return this.getArticles().find(a => a.slug === slug);
  },

  saveArticle(article: Partial<Article> & { title: string; categoryId: string }): Article {
    const articles = this.getArticles();
    const categories = this.getCategories();
    const category = categories.find(c => c.id === article.categoryId);
    const categoryName = category ? category.name : 'Geral';

    let savedArticle: Article;

    if (article.id) {
      const index = articles.findIndex(a => a.id === article.id);
      if (index !== -1) {
        savedArticle = {
          ...articles[index],
          ...article,
          categoryName,
          slug: article.slug || slugify(article.title),
        } as Article;
        articles[index] = savedArticle;
      } else {
        savedArticle = {
          ...article,
          id: article.id,
          slug: article.slug || slugify(article.title),
          categoryName,
          views: article.views || 0,
          additionalImages: article.additionalImages || [],
          publishedAt: article.publishedAt || new Date().toISOString(),
          status: article.status || 'published',
          facebookAutoPublish: article.facebookAutoPublish ?? false,
          facebookPublished: article.facebookPublished ?? false,
        } as Article;
        articles.unshift(savedArticle);
      }
    } else {
      savedArticle = {
        id: 'art-' + Date.now(),
        title: article.title,
        slug: slugify(article.title),
        subtitle: article.subtitle || '',
        content: article.content || '',
        categoryId: article.categoryId,
        categoryName,
        featuredImage: article.featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop',
        imageCaption: article.imageCaption || '',
        additionalImages: article.additionalImages || [],
        publishedAt: article.publishedAt || new Date().toISOString(),
        author: article.author || 'Redação',
        authorRole: article.authorRole || 'Redator',
        authorAvatar: article.authorAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
        youtubeUrl: article.youtubeUrl || '',
        status: article.status || 'published',
        views: 0,
        isHighlight: article.isHighlight ?? false,
        facebookAutoPublish: article.facebookAutoPublish ?? false,
        facebookPublished: false,
      };
      articles.unshift(savedArticle);
    }

    this.saveArticles(articles);
    return savedArticle;
  },

  deleteArticle(id: string): void {
    const articles = this.getArticles().filter(a => a.id !== id);
    this.saveArticles(articles);
  },

  incrementArticleViews(id: string): void {
    const articles = this.getArticles();
    const article = articles.find(a => a.id === id);
    if (article) {
      article.views = (article.views || 0) + 1;
      this.saveArticles(articles);
    }
  },

  // Categories
  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) {
        const parsed: Category[] = JSON.parse(data);
        const hasPodcast = parsed.some(c => c.slug === 'podcast' || c.id === 'cat-podcast');
        if (!hasPodcast) {
          const podcastCat: Category = {
            id: 'cat-podcast',
            name: 'Podcast',
            slug: 'podcast',
            order: parsed.length + 1,
            color: '#8b5cf6',
            description: 'Galeria de vídeos e episódios com links diretos do YouTube',
            showOnHome: true,
          };
          parsed.push(podcastCat);
          this.saveCategories(parsed);
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load categories', e);
    }
    this.saveCategories(initialCategories);
    return initialCategories;
  },

  saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      window.dispatchEvent(new Event('portal_data_updated'));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  },

  saveCategory(category: Partial<Category> & { name: string }): Category {
    const categories = this.getCategories();
    let saved: Category;

    if (category.id) {
      const idx = categories.findIndex(c => c.id === category.id);
      if (idx !== -1) {
        saved = { ...categories[idx], ...category, slug: category.slug || slugify(category.name) };
        categories[idx] = saved;
      } else {
        saved = {
          id: category.id,
          name: category.name,
          slug: slugify(category.name),
          order: category.order || categories.length + 1,
          color: category.color || '#2563eb',
          description: category.description || '',
          showOnHome: category.showOnHome ?? true,
          hideInMenu: category.hideInMenu ?? false,
        };
        categories.push(saved);
      }
    } else {
      saved = {
        id: 'cat-' + Date.now(),
        name: category.name,
        slug: slugify(category.name),
        order: category.order || categories.length + 1,
        color: category.color || '#2563eb',
        description: category.description || '',
        showOnHome: category.showOnHome ?? true,
        hideInMenu: category.hideInMenu ?? false,
      };
      categories.push(saved);
    }

    this.saveCategories(categories.sort((a, b) => a.order - b.order));
    return saved;
  },

  deleteCategory(id: string): boolean {
    const articles = this.getArticles();
    const hasArticles = articles.some(a => a.categoryId === id);
    if (hasArticles) {
      return false; // Prevent deleting category in use
    }
    const filtered = this.getCategories().filter(c => c.id !== id);
    this.saveCategories(filtered);
    return true;
  },

  // Banners
  getBanners(): Banner[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BANNERS);
      if (data) {
        const parsed: Banner[] = JSON.parse(data);
        // Ensure body_slideshow banners exist if none in storage
        const hasBodySlideshow = parsed.some(b => b.position === 'body_slideshow');
        if (!hasBodySlideshow) {
          const bodyBanners = initialBanners.filter(b => b.position === 'body_slideshow');
          if (bodyBanners.length > 0) {
            const merged = [...parsed, ...bodyBanners];
            this.saveBanners(merged);
            return merged;
          }
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load banners', e);
    }
    this.saveBanners(initialBanners);
    return initialBanners;
  },

  saveBanners(banners: Banner[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
      window.dispatchEvent(new Event('portal_data_updated'));
    } catch (e) {
      console.error('Failed to save banners', e);
    }
  },

  saveBanner(banner: Partial<Banner> & { title: string; imageUrl: string; position: BannerPosition }): Banner {
    const banners = this.getBanners();
    let saved: Banner;

    if (banner.id) {
      const idx = banners.findIndex(b => b.id === banner.id);
      if (idx !== -1) {
        saved = { ...banners[idx], ...banner } as Banner;
        banners[idx] = saved;
      } else {
        saved = {
          ...banner,
          id: banner.id,
          order: banner.order || banners.length + 1,
          active: banner.active ?? true,
          clicks: banner.clicks || 0,
        } as Banner;
        banners.push(saved);
      }
    } else {
      saved = {
        id: 'ban-' + Date.now(),
        title: banner.title,
        description: banner.description || '',
        imageUrl: banner.imageUrl,
        targetUrl: banner.targetUrl || '',
        position: banner.position,
        order: banner.order || banners.length + 1,
        active: banner.active ?? true,
        aspectRatio: banner.aspectRatio,
        width: banner.width,
        height: banner.height,
        clicks: 0,
        type: banner.type || (banner.position === 'sidebar' ? 'supporter' : 'commercial'),
        badgeText: banner.badgeText || '',
        showText: banner.showText ?? true,
      };
      banners.push(saved);
    }

    this.saveBanners(banners.sort((a, b) => a.order - b.order));
    return saved;
  },

  deleteBanner(id: string): void {
    const banners = this.getBanners().filter(b => b.id !== id);
    this.saveBanners(banners);
  },

  incrementBannerClicks(id: string): void {
    const banners = this.getBanners();
    const banner = banners.find(b => b.id === id);
    if (banner) {
      banner.clicks = (banner.clicks || 0) + 1;
      this.saveBanners(banners);
    }
  },

  recordBannerClick(id: string): void {
    const banners = this.getBanners();
    const b = banners.find(item => item.id === id);
    if (b) {
      b.clicks = (b.clicks || 0) + 1;
      this.saveBanners(banners);
    }
  },

  // Visual Identity
  getVisualIdentity(): VisualIdentity {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.IDENTITY);
      if (data) {
        const parsed = JSON.parse(data);
        const merged: VisualIdentity = {
          ...initialVisualIdentity,
          ...parsed,
          colors: {
            ...DEFAULT_COLORS,
            ...(initialVisualIdentity.colors || {}),
            ...(parsed.colors || {})
          },
          typography: {
            ...DEFAULT_TYPOGRAPHY,
            ...(initialVisualIdentity.typography || {}),
            ...(parsed.typography || {})
          },
          socialMedia: {
            ...initialVisualIdentity.socialMedia,
            ...(parsed.socialMedia || {})
          }
        };
        applyThemeColors(merged.colors);
        applyThemeTypography(merged.typography);
        return merged;
      }
    } catch (e) {
      console.error('Failed to load visual identity', e);
    }
    this.saveVisualIdentity(initialVisualIdentity);
    applyThemeColors(initialVisualIdentity.colors);
    applyThemeTypography(initialVisualIdentity.typography);
    return initialVisualIdentity;
  },

  saveVisualIdentity(identity: VisualIdentity): void {
    try {
      const merged: VisualIdentity = {
        ...initialVisualIdentity,
        ...identity,
        colors: {
          ...DEFAULT_COLORS,
          ...(initialVisualIdentity.colors || {}),
          ...(identity.colors || {})
        },
        typography: {
          ...DEFAULT_TYPOGRAPHY,
          ...(initialVisualIdentity.typography || {}),
          ...(identity.typography || {})
        }
      };
      localStorage.setItem(STORAGE_KEYS.IDENTITY, JSON.stringify(merged));
      applyThemeColors(merged.colors);
      applyThemeTypography(merged.typography);
      window.dispatchEvent(new Event('portal_data_updated'));
    } catch (e) {
      console.error('Failed to save visual identity', e);
    }
  },

  // Facebook Config
  getFacebookConfig(): FacebookConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FB_CONFIG);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load FB config', e);
    }
    this.saveFacebookConfig(initialFacebookConfig);
    return initialFacebookConfig;
  },

  saveFacebookConfig(config: FacebookConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FB_CONFIG, JSON.stringify(config));
      window.dispatchEvent(new Event('portal_data_updated'));
    } catch (e) {
      console.error('Failed to save FB config', e);
    }
  },

  // Facebook Logs
  getFacebookLogs(): FacebookLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FB_LOGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load FB logs', e);
    }
    return [
      {
        id: 'log-1',
        articleId: 'art-1',
        articleTitle: 'Congresso aprova novo marco da transição energética com foco em energias limpas',
        timestamp: '2026-09-11T09:32:00Z',
        status: 'success',
        message: 'Publicação realizada com sucesso na Página do Facebook.',
        facebookPostId: 'fb_post_99214481_01'
      }
    ];
  },

  addFacebookLog(log: Omit<FacebookLog, 'id'>): void {
    const logs = this.getFacebookLogs();
    const newLog: FacebookLog = {
      ...log,
      id: 'log-' + Date.now(),
    };
    logs.unshift(newLog);
    // Keep max 50 logs
    const trimmed = logs.slice(0, 50);
    try {
      localStorage.setItem(STORAGE_KEYS.FB_LOGS, JSON.stringify(trimmed));
      window.dispatchEvent(new Event('portal_data_updated'));
    } catch (e) {
      console.error('Failed to save FB log', e);
    }
  },

  clearFacebookLogs(): void {
    localStorage.removeItem(STORAGE_KEYS.FB_LOGS);
    window.dispatchEvent(new Event('portal_data_updated'));
  },

  // Site PopUp with Attached Image
  getSitePopup(): SitePopup {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POPUP);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...initialSitePopup,
          ...parsed,
        };
      }
    } catch (e) {
      console.error('Failed to load site popup from storage', e);
    }
    this.saveSitePopup(initialSitePopup);
    return initialSitePopup;
  },

  saveSitePopup(popup: Partial<SitePopup>): SitePopup {
    try {
      const current = this.getSitePopup();
      const updated: SitePopup = {
        ...current,
        ...popup,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.POPUP, JSON.stringify(updated));
      window.dispatchEvent(new Event('portal_data_updated'));
      return updated;
    } catch (e) {
      console.error('Failed to save site popup', e);
      return initialSitePopup;
    }
  },

  // Business Guide (Guia Empresarial) Configuration
  getBusinessGuideConfig(): BusinessGuideConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUSINESS_CONFIG);
      if (data) {
        return {
          ...initialBusinessGuideConfig,
          ...JSON.parse(data),
        };
      }
    } catch (e) {
      console.error('Failed to load business guide config', e);
    }
    this.saveBusinessGuideConfig(initialBusinessGuideConfig);
    return initialBusinessGuideConfig;
  },

  saveBusinessGuideConfig(config: Partial<BusinessGuideConfig>): BusinessGuideConfig {
    try {
      const current = this.getBusinessGuideConfig();
      const updated: BusinessGuideConfig = {
        ...current,
        ...config,
      };
      localStorage.setItem(STORAGE_KEYS.BUSINESS_CONFIG, JSON.stringify(updated));
      window.dispatchEvent(new Event('portal_data_updated'));
      return updated;
    } catch (e) {
      console.error('Failed to save business guide config', e);
      return initialBusinessGuideConfig;
    }
  },

  // Business Stores (Lojas do Guia)
  getBusinessStores(): BusinessStore[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUSINESS_STORES);
      if (data) {
        const parsed: BusinessStore[] = JSON.parse(data);
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load business stores', e);
    }
    this.saveBusinessStores(initialBusinessStores);
    return initialBusinessStores;
  },

  saveBusinessStores(stores: BusinessStore[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BUSINESS_STORES, JSON.stringify(stores));
      window.dispatchEvent(new Event('portal_data_updated'));
    } catch (e) {
      console.error('Failed to save business stores', e);
    }
  },

  saveBusinessStore(store: BusinessStore): void {
    const stores = this.getBusinessStores();
    const index = stores.findIndex(s => s.id === store.id);
    if (index >= 0) {
      stores[index] = store;
    } else {
      stores.unshift(store);
    }
    this.saveBusinessStores(stores);
  },

  deleteBusinessStore(id: string): void {
    const stores = this.getBusinessStores().filter(s => s.id !== id);
    this.saveBusinessStores(stores);
    // Also delete associated products
    const products = this.getBusinessProducts().filter(p => p.businessId !== id);
    this.saveBusinessProducts(products);
  },

  // Business Products / Services (Produtos e Serviços)
  getBusinessProducts(businessId?: string): BusinessProductService[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUSINESS_PRODUCTS);
      if (data) {
        const parsed: BusinessProductService[] = JSON.parse(data);
        if (businessId) {
          return parsed.filter(p => p.businessId === businessId);
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load business products', e);
    }
    this.saveBusinessProducts(initialBusinessProducts);
    if (businessId) {
      return initialBusinessProducts.filter(p => p.businessId === businessId);
    }
    return initialBusinessProducts;
  },

  saveBusinessProducts(products: BusinessProductService[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BUSINESS_PRODUCTS, JSON.stringify(products));
      window.dispatchEvent(new Event('portal_data_updated'));
    } catch (e) {
      console.error('Failed to save business products', e);
    }
  },

  saveBusinessProduct(product: BusinessProductService): void {
    const products = this.getBusinessProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    this.saveBusinessProducts(products);
  },

  deleteBusinessProduct(id: string): void {
    const products = this.getBusinessProducts().filter(p => p.id !== id);
    this.saveBusinessProducts(products);
  },

  // Reset to original demo content
  resetAllToDefault(): void {
    this.saveArticles(initialArticles);
    this.saveCategories(initialCategories);
    this.saveBanners(initialBanners);
    this.saveVisualIdentity(initialVisualIdentity);
    this.saveFacebookConfig(initialFacebookConfig);
    this.saveSitePopup(initialSitePopup);
    this.saveBusinessGuideConfig(initialBusinessGuideConfig);
    this.saveBusinessStores(initialBusinessStores);
    this.saveBusinessProducts(initialBusinessProducts);
    this.clearFacebookLogs();
  }
};
