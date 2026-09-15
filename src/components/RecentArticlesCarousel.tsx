import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock, Flame, Play, ArrowRight } from 'lucide-react';
import { Article } from '../types';

interface RecentArticlesCarouselProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  title?: string;
  subtitle?: string;
}

export const RecentArticlesCarousel: React.FC<RecentArticlesCarouselProps> = ({
  articles,
  onSelectArticle,
  title = 'Matérias Recentes',
  subtitle = 'Acompanhe as últimas publicações e reportagens em tempo real',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Take the most recent published articles (up to 12)
  const recentArticles = articles
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 12);

  // Check scroll position to update arrows
  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate approximate active card index
    const cardWidth = 280; // approximate width
    const currentIndex = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(currentIndex, recentArticles.length - 1));
  }, [recentArticles.length]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  // Smooth scroll left/right
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Optional subtle auto-scroll
  useEffect(() => {
    if (isPaused || recentArticles.length <= 3) return;

    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      // If reached the end, loop back to start smoothly
      if (scrollLeft >= scrollWidth - clientWidth - 20) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: 290, behavior: 'smooth' });
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, recentArticles.length]);

  if (recentArticles.length === 0) return null;

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      if (diffHours < 1) {
        const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
        return `Há ${diffMins} min`;
      }
      if (diffHours < 24) {
        return `Há ${diffHours}h`;
      }
      
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  // Estimated read time
  const getReadTime = (content: string = '') => {
    const words = content.trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 160))} min`;
  };

  return (
    <section 
      aria-label="Carrossel de Matérias Recentes"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-6 my-6 transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header with live indicator and navigation controls */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-red-600/20 text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {title}
              </h2>
              {/* Live beacon badge */}
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                </span>
                Giro Rápido
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Matérias anteriores"
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all ${
              canScrollLeft
                ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-red-600 shadow-xs cursor-pointer'
                : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Próximas matérias"
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all ${
              canScrollRight
                ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-red-600 shadow-xs cursor-pointer'
                : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {recentArticles.map((article) => {
          const hasVideo = Boolean(article.youtubeUrl);
          return (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article.slug || article.id)}
              className="group snap-start shrink-0 w-[240px] sm:w-[260px] md:w-[280px] bg-slate-50 hover:bg-white rounded-xl border border-slate-200/80 hover:border-red-200 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
            >
              {/* Thumbnail Container */}
              <div className="relative w-full aspect-16/10 overflow-hidden bg-slate-100">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Category Pill */}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                  {article.categoryName}
                </span>

                {/* Video icon */}
                {hasVideo && (
                  <div className="absolute bottom-2.5 right-2.5 bg-red-600 text-white p-1 rounded-full shadow-xs flex items-center justify-center">
                    <Play className="w-3 h-3 fill-current" />
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  {/* Meta: time and read duration */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span className="flex items-center gap-1 font-medium text-slate-500">
                      <Clock className="w-3 h-3 text-red-500" />
                      {formatDate(article.publishedAt)}
                    </span>
                    <span className="text-slate-400">
                      {getReadTime(article.content)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  {/* Concise Subtitle / Lead */}
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {article.subtitle}
                  </p>
                </div>

                {/* Card footer */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 truncate max-w-[120px]">
                    {article.author}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-red-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Ler</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
