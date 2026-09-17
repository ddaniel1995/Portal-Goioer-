import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  MessageCircle,
  ArrowUp,
  Store
} from 'lucide-react';
import { Category, VisualIdentity, BusinessGuideConfig } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  identity: VisualIdentity;
  categories: Category[];
  businessGuideConfig?: BusinessGuideConfig;
  onOpenBusinessGuide?: () => void;
  onSelectCategory: (categoryId: string) => void;
  onGoHome: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  identity,
  categories,
  businessGuideConfig,
  onOpenBusinessGuide,
  onSelectCategory,
  onGoHome,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="w-full text-slate-400 text-sm border-t border-slate-800 mt-16 transition-colors"
      style={{ backgroundColor: identity.colors?.footerBg || '#020617' }}
    >
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand, Description, Social Media */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" onClick={onGoHome} className="cursor-pointer inline-block">
              <Logo identity={identity} variant="mono" size="md" />
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              {identity.description || 'Jornalismo sério, independente e em tempo real. Informação com qualidade, ética e compromisso com o leitor brasileiro.'}
            </p>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-2.5">
              {identity.socialMedia.facebook && (
                <a
                  href={identity.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors text-slate-300"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                </a>
              )}
              {identity.socialMedia.instagram && (
                <a
                  href={identity.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors text-slate-300"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {identity.socialMedia.twitter && (
                <a
                  href={identity.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors text-slate-300"
                >
                  <Twitter className="w-4 h-4 fill-current" />
                </a>
              )}
              {identity.socialMedia.youtube && (
                <a
                  href={identity.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors text-slate-300"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {identity.socialMedia.whatsapp && (
                <a
                  href={identity.socialMedia.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Canal"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-slate-300"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 3: Categorias Principais */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Categorias
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/noticias"
                  onClick={() => onSelectCategory('cat-ultimas')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left inline-flex"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Últimas Notícias
                </Link>
              </li>
              {businessGuideConfig?.enabled !== false && (
                <li>
                  <Link
                    to="/guia-empresarial"
                    onClick={onOpenBusinessGuide}
                    className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left text-emerald-400 inline-flex"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>{businessGuideConfig?.tabName || 'Guia Empresarial'}</span>
                  </Link>
                </li>
              )}
              {categories.filter(c => !c.hideInMenu).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/noticias/${cat.slug || cat.id}`}
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-white transition-colors cursor-pointer text-left inline-block"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Institucional & Editorial */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Institucional
            </h3>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white transition-colors cursor-default">Quem Somos</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">Princípios Editoriais</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">Termos de Uso & Privacidade</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">Anuncie Conosco</span></li>
            </ul>
          </div>

          {/* Col 5: Informações de Contato */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Contato & Redação
            </h3>
            <ul className="space-y-3 text-xs">
              {identity.contactEmail && (
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="break-all">{identity.contactEmail}</span>
                </li>
              )}
              {identity.contactPhone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{identity.contactPhone}</span>
                </li>
              )}
              {identity.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{identity.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer: Copyright, Discreet ADM Button, Back to Top */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <p>© {currentYear} {identity.siteName}. Todos os direitos reservados.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Small, discreet minimalist "Painel ADM" button */}
            <Link
              to="/adm"
              onClick={(e) => {
                e.preventDefault();
                onOpenAdmin();
              }}
              aria-label="Acessar Painel Administrativo"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-normal text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 rounded transition-colors border border-slate-800 cursor-pointer"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Painel ADM</span>
            </Link>

            {/* Back to top */}
            <button
              onClick={scrollToTop}
              aria-label="Voltar ao topo"
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
