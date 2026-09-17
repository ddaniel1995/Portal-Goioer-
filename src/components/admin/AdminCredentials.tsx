import React, { useState, useEffect } from 'react';
import { Key, Mail, Shield, Check, AlertCircle, Eye, EyeOff, Save, Lock } from 'lucide-react';
import { storageService, AdminCredentials as AdminCredsType } from '../../services/storageService';

export const AdminCredentialsManager: React.FC = () => {
  const [currentCreds, setCurrentCreds] = useState<AdminCredsType>({ email: '', password: '' });
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const creds = storageService.getAdminCredentials();
    setCurrentCreds(creds);
    setEmail(creds.email);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Por favor, informe um endereço de e-mail válido.' });
      return;
    }

    if (newPassword && newPassword.length < 4) {
      setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 4 caracteres.' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'A confirmação de senha não confere com a nova senha digitada.' });
      return;
    }

    setIsSaving(true);

    const passwordToSave = newPassword ? newPassword.trim() : currentCreds.password;
    const updated = storageService.saveAdminCredentials({
      email: cleanEmail,
      password: passwordToSave,
    });

    setCurrentCreds(updated);
    setNewPassword('');
    setConfirmPassword('');
    setIsSaving(false);
    setMessage({
      type: 'success',
      text: 'Login e senha de acesso atualizados com sucesso! Guarde suas novas credenciais para os próximos acessos.',
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center shrink-0 shadow-md">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight">Segurança & Credenciais de Acesso</h2>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">
            Gerencie o e-mail de login e a senha administrativa para acessar o painel de controle do portal de notícias.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-xl text-sm flex items-start gap-3 ${
                message.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <Check className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Current Info */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">
                E-mail de Acesso Atual
              </span>
              <span className="font-bold text-slate-900 text-sm">{currentCreds.email || 'Não definido'}</span>
            </div>
            {currentCreds.updatedAt && (
              <div className="text-slate-400">
                Última alteração: {new Date(currentCreds.updatedAt).toLocaleString('pt-BR')}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Novo E-mail de Login
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@portal.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white text-slate-900 transition-all"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Este será o endereço utilizado para entrar na área administrativa do portal.
              </p>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nova Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite para alterar (mínimo 4 caracteres)"
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white text-slate-900 transition-all"
                />
                <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-700 absolute right-3.5 top-1/2 -translate-y-1/2"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Deixe em branco caso deseje manter a senha atual inalterada.
              </p>
            </div>

            {/* Confirm Password */}
            {newPassword.length > 0 && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white text-slate-900 transition-all"
                  />
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Novo Login e Senha</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
