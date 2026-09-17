import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Article, Category } from '../types';
import { SearchResults } from '../components/SearchResults';

interface SearchPageProps {
  articles: Article[];
  categories: Category[];
}

export const SearchPage: React.FC<SearchPageProps> = ({
  articles,
  categories,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const publishedArticles = articles.filter((a) => a.status === 'published');

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

  return (
    <SearchResults
      articles={publishedArticles}
      categories={categories}
      initialQuery={query}
      onSelectArticle={handleOpenArticle}
      onSelectCategory={handleSelectCategory}
      onGoHome={handleGoHome}
    />
  );
};
