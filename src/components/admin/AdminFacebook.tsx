import React, { useState } from 'react';
import { 
  Facebook, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Send, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Key, 
  ExternalLink,
  Shield,
  FileText,
  Clock,
  RotateCcw
} from 'lucide-react';
import { FacebookConfig, FacebookLog, Article } from '../../types';
import { storageService } from '../../services/storageService';
import { facebookService } from '../../services/facebookService';

interface AdminFacebookProps {
  config: FacebookConfig;
  articles: Article[];
  onRefresh?: () => void;
}

export const AdminFacebook: React.FC<AdminFacebookProps> = ({ config, articles, onRefresh }) => {
  const [pageId, setPageId] = useState(config.pageId);
  const [pageName, setPageName] = useState(config.pageName);
  const [pageAccessToken, setPageAccessToken] = useState(config.pageAccessToken);
  const [connected, setConnected] = useState(config.connected);
  const [autoPublishEnabled, setAutoPublishEnabled] = useState(config.autoPublishEnabled);
  const [defaultTemplate, setDefaultTemplate] = useState(config.defaultTemplate);

  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [retryingArticleId, setRetryingArticleId] = useState<string | null>(null);

  const logs = storageService.getFacebookLogs();

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: FacebookConfig = {
      ...config,
      connected,
      pageId: pageId.trim(),
      pageName: pageName.trim() || 'Página do Facebook',
      pageAccessToken: pageAccessToken.trim(),
      autoPublishEnabled,
      defaultTemplate,
      lastCheckStatus: config.lastCheckStatus || 'idle'
    };

    storageService.saveFacebookConfig(updated);
    setMessage({ type: 'success', text: 'Configurações da Meta/Facebook Graph API salvas com sucesso!' });
    onRefresh?.();
    setTimeout(() => setMessage(null), 3500);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const tempConfig: FacebookConfig = {
      ...config,
      pageId: pageId.trim(),
      pageName: pageName.trim(),
      pageAccessToken: pageAccessToken.trim(),
    };

    const res = await facebookService.testConnection(tempConfig);
    setIsTesting(false);
    setTestResult(res);

    if (res.success && res.pageName) {
      setPageName(res.pageName);
      setConnected(true);
    }
  };

  const handleToggleConnection = () => {
    const nextState = !connected;
    setConnected(nextState);
    storageService.saveFacebookConfig({
      ...config,
      connected: nextState
    });
    onRefresh?.();
  };

  const handleRetryPublish = async (log: FacebookLog) => {
    const article = articles.find(a => a.id === log.articleId);
    if (!article) {
      alert('Matéria não encontrada no sistema.');
      return;
    }

    setRetryingArticleId(article.id);
    const res = await facebookService.publishArticleToFacebook(article, false);
    setRetryingArticleId(null);

    if (res.success) {
      alert(`Reenvio concluído: ${res.message}`);
    } else {
      alert(`Falha no reenvio: ${res.message}`);
    }
    onRefresh?.();
  };

  // Preview generated text using sample article
  const sampleArticle = articles[0] || {
    id: 'sample',
    title: 'Congresso aprova novo marco das energias limpas',
    subtitle: 'Texto estabelece incentivos fiscais para usinas solares e eólicas.',
    categoryName: 'Política',
    author: 'Mariana Drummond',
    slug: 'congresso-aprova-novo-marco'
  };

  const previewFormattedText = facebookService.formatPublicationMessage(
    defaultTemplate, 
    sampleArticle as any, 
    typeof window !== 'undefined' ? window.location.origin : 'https://portalnoticias.com.br'
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Integrações Oficiais</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Facebook className="w-6 h-6 text-blue-600 fill-current" />
          <span>Meta / Facebook Graph API</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure a conexão com a sua Página do Facebook para publicar matérias de forma manual ou 100% automatizada.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Connection Status Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        connected ? 'bg-blue-50/70 border-blue-200' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            connected ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-300 text-slate-600'
          }`}>
            <Facebook className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {connected ? `Página Conectada: ${pageName || 'Portal Notícias'}` : 'Integração com Facebook Desconectada'}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                connected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {connected ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {connected 
                ? `Page ID: ${pageId} • Publicação automática: ${autoPublishEnabled ? 'Habilitada' : 'Desabilitada'}` 
                : 'Conecte sua Página do Facebook para enviar publicações com 1 clique diretamente do site.'}
            </p>
            {config.lastPublishDate && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                Última postagem registrada em: {new Date(config.lastPublishDate).toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testando...' : 'Testar Conexão'}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleConnection}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs ${
              connected 
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {connected ? 'Desconectar Página' : 'Conectar Página'}
          </button>
        </div>
      </div>

      {/* Test Connection Output Alert */}
      {testResult && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-3 ${
          testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {testResult.success ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          <div>
            <p className="font-bold">{testResult.success ? 'Conexão Testada com Sucesso!' : 'Aviso no Teste de Conexão'}</p>
            <p className="font-normal mt-0.5">{testResult.message}</p>
          </div>
        </div>
      )}

      {/* Config Form */}
      <form onSubmit={handleSaveConfig} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Credenciais da Página do Facebook</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Dados de autenticação oficiais da Meta Graph API para a página.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nome de Exibição da Página
            </label>
            <input
              type="text"
              required
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              placeholder="Ex: Portal Notícias Oficial"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Facebook Page ID *
            </label>
            <input
              type="text"
              required
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              placeholder="Ex: 104829104829104"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Encontre no Painel da Página no Facebook → Sobre → ID da Página.
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Page Access Token (Meta Graph API) *
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              required
              value={pageAccessToken}
              onChange={(e) => setPageAccessToken(e.target.value)}
              placeholder="EAAG... (Token de Acesso da Página da Meta)"
              className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
            <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            🔒 O token é armazenado com segurança nas configurações locais. Nunca é exposto publicamente no front-end.
          </p>
        </div>

        {/* Auto Publish Switch */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Publicação Automática Habilitada
            </span>
            <span className="text-[11px] text-slate-500">
              Quando ativado, matérias com a opção "Publicar automaticamente no Facebook" marcada serão enviadas ao salvar.
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoPublishEnabled}
              onChange={(e) => setAutoPublishEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>

        {/* Configurable Publication Template */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Modelo do Texto da Publicação (Template)
            </label>
            <span className="text-[11px] text-slate-400">Variáveis: [TITULO], [RESUMO], [LINK], [CATEGORIA], [AUTOR]</span>
          </div>

          <textarea
            rows={5}
            value={defaultTemplate}
            onChange={(e) => setDefaultTemplate(e.target.value)}
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 leading-relaxed focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />

          {/* Live Template Preview */}
          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Prévia do Post Gerado para o Facebook:
            </span>
            <div className="p-4 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap font-sans shadow-xs">
              {previewFormattedText}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Salvar Configurações do Facebook</span>
          </button>
        </div>
      </form>

      {/* Publication History Log */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Histórico de Publicações no Facebook</span>
            </h3>
            <p className="text-xs text-slate-500">
              Registro das últimas postagens enviadas para a Página oficial com status de envio e link direto.
            </p>
          </div>

          {logs.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Deseja limpar os logs de publicação do Facebook?')) {
                  storageService.clearFacebookLogs();
                  onRefresh?.();
                }
              }}
              className="text-xs text-slate-400 hover:text-red-600"
            >
              Limpar Histórico
            </button>
          )}
        </div>

        {logs.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status === 'success' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {log.status === 'success' ? 'Sucesso' : 'Erro'}
                    </span>
                    <span className="font-bold text-slate-900 truncate">{log.articleTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{log.message}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </span>
                    {log.facebookPostId && (
                      <span className="font-mono text-blue-600">ID Post: {log.facebookPostId}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {log.status === 'error' && (
                    <button
                      disabled={retryingArticleId === log.articleId}
                      onClick={() => handleRetryPublish(log)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-1 text-xs"
                    >
                      <RotateCcw className={`w-3 h-3 ${retryingArticleId === log.articleId ? 'animate-spin' : ''}`} />
                      <span>{retryingArticleId === log.articleId ? 'Tentando...' : 'Tentar Novamente'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            Nenhuma publicação registrada no histórico até o momento.
          </div>
        )}
      </div>
    </div>
  );
};
