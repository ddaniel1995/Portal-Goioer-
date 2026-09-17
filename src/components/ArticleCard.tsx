import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Play, ArrowRight, BookOpen } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onSelect?: (articleIdOrSlug: string) => void;
  variant?: 'standard' | 'featured' | 'compact' | 'horizontal';
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  variant = 'standard',
  featured = false,
}) => {
  const navigate = useNavigate();
  const effectiveVariant = featured ? 'featured' : variant;

  // Format date in PT-BR (day + short month)
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(article.publishedAt));

  // Calculate estimated reading time
  const words = (article.content || '').trim().split(/\s+/).length;
  const readMinutes = Math.max(1, Math.ceil(words / 170));

  const hasVideo = Boolean(article.youtubeUrl);
  const targetId = article.slug || article.id;
  const articleUrl = article.categorySlug
    ? `/noticias/${article.categorySlug}/${targetId}`
    : `/noticias/${targetId}`;

  const handleClick = () => {
    if (onSelect) onSelect(targetId);
    navigate(articleUrl);
  };

  // 1. COMPACT ROW / HORIZONTAL VARIANT (Space-saving, modern)
  if (effectiveVariant === 'horizontal' || effectiveVariant === 'compact') {
    return (
      <article
        onClick={handleClick}
        className="group bg-white rounded-xl border border-slate-200/80 hover:border-red-300 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex gap-3.5 p-3 items-center"
      >
        <div className="relative w-24 sm:w-28 h-20 sm:h-22 shrink-0 rounded-lg overflow-hidden bg-slate-100">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {hasVideo && (
            <div className="absolute bottom-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-xs">
              <Play className="w-2.5 h-2.5 fill-current" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
            <span className="font-bold text-red-600 uppercase tracking-wider">
              {article.categoryName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-slate-400">
              <Clock className="w-2.5 h-2.5" />
              {formattedDate}
            </span>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>

          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate max-w-[130px] font-medium text-slate-500">
              Por {article.author}
            </span>
            <span className="text-red-600 font-semibold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Ler
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  // 2. REFINED FEATURED VARIANT (Modern split card, compact footprint instead of huge banner)
  if (effectiveVariant === 'featured') {
    return (
      <article
        onClick={handleClick}
        className="group bg-white rounded-2xl border border-slate-200/90 hover:border-red-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col md:flex-row gap-0"
      >
        {/* Left / Top Image - Controlled compact proportion */}
        <div className="relative w-full md:w-5/12 aspect-16/10 md:aspect-auto md:min-h-[220px] overflow-hidden bg-slate-900 shrink-0">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 md:from-transparent to-transparent" />
          
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
            {article.categoryName}
          </span>

          {hasVideo && (
            <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[11px] font-medium">
              <Play className="w-3 h-3 fill-red-500 text-red-500" />
              Vídeo
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="p-4 sm:p-5 md:p-6 flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <Clock className="w-3.5 h-3.5 text-red-500" />
                {formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <BookOpen className="w-3 h-3" />
                {readMinutes} min de leitura
              </span>
            </div>

            <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 group-hover:text-red-600 transition-colors leading-snug">
              {article.title}
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
              {article.subtitle}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium truncate">
              Por {article.author}
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-red-600 group-hover:translate-x-1 transition-transform">
              <span>Ler matéria</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  // 3. STANDARD COMPACT VERTICAL CARD (Distinctive, tighter height, modern editorial style)
  return (
    <article
      onClick={handleClick}
      className="group bg-white rounded-xl border border-slate-200/80 hover:border-red-200 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col h-full"
    >
      {/* Thumbnail with 16:9 proportion and subtle zoom */}
      <div className="relative w-full aspect-16/9 overflow-hidden bg-slate-100">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Distinctive Category Tag with translucent pill */}
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
          {article.categoryName}
        </span>

        {/* Video indicator badge */}
        {hasVideo && (
          <div className="absolute bottom-2.5 right-2.5 bg-red-600 text-white p-1 rounded-full shadow-xs flex items-center justify-center">
            <Play className="w-3 h-3 fill-current" />
          </div>
        )}
      </div>

      {/* Card Content with compact padding */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Metadata bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span className="flex items-center gap-1 font-medium text-slate-500">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{formattedDate}</span>
            </span>
            <span className="text-slate-400">
              {readMinutes} min
            </span>
          </div>

          {/* Title - Punchy 2 lines max */}
          <h3 className="text-xs sm:text-sm md:text-[15px] font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>

          {/* Subtitle - Concise snippet */}
          <p className="mt-1.5 text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {article.subtitle}
          </p>
        </div>

        {/* Card Footer */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 truncate max-w-[130px]">
            {article.author}
          </span>

          <span className="inline-flex items-center gap-1 font-bold text-red-600 group-hover:translate-x-0.5 transition-transform">
            <span>Ler</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </article>
  );
};
