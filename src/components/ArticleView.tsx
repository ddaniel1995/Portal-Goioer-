import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  Facebook, 
  Twitter, 
  Link as LinkIcon, 
  Check, 
  ChevronRight, 
  ArrowLeft,
  Eye,
  Type,
  Maximize2,
  Heart,
  ExternalLink
} from 'lucide-react';
import { Article, Category, Banner } from '../types';
import { extractYoutubeId, storageService } from '../services/storageService';
import { ArticleCard } from './ArticleCard';
import { SidebarBanners } from './SidebarBanners';

interface ArticleViewProps {
  article: Article;
  allArticles: Article[];
  categories: Category[];
  banners: Banner[];
  onSelectArticle: (id: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onGoHome: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  allArticles,
  categories,
  banners,
  onSelectArticle,
  onSelectCategory,
  onGoHome,
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  // Increment view counter once on load
  useEffect(() => {
    storageService.incrementArticleViews(article.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  // Extract YouTube ID
  const youtubeId = extractYoutubeId(article.youtubeUrl);

  // Format date and time in Portuguese
  const publishDate = new Date(article.publishedAt);
  const dateFormatted = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(publishDate);

  const timeFormatted = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(publishDate);

  // Sharing links
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = encodeURIComponent(article.title);
  const shareUrl = encodeURIComponent(currentUrl);

  const shareWhatsApp = `https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`;
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  const shareTwitter = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`;
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Related articles from same category or latest
  const relatedArticles = allArticles
    .filter(a => a.id !== article.id && (a.categoryId === article.categoryId || a.status === 'published'))
    .slice(0, 3);

  // Select one random supporter banner to display inside the article content
  const randomSupporterBanner = useMemo(() => {
    const activeSupporters = (banners || []).filter(b => b.active);
    if (activeSupporters.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * activeSupporters.length);
    return activeSupporters[randomIndex];
  }, [article.id, banners]);

  // Split content cleanly to position the supporter banner midway inside the article
  const contentParts = useMemo(() => {
    if (!article.content) return { before: '', after: '' };
    const pMatches = article.content.split(/<\/p>/i);
    if (pMatches.length >= 3) {
      const midPoint = Math.ceil(pMatches.length / 2);
      const before = pMatches.slice(0, midPoint).join('</p>') + '</p>';
      const after = pMatches.slice(midPoint).join('</p>');
      return { before, after };
    }
    return { before: article.content, after: '' };
  }, [article.content]);

  const fontClasses = {
    normal: 'text-base md:text-lg leading-relaxed',
    large: 'text-lg md:text-xl leading-relaxed',
    xlarge: 'text-xl md:text-2xl leading-relaxed',
  }[fontSize];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap" aria-label="Navegação estrutural">
        <Link to="/" onClick={onGoHome} className="hover:text-red-600 font-medium cursor-pointer">Início</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link 
          to={`/noticias/${article.categorySlug || article.categoryId}`} 
          onClick={() => onSelectCategory(article.categoryId)} 
          className="hover:text-red-600 font-medium text-slate-700 cursor-pointer"
        >
          {article.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-400 truncate max-w-xs sm:max-w-md">{article.title}</span>
      </nav>

      {/* Main Grid: Content Column (left/center) + Sidebar Column (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <div className="lg:col-span-8">
          <article className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-8 md:p-10 shadow-xs">
            {/* Category Tag & Top Meta */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <Link
                to={`/noticias/${article.categorySlug || article.categoryId}`}
                onClick={() => onSelectCategory(article.categoryId)}
                className="px-3 py-1 rounded-md bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-xs cursor-pointer inline-block"
              >
                {article.categoryName}
              </Link>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{article.views + 1} visualizações</span>
                </span>
                {article.facebookPublished && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium text-[11px]">
                    <Facebook className="w-3 h-3 fill-blue-600 text-blue-600" />
                    Publicado no Facebook
                  </span>
                )}
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight font-serif">
              {article.title}
            </h1>

            {/* Subtitle / Resumo */}
            {article.subtitle && (
              <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed font-normal border-l-4 border-red-600 pl-4 py-0.5">
                {article.subtitle}
              </p>
            )}

            {/* Author & Publication Time Meta */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">Por {article.author}</h4>
                <p className="text-xs text-slate-500">{article.authorRole || 'Redação'}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{dateFormatted} às {timeFormatted}</span>
              </div>
            </div>

            {/* Reading Accessibility & Social Sharing Toolbar */}
            <div className="mt-6 py-3 px-4 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
              {/* Text Size Control */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Type className="w-4 h-4 text-slate-500" />
                <span>Tamanho do texto:</span>
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`px-2 py-1 rounded text-xs ${fontSize === 'normal' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-2 py-1 rounded text-xs ${fontSize === 'large' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('xlarge')}
                    className={`px-2 py-1 rounded text-xs ${fontSize === 'xlarge' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    A++
                  </button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Compartilhar:</span>
                
                {/* WhatsApp */}
                <a
                  href={shareWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Compartilhar no WhatsApp"
                  className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-xs"
                >
                  <Share2 className="w-4 h-4" />
                </a>

                {/* Facebook */}
                <a
                  href={shareFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Compartilhar no Facebook"
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                </a>

                {/* Twitter / X */}
                <a
                  href={shareTwitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Compartilhar no X"
                  className="p-2 rounded-lg bg-black hover:bg-slate-800 text-white transition-colors shadow-xs"
                >
                  <Twitter className="w-4 h-4 fill-current" />
                </a>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  aria-label="Copiar link"
                  className="relative p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkIcon className="w-4 h-4" />}
                  {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap animate-bounce">
                      Link copiado!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mt-6 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-auto max-h-[520px] object-cover object-center"
              />
              {article.imageCaption && (
                <p className="p-3 text-xs text-slate-500 bg-slate-50 border-t border-slate-100 italic">
                  {article.imageCaption}
                </p>
              )}
            </div>

            {/* YouTube Player Section (when youtubeUrl is provided) */}
            {youtubeId && (
              <div className="mt-8 rounded-xl overflow-hidden bg-slate-950 p-2 sm:p-3 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-300 px-2 pb-2">
                  <span className="font-bold flex items-center gap-1.5 text-red-500">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    Vídeo Oficial da Matéria
                  </span>
                  <span className="text-[11px] text-slate-400">Reprodutor Incorporado YouTube</span>
                </div>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                    title={article.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            )}

            {/* Full Article Content with Injected Supporter Banner */}
            {contentParts.after ? (
              <>
                <div 
                  className={`mt-8 text-slate-800 article-content ${fontClasses} space-y-4`}
                  dangerouslySetInnerHTML={{ __html: contentParts.before }}
                />

                {/* Random In-Article Supporter Banner */}
                {randomSupporterBanner && (
                  <div className="my-8 p-3.5 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200/70">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>{randomSupporterBanner.badgeText || (randomSupporterBanner.type === 'art' ? 'Arte & Cultura' : 'Apoiador Oficial')}</span>
                      </span>
                      {randomSupporterBanner.targetUrl && (
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Publicidade & Apoio</span>
                      )}
                    </div>

                    <div 
                      onClick={() => {
                        storageService.recordBannerClick(randomSupporterBanner.id);
                        if (randomSupporterBanner.targetUrl) {
                          window.open(randomSupporterBanner.targetUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className={`group block overflow-hidden rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all ${
                        randomSupporterBanner.targetUrl ? 'cursor-pointer hover:shadow-md' : ''
                      }`}
                    >
                      <div className="w-full bg-slate-50 flex items-center justify-center p-2">
                        <img
                          src={randomSupporterBanner.imageUrl}
                          alt={randomSupporterBanner.title}
                          className="w-full h-auto max-h-[260px] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                          loading="lazy"
                        />
                      </div>
                      {randomSupporterBanner.showText !== false && (randomSupporterBanner.title || randomSupporterBanner.description) && (
                        <div className="p-3.5 bg-white border-t border-slate-100">
                          {randomSupporterBanner.title && (
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                              {randomSupporterBanner.title}
                            </h4>
                          )}
                          {randomSupporterBanner.description && (
                            <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {randomSupporterBanner.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div 
                  className={`mt-4 text-slate-800 article-content ${fontClasses} space-y-4`}
                  dangerouslySetInnerHTML={{ __html: contentParts.after }}
                />
              </>
            ) : (
              <>
                <div 
                  className={`mt-8 text-slate-800 article-content ${fontClasses} space-y-4`}
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Random In-Article Supporter Banner */}
                {randomSupporterBanner && (
                  <div className="my-8 p-3.5 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200/70">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>{randomSupporterBanner.badgeText || (randomSupporterBanner.type === 'art' ? 'Arte & Cultura' : 'Apoiador Oficial')}</span>
                      </span>
                      {randomSupporterBanner.targetUrl && (
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Publicidade & Apoio</span>
                      )}
                    </div>

                    <div 
                      onClick={() => {
                        storageService.recordBannerClick(randomSupporterBanner.id);
                        if (randomSupporterBanner.targetUrl) {
                          window.open(randomSupporterBanner.targetUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className={`group block overflow-hidden rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all ${
                        randomSupporterBanner.targetUrl ? 'cursor-pointer hover:shadow-md' : ''
                      }`}
                    >
                      <div className="w-full bg-slate-50 flex items-center justify-center p-2">
                        <img
                          src={randomSupporterBanner.imageUrl}
                          alt={randomSupporterBanner.title}
                          className="w-full h-auto max-h-[260px] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                          loading="lazy"
                        />
                      </div>
                      {randomSupporterBanner.showText !== false && (randomSupporterBanner.title || randomSupporterBanner.description) && (
                        <div className="p-3.5 bg-white border-t border-slate-100">
                          {randomSupporterBanner.title && (
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                              {randomSupporterBanner.title}
                            </h4>
                          )}
                          {randomSupporterBanner.description && (
                            <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {randomSupporterBanner.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Additional Images Gallery */}
            {article.additionalImages && article.additionalImages.length > 0 && (
              <div className="mt-10 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span>Galeria de Imagens</span>
                  <span className="text-xs font-normal text-slate-500">({article.additionalImages.length} fotos)</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {article.additionalImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedGalleryImage(imgUrl)}
                      className="group relative rounded-xl overflow-hidden bg-slate-100 cursor-pointer aspect-16/10 border border-slate-200 hover:shadow-md transition-all"
                    >
                      <img
                        src={imgUrl}
                        alt={`Imagem adicional ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 className="w-6 h-6" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Share & Back Bar */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={onGoHome}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para a página inicial</span>
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold">Gostou da matéria? Compartilhe:</span>
                <a
                  href={shareWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-md bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </article>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <section className="mt-10" aria-label="Notícias Relacionadas">
              <div className="flex items-center justify-between border-b-2 border-red-600 pb-2 mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Notícias Relacionadas
                </h2>
                <button
                  type="button"
                  onClick={() => onSelectCategory(article.categoryId)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  Ver mais de {article.categoryName}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedArticles.map((item) => (
                  <ArticleCard
                    key={item.id}
                    article={item}
                    onSelect={onSelectArticle}
                    variant="standard"
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Column: Ad Banners and Extra Content */}
        <div className="lg:col-span-4 space-y-8">
          <SidebarBanners banners={banners} />
        </div>
      </div>

      {/* Lightbox modal for gallery images */}
      {selectedGalleryImage && (
        <div 
          onClick={() => setSelectedGalleryImage(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedGalleryImage}
              alt="Ampliação da imagem"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-center text-white text-xs mt-3 opacity-80">Clique em qualquer lugar para fechar</p>
          </div>
        </div>
      )}
    </div>
  );
};
