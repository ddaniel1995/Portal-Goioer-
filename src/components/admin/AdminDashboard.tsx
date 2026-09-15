import React from 'react';
import { 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  Facebook, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  Eye, 
  ExternalLink,
  Settings,
  AlertTriangle,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Article, Category, Banner, FacebookConfig, BannerPosition } from '../../types';

interface AdminDashboardProps {
  articles: Article[];
  categories: Category[];
  banners: Banner[];
  facebookConfig: FacebookConfig;
  onNavigate: (section: 'articles' | 'categories' | 'banners' | 'identity' | 'facebook') => void;
  onNewArticle: () => void;
  onEditArticle: (article: Article) => void;
  onNewBanner?: (position?: BannerPosition) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  articles,
  categories,
  banners,
  facebookConfig,
  onNavigate,
  onNewArticle,
  onEditArticle,
  onNewBanner,
}) => {
  const publishedArticles = articles.filter(a => a.status === 'published');
  const draftArticles = articles.filter(a => a.status === 'draft');
  const activeBanners = banners.filter(b => b.active);
  const facebookPublishedCount = articles.filter(a => a.facebookPublished).length;

  const recentArticles = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-red-500">Painel de Controle</span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">Gestão do Portal de Notícias</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
            Bem-vindo à área administrativa. Aqui você gerencia matérias, banners do slideshow e laterais, categorias, identidade visual e a publicação automática no Facebook.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNewArticle}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nova Matéria</span>
          </button>
          <button
            onClick={() => onNewBanner ? onNewBanner('slideshow') : onNavigate('banners')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-bold backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Adicionar Banner</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {/* Total Matérias */}
        <div 
          onClick={() => onNavigate('articles')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total de Matérias</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{articles.length}</span>
            <span className="text-xs font-semibold text-emerald-600">{publishedArticles.length} publicadas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{draftArticles.length} em rascunho</p>
        </div>

        {/* Total Banners */}
        <div 
          onClick={() => onNavigate('banners')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total de Banners</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{banners.length}</span>
            <span className="text-xs font-semibold text-emerald-600">{activeBanners.length} ativos</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Slideshow e Laterais</p>
        </div>

        {/* Categorias */}
        <div 
          onClick={() => onNavigate('categories')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categorias</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{categories.length}</span>
            <span className="text-xs font-semibold text-slate-500">ativas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ordenadas no menu</p>
        </div>

        {/* Facebook Integration */}
        <div 
          onClick={() => onNavigate('facebook')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Facebook</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
              <Facebook className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{facebookPublishedCount}</span>
            <span className="text-xs font-semibold text-blue-600">posts enviados</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`w-2 h-2 rounded-full ${facebookConfig.connected ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-[11px] text-slate-500 font-medium">
              {facebookConfig.connected ? 'Página Conectada' : 'Desconectado'}
            </span>
          </div>
        </div>

        {/* Visual Identity */}
        <div 
          onClick={() => onNavigate('identity')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Identidade</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-sm font-bold text-slate-800">Logos & Contato</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Colorida & Monocromática</p>
        </div>
      </div>

      {/* Main Two-Column Layout: Recent Articles + Active Banners overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Articles Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Matérias Recentes</h2>
              <p className="text-xs text-slate-500">Últimos conteúdos cadastrados no portal</p>
            </div>
            <button
              onClick={() => onNavigate('articles')}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              Ver todas ({articles.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Matéria</th>
                  <th className="py-2.5 px-3">Categoria</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Facebook</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={article.featuredImage}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-xs">{article.title}</p>
                          <p className="text-[11px] text-slate-400">Por {article.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {article.categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        article.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {article.facebookPublished ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                          <Facebook className="w-3 h-3 fill-current" />
                          Enviado
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Pendente</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onEditArticle(article)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Banners Quick View (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Banners Ativos</h2>
                <p className="text-xs text-slate-500">{activeBanners.length} anúncios em veiculação</p>
              </div>
              <button
                onClick={() => onNavigate('banners')}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                Gerenciar
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeBanners.slice(0, 4).map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <img
                    src={b.imageUrl}
                    alt=""
                    className="w-14 h-10 rounded-lg object-cover bg-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-slate-800 truncate">{b.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {b.position === 'slideshow' ? 'Slideshow' : 'Lateral'}
                      </span>
                      <span className="text-[10px] text-slate-400">• {b.clicks} cliques</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNewBanner ? onNewBanner('slideshow') : onNavigate('banners')}
              className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <PlusCircle className="w-4 h-4 text-red-600" />
              <span>+ Adicionar Novo Banner</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
