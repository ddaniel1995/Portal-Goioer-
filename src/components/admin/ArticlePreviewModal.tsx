import React from 'react';
import { X, Calendar, Clock, Eye, Play } from 'lucide-react';
import { Article } from '../../types';
import { extractYoutubeId } from '../../services/storageService';

interface ArticlePreviewModalProps {
  article: Partial<Article>;
  onClose: () => void;
}

export const ArticlePreviewModal: React.FC<ArticlePreviewModalProps> = ({ article, onClose }) => {
  const youtubeId = extractYoutubeId(article.youtubeUrl);

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(article.publishedAt ? new Date(article.publishedAt) : new Date());

  return (
    <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Top Header of Preview */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-600 text-[11px] font-bold uppercase tracking-wider">
              Modo Pré-visualização
            </span>
            <span className="text-xs text-slate-400">Assim a matéria aparecerá no site público</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Preview Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
          {/* Category */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
              {article.categoryName || 'Geral'}
            </span>
            <span className="text-xs text-slate-400">Status: {article.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight font-serif">
            {article.title || 'Título da matéria'}
          </h1>

          {/* Subtitle */}
          {article.subtitle && (
            <p className="text-base sm:text-lg text-slate-600 border-l-4 border-red-600 pl-4 py-1 leading-relaxed">
              {article.subtitle}
            </p>
          )}

          {/* Author & Meta */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2 font-medium text-slate-700">
              <span>Por {article.author || 'Redação'}</span>
              <span>•</span>
              <span>{article.authorRole || 'Redator'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={article.featuredImage}
                alt={article.title || 'Imagem de destaque'}
                className="w-full h-auto max-h-[440px] object-cover object-center"
              />
              {article.imageCaption && (
                <p className="p-3 text-xs text-slate-500 bg-slate-50 border-t border-slate-100 italic">
                  {article.imageCaption}
                </p>
              )}
            </div>
          )}

          {/* Video Preview */}
          {youtubeId && (
            <div className="rounded-xl overflow-hidden bg-slate-950 p-3 border border-slate-800">
              <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5 font-bold">
                <Play className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                Vídeo Incorporado (YouTube)
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                  title="Vídeo pré-visualização"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {/* Rich Content Preview */}
          <div
            className="text-slate-800 leading-relaxed space-y-4 pt-4 border-t border-slate-100 text-base"
            dangerouslySetInnerHTML={{ __html: article.content || '<p>Nenhum conteúdo inserido ainda.</p>' }}
          />

          {/* Additional Images Preview */}
          {article.additionalImages && article.additionalImages.length > 0 && (
            <div className="pt-6 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Imagens Adicionais:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {article.additionalImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-28 object-cover rounded-lg border border-slate-200"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Fechar Pré-visualização
          </button>
        </div>
      </div>
    </div>
  );
};
