export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  content: string;
  categoryId: string;
  categoryName: string;
  featuredImage: string;
  imageCaption?: string;
  additionalImages: string[];
  publishedAt: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  youtubeUrl?: string;
  status: 'published' | 'draft';
  views: number;
  isHighlight?: boolean;
  facebookAutoPublish: boolean;
  facebookPublished: boolean;
  facebookPostId?: string;
  facebookPublishedAt?: string;
  facebookError?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  color?: string;
  description?: string;
  showOnHome?: boolean; // Controls whether this category section appears on the homepage
}

export type BannerPosition = 'slideshow' | 'sidebar' | 'body_slideshow';
export type BannerType = 'commercial' | 'supporter' | 'art' | 'partner';

export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  targetUrl?: string;
  position: BannerPosition;
  order: number;
  active: boolean;
  aspectRatio?: string;
  width?: number;
  height?: number;
  clicks: number;
  type?: BannerType; // commercial, supporter, art, partner
  badgeText?: string; // Optional custom tag e.g. "Apoiador Oficial", "Arte Cultural", "Patrocínio"
}

export interface ThemeColors {
  primary: string; // Primary brand accent color (default #dc2626)
  primaryHover?: string;
  topBarBg?: string; // Top news tickers bar (default #0f172a or primary)
  headerBg?: 'white' | 'dark' | 'primary'; // Header navbar background style
  footerBg?: string; // Footer background color (default #020617)
  pageBg?: string; // General background (default #f8fafc)
}

export type SiteFontFamily =
  | 'plus_jakarta_sans'
  | 'inter'
  | 'roboto'
  | 'merriweather'
  | 'lora'
  | 'playfair'
  | 'montserrat'
  | 'oswald';

export type SiteHeadingFontFamily = 'same' | SiteFontFamily;

export type SiteBaseFontSize = 'sm' | 'base' | 'lg';

export interface TypographyConfig {
  fontFamily: SiteFontFamily;
  headingFontFamily?: SiteHeadingFontFamily;
  baseFontSize?: SiteBaseFontSize;
}

export type LogoDisplayMode = 'both' | 'logo_only' | 'text_only';

export interface VisualIdentity {
  siteName: string;
  tagline: string;
  description: string;
  logoDisplayMode?: LogoDisplayMode; // 'both' (logo PNG + text in front), 'logo_only' (PNG only), 'text_only' (text only)
  logoColorUrl: string;
  logoMonoUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    whatsapp?: string;
  };
  colors?: ThemeColors;
  typography?: TypographyConfig;
}

export interface FacebookConfig {
  connected: boolean;
  pageId: string;
  pageName: string;
  pageAccessToken: string;
  autoPublishEnabled: boolean;
  defaultTemplate: string;
  lastCheckStatus?: 'success' | 'error' | 'idle';
  lastCheckMessage?: string;
  lastPublishStatus?: 'success' | 'error';
  lastPublishDate?: string;
}

export interface FacebookLog {
  id: string;
  articleId: string;
  articleTitle: string;
  timestamp: string;
  status: 'success' | 'error';
  message: string;
  facebookPostId?: string;
}

export type NavigationPage = 
  | { type: 'home' }
  | { type: 'article'; articleId: string }
  | { type: 'category'; categoryId: string }
  | { type: 'search'; query: string }
  | { type: 'admin'; section?: 'dashboard' | 'articles' | 'categories' | 'banners' | 'identity' | 'facebook' };
