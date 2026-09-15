import React, { useState, useRef, useEffect } from 'react';
import { Upload, Check, AlertCircle, Sparkles, Image as ImageIcon, Globe, Mail, Phone, MapPin, Palette, RefreshCw, RotateCcw, Type, TextQuote } from 'lucide-react';
import { VisualIdentity, ThemeColors, SiteFontFamily, SiteHeadingFontFamily, SiteBaseFontSize } from '../../types';
import { storageService } from '../../services/storageService';
import { applyThemeColors, applyThemeTypography, DEFAULT_COLORS, DEFAULT_TYPOGRAPHY, FONT_DEFINITIONS } from '../../services/themeService';
import { Logo } from '../Logo';

interface AdminIdentityProps {
  identity: VisualIdentity;
  onRefresh: () => void;
}

const COLOR_PRESETS = [
  { name: 'Vermelho Notícias (Padrão)', primary: '#dc2626', topBarBg: '#0f172a', footerBg: '#020617', pageBg: '#f8fafc' },
  { name: 'Azul Editorial', primary: '#1d4ed8', topBarBg: '#0f172a', footerBg: '#0f172a', pageBg: '#f8fafc' },
  { name: 'Verde Esmeralda', primary: '#059669', topBarBg: '#064e3b', footerBg: '#022c22', pageBg: '#f8fafc' },
  { name: 'Índigo Moderno', primary: '#6366f1', topBarBg: '#1e1b4b', footerBg: '#0f172a', pageBg: '#f8fafc' },
  { name: 'Laranja Dinâmico', primary: '#ea580c', topBarBg: '#1c1917', footerBg: '#0c0a09', pageBg: '#f8fafc' },
  { name: 'Grafite & Âmbar', primary: '#d97706', topBarBg: '#18181b', footerBg: '#09090b', pageBg: '#fafaf9' },
  { name: 'Preto Minimalista', primary: '#0f172a', topBarBg: '#020617', footerBg: '#020617', pageBg: '#f8fafc' },
];

