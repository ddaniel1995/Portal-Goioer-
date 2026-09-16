import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Check, 
  AlertCircle, 
  Image as ImageIcon, 
  ExternalLink, 
  Eye, 
  Trash2, 
  Sparkles, 
  Layers, 
  Info,
  Clock,
  Link as LinkIcon
} from 'lucide-react';
import { SitePopup } from '../../types';
import { storageService } from '../../services/storageService';
import { SitePopupModal } from '../SitePopupModal';

interface AdminPopupProps {
  onRefresh?: () => void;
}

export const AdminPopup: React.FC<AdminPopupProps> = ({ onRefresh }) => {
  const [popup, setPopup] = useState<SitePopup>(storageService.getSitePopup());
  const [active, setActive] = useState<boolean>(popup.active);
  const [imageUrl, setImageUrl] = useState<string>(popup.imageUrl || '');
  const [title, setTitle] = useState<string>(popup.title || '');
  const [subtitle, setSubtitle] = useState<string>(popup.subtitle || '');
  const [targetUrl, setTargetUrl] = useState<string>(popup.targetUrl || '');
  const [buttonText, setButtonText] = useState<string>(popup.buttonText || 'Saiba Mais');
  const [showOnHomeOnly, setShowOnHomeOnly] = useState<boolean>(popup.showOnHomeOnly !== false);
  const [frequency, setFrequency] = useState<'always' | 'once_per_session' | 'once_per_day'>(
    popup.frequency || 'once_per_session'
  );

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler (Base64 conversion)
  const handleFileProcess = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP ou GIF).' });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'O arquivo é muito grande. A imagem deve ter até 8MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setMessage({ type: 'success', text: 'Imagem anexada com sucesso! Não esqueça de salvar as alterações.' });
        setTimeout(() => setMessage(null), 3000);
      }
    };
    reader.onerror = () => {
      setMessage({ type: 'error', text: 'Erro ao processar o arquivo de imagem.' });
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (active && !imageUrl.trim()) {
      setMessage({ 
        type: 'error', 
        text: 'Para ativar o PopUp no site, você precisa anexar uma imagem.' 
      });
      return;
    }

    const updated: SitePopup = {
      ...popup,
      active,
      imageUrl: imageUrl.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      targetUrl: targetUrl.trim(),
      buttonText: buttonText.trim() || 'Saiba Mais',
      showOnHomeOnly,
      frequency,
    };

    const saved = storageService.saveSitePopup(updated);
    setPopup(saved);
    setMessage({ type: 'success', text: 'Configurações do PopUp salvas e publicadas com sucesso!' });
    if (onRefresh) onRefresh();
    setTimeout(() => setMessage(null), 3500);
  };

  const currentPreviewData: SitePopup = {
    ...popup,
    active,
    imageUrl: imageUrl.trim(),
    title: title.trim(),
    subtitle: subtitle.trim(),
    targetUrl: targetUrl.trim(),
    buttonText: buttonText.trim() || 'Saiba Mais',
    showOnHomeOnly,
    frequency,
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-red-600" />
            <span>PopUp de Entrada & Imagem de Destaque</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Anexe uma imagem para ser exibida em formato de PopUp (janela modal) aos visitantes do portal ao acessarem o site.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {imageUrl && (
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Testar PopUp Agora</span>
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Status & Visibilidade */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Status do PopUp no Portal
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Quando ativado, os visitantes verão a imagem anexada ao carregar a página.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActive(!active)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                active ? 'bg-red-600' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={active}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  active ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              active ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-500'
            }`}>
              {active ? '● Ativo no Site' : '○ Desativado'}
            </span>
          </div>
        </div>

        {/* Card 2: Anexar Imagem */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-red-600" />
              <span>Anexar Imagem para o PopUp</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Faça upload do arquivo de imagem do seu computador ou informe o link direto de uma imagem na web.
            </p>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging 
                ? 'border-red-600 bg-red-50/50 scale-[1.01]' 
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/70 hover:bg-slate-50'
            }`}
          >
            <div className="max-w-md mx-auto flex flex-col items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-slate-200 text-red-600">
                <Upload className="w-7 h-7" />
              </div>

              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  Clique para anexar ou arraste a imagem até aqui
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Formatos aceitos: PNG, JPG, JPEG, WebP, GIF ou SVG (até 8MB).
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Selecionar Arquivo no Computador
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Alternative: Direct URL input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Ou informe a URL direta da imagem:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/minha-imagem-popup.png"
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
              />
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="p-2.5 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  title="Remover imagem anexada"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Live Preview Box if image exists */}
          {imageUrl && (
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Imagem Anexada (Pré-visualização)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver PopUp Completo</span>
                </button>
              </div>

              <div className="max-h-64 overflow-hidden rounded-lg bg-black/40 border border-slate-800 flex items-center justify-center p-2">
                <img
                  src={imageUrl}
                  alt="Prévia da imagem anexada"
                  className="max-h-60 max-w-full object-contain rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Opções Adicionais & Link */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-red-600" />
              <span>Configurações Opcionais & Link de Destino</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalize o comportamento ao clicar na imagem, textos de apoio e frequência de exibição.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Título opcional */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Título do PopUp (Opcional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Comunicado Especial / Promoção Exclusiva"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
              />
            </div>

            {/* Link de Destino */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Link ao Clicar na Imagem (Opcional)
              </label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://exemplo.com/evento-ou-noticia"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
              />
            </div>

            {/* Subtítulo / Descrição curta */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Subtítulo ou Texto Curto (Opcional)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ex: Clique na imagem para conferir as informações completas no nosso site."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
              />
            </div>

            {/* Texto do Botão */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Texto do Botão de Ação
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Saiba Mais"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
              />
            </div>

            {/* Frequência de exibição */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Frequência de Exibição
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
              >
                <option value="once_per_session">1 vez por sessão (Recomendado - não incomoda)</option>
                <option value="always">Sempre que abrir o site (Avisos imediatos ou testes)</option>
                <option value="once_per_day">1 vez por dia por visitante</option>
              </select>
            </div>

            {/* Exibir apenas na Home */}
            <div className="md:col-span-2 flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Exibir apenas na Página Inicial (Home)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Quando ativo, o PopUp abre somente na Home. Desative para exibir em qualquer página aberta.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showOnHomeOnly}
                onChange={(e) => setShowOnHomeOnly(e.target.checked)}
                className="w-5 h-5 accent-red-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit & Save Footer */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">
            {active ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> PopUp configurado para exibição ativa
              </span>
            ) : (
              <span>O PopUp está atualmente desativado.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {imageUrl && (
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Visualizar</span>
              </button>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Alterações do PopUp</span>
            </button>
          </div>
        </div>
      </form>

      {/* Test Modal in Live Preview Mode */}
      {isPreviewOpen && (
        <SitePopupModal
          popup={currentPreviewData}
          previewMode={true}
          onClose={() => setIsPreviewOpen(false)}
          isHomePage={true}
        />
      )}
    </div>
  );
};
