import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Facebook, 
  Play, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  AlertCircle, 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Calendar, 
  User,
  X,
  Share2
} from 'lucide-react';
import { Article, Category } from '../../types';
import { storageService, extractYoutubeId } from '../../services/storageService';
import { facebookService } from '../../services/facebookService';
import { ArticlePreviewModal } from './ArticlePreviewModal';

interface AdminArticlesProps {
  articles: Article[];
  categories: Category[];
  editingArticle?: Article | null;
  onClearEditing: () => void;
  onRefresh: () => void;
}

export const AdminArticles: React.FC<AdminArticlesProps> = ({
  articles,
  categories,
  editingArticle,
  onClearEditing,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [isFormOpen, setIsFormOpen] = useState(Boolean(editingArticle));
  const [previewArticle, setPreviewArticle] = useState<Partial<Article> | null>(null);

  // Form State
  const [id, setId] = useState<string | undefined>(editingArticle?.id);
  const [title, setTitle] = useState(editingArticle?.title || '');
  const [subtitle, setSubtitle] = useState(editingArticle?.subtitle || '');
  const [categoryId, setCategoryId] = useState(editingArticle?.categoryId || (categories[0]?.id || ''));
  const [content, setContent] = useState(editingArticle?.content || '');
  const [featuredImage, setFeaturedImage] = useState(editingArticle?.featuredImage || '');
  const [imageCaption, setImageCaption] = useState(editingArticle?.imageCaption || '');
  const [additionalImages, setAdditionalImages] = useState<string[]>(editingArticle?.additionalImages || []);
  const [newAddImageUrl, setNewAddImageUrl] = useState('');
  const [author, setAuthor] = useState(editingArticle?.author || 'Redação');
  const [authorRole, setAuthorRole] = useState(editingArticle?.authorRole || 'Redator');
  const [publishedAt, setPublishedAt] = useState(editingArticle?.publishedAt || new Date().toISOString().slice(0, 16));
  const [youtubeUrl, setYoutubeUrl] = useState(editingArticle?.youtubeUrl || '');
  const [status, setStatus] = useState<'published' | 'draft'>(editingArticle?.status || 'published');
  const [facebookAutoPublish, setFacebookAutoPublish] = useState(editingArticle?.facebookAutoPublish ?? false);

  // Feedback states
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPublishingFb, setIsPublishingFb] = useState(false);

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to sync when editingArticle prop changes
  React.useEffect(() => {
    if (editingArticle) {
      setId(editingArticle.id);
      setTitle(editingArticle.title);
      setSubtitle(editingArticle.subtitle);
      setCategoryId(editingArticle.categoryId);
      setContent(editingArticle.content);
      setFeaturedImage(editingArticle.featuredImage);
      setImageCaption(editingArticle.imageCaption || '');
      setAdditionalImages(editingArticle.additionalImages || []);
      setAuthor(editingArticle.author);
      setAuthorRole(editingArticle.authorRole || 'Redator');
      setPublishedAt(editingArticle.publishedAt ? new Date(editingArticle.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));
      setYoutubeUrl(editingArticle.youtubeUrl || '');
      setStatus(editingArticle.status);
      setFacebookAutoPublish(editingArticle.facebookAutoPublish);
      setIsFormOpen(true);
    }
  }, [editingArticle]);

  const resetForm = () => {
    setId(undefined);
    setTitle('');
    setSubtitle('');
    setCategoryId(categories[0]?.id || '');
    setContent('');
    setFeaturedImage('');
    setImageCaption('');
    setAdditionalImages([]);
    setAuthor('Redação');
    setAuthorRole('Redator');
    setPublishedAt(new Date().toISOString().slice(0, 16));
    setYoutubeUrl('');
    setStatus('published');
    setFacebookAutoPublish(false);
    onClearEditing();
    setIsFormOpen(false);
  };

  const handleOpenNew = () => {
    resetForm();
    setIsFormOpen(true);
  };

  // Image Upload handler (converts file to Base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFeaturedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Text formatting insertion helpers
  const insertFormatting = (tagOpen: string, tagClose: string = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${tagOpen}${selectedText || 'texto'}${tagClose}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + (selectedText.length || 5));
    }, 50);
  };

  const handleAddAdditionalImage = () => {
    if (newAddImageUrl.trim()) {
      setAdditionalImages([...additionalImages, newAddImageUrl.trim()]);
      setNewAddImageUrl('');
    }
  };

  const handleRemoveAdditionalImage = (idx: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== idx));
  };

  const isPodcast = categoryId === 'cat-podcast' || 
    categories.find(c => c.id === categoryId)?.slug === 'podcast' ||
    categories.find(c => c.id === categoryId)?.name.toLowerCase().includes('podcast');

  // Save Article
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage({ type: 'error', text: 'O título da matéria/episódio é obrigatório.' });
      return;
    }

    if (!categoryId) {
      setMessage({ type: 'error', text: 'Selecione uma categoria para a matéria.' });
      return;
    }

    // If Podcast, extract thumbnail from YouTube if featuredImage is empty
    const ytId = extractYoutubeId(youtubeUrl);
    let resolvedImage = featuredImage.trim();
    if (!resolvedImage && ytId) {
      resolvedImage = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
    if (!resolvedImage) {
      resolvedImage = isPodcast 
        ? 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop';
    }

    const saved = storageService.saveArticle({
      id,
      title: title.trim(),
      subtitle: subtitle.trim(),
      categoryId,
      content: content.trim() || (subtitle.trim() ? `<p>${subtitle.trim()}</p>` : `<p>${title.trim()}</p>`),
      featuredImage: resolvedImage,
      imageCaption: imageCaption.trim(),
      additionalImages,
      author: author.trim() || 'Redação',
      authorRole: authorRole.trim() || (isPodcast ? 'Apresentador' : 'Redator'),
      publishedAt: new Date(publishedAt).toISOString(),
      youtubeUrl: youtubeUrl.trim(),
      status,
      facebookAutoPublish,
    });

    setMessage({ type: 'success', text: 'Matéria salva com sucesso no portal!' });

    // Handle Facebook Auto-Publish if enabled and published
    if (facebookAutoPublish && status === 'published' && !saved.facebookPublished) {
      setIsPublishingFb(true);
      const fbResult = await facebookService.publishArticleToFacebook(saved, true);
      setIsPublishingFb(false);
      if (fbResult.success) {
        setMessage({ type: 'success', text: 'Matéria salva e publicada automaticamente no Facebook com sucesso!' });
      } else {
        setMessage({ type: 'error', text: `Matéria salva no portal, mas a publicação no Facebook retornou: ${fbResult.message}` });
      }
    }

    onRefresh();
    setTimeout(() => {
      resetForm();
    }, 1200);
  };

  // Manual Facebook Publish
  const handlePublishNowToFacebook = async (articleToPublish: Article) => {
    setIsPublishingFb(true);
    const result = await facebookService.publishArticleToFacebook(articleToPublish, false);
    setIsPublishingFb(false);

    if (result.success) {
      alert(`Sucesso! ${result.message}`);
    } else {
      alert(`Aviso: ${result.message}`);
    }
    onRefresh();
  };

  // Delete Article
  const handleDelete = (idToDelete: string, titleToDelete: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a matéria "${titleToDelete}"? Esta ação é irreversível.`)) {
      storageService.deleteArticle(idToDelete);
      onRefresh();
      if (id === idToDelete) {
        resetForm();
      }
    }
  };

  // Open Preview Modal
  const handleOpenPreview = () => {
    const selectedCat = categories.find(c => c.id === categoryId);
    setPreviewArticle({
      title,
      subtitle,
      categoryId,
      categoryName: selectedCat ? selectedCat.name : 'Geral',
      content,
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop',
      imageCaption,
      additionalImages,
      author,
      authorRole,
      publishedAt: new Date(publishedAt).toISOString(),
      youtubeUrl,
      status,
    });
  };

  // Filter list
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || article.categoryId === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const previewYoutubeId = extractYoutubeId(youtubeUrl);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Gerenciamento de Matérias
          </h2>
          <p className="text-xs text-slate-500">
            Cadastre, edite, organize categorias e publique conteúdos no portal e no Facebook.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Matéria</span>
        </button>
      </div>

      {/* Form Modal / Drawer */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl border-2 border-red-500/30 p-6 sm:p-8 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              {id ? 'Editar Matéria' : 'Cadastrar Nova Matéria'}
            </h3>
            <button
              onClick={resetForm}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Podcast Mode Notice Banner */}
            {isPodcast && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-3">
                <Play className="w-5 h-5 text-purple-600 fill-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs text-purple-900">
                  <span className="font-bold block text-sm mb-0.5">Modo Galeria de Podcast / Vídeo</span>
                  Cadastre o <strong>Título do episódio</strong> e insira o <strong>link direto do YouTube</strong> abaixo. O episódio será listado automaticamente na galeria de Podcasts e poderá ser reproduzido diretamente no site pelos visitantes.
                </div>
              </div>
            )}

            {/* Title & Subtitle */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isPodcast ? 'Título do Episódio do Podcast *' : 'Título da Matéria *'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isPodcast ? "Ex: Episódio #12 - O Futuro da Tecnologia e IA no Brasil" : "Ex: Congresso aprova novo marco das energias renováveis"}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isPodcast ? 'Descrição / Sinopse do Episódio' : 'Subtítulo / Resumo da Notícia'}
                </label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder={isPodcast ? "Breve resumo dos temas abordados e convidados deste episódio..." : "Breve resumo da matéria que aparecerá nos cards da Home e na publicação do Facebook."}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            {/* Category, Status & Author Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Categoria *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Status de Publicação
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600"
                >
                  <option value="published">Publicado no Site</option>
                  <option value="draft">Rascunho (Oculto)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Autor da Notícia
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nome do repórter"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Data e Hora de Publicação
                </label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            {/* Featured Image Section */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Imagem de Destaque
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder="Cole o link da imagem (HTTPS) ou faça upload..."
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Legenda da foto / Crédito (Ex: Foto: Agência Brasil)"
                    className="w-full mt-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 italic"
                  />
                </div>

                {featuredImage && (
                  <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-slate-200 bg-slate-200 max-h-36">
                    <img
                      src={featuredImage}
                      alt="Prévia de destaque"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* YouTube Video Section */}
            <div className={`p-4 rounded-xl border space-y-3 ${
              isPodcast ? 'bg-purple-50/50 border-purple-300 ring-2 ring-purple-100' : 'bg-slate-50 border-slate-200'
            }`}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Play className={`w-4 h-4 fill-current ${isPodcast ? 'text-purple-600' : 'text-red-600'}`} />
                <span>
                  {isPodcast ? 'Link Direto do Vídeo no YouTube (Player da Galeria de Podcasts) *' : 'Vídeo do YouTube (Opcional)'}
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="Ex: https://www.youtube.com/watch?v=ScMzIvxBSi4 ou https://youtu.be/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isPodcast
                      ? 'Cole o link do vídeo do YouTube. Os usuários poderão assistir o episódio completo diretamente na Galeria de Podcasts!'
                      : 'O ID do vídeo será extraído automaticamente e o reprodutor oficial incorporado será exibido na matéria.'}
                  </p>
                </div>

                {previewYoutubeId && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-300 bg-black max-h-36">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${previewYoutubeId}`}
                      title="Prévia do YouTube"
                      className="w-full h-full border-0"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Rich Text Editor for Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Texto Completo da Matéria *
                </label>
                <span className="text-[11px] text-slate-400">Suporta HTML e formatação rápida</span>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700">
                <button
                  type="button"
                  onClick={() => insertFormatting('<h2>', '</h2>')}
                  className="p-1.5 hover:bg-white rounded font-bold flex items-center gap-1"
                  title="Subtítulo H2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<h3>', '</h3>')}
                  className="p-1.5 hover:bg-white rounded font-bold flex items-center gap-1"
                  title="Subtítulo H3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting('<strong>', '</strong>')}
                  className="p-1.5 hover:bg-white rounded font-bold"
                  title="Negrito"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<em>', '</em>')}
                  className="p-1.5 hover:bg-white rounded italic"
                  title="Itálico"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting('<blockquote>', '</blockquote>')}
                  className="p-1.5 hover:bg-white rounded"
                  title="Citação"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<ul>\n<li>Item 1</li>\n<li>Item 2</li>\n</ul>')}
                  className="p-1.5 hover:bg-white rounded"
                  title="Lista com marcadores"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<ol>\n<li>Item 1</li>\n<li>Item 2</li>\n</ol>')}
                  className="p-1.5 hover:bg-white rounded"
                  title="Lista numerada"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('Insira o link de destino (HTTPS):', 'https://');
                    if (url) insertFormatting(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>');
                  }}
                  className="p-1.5 hover:bg-white rounded"
                  title="Inserir Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const img = prompt('URL da imagem a ser inserida no meio do texto:');
                    if (img) insertFormatting(`<img src="${img}" alt="Foto ilustrativa" class="w-full rounded-xl my-4" />`);
                  }}
                  className="p-1.5 hover:bg-white rounded"
                  title="Inserir Imagem Inline"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Textarea */}
              <textarea
                ref={contentTextareaRef}
                rows={isPodcast ? 5 : 10}
                required={!isPodcast}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={isPodcast ? "Notas do episódio, links citados ou transcrição (opcional)..." : "Escreva aqui o texto completo da matéria utilizando os botões de formatação acima ou tags HTML comuns (<p>, <h2>, <strong>, <blockquote>)..."}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-600 leading-relaxed"
              />
            </div>

            {/* Additional Images Section */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Galeria de Imagens Adicionais
              </label>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={newAddImageUrl}
                  onChange={(e) => setNewAddImageUrl(e.target.value)}
                  placeholder="URL da imagem adicional..."
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleAddAdditionalImage}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900"
                >
                  Adicionar à Galeria
                </button>
              </div>

              {additionalImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {additionalImages.map((img, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 aspect-16/10 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveAdditionalImage(i)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Facebook Options Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <Facebook className="w-5 h-5 text-blue-600 fill-current" />
                <span className="text-xs font-bold text-blue-900">Integração com o Facebook</span>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={facebookAutoPublish}
                  onChange={(e) => setFacebookAutoPublish(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-700">
                  Publicar automaticamente no Facebook ao salvar como "Publicado"
                </span>
              </label>

              <p className="text-[11px] text-slate-500 pl-6">
                Utiliza a imagem de destaque, o título como chamada, o resumo e o link oficial da notícia.
              </p>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenPreview}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-4 h-4 text-slate-600" />
                  <span>Visualizar Matéria</span>
                </button>

                {id && status === 'published' && (
                  <button
                    type="button"
                    disabled={isPublishingFb}
                    onClick={() => {
                      const cur = articles.find(a => a.id === id);
                      if (cur) handlePublishNowToFacebook(cur);
                    }}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Facebook className="w-4 h-4 fill-current" />
                    <span>{isPublishingFb ? 'Publicando...' : 'Publicar agora no Facebook'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPublishingFb}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {id ? 'Atualizar Matéria' : 'Salvar Matéria'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por título ou autor..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-red-600"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-red-600"
          >
            <option value="all">Todos os Status</option>
            <option value="published">Apenas Publicados</option>
            <option value="draft">Apenas Rascunhos</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Matéria</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Facebook</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={article.featuredImage}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0 max-w-sm sm:max-w-md">
                        <p className="font-bold text-slate-900 line-clamp-1">{article.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{article.subtitle || 'Sem resumo'}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                          <span>Por {article.author}</span>
                          {article.youtubeUrl && (
                            <span className="flex items-center gap-0.5 text-red-600 font-bold">
                              <Play className="w-2.5 h-2.5 fill-current" /> Vídeo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold">
                      {article.categoryName}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                    {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(article.publishedAt))}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      article.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {article.facebookPublished ? (
                      <span className="inline-flex items-center gap-1 text-blue-600 font-bold text-[11px]">
                        <Facebook className="w-3.5 h-3.5 fill-current" />
                        Publicado
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePublishNowToFacebook(article)}
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors text-[11px]"
                        title="Publicar agora no Facebook"
                      >
                        <Facebook className="w-3.5 h-3.5" />
                        <span>Publicar</span>
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setPreviewArticle(article);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        title="Pré-visualizar matéria"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setId(article.id);
                          setTitle(article.title);
                          setSubtitle(article.subtitle);
                          setCategoryId(article.categoryId);
                          setContent(article.content);
                          setFeaturedImage(article.featuredImage);
                          setImageCaption(article.imageCaption || '');
                          setAdditionalImages(article.additionalImages || []);
                          setAuthor(article.author);
                          setAuthorRole(article.authorRole || 'Redator');
                          setPublishedAt(new Date(article.publishedAt).toISOString().slice(0, 16));
                          setYoutubeUrl(article.youtubeUrl || '');
                          setStatus(article.status);
                          setFacebookAutoPublish(article.facebookAutoPublish);
                          setIsFormOpen(true);
                          window.scrollTo({ top: 100, behavior: 'smooth' });
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        title="Editar matéria"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                        title="Excluir matéria"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewArticle && (
        <ArticlePreviewModal
          article={previewArticle}
          onClose={() => setPreviewArticle(null)}
        />
      )}
    </div>
  );
};
