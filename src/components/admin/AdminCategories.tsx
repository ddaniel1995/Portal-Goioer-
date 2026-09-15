import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Layers, Check, AlertCircle, Eye, EyeOff, Home } from 'lucide-react';
import { Category, Article } from '../../types';
import { storageService, slugify } from '../../services/storageService';

interface AdminCategoriesProps {
  categories: Category[];
  articles: Article[];
  onRefresh: () => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  articles,
  onRefresh,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#2563eb');
  const [description, setDescription] = useState('');
  const [showOnHome, setShowOnHome] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setColor('#2563eb');
    setDescription('');
    setShowOnHome(true);
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setColor(cat.color || '#2563eb');
    setDescription(cat.description || '');
    setShowOnHome(cat.showOnHome ?? true);
  };

  const handleToggleShowOnHome = (cat: Category) => {
    const updated = {
      ...cat,
      showOnHome: !(cat.showOnHome ?? true)
    };
    storageService.saveCategory(updated);
    onRefresh();
    setMessage({
      type: 'success',
      text: updated.showOnHome
        ? `Categoria "${cat.name}" agora será exibida na Home!`
        : `Categoria "${cat.name}" foi ocultada da Home.`
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'O nome da categoria é obrigatório.' });
      return;
    }

    storageService.saveCategory({
      id: editingId || undefined,
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      color,
      description: description.trim(),
      showOnHome,
      order: editingId ? (categories.find(c => c.id === editingId)?.order || categories.length) : categories.length + 1
    });

    setMessage({ 
      type: 'success', 
      text: editingId ? 'Categoria atualizada com sucesso!' : 'Nova categoria criada com sucesso!' 
    });
    resetForm();
    onRefresh();
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = (cat: Category) => {
    const hasArticles = articles.some(a => a.categoryId === cat.id);
    if (hasArticles) {
      alert(`Não é possível excluir a categoria "${cat.name}" pois existem matérias vinculadas a ela. Mova as matérias antes de excluir.`);
      return;
    }

    if (window.confirm(`Deseja realmente excluir a categoria "${cat.name}"?`)) {
      storageService.deleteCategory(cat.id);
      onRefresh();
      setMessage({ type: 'success', text: 'Categoria removida.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const moveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;

    // Reassign order numbers
    newCategories.forEach((c, idx) => {
      c.order = idx + 1;
    });

    storageService.saveCategories(newCategories);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Gerenciamento de Categorias
        </h2>
        <p className="text-xs text-slate-500">
          Crie, edite e organize a ordem em que as seções de notícias aparecem na Home e no menu do site.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Two Columns: Category Creator / Editor + Category Reorderable List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-fit">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-red-600" />
            <span>{editingId ? 'Editar Categoria' : 'Nova Categoria'}</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nome da Categoria *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingId) setSlug(slugify(e.target.value));
                }}
                placeholder="Ex: Tecnologia, Meio Ambiente..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Identificador (Slug / URL)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ex: tecnologia"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Cor de Destaque
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-600">{color}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Descrição Curta
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição temática da editoria..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Show on Homepage Toggle */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showOnHome}
                  onChange={(e) => setShowOnHome(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-red-600" />
                  <span>Exibir esta categoria na Home do site</span>
                </span>
              </label>
              <p className="text-[11px] text-slate-500 pl-6 leading-tight">
                Se desmarcado, a categoria permanece no menu e na busca, mas sua seção de matérias fica oculta da página inicial.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                {editingId ? 'Atualizar Categoria' : 'Salvar Categoria'}
              </button>
            </div>
          </form>
        </div>

        {/* Categories List with Ordering (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Categorias Cadastradas ({categories.length})
              </h3>
              <p className="text-[11px] text-slate-400">Ordene ou ative/desative a exibição na Home com um clique</p>
            </div>
            <span className="text-[11px] text-slate-400">Use as setas para reorganizar</span>
          </div>

          <div className="space-y-2">
            {categories.map((cat, index) => {
              const articleCount = articles.filter(a => a.categoryId === cat.id).length;
              const isVisibleOnHome = cat.showOnHome !== false;

              return (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isVisibleOnHome
                      ? 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                      : 'bg-slate-100/70 border-dashed border-slate-300 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: cat.color || '#2563eb' }} 
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{cat.name}</p>
                        {isVisibleOnHome ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                            <Home className="w-2.5 h-2.5" />
                            <span>Na Home</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200/80 text-slate-600 shrink-0">
                            <EyeOff className="w-2.5 h-2.5" />
                            <span>Oculta da Home</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">/{cat.slug} • {articleCount} matérias</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {/* Instant Toggle Home Visibility */}
                    <button
                      type="button"
                      onClick={() => handleToggleShowOnHome(cat)}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isVisibleOnHome
                          ? 'text-emerald-700 hover:bg-emerald-100/70'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                      }`}
                      title={isVisibleOnHome ? 'Clique para ocultar esta seção da Home' : 'Clique para exibir esta seção na Home'}
                    >
                      {isVisibleOnHome ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Move Up */}
                    <button
                      disabled={index === 0}
                      onClick={() => moveOrder(index, 'up')}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    {/* Move Down */}
                    <button
                      disabled={index === categories.length - 1}
                      onClick={() => moveOrder(index, 'down')}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    {/* Edit */}
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="p-1 rounded text-slate-500 hover:text-slate-800"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1 rounded text-slate-400 hover:text-red-600"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
