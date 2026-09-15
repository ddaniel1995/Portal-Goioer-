import { ThemeColors, TypographyConfig, SiteFontFamily, VisualIdentity } from '../types';

export const DEFAULT_COLORS: ThemeColors = {
  primary: '#dc2626',
  primaryHover: '#b91c1c',
  topBarBg: '#0f172a',
  headerBg: 'white',
  footerBg: '#020617',
  pageBg: '#f8fafc',
};

export const DEFAULT_TYPOGRAPHY: TypographyConfig = {
  fontFamily: 'plus_jakarta_sans',
  headingFontFamily: 'same',
  baseFontSize: 'base',
};

export interface FontDefinition {
  id: SiteFontFamily;
  name: string;
  category: 'sans' | 'serif' | 'display';
  categoryLabel: string;
  cssFamily: string;
  description: string;
  previewSample: string;
}

export const FONT_DEFINITIONS: Record<SiteFontFamily, FontDefinition> = {
  plus_jakarta_sans: {
    id: 'plus_jakarta_sans',
    name: 'Plus Jakarta Sans',
    category: 'sans',
    categoryLabel: 'Sem Serifa (Moderna)',
    cssFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: 'Geométrica, limpa e altamente legível no meio digital.',
    previewSample: 'G1 Notícias • Política, Economia e Tempo Real',
  },
  inter: {
    id: 'inter',
    name: 'Inter',
    category: 'sans',
    categoryLabel: 'Sem Serifa (Neutra)',
    cssFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: 'Padrão editorial global para notícias e interfaces densas.',
    previewSample: 'Cobertura Completa • Análise e Checagem',
  },
  roboto: {
    id: 'roboto',
    name: 'Roboto',
    category: 'sans',
    categoryLabel: 'Sem Serifa (Universal)',
    cssFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    description: 'Clássica, equilibrada e de rápida assimilação visual.',
    previewSample: 'Jornalismo Investigativo e Opinião',
  },
  merriweather: {
    id: 'merriweather',
    name: 'Merriweather',
    category: 'serif',
    categoryLabel: 'Com Serifa (Editorial)',
    cssFamily: "'Merriweather', Georgia, 'Times New Roman', serif",
    description: 'Projetada para conforto supremo na leitura de grandes reportagens.',
    previewSample: 'Grandes Reportagens • Edição de Domingo',
  },
  lora: {
    id: 'lora',
    name: 'Lora',
    category: 'serif',
    categoryLabel: 'Com Serifa (Literária)',
    cssFamily: "'Lora', Georgia, 'Times New Roman', serif",
    description: 'Contemporânea e elegante, ideal para colunas de opinião e artigos.',
    previewSample: 'Artigos Especiais • Crônicas e Cultura',
  },
  playfair: {
    id: 'playfair',
    name: 'Playfair Display',
    category: 'serif',
    categoryLabel: 'Com Serifa (Sofisticada)',
    cssFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
    description: 'Tipografia de alto impacto estético, estilo grandes revistas de notícia.',
    previewSample: 'Caderno de Tendências & Liderança',
  },
  montserrat: {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'sans',
    categoryLabel: 'Sem Serifa (Imponente)',
    cssFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    description: 'Visual arquitetônico e urbano com grande presença gráfica.',
    previewSample: 'Mundo dos Negócios & Mercado Financeiro',
  },
  oswald: {
    id: 'oswald',
    name: 'Oswald',
    category: 'display',
    categoryLabel: 'Condensada (Manchete)',
    cssFamily: "'Oswald', Impact, sans-serif",
    description: 'Estilo plantão urgente de telejornal e capa de jornal impresso.',
    previewSample: 'PLANTÃO URGENTE: ÚLTIMAS NOTÍCIAS AO VIVO',
  },
};

// Helper to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

