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
  hideInMenu?: boolean; // Controls whether this category is hidden from top menu navigation
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
  showText?: boolean; // Controls whether title and text overlay are rendered (default true)
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
  showSiteName?: boolean; // Permite habilitar ou desabilitar a exibição do nome do portal
  logoDisplayMode?: LogoDisplayMode; // 'both' (logo PNG + text in front), 'logo_only' (PNG only), 'text_only' (text only)
  logoSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'; // Tamanho pré-definido da logo
  logoHeight?: number; // Altura customizada da logo no cabeçalho em pixels (ex: 32px a 140px)
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

export interface SitePopup {
  id: string;
  title?: string;
  subtitle?: string;
  imageUrl: string; // Imagem anexada para exibição no PopUp
  targetUrl?: string; // Link de destino opcional ao clicar na imagem
  active: boolean; // Ativa ou desativa a exibição do PopUp no site
  showOnHomeOnly?: boolean; // Exibir apenas na Home ou em todas as páginas
  frequency: 'always' | 'once_per_session' | 'once_per_day'; // Frequência de exibição
  buttonText?: string; // Texto do botão de ação opcional
  updatedAt?: string;
}

export interface BusinessGuideConfig {
  enabled: boolean; // Permite ativar ou desativar a aba no site
  tabName: string; // Nome da aba (padrão: "Guia Empresarial", configurável)
  description?: string;
}

export interface BusinessProductService {
  id: string;
  businessId: string; // ID da loja associada
  name: string;
  type: 'product' | 'service'; // Produto ou Serviço
  category: string; // Categoria interna na loja (ex: "Sobremesas", "Pizzas", "Limpeza Facial")
  price?: number;
  priceFormatted?: string; // ex: "R$ 69,90" ou "A partir de R$ 150" ou "Sob Consulta"
  shortDescription?: string;
  description: string;
  images: string[]; // Fotos do produto / serviço
  featured?: boolean;
  whatsappMessage?: string; // Mensagem opcional personalizada ao clicar
  active: boolean;
}

export interface BusinessStore {
  id: string;
  name: string;
  slug: string;
  category: string; // ex: 'Gastronomia', 'Moda & Acessórios', 'Saúde & Beleza', 'Serviços Automotivos', 'Tecnologia'
  segment?: string;
  description: string;
  aboutText?: string;
  logoUrl: string;
  coverBannerUrl?: string;
  whatsapp: string; // WhatsApp comercial da loja (ex: 5511999999999)
  phone?: string;
  email?: string;
  address: string;
  city: string;
  state?: string;
  neighborhood?: string;
  googleMapsUrl?: string; // Link para rota no Google Maps
  googleMapsEmbedQuery?: string; // Endereço ou query para embutir o mapa
  workingHours?: string; // Ex: Seg a Sex: 08h - 18h | Sáb: 08h - 13h
  website?: string;
  instagram?: string;
  facebook?: string;
  verified?: boolean;
  featured?: boolean;
  active: boolean;
  productCategories: string[];
  products?: BusinessProductService[];
  createdAt?: string;
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
  | { type: 'business_guide' }
  | { type: 'business_store'; storeSlug: string }
  | { type: 'admin'; section?: 'dashboard' | 'articles' | 'categories' | 'banners' | 'popup' | 'identity' | 'businesses' | 'facebook' };
