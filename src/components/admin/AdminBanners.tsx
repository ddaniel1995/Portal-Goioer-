import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  ExternalLink, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  SlidersHorizontal,
  Layers,
  ArrowUp,
  ArrowDown,
  Heart,
  Palette,
  Handshake,
  Sparkles
} from 'lucide-react';
import { Banner, BannerPosition, BannerType } from '../../types';
import { storageService } from '../../services/storageService';

interface AdminBannersProps {
  banners: Banner[];
  onRefresh: () => void;
  initialFormOpen?: boolean;
  initialPosition?: BannerPosition;
  onClearInitialFormOpen?: () => void;
}

export const AdminBanners: React.FC<AdminBannersProps> = ({ 
  banners, 
  onRefresh,
  initialFormOpen,
  initialPosition,
  onClearInitialFormOpen,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [position, setPosition] = useState<BannerPosition>('slideshow');
  const [type, setType] = useState<BannerType>('commercial');
  const [badgeText, setBadgeText] = useState('');
  const [active, setActive] = useState(true);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Automatically detect dimensions from image URL or file data
  const detectImageDimensions = (url: string) => {
    if (!url) return;
    const img = new Image();
    img.onload = () => {
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.src = url;
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    detectImageDimensions(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 6 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 6MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        detectImageDimensions(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setTargetUrl('');
    setPosition('slideshow');
    setType('commercial');
    setBadgeText('');
    setActive(true);
    setWidth(undefined);
    setHeight(undefined);
    setIsFormOpen(false);
  };

  const handleStartNew = (targetPosition: BannerPosition = 'slideshow', targetType?: BannerType) => {
    resetForm();
    setPosition(targetPosition);
    const chosenType = targetType || (targetPosition === 'sidebar' ? 'supporter' : 'commercial');
    setType(chosenType);
    if (targetPosition === 'sidebar') {
      if (chosenType === 'supporter') setBadgeText('Apoiador Cultural');
      else if (chosenType === 'art') setBadgeText('Arte & Cultura');
      else if (chosenType === 'partner') setBadgeText('Parceiro Oficial');
      else setBadgeText('Publicidade');
    } else {
      setBadgeText('');
    }
    setIsFormOpen(true);
    setTimeout(() => {
      document.getElementById('banner-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const handleStartEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setTitle(banner.title);
    setDescription(banner.description || '');
    setImageUrl(banner.imageUrl);
    setTargetUrl(banner.targetUrl || '');
    setPosition(banner.position);
    setType(banner.type || 'commercial');
    setBadgeText(banner.badgeText || '');
    setActive(banner.active);
    setWidth(banner.width);
    setHeight(banner.height);
    setIsFormOpen(true);
    setTimeout(() => {
      document.getElementById('banner-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  // Open form immediately if requested from dashboard or other tab
  useEffect(() => {
    if (initialFormOpen) {
      handleStartNew(initialPosition || 'slideshow', initialPosition === 'sidebar' ? 'supporter' : 'commercial');
      onClearInitialFormOpen?.();
    }
  }, [initialFormOpen, initialPosition]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'O título do banner é obrigatório.' });
      return;
    }
    if (!imageUrl.trim()) {
      setMessage({ type: 'error', text: 'A imagem do banner é obrigatória.' });
      return;
    }

    const posBanners = banners.filter(b => b.position === position);

    storageService.saveBanner({
      id: editingId || undefined,
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      targetUrl: targetUrl.trim(),
      position,
      type: position === 'sidebar' ? type : undefined,
      badgeText: position === 'sidebar' && badgeText.trim() ? badgeText.trim() : undefined,
      active,
      width,
      height,
      aspectRatio: width && height ? `${width}/${height}` : undefined,
      order: editingId ? (banners.find(b => b.id === editingId)?.order || posBanners.length) : posBanners.length + 1
    });

    setMessage({ 
      type: 'success', 
      text: editingId ? 'Banner atualizado com sucesso!' : 'Novo banner cadastrado com sucesso!' 
    });
    resetForm();
    onRefresh();
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggleActive = (banner: Banner) => {
    storageService.saveBanner({
      ...banner,
      active: !banner.active
    });
    onRefresh();
  };

  const handleDelete = (banner: Banner) => {
    if (window.confirm(`Deseja excluir o banner "${banner.title}"?`)) {
      storageService.deleteBanner(banner.id);
      onRefresh();
      if (editingId === banner.id) resetForm();
    }
  };

  const slideshowBanners = banners.filter(b => b.position === 'slideshow').sort((a, b) => a.order - b.order);
  const bodySlideshowBanners = banners.filter(b => b.position === 'body_slideshow').sort((a, b) => a.order - b.order);
  const sidebarBanners = banners.filter(b => b.position === 'sidebar').sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Gerenciamento de Banners
          </h2>
          <p className="text-xs text-slate-500">
            Cadastre anúncios para o slideshow do topo, carrossel no corpo do site (abaixo das categorias) ou barra lateral de apoiadores/artes.
          </p>
        </div>

        {!isFormOpen ? (
          <div className="flex flex-wrap items-center gap-2 self-start">
            <button
              onClick={() => handleStartNew('slideshow', 'commercial')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Adicionar Banner</span>
            </button>
            <button
              onClick={() => handleStartNew('body_slideshow', 'commercial')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Carrossel do Corpo</span>
            </button>
            <button
              onClick={() => handleStartNew('sidebar', 'supporter')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              <span>Apoiador / Lateral</span>
            </button>
          </div>
        ) : (
          <button
            onClick={resetForm}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer self-start"
          >
            ✕ Fechar Formulário
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form Drawer / Box */}
      {isFormOpen && (
        <div id="banner-form-container" className="bg-white rounded-2xl border-2 border-red-500/40 p-6 sm:p-8 shadow-xl animate-fadeIn scroll-mt-24">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? 'Editar Banner' : 'Cadastrar Novo Banner ou Apoiador'}
              </h3>
              <p className="text-xs text-slate-500">
                {position === 'sidebar' ? 'Configurando banner lateral (Apoiador, Arte, Patrocínio)' : 'Configurando banner do carrossel principal do topo'}
              </p>
            </div>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-700 text-xs font-bold">
              Fechar
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Título / Nome do Apoiador ou Anúncio *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Fundação Cultural, Galeria de Arte, Loja..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Posição no Site *
                </label>
                <select
                  value={position}
                  onChange={(e) => {
                    const pos = e.target.value as BannerPosition;
                    setPosition(pos);
                    if (pos === 'sidebar' && !badgeText) {
                      setBadgeText(type === 'art' ? 'Arte & Cultura' : 'Apoiador Cultural');
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600"
                >
                  <option value="slideshow">Slideshow Principal (Topo da Home)</option>
                  <option value="body_slideshow">Carrossel do Corpo (Abaixo das Categorias de Matérias)</option>
                  <option value="sidebar">Barra Lateral (Apoiadores, Artes, Patrocinadores)</option>
                </select>
              </div>
            </div>

            {/* If Position is Sidebar: Type Selector & Badge */}
            {position === 'sidebar' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Categoria do Banner Lateral
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">Define o selo e estilo de apresentação</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setType('supporter');
                      if (!badgeText || badgeText === 'Arte & Cultura' || badgeText === 'Parceiro Oficial' || badgeText === 'Publicidade') {
                        setBadgeText('Apoiador Cultural');
                      }
                    }}
                    className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all ${
                      type === 'supporter'
                        ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-xs ring-2 ring-rose-300'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className="w-5 h-5 text-rose-500" />
                    <span>Apoiador</span>
                    <span className="text-[10px] text-rose-600 font-normal">Cultura & causas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setType('art');
                      if (!badgeText || badgeText === 'Apoiador Cultural' || badgeText === 'Parceiro Oficial' || badgeText === 'Publicidade') {
                        setBadgeText('Arte & Cultura');
                      }
                    }}
                    className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all ${
                      type === 'art'
                        ? 'bg-purple-50 border-purple-400 text-purple-800 shadow-xs ring-2 ring-purple-300'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Palette className="w-5 h-5 text-purple-500" />
                    <span>Arte / Mostra</span>
                    <span className="text-[10px] text-purple-600 font-normal">Obras & eventos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setType('partner');
                      if (!badgeText || badgeText === 'Apoiador Cultural' || badgeText === 'Arte & Cultura' || badgeText === 'Publicidade') {
                        setBadgeText('Parceiro Oficial');
                      }
                    }}
                    className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all ${
                      type === 'partner'
                        ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-xs ring-2 ring-blue-300'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Handshake className="w-5 h-5 text-blue-500" />
                    <span>Parceiro</span>
                    <span className="text-[10px] text-blue-600 font-normal">Institucional</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setType('commercial');
                      if (!badgeText || badgeText === 'Apoiador Cultural' || badgeText === 'Arte & Cultura' || badgeText === 'Parceiro Oficial') {
                        setBadgeText('Publicidade');
                      }
                    }}
                    className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all ${
                      type === 'commercial'
                        ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs ring-2 ring-amber-300'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Comercial</span>
                    <span className="text-[10px] text-amber-600 font-normal">Anúncios & marcas</span>
                  </button>
                </div>

                {/* Badge text input with suggestion chips */}
                <div className="pt-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Texto do Selo / Badge (Exibido acima do banner)
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="Ex: Apoiador Cultural, Arte da Semana, Patrocinador Oficial..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-400 font-semibold self-center mr-1">Sugestões rápidas:</span>
                    {['Apoiador Cultural', 'Arte & Cultura', 'Mostra Artística', 'Parceiro Oficial', 'Apoio Institucional', 'Patrocínio'].map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setBadgeText(sug)}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-colors cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Descrição Curta (Opcional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve texto institucional, chamada da mostra artística ou promoção..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Image URL & File Upload with dimension detector */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Imagem do Banner *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder="Link da imagem (HTTPS) ou faça upload..."
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {width && height && (
                    <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center justify-between">
                      <span>Dimensões detectadas: <strong>{width} x {height} px</strong></span>
                      <span>Proporção: <strong>{(width / height).toFixed(2)}:1</strong></span>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 mt-2">
                    O sistema adapta a imagem ao espaço disponível preservando a proporção natural sem distorções.
                  </p>
                </div>

                {imageUrl && (
                  <div className="relative rounded-lg overflow-hidden border border-slate-300 bg-slate-100 flex items-center justify-center max-h-48 p-2">
                    <img
                      src={imageUrl}
                      alt="Prévia do banner"
                      className="max-h-40 w-auto object-contain rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Target URL & Active Switch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Link de Destino (Opcional)
                </label>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://exemplo.com.br/anuncio"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Status de Visibilidade no Site
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActive(true)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      active
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visível (Ativo)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActive(false)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      !active
                        ? 'bg-rose-500 text-white border-rose-600 shadow-sm ring-2 ring-rose-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Desativado (Oculto)</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {active ? 'Este banner será exibido aos visitantes do portal.' : 'Banner salvo, mas oculto no site até ser reativado.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                {editingId ? 'Atualizar Banner' : 'Salvar Banner'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banner Sections: Slideshow Topo, Carrossel do Corpo, & Sidebar */}
      <div className="space-y-6">
        {/* Slideshow Banners (Topo) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-red-600" />
                <span>Banners do Slideshow Principal - Topo ({slideshowBanners.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Exibidos no topo da página inicial em carrossel rotativo.</p>
            </div>

            <button
              onClick={() => handleStartNew('slideshow', 'commercial')}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Adicionar Banner de Topo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slideshowBanners.map((banner) => (
              <div
                key={banner.id}
                className={`rounded-xl border overflow-hidden transition-all ${
                  banner.active ? 'border-slate-200 bg-white shadow-xs' : 'border-rose-200 bg-rose-50/20 opacity-80'
                }`}
              >
                <div className="relative aspect-21/9 bg-slate-900 overflow-hidden">
                  <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                    Ordem {banner.order}
                  </span>
                </div>

                <div className="p-3.5">
                  {/* Dedicated Prominent Active/Inactive Button */}
                  <div className="mb-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(banner)}
                      className={`w-full py-1 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        banner.active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                      }`}
                      title="Clique para alternar visibilidade deste banner no site"
                    >
                      {banner.active ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Visível no Site (Clique p/ desativar)</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                          <span>Desativado (Clique p/ ativar)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 truncate">{banner.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{banner.description || 'Sem descrição'}</p>
                  
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{banner.clicks} cliques</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(banner)}
                        className="p-1 text-slate-500 hover:text-slate-900 rounded"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Body Slideshow Banners (Abaixo das Categorias) */}
        <div className="bg-white p-6 rounded-2xl border border-blue-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Banners Slideshow no Corpo do Site - Abaixo das Categorias ({bodySlideshowBanners.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Exibidos em formato carrossel rotativo no corpo da página inicial, logo abaixo dos blocos de categorias de matérias.
              </p>
            </div>

            <button
              onClick={() => handleStartNew('body_slideshow', 'commercial')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Adicionar Banner no Corpo</span>
            </button>
          </div>

          {bodySlideshowBanners.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
              Nenhum banner cadastrado para o corpo do site ainda. Clique no botão acima para adicionar.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bodySlideshowBanners.map((banner) => (
                <div
                  key={banner.id}
                  className={`rounded-xl border overflow-hidden transition-all ${
                    banner.active ? 'border-blue-200 bg-white shadow-xs' : 'border-rose-200 bg-rose-50/20 opacity-80'
                  }`}
                >
                  <div className="relative aspect-21/9 bg-slate-900 overflow-hidden">
                    <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                      Ordem #{banner.order}
                    </span>
                  </div>

                  <div className="p-3.5">
                    {/* Dedicated Prominent Active/Inactive Button */}
                    <div className="mb-2">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(banner)}
                        className={`w-full py-1 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          banner.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                        }`}
                        title="Clique para alternar visibilidade deste banner no site"
                      >
                        {banner.active ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Visível no Site (Clique p/ desativar)</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                            <span>Desativado (Clique p/ ativar)</span>
                          </>
                        )}
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 truncate">{banner.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{banner.description || 'Sem descrição'}</p>
                    
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{banner.clicks} cliques</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(banner)}
                          className="p-1 text-slate-500 hover:text-slate-900 rounded"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(banner)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Banners */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-600" />
                <span>Banners Laterais (Apoiadores, Artes & Publicidade) ({sidebarBanners.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Exibidos na barra lateral de matérias e adaptados com selos especiais de apoiador/arte</p>
            </div>

            <button
              onClick={() => handleStartNew('sidebar', 'supporter')}
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>+ Adicionar Apoiador ou Arte</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sidebarBanners.map((banner) => (
              <div
                key={banner.id}
                className={`rounded-xl border overflow-hidden transition-all ${
                  banner.active ? 'border-slate-200 bg-white shadow-xs' : 'border-rose-200 bg-rose-50/20 opacity-80'
                }`}
              >
                <div className="relative h-44 bg-slate-100 flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={banner.imageUrl}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
                      #{banner.order}
                    </span>
                    {banner.type === 'art' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-600/90 text-white flex items-center gap-1 backdrop-blur-xs">
                        <Palette className="w-2.5 h-2.5" /> Arte
                      </span>
                    ) : banner.type === 'supporter' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600/90 text-white flex items-center gap-1 backdrop-blur-xs">
                        <Heart className="w-2.5 h-2.5" /> Apoiador
                      </span>
                    ) : banner.type === 'partner' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600/90 text-white flex items-center gap-1 backdrop-blur-xs">
                        <Handshake className="w-2.5 h-2.5" /> Parceiro
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600/90 text-white flex items-center gap-1 backdrop-blur-xs">
                        <Sparkles className="w-2.5 h-2.5" /> Anúncio
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3.5">
                  {/* Dedicated Prominent Active/Inactive Button */}
                  <div className="mb-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(banner)}
                      className={`w-full py-1 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        banner.active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                      }`}
                      title="Clique para alternar visibilidade deste banner no site"
                    >
                      {banner.active ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Visível no Site (Clique p/ desativar)</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                          <span>Desativado (Clique p/ ativar)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {banner.badgeText || (banner.type === 'art' ? 'Arte & Cultura' : banner.type === 'supporter' ? 'Apoiador' : 'Publicidade')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{banner.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{banner.description || 'Sem descrição'}</p>
                  
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{banner.clicks} cliques</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(banner)}
                        className="p-1 text-slate-500 hover:text-slate-900 rounded"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
