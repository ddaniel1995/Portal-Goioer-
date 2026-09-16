import React, { useState, useRef } from 'react';
import { 
  Store, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  AlertCircle, 
  Upload, 
  ShoppingBag, 
  MessageCircle, 
  MapPin, 
  Eye, 
  ExternalLink, 
  Settings, 
  Sparkles, 
  ShieldCheck, 
  X, 
  ArrowLeft,
  ImageIcon,
  Search,
  Tag
} from 'lucide-react';
import { BusinessGuideConfig, BusinessStore, BusinessProductService } from '../../types';
import { storageService, slugify } from '../../services/storageService';

interface AdminBusinessesProps {
  onRefresh?: () => void;
  onPreviewStore?: (storeSlug: string) => void;
}

export const AdminBusinesses: React.FC<AdminBusinessesProps> = ({ 
  onRefresh,
  onPreviewStore 
}) => {
  // Load data from storage
  const [config, setConfig] = useState<BusinessGuideConfig>(storageService.getBusinessGuideConfig());
  const [stores, setStores] = useState<BusinessStore[]>(storageService.getBusinessStores());
  const [products, setProducts] = useState<BusinessProductService[]>(storageService.getBusinessProducts());

  // Navigation subtabs inside AdminBusinesses: 'stores' | 'products' | 'config'
  const [adminTab, setAdminTab] = useState<'stores' | 'products' | 'config'>('stores');
  const [selectedStoreForProducts, setSelectedStoreForProducts] = useState<string>(
    stores[0]?.id || ''
  );

  // Forms states
  const [editingStore, setEditingStore] = useState<BusinessStore | null>(null);
  const [isStoreFormOpen, setIsStoreFormOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<BusinessProductService | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  // Notifications
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Store Form Fields
  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [storeCategory, setStoreCategory] = useState('Gastronomia');
  const [storeSegment, setStoreSegment] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeAboutText, setStoreAboutText] = useState('');
  const [storeLogoUrl, setStoreLogoUrl] = useState('');
  const [storeCoverBannerUrl, setStoreCoverBannerUrl] = useState('');
  const [storeWhatsapp, setStoreWhatsapp] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeNeighborhood, setStoreNeighborhood] = useState('');
  const [storeCity, setStoreCity] = useState('');
  const [storeState, setStoreState] = useState('SP');
  const [storeGoogleMapsQuery, setStoreGoogleMapsQuery] = useState('');
  const [storeWorkingHours, setStoreWorkingHours] = useState('');
  const [storeWebsite, setStoreWebsite] = useState('');
  const [storeInstagram, setStoreInstagram] = useState('');
  const [storeFacebook, setStoreFacebook] = useState('');
  const [storeVerified, setStoreVerified] = useState(true);
  const [storeFeatured, setStoreFeatured] = useState(false);
  const [storeActive, setStoreActive] = useState(true);
  const [storeCategoriesInput, setStoreCategoriesInput] = useState('');

  // Product Form Fields
  const [prodBusinessId, setProdBusinessId] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodType, setProdType] = useState<'product' | 'service'>('product');
  const [prodCategory, setProdCategory] = useState('');
  const [prodPriceFormatted, setProdPriceFormatted] = useState('');
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodNewImageUrl, setProdNewImageUrl] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodWhatsappMsg, setProdWhatsappMsg] = useState('');
  const [prodActive, setProdActive] = useState(true);

  // File input refs
  const storeLogoRef = useRef<HTMLInputElement>(null);
  const storeCoverRef = useRef<HTMLInputElement>(null);
  const prodImageRef = useRef<HTMLInputElement>(null);

  // Refresh local list
  const reloadData = () => {
    setConfig(storageService.getBusinessGuideConfig());
    setStores(storageService.getBusinessStores());
    setProducts(storageService.getBusinessProducts());
    if (onRefresh) onRefresh();
  };

  // Save General Guide Config
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storageService.saveBusinessGuideConfig(config);
    setConfig(updated);
    setMessage({ type: 'success', text: 'Configurações do Guia Empresarial atualizadas com sucesso!' });
    reloadData();
    setTimeout(() => setMessage(null), 3000);
  };

  // Open Store Form for New or Edit
  const handleOpenStoreForm = (store?: BusinessStore) => {
    if (store) {
      setEditingStore(store);
      setStoreName(store.name);
      setStoreSlug(store.slug);
      setStoreCategory(store.category);
      setStoreSegment(store.segment || '');
      setStoreDescription(store.description);
      setStoreAboutText(store.aboutText || '');
      setStoreLogoUrl(store.logoUrl);
      setStoreCoverBannerUrl(store.coverBannerUrl || '');
      setStoreWhatsapp(store.whatsapp);
      setStorePhone(store.phone || '');
      setStoreEmail(store.email || '');
      setStoreAddress(store.address);
      setStoreNeighborhood(store.neighborhood || '');
      setStoreCity(store.city);
      setStoreState(store.state || 'SP');
      setStoreGoogleMapsQuery(store.googleMapsEmbedQuery || '');
      setStoreWorkingHours(store.workingHours || '');
      setStoreWebsite(store.website || '');
      setStoreInstagram(store.instagram || '');
      setStoreFacebook(store.facebook || '');
      setStoreVerified(store.verified !== false);
      setStoreFeatured(Boolean(store.featured));
      setStoreActive(store.active !== false);
      setStoreCategoriesInput((store.productCategories || []).join(', '));
    } else {
      setEditingStore(null);
      setStoreName('');
      setStoreSlug('');
      setStoreCategory('Gastronomia');
      setStoreSegment('');
      setStoreDescription('');
      setStoreAboutText('');
      setStoreLogoUrl('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop');
      setStoreCoverBannerUrl('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop');
      setStoreWhatsapp('');
      setStorePhone('');
      setStoreEmail('');
      setStoreAddress('');
      setStoreNeighborhood('');
      setStoreCity('');
      setStoreState('SP');
      setStoreGoogleMapsQuery('');
      setStoreWorkingHours('');
      setStoreWebsite('');
      setStoreInstagram('');
      setStoreFacebook('');
      setStoreVerified(true);
      setStoreFeatured(false);
      setStoreActive(true);
      setStoreCategoriesInput('Geral, Destaques');
    }
    setIsStoreFormOpen(true);
  };

  // Submit Store Form
  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName.trim()) {
      setMessage({ type: 'error', text: 'Informe o nome da loja/empresa.' });
      return;
    }
    if (!storeWhatsapp.trim()) {
      setMessage({ type: 'error', text: 'Informe o número do WhatsApp comercial da loja.' });
      return;
    }

    const cats = storeCategoriesInput
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    const storeData: BusinessStore = {
      id: editingStore?.id || `store-${Date.now()}`,
      name: storeName.trim(),
      slug: storeSlug.trim() || slugify(storeName.trim()),
      category: storeCategory.trim(),
      segment: storeSegment.trim(),
      description: storeDescription.trim(),
      aboutText: storeAboutText.trim(),
      logoUrl: storeLogoUrl.trim() || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=400&auto=format&fit=crop',
      coverBannerUrl: storeCoverBannerUrl.trim(),
      whatsapp: storeWhatsapp.trim(),
      phone: storePhone.trim(),
      email: storeEmail.trim(),
      address: storeAddress.trim(),
      neighborhood: storeNeighborhood.trim(),
      city: storeCity.trim() || 'São Paulo',
      state: storeState.trim() || 'SP',
      googleMapsEmbedQuery: storeGoogleMapsQuery.trim() || `${storeAddress.trim()}, ${storeCity.trim()}`,
      workingHours: storeWorkingHours.trim(),
      website: storeWebsite.trim(),
      instagram: storeInstagram.trim(),
      facebook: storeFacebook.trim(),
      verified: storeVerified,
      featured: storeFeatured,
      active: storeActive,
      productCategories: cats.length > 0 ? cats : ['Geral'],
      createdAt: editingStore?.createdAt || new Date().toISOString(),
    };

    storageService.saveBusinessStore(storeData);
    setIsStoreFormOpen(false);
    setMessage({ type: 'success', text: `Loja "${storeData.name}" salva com sucesso!` });
    reloadData();
    setTimeout(() => setMessage(null), 3000);
  };

  // Delete Store
  const handleDeleteStore = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover a loja "${name}" e todos os seus produtos/serviços?`)) {
      storageService.deleteBusinessStore(id);
      setMessage({ type: 'success', text: `Loja "${name}" removida com sucesso.` });
      reloadData();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Open Product Form for New or Edit
  const handleOpenProductForm = (prod?: BusinessProductService, defaultStoreId?: string) => {
    const targetStoreId = defaultStoreId || selectedStoreForProducts || stores[0]?.id || '';
    if (prod) {
      setEditingProduct(prod);
      setProdBusinessId(prod.businessId);
      setProdName(prod.name);
      setProdType(prod.type);
      setProdCategory(prod.category || '');
      setProdPriceFormatted(prod.priceFormatted || '');
      setProdShortDesc(prod.shortDescription || '');
      setProdDesc(prod.description || '');
      setProdImages(prod.images || []);
      setProdFeatured(Boolean(prod.featured));
      setProdWhatsappMsg(prod.whatsappMessage || '');
      setProdActive(prod.active !== false);
    } else {
      setEditingProduct(null);
      setProdBusinessId(targetStoreId);
      setProdName('');
      setProdType('product');
      setProdCategory('');
      setProdPriceFormatted('R$ 0,00');
      setProdShortDesc('');
      setProdDesc('');
      setProdImages(['https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop']);
      setProdFeatured(false);
      setProdWhatsappMsg('');
      setProdActive(true);
    }
    setIsProductFormOpen(true);
  };

  // Submit Product Form
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prodName.trim()) {
      setMessage({ type: 'error', text: 'Informe o nome do produto ou serviço.' });
      return;
    }
    if (!prodBusinessId) {
      setMessage({ type: 'error', text: 'Selecione a loja correspondente.' });
      return;
    }

    const prodData: BusinessProductService = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      businessId: prodBusinessId,
      name: prodName.trim(),
      type: prodType,
      category: prodCategory.trim() || 'Geral',
      priceFormatted: prodPriceFormatted.trim(),
      shortDescription: prodShortDesc.trim(),
      description: prodDesc.trim(),
      images: prodImages.length > 0 ? prodImages : ['https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop'],
      featured: prodFeatured,
      whatsappMessage: prodWhatsappMsg.trim(),
      active: prodActive,
    };

    storageService.saveBusinessProduct(prodData);
    setIsProductFormOpen(false);
    setMessage({ type: 'success', text: `Item "${prodData.name}" salvo com sucesso!` });
    reloadData();
    setTimeout(() => setMessage(null), 3000);
  };

  // Delete Product
  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir "${name}"?`)) {
      storageService.deleteBusinessProduct(id);
      setMessage({ type: 'success', text: `Item removido com sucesso.` });
      reloadData();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Image Upload Handlers (FileReader base64)
  const handleFileUpload = (
    type: 'logo' | 'cover' | 'product',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor, selecione um arquivo de imagem válido.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (type === 'logo') setStoreLogoUrl(reader.result);
        else if (type === 'cover') setStoreCoverBannerUrl(reader.result);
        else if (type === 'product') {
          setProdImages(prev => [...prev, reader.result as string]);
        }
        setMessage({ type: 'success', text: 'Imagem carregada com sucesso!' });
        setTimeout(() => setMessage(null), 2500);
      }
    };
    reader.readAsDataURL(file);
  };

  const currentStoreForProducts = stores.find(s => s.id === selectedStoreForProducts) || stores[0];
  const currentStoreProductsList = products.filter(p => p.businessId === currentStoreForProducts?.id);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Store className="w-6 h-6 text-red-600" />
            <span>Gestão do Guia Empresarial & Minisites</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cadastre e gerencie lojas, produtos/serviços, pedidos diretos no WhatsApp e localização no Google Maps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {stores.length > 0 && onPreviewStore && (
            <button
              type="button"
              onClick={() => onPreviewStore(stores[0].slug)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Ver Minisite Exemplo</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleOpenStoreForm()}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Loja</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Admin Subtabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setAdminTab('stores')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            adminTab === 'stores'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Lojas & Minisites ({stores.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            adminTab === 'products'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Produtos & Serviços ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('config')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            adminTab === 'config'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configuração da Aba & Nome</span>
        </button>
      </div>

      {/* TAB 1: STORES LIST */}
      {adminTab === 'stores' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Lojas e Estabelecimentos Cadastrados
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cada loja possui seu próprio minisite completo com logotipo, banner, categorias e catálogo de produtos.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full w-fit">
                Total: {stores.length} lojas
              </span>
            </div>

            {stores.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Store className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Nenhuma loja cadastrada ainda.</p>
                <button
                  type="button"
                  onClick={() => handleOpenStoreForm()}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
                >
                  Cadastrar Primeira Loja
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {stores.map((store) => {
                  const storeProds = products.filter(p => p.businessId === store.id);
                  return (
                    <div
                      key={store.id}
                      className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={store.logoUrl}
                          alt={store.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm sm:text-base font-black text-slate-900">
                              {store.name}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {store.category}
                            </span>
                            {store.verified && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-blue-600" />
                                <span>Verificada</span>
                              </span>
                            )}
                            {store.featured && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>Destaque</span>
                              </span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              store.active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-500'
                            }`}>
                              {store.active !== false ? 'Ativa' : 'Inativa'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                            {store.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-red-600" />
                              <span>{store.city}/{store.state || 'SP'}</span>
                            </span>
                            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                              <MessageCircle className="w-3 h-3" />
                              <span>{store.whatsapp}</span>
                            </span>
                            <span className="flex items-center gap-1 text-slate-600 font-semibold">
                              <ShoppingBag className="w-3 h-3 text-red-600" />
                              <span>{storeProds.length} itens cadastrados</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        {onPreviewStore && (
                          <button
                            type="button"
                            onClick={() => onPreviewStore(store.slug)}
                            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                            title="Ver Minisite Público"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStoreForProducts(store.id);
                            setAdminTab('products');
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                          title="Gerenciar Produtos desta Loja"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-red-600" />
                          <span>Produtos ({storeProds.length})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenStoreForm(store)}
                          className="p-2 text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                          title="Editar Loja"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteStore(store.id, store.name)}
                          className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Excluir Loja"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS AND SERVICES MANAGEMENT */}
      {adminTab === 'products' && (
        <div className="space-y-6">
          {/* Store Selector Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Selecione a Loja para Gerenciar Itens:
                </label>
                <select
                  value={selectedStoreForProducts}
                  onChange={(e) => setSelectedStoreForProducts(e.target.value)}
                  className="mt-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600"
                >
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({products.filter(p => p.businessId === s.id).length} itens)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenProductForm(undefined, selectedStoreForProducts)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Produto / Serviço</span>
            </button>
          </div>

          {/* Products List for Selected Store */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Itens cadastrados em:</span>
                  <span className="text-red-600">{currentStoreForProducts?.name}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Estes itens aparecem nos "boxes de produtos / serviços" do minisite da loja.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {currentStoreProductsList.length} itens
              </span>
            </div>

            {currentStoreProductsList.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Nenhum produto ou serviço cadastrado nesta loja.</p>
                <button
                  type="button"
                  onClick={() => handleOpenProductForm(undefined, selectedStoreForProducts)}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
                >
                  Cadastrar Primeiro Item
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {currentStoreProductsList.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={(prod.images && prod.images[0]) || currentStoreForProducts?.logoUrl}
                        alt={prod.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">
                            {prod.name}
                          </h4>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            prod.type === 'service' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {prod.type === 'service' ? 'Serviço' : 'Produto'}
                          </span>
                          {prod.category && (
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              {prod.category}
                            </span>
                          )}
                          {prod.featured && (
                            <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded flex items-center gap-0.5">
                              <Sparkles className="w-3 h-3 text-amber-500" /> Destaque
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                          {prod.shortDescription || prod.description}
                        </p>

                        <div className="flex items-center gap-3 text-xs pt-1">
                          <span className="font-black text-emerald-600">
                            {prod.priceFormatted || (prod.price ? `R$ ${prod.price.toFixed(2).replace('.', ',')}` : 'Sob Consulta')}
                          </span>
                          {prod.images && prod.images.length > 1 && (
                            <span className="text-slate-400 text-[11px]">
                              • {prod.images.length} fotos cadastradas
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenProductForm(prod)}
                        className="p-2 text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                        title="Editar Produto"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Excluir Produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CONFIGURATION (TAB NAME & TOGGLE) */}
      {adminTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-red-600" />
              <span>Configuração Geral da Aba no Site</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Altere o nome da aba no cabeçalho do portal ou desative o Guia Empresarial quando quiser.
            </p>
          </div>

          {/* Toggle Enable/Disable Tab */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Exibir Aba de Guia no Cabeçalho e Rodapé do Site
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {config.enabled 
                  ? 'A aba está visível no menu do site com os minisites ativos.' 
                  : 'A aba está oculta para os visitantes (desativada).'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  config.enabled ? 'bg-red-600' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={config.enabled}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    config.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-xs font-bold ${config.enabled ? 'text-red-600' : 'text-slate-400'}`}>
                {config.enabled ? 'Habilitada' : 'Desativada'}
              </span>
            </div>
          </div>

          {/* Tab Name Customization */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nome da Aba (Exibido no Menu do Site)
            </label>
            <input
              type="text"
              value={config.tabName}
              onChange={(e) => setConfig(prev => ({ ...prev, tabName: e.target.value }))}
              placeholder="Guia Empresarial"
              required
              className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
            />
            <p className="text-[11px] text-slate-400">
              Você pode alterar para: "Guia Comercial", "Comércio Local", "Classificados", "Lojas da Cidade", etc.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Descrição Pública do Guia
            </label>
            <textarea
              rows={3}
              value={config.description || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o propósito do guia na página inicial do diretório..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              Salvar Alterações da Aba
            </button>
          </div>
        </form>
      )}

      {/* MODAL: CADASTRO / EDIÇÃO DE LOJA */}
      {isStoreFormOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto"
          onClick={() => setIsStoreFormOpen(false)}
        >
          <div 
            className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-slate-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-red-600" />
                  <span>{editingStore ? 'Editar Loja / Minisite' : 'Cadastrar Nova Loja'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Preencha os dados da loja, informações de contato e localização no Google Maps.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsStoreFormOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStore} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nome da Loja / Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => {
                      setStoreName(e.target.value);
                      if (!editingStore) setStoreSlug(slugify(e.target.value));
                    }}
                    placeholder="Ex: Bella Forneria Pizzaria"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Slug / Link do Minisite
                  </label>
                  <input
                    type="text"
                    value={storeSlug}
                    onChange={(e) => setStoreSlug(slugify(e.target.value))}
                    placeholder="bella-forneria-pizzaria"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>

                {/* Categoria */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Categoria Comercial
                  </label>
                  <input
                    type="text"
                    value={storeCategory}
                    onChange={(e) => setStoreCategory(e.target.value)}
                    placeholder="Gastronomia, Moda, Automotivo, etc."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>

                {/* Segmento */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Segmento / Especialidade Curta
                  </label>
                  <input
                    type="text"
                    value={storeSegment}
                    onChange={(e) => setStoreSegment(e.target.value)}
                    placeholder="Pizzaria & Forno à Lenha"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>

                {/* Descrição Curta */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Resumo / Descrição da Loja
                  </label>
                  <textarea
                    rows={2}
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    placeholder="Pizzas artesanais de fermentação lenta com ingredientes nobres..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>

                {/* Sobre Nós */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Texto "Sobre Nós" no Minisite
                  </label>
                  <textarea
                    rows={3}
                    value={storeAboutText}
                    onChange={(e) => setStoreAboutText(e.target.value)}
                    placeholder="Conte a história do estabelecimento, valores e diferenciais..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>

                {/* Logo da Loja (Upload ou URL) */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Logo da Loja
                  </label>
                  <div className="flex items-center gap-3">
                    {storeLogoUrl && (
                      <img src={storeLogoUrl} alt="Prévia da Logo" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                    )}
                    <input
                      type="url"
                      value={storeLogoUrl}
                      onChange={(e) => setStoreLogoUrl(e.target.value)}
                      placeholder="URL da logo ou faça upload..."
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => storeLogoRef.current?.click()}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                    <input
                      ref={storeLogoRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('logo', e)}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Banner de Capa */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Banner de Capa do Minisite
                  </label>
                  <div className="flex items-center gap-3">
                    {storeCoverBannerUrl && (
                      <img src={storeCoverBannerUrl} alt="Prévia da Capa" className="w-16 h-10 rounded-lg object-cover border border-slate-200" />
                    )}
                    <input
                      type="url"
                      value={storeCoverBannerUrl}
                      onChange={(e) => setStoreCoverBannerUrl(e.target.value)}
                      placeholder="URL do banner de capa ou upload..."
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => storeCoverRef.current?.click()}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                    <input
                      ref={storeCoverRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('cover', e)}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1 text-emerald-700">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Comercial *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={storeWhatsapp}
                    onChange={(e) => setStoreWhatsapp(e.target.value)}
                    placeholder="5511999998888"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white font-bold"
                  />
                  <p className="text-[10px] text-slate-400">DDD + Número (apenas dígitos)</p>
                </div>

                {/* Telefone Fixo */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Telefone Fixo / Adicional
                  </label>
                  <input
                    type="text"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    placeholder="(11) 3456-7890"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                {/* Endereço */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>Endereço Completo & Cidade</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      placeholder="Rua / Avenida, Número"
                      className="sm:col-span-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      value={storeCity}
                      onChange={(e) => setStoreCity(e.target.value)}
                      placeholder="Cidade"
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* Google Maps Query */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Localização no Google Maps (Endereço para o Mapa Embutido)
                  </label>
                  <input
                    type="text"
                    value={storeGoogleMapsQuery}
                    onChange={(e) => setStoreGoogleMapsQuery(e.target.value)}
                    placeholder="Ex: Av. Paulista, 1200, São Paulo - SP"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                  <p className="text-[10px] text-slate-400">
                    O mapa do Google Maps será embutido automaticamente no minisite utilizando este endereço.
                  </p>
                </div>

                {/* Horário de Funcionamento */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Horário de Funcionamento
                  </label>
                  <input
                    type="text"
                    value={storeWorkingHours}
                    onChange={(e) => setStoreWorkingHours(e.target.value)}
                    placeholder="Ex: Terça a Domingo: 18h às 23h30"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                {/* Redes Sociais */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Instagram da Loja
                  </label>
                  <input
                    type="text"
                    value={storeInstagram}
                    onChange={(e) => setStoreInstagram(e.target.value)}
                    placeholder="@sualoja"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Site Oficial da Loja
                  </label>
                  <input
                    type="url"
                    value={storeWebsite}
                    onChange={(e) => setStoreWebsite(e.target.value)}
                    placeholder="https://sualoja.com.br"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                {/* Categorias Internas da Loja */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Menu de Categorias da Loja (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={storeCategoriesInput}
                    onChange={(e) => setStoreCategoriesInput(e.target.value)}
                    placeholder="Pizzas Tradicionais, Pizzas Especiais, Massas, Sobremesas"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                  <p className="text-[10px] text-slate-400">
                    Estas categorias formarão o menu de navegação de produtos dentro do minisite da loja.
                  </p>
                </div>

                {/* Flags Checkboxes */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={storeVerified}
                      onChange={(e) => setStoreVerified(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700">Selo Loja Verificada</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={storeFeatured}
                      onChange={(e) => setStoreFeatured(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700">Destaque no Guia</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={storeActive}
                      onChange={(e) => setStoreActive(e.target.checked)}
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700">Loja Ativa no Site</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStoreFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all"
                >
                  {editingStore ? 'Salvar Alterações' : 'Cadastrar Loja'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CADASTRO / EDIÇÃO DE PRODUTO OU SERVIÇO */}
      {isProductFormOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto"
          onClick={() => setIsProductFormOpen(false)}
        >
          <div 
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5 border border-slate-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-red-600" />
                  <span>{editingProduct ? 'Editar Produto / Serviço' : 'Novo Produto ou Serviço'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adicione fotos, descrição e preço. O cliente poderá pedir diretamente no WhatsApp da loja.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsProductFormOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Loja Associada */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Loja Vinculada *
                </label>
                <select
                  value={prodBusinessId}
                  onChange={(e) => setProdBusinessId(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800"
                >
                  {stores.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Nome do Item */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nome do Produto ou Serviço *
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ex: Pizza Artesanal Di Burrata"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Tipo */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tipo
                  </label>
                  <select
                    value={prodType}
                    onChange={(e) => setProdType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold"
                  >
                    <option value="product">Produto Físico</option>
                    <option value="service">Serviço Prestado</option>
                  </select>
                </div>

                {/* Categoria interna */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Categoria na Loja
                  </label>
                  <input
                    type="text"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    placeholder="Pizzas Especiais"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                {/* Preço formatado */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Valor / Preço
                  </label>
                  <input
                    type="text"
                    value={prodPriceFormatted}
                    onChange={(e) => setProdPriceFormatted(e.target.value)}
                    placeholder="R$ 89,90"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>

              {/* Descrição Curta */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Resumo Curto (exibido no card)
                </label>
                <input
                  type="text"
                  value={prodShortDesc}
                  onChange={(e) => setProdShortDesc(e.target.value)}
                  placeholder="Massa fermentação natural 48h, San Marzano, mozzarella e burrata..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Descrição Detalhada */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Descrição Completa e Detalhada (exibida ao abrir o produto)
                </label>
                <textarea
                  rows={4}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Descreva detalhadamente os ingredientes, materiais, tempo de preparo, tamanhos disponíveis..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Galeria de Fotos */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Fotos do Produto / Serviço ({prodImages.length} fotos)
                  </label>
                  <button
                    type="button"
                    onClick={() => prodImageRef.current?.click()}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto</span>
                  </button>
                  <input
                    ref={prodImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('product', e)}
                    className="hidden"
                  />
                </div>

                {/* Add Photo by URL */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={prodNewImageUrl}
                    onChange={(e) => setProdNewImageUrl(e.target.value)}
                    placeholder="Ou cole uma URL de imagem aqui..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (prodNewImageUrl.trim()) {
                        setProdImages(prev => [...prev, prodNewImageUrl.trim()]);
                        setProdNewImageUrl('');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Adicionar
                  </button>
                </div>

                {/* Images Previews */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {prodImages.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProdImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remover foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mensagem customizada para WhatsApp */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Mensagem Personalizada ao Clicar no WhatsApp (Opcional)</span>
                </label>
                <input
                  type="text"
                  value={prodWhatsappMsg}
                  onChange={(e) => setProdWhatsappMsg(e.target.value)}
                  placeholder="Olá! Gostaria de pedir este item visto no Guia Empresarial."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Flags */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="text-xs font-bold text-slate-700">Destaque na Loja</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodActive}
                    onChange={(e) => setProdActive(e.target.checked)}
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                  <span className="text-xs font-bold text-slate-700">Item Ativo</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
