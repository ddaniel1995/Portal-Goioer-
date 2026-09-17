import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home as HomeIcon, Newspaper, TrendingUp } from 'lucide-react';
import { Article, Category, Banner } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { SidebarBanners } from '../components/SidebarBanners';

interface NewsPageProps {
  articles: Article[];
  categories: Category[];
  banners: Banner[];
  onBannerClick: (banner: Banner) => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({
  articles,
  categories,
  banners,
  onBannerClick,
}) => {
  const publishedArticles = articles
    .filter((a) => a.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const sidebarBanners = banners.filter((b) => b.position === 'sidebar' && b.active);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-red-600 transition-colors cursor-pointer"
        >
          <HomeIcon className="w-3.5 h-3.5" />
          <span>Início</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-slate-800">Notícias</span>
      </nav>

      {/* News Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Cobertura Completa
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
              Todas as Notícias
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Acompanhe as notícias mais recentes, reportagens e acontecimentos em tempo real.
            </p>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            {publishedArticles.length} {publishedArticles.length === 1 ? 'publicação' : 'publicações'}
          </span>
        </div>

        {/* Categories Quick Filter Chips */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Link
            to="/noticias"
            className="px-3.5 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold whitespace-nowrap shadow-xs"
          >
            Todas
          </Link>
          {categories.filter(c => !c.hideInMenu).map((cat) => (
            <Link
              key={cat.id}
              to={`/noticias/${cat.slug || cat.id}`}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-semibold whitespace-nowrap transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Grid: Articles + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {publishedArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {publishedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-slate-500 font-medium">
                Nenhuma matéria cadastrada no momento.
              </p>
              <Link
                to="/"
                className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
              >
                Voltar para a Página Inicial
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-4 space-y-8">
          {/* Trending Block */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Mais Lidas
              </h3>
            </div>

            <div className="space-y-3.5">
              {publishedArticles.slice(0, 5).map((art, idx) => {
                const artUrl = art.categorySlug 
                  ? `/noticias/${art.categorySlug}/${art.slug || art.id}` 
                  : `/noticias/${art.slug || art.id}`;
                return (
                  <Link
                    key={art.id}
                    to={artUrl}
                    className="group flex items-start gap-3 py-1.5 border-b border-slate-50 last:border-0 cursor-pointer block"
                  >
                    <span className="text-xl font-black text-slate-300 group-hover:text-red-600 transition-colors w-6 shrink-0 leading-none mt-1">
                      0{idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase text-red-600">
                        {art.categoryName}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition-colors line-clamp-2 mt-0.5 leading-snug">
                        {art.title}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <SidebarBanners
            banners={sidebarBanners}
            onBannerClick={onBannerClick}
          />
        </div>
      </div>
    </div>
  );
};
