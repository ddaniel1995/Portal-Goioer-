import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  FolderCheck, 
  Database, 
  HardDrive,
  Info,
  Save,
  Check
} from 'lucide-react';
import { supabaseStorageService, SupabaseStorageConfig } from '../../services/supabaseStorageService';

export const AdminStorage: React.FC = () => {
  const [config, setConfig] = useState<SupabaseStorageConfig>(supabaseStorageService.getConfig());
  const [url, setUrl] = useState(config.url);
  const [anonKey, setAnonKey] = useState(config.anonKey);
  const [bucket, setBucket] = useState(config.bucket || 'portal-images');
  const [enabled, setEnabled] = useState(config.enabled);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const current = supabaseStorageService.getConfig();
    setConfig(current);
    setUrl(current.url);
    setAnonKey(current.anonKey);
    setBucket(current.bucket);
    setEnabled(current.enabled);
  }, []);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = supabaseStorageService.saveConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
      bucket: bucket.trim() || 'portal-images',
      enabled,
    });
    setConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    // Save first so test runs against current inputs
    supabaseStorageService.saveConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
      bucket: bucket.trim() || 'portal-images',
      enabled: true,
    });

    setTesting(true);
    setTestResult(null);

    const result = await supabaseStorageService.testConnection();
    setTestResult(result);
    setTesting(false);
  };

  const isConnected = config.enabled && config.url && config.anonKey;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Cloud className="w-6 h-6 text-emerald-600" />
            <span>Armazenamento de Imagens & Nuvem (Supabase)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Armazene todas as fotos das matérias, banners, guia comercial e logos permanentemente na nuvem para que nunca sejam apagadas ao atualizar a página.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Nuvem Supabase Ativa
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <HardDrive className="w-3.5 h-3.5 text-amber-600" />
              Armazenamento Local Otimizado
            </span>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Configurações de armazenamento salvas com sucesso!</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                Ativar Envio para o Supabase Storage
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500">
                Ao ativar, toda nova imagem enviada (matérias, banners, guia) será hospedada permanentemente nos servidores da Supabase com link público seguro (HTTPS).
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supabase URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Supabase Project URL *
              </label>
              <input
                type="url"
                required={enabled}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo-seu-projeto.supabase.co"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Disponível no menu <strong>Project Settings &gt; API</strong> do seu projeto Supabase.
              </p>
            </div>

            {/* Bucket Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nome do Bucket de Armazenamento *
              </label>
              <input
                type="text"
                required={enabled}
                value={bucket}
                onChange={(e) => setBucket(e.target.value)}
                placeholder="portal-images"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Nome do Bucket no Supabase Storage (recomendado: <code>portal-images</code> ou <code>images</code>).
              </p>
            </div>
          </div>

          {/* Anon / Public Key */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Supabase Anon / Public API Key *
            </label>
            <input
              type="password"
              required={enabled}
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Chave pública <strong>anon key</strong> (NUNCA utilize a chave de serviço service_role).
            </p>
          </div>

          {/* Test Feedback Area */}
          {testResult && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
              testResult.success 
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800' 
                : 'bg-red-50/80 border-red-200 text-red-800'
            }`}>
              <div className="flex items-start gap-2.5">
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">{testResult.message}</p>
                  {testResult.details && (
                    <p className="mt-1 opacity-80 text-[11px] font-mono">{testResult.details}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={testing || !url || !anonKey}
              onClick={handleTestConnection}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testando Conexão...' : 'Testar Conexão com Supabase'}</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Configurações</span>
            </button>
          </div>
        </form>
      </div>

      {/* Step by Step Setup Guide */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Como Configurar o Supabase Gratuitamente em 2 Minutos</span>
          </h3>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <span>Acessar Supabase</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs mb-2">
              1
            </span>
            <p className="font-bold text-white mb-1">Crie o Projeto Gratuito</p>
            <p className="text-slate-400 leading-relaxed">
              Acesse <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">supabase.com</a>, clique em <strong>New Project</strong> e defina um nome e senha para o banco de dados.
            </p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs mb-2">
              2
            </span>
            <p className="font-bold text-white mb-1">Crie o Bucket Público</p>
            <p className="text-slate-400 leading-relaxed">
              No menu lateral esquerdo, clique em <strong>Storage</strong> &gt; <strong>New bucket</strong>. Digite o nome <code>portal-images</code> e certifique-se de marcar a opção <strong className="text-white">"Public bucket"</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs mb-2">
              3
            </span>
            <p className="font-bold text-white mb-1">Copie a URL e Anon Key</p>
            <p className="text-slate-400 leading-relaxed">
              Vá em <strong>Project Settings &gt; API</strong>. Copie a <strong>Project URL</strong> e a <strong>anon key</strong> e cole nos campos acima. Pronto!
            </p>
          </div>
        </div>

        {/* Info for GitHub / Vercel Deploy */}
        <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/40 flex items-start gap-3 text-xs text-slate-400">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-300 font-semibold mb-1">
              Deploy na Vercel ou Hospedagem GitHub:
            </p>
            <p>
              Ao fazer o deploy na <strong>Vercel</strong>, você também pode cadastrar as variáveis de ambiente <code className="text-emerald-300 font-mono">VITE_SUPABASE_URL</code> e <code className="text-emerald-300 font-mono">VITE_SUPABASE_ANON_KEY</code> no painel de Environment Variables do seu projeto. O portal as reconhecerá automaticamente!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
