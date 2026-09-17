import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import { Article, Category, Banner } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { PodcastGallery } from '../components/PodcastGallery';
import { SidebarBanners, SupporterBannerCard } from '../components/SidebarBanners';
import { ArticleDetailPage } from './ArticleDetailPage';

interface CategoryPageProps {
  articles: Article[];
  categories: Category[];
  banners: Banner[];
  onBannerClick: (banner: Banner) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  articles,
  categories,
  banners,
  onBannerClick,
}) => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const publishedArticles = articles.filter(a => a.status === 'published');
  const sidebarBanners = banners.filter(b => b.position === 'sidebar' && b.active);

  const isUltimas = categorySlug === 'ultimas' || categorySlug === 'cat-ultimas';

  const categoryActive: Category | null = isUltimas
    ? {
        id: 'cat-ultimas',
        name: 'Últimas Notícias',
        slug: 'ultimas',
        description: 'Acompanhe as notícias mais recentes e acontecimentos em tempo real.',
        color: '#dc2626',
        order: 0,
        showOnHome: true,
      }
    : (categories.find(
        c => c.slug?.toLowerCase() === categorySlug?.toLowerCase() || 
             c.id?.toLowerCase() === categorySlug?.toLowerCase()
      ) || null);

  // If not a category, check if this is an article slug accessed directly as /noticias/:slug
  if (!categoryActive && categorySlug) {
    const matchedArticle = articles.find(
      a => a.slug === categorySlug || a.id === categorySlug
    );
    if (matchedArticle) {
      return (
        <ArticleDetailPage
          articles={articles}
          categories={categories}
          banners={banners}
          overrideArticle={matchedArticle}
        />
      );
    }
  }

  // If no category matched and no article matched
  if (!categoryActive) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 my-8">
        <h2 className="text-xl font-bold text-slate-800">Categoria ou matéria não encontrada</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Não conseguimos localizar a editoria solicitada ({categorySlug}). Escolha uma das categorias disponíveis abaixo ou retorne à página inicial.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/noticias/${cat.slug || cat.id}`}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-bold transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
          >
            Ir para a Home
          </Link>
        </div>
      </div>
    );
  }

  const isPodcastCategory = Boolean(
    categoryActive.id === 'cat-podcast' ||
    categoryActive.slug === 'podcast' ||
    categoryActive.name.toLowerCase().includes('podcast')
  );

  const categoryArticles = isUltimas
    ? [...publishedArticles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    : publishedArticles.filter(
        a => a.categoryId === categoryActive.id ||
             (categoryActive.slug && a.categorySlug === categoryActive.slug) ||
             (categoryActive.name && a.categoryName?.toLowerCase() === categoryActive.name.toLowerCase()) ||
             (isPodcastCategory && (a.categoryId === 'cat-podcast' || a.categoryName?.toLowerCase().includes('podcast') || Boolean(a.youtubeUrl)))
      );

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
        <Link to="/noticias" className="hover:text-red-600 transition-colors">
          Notícias
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-slate-800">{categoryActive.name}</span>
      </nav>

      {/* Category Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: categoryActive.color || '#dc2626' }}
              />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {isPodcastCategory ? 'Galeria & Vídeos' : 'Editoria'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
              {categoryActive.name}
            </h1>
            {categoryActive.description && (
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
                {categoryActive.description}
              </p>
            )}
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            {categoryArticles.length} {categoryArticles.length === 1 ? 'publicação' : 'publicações'}
          </span>
        </div>
      </div>

      {/* If Podcast Category, render dedicated PodcastGallery */}
      {isPodcastCategory && (
        <section aria-label="Galeria de Podcasts" className="space-y-4">
          <PodcastGallery
            articles={publishedArticles}
          />
        </section>
      )}

      {/* Layout with Articles + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {categoryArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {categoryArticles.map((article, idx) => (
                <React.Fragment key={article.id}>
                  <ArticleCard
                    article={article}
                  />

                  {/* On reduced screen: place supporter banner between articles */}
                  {(idx + 1) % 3 === 0 && sidebarBanners.length > 0 && (
                    <div className="lg:hidden col-span-full my-3">
                      <SupporterBannerCard
                        banner={sidebarBanners[Math.floor(idx / 3) % sidebarBanners.length]}
                        onBannerClick={onBannerClick}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-slate-500 font-medium">
                Nenhuma matéria cadastrada nesta categoria no momento.
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
        <div className="hidden lg:block lg:col-span-4">
          <SidebarBanners
            banners={sidebarBanners}
            onBannerClick={onBannerClick}
          />
        </div>
      </div>
    </div>
  );
};
