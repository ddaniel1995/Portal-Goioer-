import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowLeft, Tag, Calendar } from 'lucide-react';
import { Article, Category } from '../types';
import { ArticleCard } from './ArticleCard';

interface SearchResultsProps {
  initialQuery?: string;
  articles: Article[];
  categories: Category[];
  onSelectArticle: (id: string) => void;
  onGoHome: () => void;
  onSelectCategory: (categoryId: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  initialQuery = '',
  articles,
  categories,
  onSelectArticle,
  onGoHome,
  onSelectCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'views'>('recent');

  const filteredArticles = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return articles.filter((article) => {
      if (article.status !== 'published') return false;

      // Filter by category
      if (selectedCategory !== 'all' && article.categoryId !== selectedCategory) {
        return false;
      }

      // If no search term, return matching category
      if (!term) return true;

      // Match title, subtitle, content, author, or category name
      const matchTitle = article.title.toLowerCase().includes(term);
      const matchSubtitle = article.subtitle.toLowerCase().includes(term);
      const matchAuthor = article.author.toLowerCase().includes(term);
      const matchCategory = article.categoryName.toLowerCase().includes(term);
      const matchContent = article.content.toLowerCase().includes(term);

      return matchTitle || matchSubtitle || matchAuthor || matchCategory || matchContent;
    }).sort((a, b) => {
      if (sortBy === 'views') {
        return (b.views || 0) - (a.views || 0);
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [articles, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
        <button
          type="button"
          onClick={onGoHome}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para a Home</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Buscar Notícias no Portal
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Encontre matérias por título, tema, palavra-chave, autor ou categoria.
        </p>

        {/* Search Input */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o que deseja pesquisar..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-600 transition-all text-sm font-medium"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-red-600 cursor-pointer"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-3 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-red-600 cursor-pointer"
            >
              <option value="recent">Mais Recentes</option>
              <option value="views">Mais Lidas</option>
            </select>
          </div>
        </div>

        {/* Active categories tags */}
        <div className="mt-4 flex items-center gap-2 flex-wrap pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Filtrar:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({articles.filter(a => a.status === 'published').length})
          </button>
          {categories.map((cat) => {
            const count = articles.filter(a => a.categoryId === cat.id && a.status === 'published').length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-bold text-slate-700">
          {filteredArticles.length} {filteredArticles.length === 1 ? 'matéria encontrada' : 'matérias encontradas'}
          {searchTerm && <span> para "{searchTerm}"</span>}
        </p>
      </div>

      {/* Results Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onSelect={onSelectArticle}
              variant="standard"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Nenhuma matéria encontrada</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Tente buscar com outros termos, verifique a ortografia ou selecione outra categoria.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
          >
            Limpar filtros de busca
          </button>
        </div>
      )}
    </div>
  );
};
