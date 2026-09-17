import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  Settings, 
  Facebook, 
  ArrowLeft, 
  LogOut, 
  Globe,
  CheckCircle,
  Plus,
  Sparkles,
  Store,
  Key,
  Cloud
} from 'lucide-react';
import { Article, Category, Banner, VisualIdentity, FacebookConfig, BannerPosition } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { AdminArticles } from './AdminArticles';
import { AdminCategories } from './AdminCategories';
import { AdminBanners } from './AdminBanners';
import { AdminIdentity } from './AdminIdentity';
import { AdminFacebook } from './AdminFacebook';
import { AdminPopup } from './AdminPopup';
import { AdminBusinesses } from './AdminBusinesses';
import { AdminCredentialsManager } from './AdminCredentials';
import { AdminStorage } from './AdminStorage';

type AdminTab = 'dashboard' | 'articles' | 'categories' | 'banners' | 'identity' | 'popup' | 'businesses' | 'facebook' | 'storage' | 'security';

interface AdminPanelProps {
  articles: Article[];
  categories: Category[];
  banners: Banner[];
  identity: VisualIdentity;
  facebookConfig: FacebookConfig;
  sitePopup?: any;
  businessConfig?: any;
  businessStores?: any[];
  businessProducts?: any[];
  onRefreshData?: () => void;
  onDataChanged?: () => void;
  onCloseAdmin?: () => void;
  onClose?: () => void;
  onLogout: () => void;
  onOpenStorePreview?: (slug: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  articles,
  categories,
  banners,
  identity,
  facebookConfig,
  onRefreshData,
  onDataChanged,
  onCloseAdmin,
  onClose,
  onLogout,
  onOpenStorePreview,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [openBannerForm, setOpenBannerForm] = useState<boolean>(false);
  const [initialBannerPosition, setInitialBannerPosition] = useState<BannerPosition>('slideshow');

  const handleRefresh = () => {
    if (typeof onRefreshData === 'function') onRefreshData();
    if (typeof onDataChanged === 'function') onDataChanged();
  };

  const handleClose = () => {
    if (typeof onCloseAdmin === 'function') onCloseAdmin();
    if (typeof onClose === 'function') onClose();
  };

  const handleNewArticle = () => {
    setEditingArticle(null);
    setActiveTab('articles');
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setActiveTab('articles');
  };

  const handleNewBanner = (position: BannerPosition = 'slideshow') => {
    setInitialBannerPosition(position);
    setOpenBannerForm(true);
    setActiveTab('banners');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Voltar ao portal público"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Ver Site Público</span>
            </button>

            <div className="h-5 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <h1 className="font-bold text-sm sm:text-base tracking-tight text-white">
                Painel Administrativo <span className="text-slate-400 font-normal text-xs hidden md:inline">• {identity.siteName}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Secondary Navigation Menu Tabs */}
        <div className="bg-slate-950 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto scrollbar-none py-1 gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setEditingArticle(null);
                setActiveTab('articles');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'articles'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Matérias</span>
              <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full">
                {articles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'categories'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categorias</span>
              <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'banners'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Banners</span>
              <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full">
                {banners.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('identity')}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'identity'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Identidade Visual</span>
            </button>

            <button
              onClick={() => setActiveTab('popup')}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'popup'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>PopUp com Imagem</span>
            </button>

            <button
              onClick={() => setActiveTab('businesses')}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'businesses'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>Guia Empresarial</span>
            </button>

            <button
              onClick={() => setActiveTab('facebook')}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'facebook'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Facebook className="w-3.5 h-3.5 fill-current" />
              <span>Facebook Graph API</span>
              {facebookConfig.connected && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('storage')}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'storage'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>Imagens & Supabase</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === 'security'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-amber-300" />
              <span>Redefinir Login e Senha</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            articles={articles}
            categories={categories}
            banners={banners}
            facebookConfig={facebookConfig}
            onNavigate={(tab) => {
              setEditingArticle(null);
              setOpenBannerForm(false);
              setActiveTab(tab);
            }}
            onNewArticle={handleNewArticle}
            onEditArticle={handleEditArticle}
            onNewBanner={handleNewBanner}
          />
        )}

        {activeTab === 'articles' && (
          <AdminArticles
            articles={articles}
            categories={categories}
            editingArticle={editingArticle}
            onClearEditing={() => setEditingArticle(null)}
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === 'categories' && (
          <AdminCategories
            categories={categories}
            articles={articles}
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === 'banners' && (
          <AdminBanners
            banners={banners}
            onRefresh={handleRefresh}
            initialFormOpen={openBannerForm}
            initialPosition={initialBannerPosition}
            onClearInitialFormOpen={() => setOpenBannerForm(false)}
          />
        )}

        {activeTab === 'identity' && (
          <AdminIdentity
            identity={identity}
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === 'popup' && (
          <AdminPopup
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === 'businesses' && (
          <AdminBusinesses
            onRefresh={handleRefresh}
            onPreviewStore={onOpenStorePreview}
          />
        )}

        {activeTab === 'facebook' && (
          <AdminFacebook
            config={facebookConfig}
            articles={articles}
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === 'storage' && (
          <AdminStorage />
        )}

        {activeTab === 'security' && (
          <AdminCredentialsManager />
        )}
      </main>

      {/* Admin Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Sistema de Gerenciamento de Conteúdo Editorial • Versão 2.4</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="text-slate-600 hover:text-red-600 font-semibold"
            >
              Voltar ao Site Público
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
