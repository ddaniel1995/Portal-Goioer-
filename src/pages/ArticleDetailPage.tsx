import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Article, Category, Banner } from '../types';
import { ArticleView } from '../components/ArticleView';

interface ArticleDetailPageProps {
  articles: Article[];
  categories: Category[];
  banners: Banner[];
  overrideArticle?: Article;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  articles,
  categories,
  banners,
  overrideArticle,
}) => {
  const { categorySlug, articleSlug } = useParams<{
    categorySlug?: string;
    articleSlug?: string;
  }>();
  const navigate = useNavigate();

  const publishedArticles = articles.filter((a) => a.status === 'published');
  const sidebarBanners = banners.filter((b) => b.position === 'sidebar' && b.active);

  // Determine article
  const currentArticle = overrideArticle || (
    articleSlug
      ? articles.find((a) => a.slug === articleSlug || a.id === articleSlug)
      : categorySlug
      ? articles.find((a) => a.slug === categorySlug || a.id === categorySlug)
      : null
  );

  const handleOpenArticle = (slugOrId: string) => {
    const art = articles.find((a) => a.slug === slugOrId || a.id === slugOrId);
    if (art?.categorySlug) {
      navigate(`/noticias/${art.categorySlug}/${art.slug || art.id}`);
    } else {
      navigate(`/noticias/${slugOrId}`);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId || c.slug === categoryId);
    if (cat) {
      navigate(`/noticias/${cat.slug || cat.id}`);
    } else {
      navigate(`/noticias/${categoryId}`);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (!currentArticle) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 my-8">
        <h2 className="text-xl font-bold text-slate-800">Matéria não encontrada</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Não conseguimos encontrar a publicação solicitada. Ela pode ter sido removida ou o endereço está incorreto.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/noticias"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Ver Todas as Notícias
          </Link>
          <Link
            to="/"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Ir para a Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ArticleView
      article={currentArticle}
      allArticles={publishedArticles}
      categories={categories}
      banners={sidebarBanners}
      onSelectArticle={handleOpenArticle}
      onSelectCategory={handleSelectCategory}
      onGoHome={handleGoHome}
    />
  );
};