// Darken a hex color for hover state
function darkenHex(hex: string, percent: number = 15): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = 1 - percent / 100;
  const r = Math.max(0, Math.min(255, Math.round(rgb.r * factor)));
  const g = Math.max(0, Math.min(255, Math.round(rgb.g * factor)));
  const b = Math.max(0, Math.min(255, Math.round(rgb.b * factor)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function applyThemeColors(colors?: ThemeColors): void {
  if (typeof document === 'undefined') return;

  const currentColors: ThemeColors = {
    primary: colors?.primary || DEFAULT_COLORS.primary,
    topBarBg: colors?.topBarBg || DEFAULT_COLORS.topBarBg,
    footerBg: colors?.footerBg || DEFAULT_COLORS.footerBg,
    pageBg: colors?.pageBg || DEFAULT_COLORS.pageBg,
    headerBg: colors?.headerBg || 'white',
  };

  const primary = currentColors.primary;
  const primaryHover = colors?.primaryHover || darkenHex(primary, 15);
  const rgb = hexToRgb(primary);
  const lightBg = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)` : 'rgba(220, 38, 38, 0.08)';
  const lightBorder = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)` : 'rgba(220, 38, 38, 0.25)';

  // 1. Set CSS Custom Properties on document element
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', primary);
  root.style.setProperty('--theme-primary-hover', primaryHover);
  root.style.setProperty('--theme-primary-light', lightBg);
  root.style.setProperty('--theme-primary-border', lightBorder);
  root.style.setProperty('--theme-topbar-bg', currentColors.topBarBg || '#0f172a');
  root.style.setProperty('--theme-footer-bg', currentColors.footerBg || '#020617');
  root.style.setProperty('--theme-page-bg', currentColors.pageBg || '#f8fafc');

  // 2. Inject or update dynamic stylesheet to override Tailwind utility classes globally
  let styleEl = document.getElementById('portal-dynamic-theme-styles') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'portal-dynamic-theme-styles';
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    /* PORTAL DYNAMIC THEME INJECTION */
    :root {
      --color-primary: ${primary};
      --color-primary-hover: ${primaryHover};
      --color-primary-light: ${lightBg};
      --color-topbar-bg: ${currentColors.topBarBg};
      --color-footer-bg: ${currentColors.footerBg};
      --color-page-bg: ${currentColors.pageBg};
    }

    body {
      background-color: ${currentColors.pageBg} !important;
    }

    /* Override Red Utility Backgrounds */
    .bg-red-600, .bg-red-500 {
      background-color: var(--color-primary) !important;
    }

    .hover\\:bg-red-700:hover, .hover\\:bg-red-600:hover {
      background-color: var(--color-primary-hover) !important;
    }

    .bg-red-50 {
      background-color: var(--color-primary-light) !important;
    }

    /* Override Red Text */
    .text-red-600, .text-red-500 {
      color: var(--color-primary) !important;
    }

    .hover\\:text-red-600:hover, .hover\\:text-red-700:hover, .group:hover .group-hover\\:text-red-600 {
      color: var(--color-primary) !important;
    }

    /* Override Red Borders */
    .border-red-600, .border-red-500 {
      border-color: var(--color-primary) !important;
    }

    .hover\\:border-red-600:hover, .hover\\:border-red-500:hover {
      border-color: var(--color-primary) !important;
    }

    /* Override Focus Ring */
    .focus\\:ring-red-600:focus, .focus\\:ring-red-500:focus, .ring-red-600, .ring-red-500 {
      --tw-ring-color: var(--color-primary) !important;
    }

    /* Selection Highlight */
    ::selection, .selection\\:bg-red-600::selection {
      background-color: var(--color-primary) !important;
      color: #ffffff !important;
    }
  `;
}

export function applyThemeTypography(typography?: TypographyConfig): void {
  if (typeof document === 'undefined') return;

  const fontKey = typography?.fontFamily || DEFAULT_TYPOGRAPHY.fontFamily;
  const headingKey = typography?.headingFontFamily || DEFAULT_TYPOGRAPHY.headingFontFamily;
  const sizeKey = typography?.baseFontSize || DEFAULT_TYPOGRAPHY.baseFontSize || 'base';

  const bodyDef = FONT_DEFINITIONS[fontKey] || FONT_DEFINITIONS.plus_jakarta_sans;
  const headingDef =
    headingKey && headingKey !== 'same' && FONT_DEFINITIONS[headingKey as SiteFontFamily]
      ? FONT_DEFINITIONS[headingKey as SiteFontFamily]
      : bodyDef;

  const baseSizes = {
    sm: '15px',
    base: '16px',
    lg: '17px',
  };
  const baseSize = baseSizes[sizeKey] || '16px';

  // 1. Set CSS Custom Properties on document root
  const root = document.documentElement;
  root.style.setProperty('--theme-font-body', bodyDef.cssFamily);
  root.style.setProperty('--theme-font-heading', headingDef.cssFamily);
  root.style.setProperty('--theme-base-font-size', baseSize);

  // 2. Inject or update dynamic stylesheet
  let styleEl = document.getElementById('portal-dynamic-typography-styles') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'portal-dynamic-typography-styles';
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    /* PORTAL DYNAMIC TYPOGRAPHY INJECTION */
    :root {
      --theme-font-body: ${bodyDef.cssFamily};
      --theme-font-heading: ${headingDef.cssFamily};
      --theme-base-font-size: ${baseSize};
    }

    html {
      font-size: var(--theme-base-font-size) !important;
    }

    body,
    button,
    input,
    select,
    textarea {
      font-family: var(--theme-font-body) !important;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    .font-serif,
    .font-heading {
      font-family: var(--theme-font-heading) !important;
    }
  `;
}

export function applyFullVisualTheme(identity?: Partial<VisualIdentity>): void {
  if (identity?.colors) {
    applyThemeColors(identity.colors);
  }
  if (identity?.typography) {
    applyThemeTypography(identity.typography);
  } else {
    applyThemeTypography(DEFAULT_TYPOGRAPHY);
  }
}