export const AdminIdentity: React.FC<AdminIdentityProps> = ({ identity, onRefresh }) => {
  const [siteName, setSiteName] = useState(identity.siteName);
  const [tagline, setTagline] = useState(identity.tagline);
  const [description, setDescription] = useState(identity.description);
  const [logoColorUrl, setLogoColorUrl] = useState(identity.logoColorUrl);
  const [logoMonoUrl, setLogoMonoUrl] = useState(identity.logoMonoUrl);
  const [contactEmail, setContactEmail] = useState(identity.contactEmail);
  const [contactPhone, setContactPhone] = useState(identity.contactPhone);
  const [address, setAddress] = useState(identity.address);

  // Site Colors
  const [primaryColor, setPrimaryColor] = useState(identity.colors?.primary || '#dc2626');
  const [topBarBg, setTopBarBg] = useState(identity.colors?.topBarBg || '#0f172a');
  const [footerBg, setFooterBg] = useState(identity.colors?.footerBg || '#020617');
  const [pageBg, setPageBg] = useState(identity.colors?.pageBg || '#f8fafc');

  // Site Typography
  const [fontFamily, setFontFamily] = useState<SiteFontFamily>(
    identity.typography?.fontFamily || DEFAULT_TYPOGRAPHY.fontFamily
  );
  const [headingFontFamily, setHeadingFontFamily] = useState<SiteHeadingFontFamily>(
    identity.typography?.headingFontFamily || DEFAULT_TYPOGRAPHY.headingFontFamily
  );
  const [baseFontSize, setBaseFontSize] = useState<SiteBaseFontSize>(
    identity.typography?.baseFontSize || DEFAULT_TYPOGRAPHY.baseFontSize || 'base'
  );

  // Socials
  const [facebook, setFacebook] = useState(identity.socialMedia.facebook || '');
  const [instagram, setInstagram] = useState(identity.socialMedia.instagram || '');
  const [twitter, setTwitter] = useState(identity.socialMedia.twitter || '');
  const [youtube, setYoutube] = useState(identity.socialMedia.youtube || '');
  const [whatsapp, setWhatsapp] = useState(identity.socialMedia.whatsapp || '');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const colorFileInputRef = useRef<HTMLInputElement>(null);
  const monoFileInputRef = useRef<HTMLInputElement>(null);

  // Apply live colors immediately whenever user picks or edits colors
  useEffect(() => {
    applyThemeColors({
      primary: primaryColor,
      topBarBg,
      footerBg,
      pageBg,
    });
  }, [primaryColor, topBarBg, footerBg, pageBg]);

  // Apply live typography immediately whenever user picks or edits typography
  useEffect(() => {
    applyThemeTypography({
      fontFamily,
      headingFontFamily,
      baseFontSize,
    });
  }, [fontFamily, headingFontFamily, baseFontSize]);

  const handleApplyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setPrimaryColor(preset.primary);
    setTopBarBg(preset.topBarBg);
    setFooterBg(preset.footerBg);
    setPageBg(preset.pageBg);
    applyThemeColors({
      primary: preset.primary,
      topBarBg: preset.topBarBg,
      footerBg: preset.footerBg,
      pageBg: preset.pageBg,
    });
  };

  const handleResetDefaultColors = () => {
    setPrimaryColor(DEFAULT_COLORS.primary);
    setTopBarBg(DEFAULT_COLORS.topBarBg);
    setFooterBg(DEFAULT_COLORS.footerBg);
    setPageBg(DEFAULT_COLORS.pageBg);
    applyThemeColors(DEFAULT_COLORS);
  };

  const handleResetDefaultTypography = () => {
    setFontFamily(DEFAULT_TYPOGRAPHY.fontFamily);
    setHeadingFontFamily(DEFAULT_TYPOGRAPHY.headingFontFamily);
    setBaseFontSize(DEFAULT_TYPOGRAPHY.baseFontSize);
    applyThemeTypography(DEFAULT_TYPOGRAPHY);
  };

  const handleFileUpload = (type: 'color' | 'mono', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('A logo deve ter no máximo 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (type === 'color') setLogoColorUrl(reader.result);
        else setLogoMonoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: VisualIdentity = {
      siteName: siteName.trim() || 'PORTAL NOTÍCIAS',
      tagline: tagline.trim(),
      description: description.trim(),
      logoColorUrl: logoColorUrl.trim(),
      logoMonoUrl: logoMonoUrl.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      address: address.trim(),
      colors: {
        primary: primaryColor,
        topBarBg,
        footerBg,
        pageBg,
      },
      typography: {
        fontFamily,
        headingFontFamily,
        baseFontSize,
      },
      socialMedia: {
        facebook: facebook.trim(),
        instagram: instagram.trim(),
        twitter: twitter.trim(),
        youtube: youtube.trim(),
        whatsapp: whatsapp.trim()
      }
    };

    storageService.saveVisualIdentity(updated);
    setMessage({ type: 'success', text: 'Identidade visual, fontes, logos e cores atualizados com sucesso!' });
    onRefresh();
    setTimeout(() => setMessage(null), 3500);
  };

  const previewIdentity: VisualIdentity = {
    ...identity,
    siteName,
    tagline,
    logoColorUrl,
    logoMonoUrl,
    colors: {
      primary: primaryColor,
      topBarBg,
      footerBg,
      pageBg,
    },
    typography: {
      fontFamily,
      headingFontFamily,
      baseFontSize,
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Identidade Visual & Logos
        </h2>
        <p className="text-xs text-slate-500">
          Personalize as marcas do site: a logo colorida para o cabeçalho e a versão monocromática para o rodapé escuro.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Logos (Colorida para Header & Monocromática para Rodapé) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-red-600" />
              <span>Gerenciamento de Logos</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cadastre separadamente a versão colorida (para o cabeçalho claro) e a monocromática (para o rodapé escuro).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo Colorida */}
            <div className="space-y-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Logo Colorida (Cabeçalho)
                </label>
                <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  Header Claro
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={logoColorUrl}
                  onChange={(e) => setLogoColorUrl(e.target.value)}
                  placeholder="URL da logo colorida (PNG/SVG/JPG) ou faça upload..."
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => colorFileInputRef.current?.click()}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
                <input
                  ref={colorFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('color', e)}
                  className="hidden"
                />
              </div>

              {/* Preview of Header Logo */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 mb-2 block">Prévia no Cabeçalho (Fundo Branco):</span>
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-center min-h-[70px]">
                  <Logo identity={previewIdentity} variant="color" size="md" />
                </div>
              </div>
            </div>

            {/* Logo Monocromática */}
            <div className="space-y-4 p-5 rounded-xl bg-slate-900 text-white border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Logo Monocromática (Rodapé)
                </label>
                <span className="text-[10px] uppercase font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                  Rodapé Escuro
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={logoMonoUrl}
                  onChange={(e) => setLogoMonoUrl(e.target.value)}
                  placeholder="URL da logo monocromática (branca/cinza) ou upload..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => monoFileInputRef.current?.click()}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
                <input
                  ref={monoFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('mono', e)}
                  className="hidden"
                />
              </div>

              {/* Preview of Footer Logo */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 mb-2 block">Prévia no Rodapé (Fundo Escuro):</span>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center min-h-[70px]">
                  <Logo identity={previewIdentity} variant="mono" size="md" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Paleta de Cores & Personalização do Tema */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-red-600" />
                <span>Cores & Personalização do Site</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Personalize as cores dos elementos do portal ou escolha uma paleta profissional pronta.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 w-fit">
              Aplicação Instantânea
            </span>
          </div>

          {/* Presets Rápidos */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Paletas Rápidas Pré-Definidas
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset) => {
                const isCurrent = primaryColor.toLowerCase() === preset.primary.toLowerCase();
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all border ${
                      isCurrent
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span>{preset.name}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleResetDefaultColors}
                className="px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 shadow-2xs"
                title="Restaurar cores originais do portal"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Restaurar Cores Padrão</span>
              </button>
            </div>
          </div>

          {/* Color Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Cor Primária */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Cor Primária / Destaque
              </label>
              <p className="text-[11px] text-slate-500">Botões, destaques, selos e links ativos</p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 p-0.5 rounded-lg border border-slate-200 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold uppercase text-slate-800"
                />
              </div>
            </div>

            {/* 2. Top Bar Background */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Barra Superior (Top Bar)
              </label>
              <p className="text-[11px] text-slate-500">Faixa de plantão e data no topo</p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  value={topBarBg}
                  onChange={(e) => setTopBarBg(e.target.value)}
                  className="w-10 h-10 p-0.5 rounded-lg border border-slate-200 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={topBarBg}
                  onChange={(e) => setTopBarBg(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold uppercase text-slate-800"
                />
              </div>
            </div>

            {/* 3. Footer Background */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Fundo do Rodapé
              </label>
              <p className="text-[11px] text-slate-500">Área institucional inferior do site</p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  value={footerBg}
                  onChange={(e) => setFooterBg(e.target.value)}
                  className="w-10 h-10 p-0.5 rounded-lg border border-slate-200 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={footerBg}
                  onChange={(e) => setFooterBg(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold uppercase text-slate-800"
                />
              </div>
            </div>

            {/* 4. Page Background */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Fundo da Página
              </label>
              <p className="text-[11px] text-slate-500">Cor de fundo de todo o portal</p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  value={pageBg}
                  onChange={(e) => setPageBg(e.target.value)}
                  className="w-10 h-10 p-0.5 rounded-lg border border-slate-200 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={pageBg}
                  onChange={(e) => setPageBg(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold uppercase text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Interactive Live Theme Preview Box */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Simulação do Tema em Tempo Real
            </span>

            <div
              className="rounded-xl border border-slate-200 overflow-hidden shadow-xs"
              style={{ backgroundColor: pageBg }}
            >
              {/* Mini Top Bar */}
              <div
                className="px-4 py-2 text-white flex items-center justify-between text-[11px] font-semibold"
                style={{ backgroundColor: topBarBg }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Plantão
                  </span>
                  <span className="truncate">Portal Notícias 24h ao vivo no ar</span>
                </div>
                <span className="text-white/60 text-[10px] hidden sm:inline">Edição Digital</span>
              </div>

              {/* Mini Content Area */}
              <div className="p-4 bg-white/90 m-3 rounded-lg border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Últimas Notícias
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Título de exemplo com o estilo visual e contraste escolhidos
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className="px-3 py-1.5 text-white rounded-lg text-xs font-bold shadow-xs transition-opacity hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Ler Matéria
                  </button>
                  <span
                    className="text-xs font-bold cursor-pointer"
                    style={{ color: primaryColor }}
                  >
                    Ver Categoria →
                  </span>
                </div>
              </div>

              {/* Mini Footer */}
              <div
                className="px-4 py-3 text-white/70 flex items-center justify-between text-[11px]"
                style={{ backgroundColor: footerBg }}
              >
                <span className="font-bold text-white tracking-wider">{siteName || 'PORTAL NOTÍCIAS'}</span>
                <span className="text-[10px] text-white/50">Rodapé personalizado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Tipografia & Fontes de Todo o Site */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Type className="w-4 h-4 text-red-600" />
                <span>Tipografia & Fontes de Todo o Site</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Altere a família de fontes de todo o portal. A fonte escolhida é aplicada instantaneamente nas matérias, cabeçalho, cartões, menus e rodapé.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetDefaultTypography}
              className="px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 shadow-2xs self-start sm:self-center shrink-0 cursor-pointer"
              title="Restaurar fonte padrão do portal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Restaurar Fonte Padrão</span>
            </button>
          </div>

          {/* 1. Escolha da Fonte Principal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Fonte Principal (Corpo do Texto, Notícias e Navegação)
              </label>
              <span className="text-[11px] font-semibold text-slate-500">
                Ativa:{' '}
                <strong className="text-slate-900 font-bold">
                  {FONT_DEFINITIONS[fontFamily]?.name}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {(Object.keys(FONT_DEFINITIONS) as SiteFontFamily[]).map((key) => {
                const font = FONT_DEFINITIONS[key];
                const isSelected = fontFamily === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFontFamily(key)}
                    className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-red-600 ring-2 ring-red-500/30 bg-red-50/20 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 tracking-tight">
                          {font.name}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
                        {font.categoryLabel}
                      </span>
                    </div>

                    {/* Visual Typography Specimen */}
                    <div
                      className="text-base sm:text-lg font-medium text-slate-800 leading-snug py-1 border-y border-slate-200/60"
                      style={{ fontFamily: font.cssFamily }}
                    >
                      Aa Bb Gg 123
                    </div>

                    <p className="text-[11px] text-slate-500 leading-tight">
                      {font.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Combinação Editorial para Manchetes e Títulos */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Estilo das Manchetes e Títulos (H1, H2, H3 e Destaques)
            </label>
            <p className="text-[11px] text-slate-500">
              Você pode manter a mesma fonte em tudo ou aplicar contraste editorial nas manchetes de destaque.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'same', label: 'Mesma do Site (Harmônica)', fontDef: FONT_DEFINITIONS[fontFamily] },
                { id: 'playfair', label: 'Playfair (Sofisticada)', fontDef: FONT_DEFINITIONS.playfair },
                { id: 'merriweather', label: 'Merriweather (Clássica)', fontDef: FONT_DEFINITIONS.merriweather },
                { id: 'oswald', label: 'Oswald (Plantão Condensado)', fontDef: FONT_DEFINITIONS.oswald },
                { id: 'montserrat', label: 'Montserrat (Geométrica)', fontDef: FONT_DEFINITIONS.montserrat },
                { id: 'lora', label: 'Lora (Literária Refinada)', fontDef: FONT_DEFINITIONS.lora },
                { id: 'inter', label: 'Inter (Neutra & Direta)', fontDef: FONT_DEFINITIONS.inter },
                { id: 'plus_jakarta_sans', label: 'Jakarta (Moderna)', fontDef: FONT_DEFINITIONS.plus_jakarta_sans },
              ].map((opt) => {
                const isSelected = headingFontFamily === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setHeadingFontFamily(opt.id as SiteHeadingFontFamily)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-red-600 bg-red-50/30 text-red-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="block text-xs truncate font-semibold mb-1">
                      {opt.label}
                    </span>
                    <span
                      className="block text-sm sm:text-base font-bold text-slate-900 truncate"
                      style={{ fontFamily: opt.fontDef?.cssFamily }}
                    >
                      Manchete Geral
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Escala e Tamanho Base de Leitura */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. Escala do Texto (Tamanho Base de Leitura)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'sm', label: 'Compacto (15px)', desc: 'Mais matérias e informações visíveis por tela' },
                { id: 'base', label: 'Padrão (16px)', desc: 'Equilíbrio editorial ideal e recomendado para leitura' },
                { id: 'lg', label: 'Confortável (17px)', desc: 'Maior acessibilidade, espaço e conforto aos olhos' },
              ].map((sizeOpt) => {
                const isSelected = baseFontSize === sizeOpt.id;
                return (
                  <button
                    key={sizeOpt.id}
                    type="button"
                    onClick={() => setBaseFontSize(sizeOpt.id as SiteBaseFontSize)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-red-600 bg-red-50/20 shadow-2xs'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">
                        {sizeOpt.label}
                      </span>
                      {isSelected && (
                        <span className="w-3.5 h-3.5 rounded-full bg-red-600 text-white flex items-center justify-center">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {sizeOpt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Simulação Tipográfica Completa ao Vivo */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                Demonstração Tipográfica em Tempo Real
              </span>

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                  Fonte: <strong className="text-slate-800">{FONT_DEFINITIONS[fontFamily]?.name}</strong>
                </span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                  Títulos:{' '}
                  <strong className="text-slate-800">
                    {headingFontFamily === 'same' ? 'Igual ao Site' : FONT_DEFINITIONS[headingFontFamily as SiteFontFamily]?.name}
                  </strong>
                </span>
              </div>
            </div>

            {/* Specimen Sheet */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  Economia & Política
                </span>
                <span>•</span>
                <span>15 de Setembro de 2026</span>
                <span>•</span>
                <span>4 min de leitura</span>
              </div>

              {/* Sample Headline */}
              <h4
                className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-tight"
                style={{
                  fontFamily:
                    headingFontFamily === 'same'
                      ? FONT_DEFINITIONS[fontFamily]?.cssFamily
                      : FONT_DEFINITIONS[headingFontFamily as SiteFontFamily]?.cssFamily,
                }}
              >
                Congresso e Governo Definem Nova Agenda de Investimentos e Sustentabilidade
              </h4>

              {/* Sample Subtitle / Lead */}
              <p
                className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed border-l-3 border-red-600 pl-3 py-0.5"
                style={{ fontFamily: FONT_DEFINITIONS[fontFamily]?.cssFamily }}
              >
                Especialistas debatem os efeitos imediatos para o mercado de trabalho, inflação e desenvolvimento das capitais brasileiras.
              </p>

              {/* Sample Article Body Paragraph */}
              <p
                className="text-xs sm:text-sm text-slate-700 leading-relaxed"
                style={{ fontFamily: FONT_DEFINITIONS[fontFamily]?.cssFamily }}
              >
                O compromisso primordial do jornalismo independente é garantir informação clara, ética e precisa. A tipografia escolhida influencia diretamente o ritmo de absorção das matérias, oferecendo ao leitor uma experiência fluida tanto em computadores quanto em dispositivos móveis.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Nome do Portal & Textos */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-red-600" />
              <span>Dados Gerais do Portal</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nome do Portal *
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Descrição Institucional (Aparece no Rodapé)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
        </div>

        {/* Section 3: Redes Sociais & Contato */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-600" />
              <span>Contatos & Redes Sociais</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                E-mail de Contato
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Telefone da Redação
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Endereço
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Social media inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Facebook URL</label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Instagram URL</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">WhatsApp Canal</label>
              <input
                type="url"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="https://whatsapp.com/channel/..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            Salvar Identidade Visual
          </button>
        </div>
      </form>
    </div>
  );
};
