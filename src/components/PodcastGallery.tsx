import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Tv, 
  ExternalLink, 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  Check, 
  Radio, 
  Sparkles,
  ChevronRight,
  Maximize2,
  X
} from 'lucide-react';
import { Article } from '../types';
import { extractYoutubeId } from '../services/storageService';

interface PodcastGalleryProps {
  articles: Article[];
  onSelectArticle?: (slug: string) => void;
  isEmbedded?: boolean; // If rendered on homepage vs full category view
}

export const PodcastGallery: React.FC<PodcastGalleryProps> = ({
  articles,
  onSelectArticle,
  isEmbedded = false,
}) => {
  // Filter podcast episodes: articles in podcast category or with youtubeUrl
  const podcastEpisodes = useMemo(() => {
    return articles.filter(
      (a) => (a.categoryId === 'cat-podcast' || a.categoryName?.toLowerCase().includes('podcast')) && a.status === 'published'
    );
  }, [articles]);

  const [activeEpisodeId, setActiveEpisodeId] = useState<string>(
    podcastEpisodes[0]?.id || ''
  );
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Active episode object
  const activeEpisode = useMemo(() => {
    return (
      podcastEpisodes.find((ep) => ep.id === activeEpisodeId) ||
      podcastEpisodes[0] ||
      null
    );
  }, [podcastEpisodes, activeEpisodeId]);

  const activeYoutubeId = activeEpisode ? extractYoutubeId(activeEpisode.youtubeUrl) : null;

  const handleCopyShare = (episode: Article) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const url = episode.youtubeUrl || window.location.href;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (podcastEpisodes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-6">
        <Radio className="w-12 h-12 text-purple-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Nenhum episódio de Podcast disponível ainda</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Cadastre novos episódios em vídeo no painel administrativo inserindo o link direto do YouTube e o título.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isEmbedded ? 'my-4' : 'my-8'}`}>
      {/* Header Banner for Podcast */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-purple-900/40">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2.5 backdrop-blur-xs border border-purple-400/30">
              <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Podcast & Videocast Oficial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Galeria de Vídeos & Episódios</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-600 text-white">
                {podcastEpisodes.length} {podcastEpisodes.length === 1 ? 'episódio' : 'episódios'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl mt-1.5 leading-relaxed">
              Assista a entrevistas exclusivas, grandes debates e análises aprofundadas com reprodução direta no site pelo reprodutor integrado do YouTube.
            </p>
          </div>

          {activeEpisode && (
            <div className="flex items-center gap-2 shrink-0">
              {activeEpisode.youtubeUrl && (
                <a
                  href={activeEpisode.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-102"
                >
                  <Tv className="w-4 h-4" />
                  <span>Ver no YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Stage: Player + Currently Selected Episode Details */}
      {activeEpisode && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Video Player Column (8 cols on large screens) */}
            <div className="lg:col-span-7 xl:col-span-8 bg-black relative">
              <div className="relative aspect-video w-full flex items-center justify-center bg-slate-950">
                {activeYoutubeId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeYoutubeId}?autoplay=0&rel=0&modestbranding=1`}
                    title={activeEpisode.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0 absolute inset-0"
                  />
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <p className="text-xs">Link do YouTube inválido ou ausente para este episódio.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Episode Meta & Information Column (4-5 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 p-5 sm:p-6 flex flex-col justify-between bg-slate-50/50 border-t lg:border-t-0 lg:border-l border-slate-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-700 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>Episódio em Destaque</span>
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(activeEpisode.publishedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Episode Title */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {activeEpisode.title}
                </h3>

                {/* Subtitle / Description */}
                {activeEpisode.subtitle && (
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {activeEpisode.subtitle}
                  </p>
                )}

                {/* Host / Presenter */}
                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200/80">
                  <img
                    src={activeEpisode.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop'}
                    alt={activeEpisode.author}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{activeEpisode.author}</h4>
                    <p className="text-[10px] text-slate-500">{activeEpisode.authorRole || 'Apresentador do Podcast'}</p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                <button
                  onClick={() => handleCopyShare(activeEpisode)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
                </button>

                {onSelectArticle && (
                  <button
                    onClick={() => onSelectArticle(activeEpisode.slug)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-xs"
                  >
                    <span>Ver matéria completa</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Episodes Carousel / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Tv className="w-4 h-4 text-purple-600" />
            <span>Todos os Episódios Disponíveis ({podcastEpisodes.length})</span>
          </h3>
          <span className="text-xs text-slate-500">Clique para reproduzir qualquer episódio</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {podcastEpisodes.map((episode, idx) => {
            const isCurrent = episode.id === activeEpisodeId;
            const epYoutubeId = extractYoutubeId(episode.youtubeUrl);
            const thumbUrl = episode.featuredImage || (epYoutubeId ? `https://img.youtube.com/vi/${epYoutubeId}/hqdefault.jpg` : '');

            return (
              <div
                key={episode.id}
                onClick={() => {
                  setActiveEpisodeId(episode.id);
                  // Smooth scroll to player on mobile
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    const el = document.getElementById('podcast-player-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-200 flex flex-col justify-between ${
                  isCurrent
                    ? 'border-purple-600 ring-2 ring-purple-400/50 bg-purple-50/40 shadow-md'
                    : 'border-slate-200/90 bg-white hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Thumbnail with Play Overlay */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={thumbUrl}
                      alt={episode.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${
                        isCurrent 
                          ? 'bg-purple-600 text-white scale-110 ring-4 ring-purple-300' 
                          : 'bg-white/90 text-slate-900 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white'
                      }`}>
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                        Episódio #{podcastEpisodes.length - idx}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-bold animate-pulse">
                          No ar
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-extrabold flex items-center gap-1">
                      <Tv className="w-3 h-3" />
                      <span>YouTube</span>
                    </div>
                  </div>

                  {/* Episode Title & Resumo */}
                  <div className="p-3.5">
                    <h4 className={`text-xs font-bold line-clamp-2 leading-snug group-hover:text-purple-700 transition-colors ${
                      isCurrent ? 'text-purple-900 font-extrabold' : 'text-slate-900'
                    }`}>
                      {episode.title}
                    </h4>

                    {episode.subtitle && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {episode.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-3.5 pt-0 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 mt-2">
                  <span className="truncate max-w-[120px] font-medium text-slate-600">
                    {episode.author}
                  </span>
                  <span>
                    {new Date(episode.publishedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
