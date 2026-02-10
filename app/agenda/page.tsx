"use client";
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, X, Star } from 'lucide-react';
import agendaData from '../../data/agenda.json';
import ScrollToTop from '../components/ScrollToTop';

type Session = {
  time: string;
  title: string;
  location: string;
  speakers: string[];
  moderators?: string[];
  panelists?: string[];
  chairs?: string[];
  description?: string;
  theme?: string;
  block?: string;
};

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'speaker';

// Normalize name by removing country suffix to match speaker slugs
const normalizeName = (name: string) => {
  return name.replace(/\s*\([^)]+\)\s*$/, '').trim();
};

const isLinkable = (name: string) => {
  const n = name.toLowerCase();
  if (n === '-' || n === '' || n === 'tbc' || n === 'tbd') return false;
  if (n.includes('panelist') || n.includes('moderator') || n.includes('hosts & guests')) return false;
  return true;
};

function AgendaContent() {
  const searchParams = useSearchParams();
  const [day, setDay] = useState<'myopia' | 'innovation'>('myopia');

  useEffect(() => {
    const dayParam = searchParams.get('day');
    if (dayParam === 'innovation' || dayParam === 'myopia') {
      setDay(dayParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (window.location.hash) {
      const id = decodeURIComponent(window.location.hash.substring(1));
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-[#2E5B8D]', 'ring-offset-2');
          setTimeout(() => element.classList.remove('ring-2', 'ring-[#2E5B8D]', 'ring-offset-2'), 2000);
        }
      }, 300);
    }
  }, [day]);

  const dayInfo = day === 'myopia' ? (agendaData as any).myopia_day : (agendaData as any).innovation_day;
  const sessions: Session[] = dayInfo?.sessions || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Favorites logic
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ccoi-favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('ccoi-favorites', JSON.stringify(newFavorites));
  };

  // Get all available themes for the dropdown
  const allThemes = useMemo(() => {
    const themes = new Set<string>();
    sessions.forEach(session => {
      if (session.theme) themes.add(session.theme);
    });
    return ['All', ...Array.from(themes)];
  }, [sessions]);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const sessionId = session.block || session.time;
      const matchesSearch = searchQuery === '' ||
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.speakers.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (session.moderators && session.moderators.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (session.panelists && session.panelists.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        session.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTheme = selectedTheme === 'All' || session.theme === selectedTheme;
      const matchesFavorite = !showFavoritesOnly || favorites.includes(sessionId);

      return matchesSearch && matchesTheme && matchesFavorite;
    });
  }, [sessions, searchQuery, selectedTheme, showFavoritesOnly, favorites]);

  // Group sessions by theme
  const groupedSessions = useMemo(() => {
    const groups: Record<string, Session[]> = {};
    filteredSessions.forEach((session) => {
      const theme = session.theme || 'Other';
      if (!groups[theme]) groups[theme] = [];
      groups[theme].push(session);
    });
    return groups;
  }, [filteredSessions]);

  const themes = Object.keys(groupedSessions);

  return (
    <div className="min-h-screen relative overflow-hidden bg-white pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2E5B8D]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E5A96]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      <div className="relative z-10">
      <header className="bg-white/95 backdrop-blur-sm py-4 px-4 fixed top-0 left-0 right-0 z-50 shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
           <Link href="/" className="text-[#2E5B8D] text-sm font-medium hover:underline">← Back</Link>
           <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{dayInfo?.date}</div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Agenda</h1>
          <div className="flex items-center gap-3">
            <button
               onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
               className={`p-2 rounded-full transition-colors ${showFavoritesOnly ? 'bg-yellow-50 text-yellow-500 ring-1 ring-yellow-200' : 'bg-gray-50 text-gray-400 hover:text-yellow-500'}`}
               aria-label="Show favorites only"
             >
               <Star className={`w-5 h-5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
             </button>
            <div className="flex rounded-lg overflow-hidden border border-[#2E5B8D]/20 shadow-sm">
            <button
              onClick={() => setDay('myopia')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${day === 'myopia' ? 'bg-[#2E5B8D] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              Myopia
            </button>
            <div className="w-px bg-[#2E5B8D]/20"></div>
            <button
              onClick={() => setDay('innovation')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${day === 'innovation' ? 'bg-[#2E5B8D] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              Innovation
            </button>
          </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#2E5B8D] transition-colors" />
            <input
              type="text"
              placeholder="Search sessions, speakers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E5B8D]/20 focus:border-[#2E5B8D] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
             {allThemes.map(theme => (
               <button
                 key={theme}
                 onClick={() => setSelectedTheme(selectedTheme === theme ? 'All' : theme)}
                 className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                   selectedTheme === theme 
                     ? 'bg-[#2E5B8D] text-white shadow-md shadow-[#2E5B8D]/20 ring-2 ring-[#2E5B8D]/20 ring-offset-1' 
                     : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                 }`}
               >
                 {theme}
               </button>
             ))}
          </div>
        </div>
      </header>

      <main className="px-4 pb-6 pt-52">
        <ScrollToTop />
        {themes.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">No sessions found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedTheme('All');}}
              className="mt-4 text-[#2E5B8D] text-sm font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
        <div className="space-y-8">
          {themes.map((theme) => {
            const themeSessions = groupedSessions[theme];
            const themeTime = themeSessions[0]?.time || '';

            // Get all chairs for this theme from the full unfiltered list to ensure we don't miss any
            // if the first session is filtered out
            const allThemeSessions = sessions.filter(s => s.theme === theme);
            const uniqueChairs = Array.from(new Set(
              allThemeSessions.flatMap(session => session.chairs || [])
            )).filter(Boolean);

            return (
              <section key={theme} className="space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#2E5B8D] uppercase tracking-wide">
                      {theme}
                    </h3>
                    {themeTime && (
                      <span className="text-xs text-gray-500">{themeTime}</span>
                    )}
                  </div>
                  {uniqueChairs.length > 0 && (
                    <div className="mt-1 text-sm text-gray-600 flex flex-wrap gap-1">
                      <span className="font-bold text-gray-800">Chairs:</span>
                      {uniqueChairs.map((chair, i) => {
                        const linkable = isLinkable(chair);
                        const slug = slugify(normalizeName(chair));
                        const isLast = i === uniqueChairs.length - 1;
                        return (
                          <span key={`chair-${chair}-${i}`} className="inline-flex items-center gap-1">
                            {linkable ? (
                              <Link href={`/speakers?slug=${slug}`} className="text-[#2E5B8D] underline">
                                {chair}
                              </Link>
                            ) : (
                              <span>{chair}</span>
                            )}
                            {!isLast && <span className="text-gray-400">,</span>}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedSessions[theme].map((session, idx) => {
                  const timeString = session.block || session.time;
                  const timeDisplay = timeString.split(/[-–]/); // Split by hyphen or en-dash
                  return (
                  <div 
                    key={`${theme}-${idx}`} 
                    id={session.block || session.time}
                    className="flex gap-2 scroll-mt-40 transition-all duration-300 rounded-lg p-1 h-full"
                  >
                    <div className="w-16 text-right text-xs text-gray-500 flex-shrink-0 pt-1">
                      {timeDisplay.length > 1 ? (
                        <>
                          {timeDisplay[0].trim()}<br/>-<br/>{timeDisplay[1].trim()}
                        </>
                      ) : (
                        timeDisplay[0]
                      )}
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-lg shadow-sm relative">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-semibold text-gray-800 leading-snug flex-1">{session.title}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(session.block || session.time);
                          }}
                          className="text-gray-300 hover:text-yellow-500 transition-colors p-1 -mr-2 -mt-2"
                          aria-label={favorites.includes(session.block || session.time) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Star className={`w-5 h-5 ${favorites.includes(session.block || session.time) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{session.location}</div>
                      
                      {session.moderators && session.moderators.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-1">
                          <span className="text-gray-600">Moderator{session.moderators.length > 1 ? 's' : ''}:</span>
                          {session.moderators.map((moderator, i) => {
                            const linkable = isLinkable(moderator);
                            const slug = slugify(normalizeName(moderator));
                            const isLast = i === (session.moderators?.length ?? 0) - 1;
                            return (
                              <span key={`mod-${moderator}-${i}`} className="inline-flex items-center gap-1">
                                {linkable ? (
                                  <Link href={`/speakers?slug=${slug}`} className="text-[#2E5B8D] underline">
                                    {moderator}
                                  </Link>
                                ) : (
                                  <span>{moderator}</span>
                                )}
                                {!isLast && <span className="text-gray-400">,</span>}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      
                      {session.panelists && session.panelists.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-1">
                          <span className="text-gray-600">Panelists:</span>
                          {session.panelists.map((panelist, i) => {
                            const linkable = isLinkable(panelist);
                            const slug = slugify(normalizeName(panelist));
                            const isLast = i === (session.panelists?.length ?? 0) - 1;
                            return (
                              <span key={`pan-${panelist}-${i}`} className="inline-flex items-center gap-1">
                                {linkable ? (
                                  <Link href={`/speakers?slug=${slug}`} className="text-[#2E5B8D] underline">
                                    {panelist}
                                  </Link>
                                ) : (
                                  <span>{panelist}</span>
                                )}
                                {!isLast && <span className="text-gray-400">,</span>}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      
                      {session.speakers && session.speakers.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-1">
                          <span className="text-gray-600">Speaker{session.speakers.length > 1 ? 's' : ''}:</span>
                          {session.speakers.map((speaker, i) => {
                            const linkable = isLinkable(speaker);
                            const slug = slugify(normalizeName(speaker));
                            return (
                              <span key={`${speaker}-${i}`} className="inline-flex items-center gap-1">
                                {linkable ? (
                                  <Link href={`/speakers?slug=${slug}`} className="text-[#2E5B8D] underline">
                                    {speaker}
                                  </Link>
                                ) : (
                                  <span>{speaker}</span>
                                )}
                                {i < session.speakers.length - 1 && <span className="text-gray-400">,</span>}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {session.description && (
                        <p className="mt-2 text-sm text-gray-700">{session.description}</p>
                      )}
                    </div>
                  </div>
                  );
                })}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="text-center py-3 text-xs text-gray-500 bg-white/50">
        <a href="https://eventx.io" target="_blank" rel="noopener noreferrer" className="hover:text-[#2E5B8D] transition-colors">
          Powered by EventX
        </a>
      </footer>
      </div>
    </div>
  );
}

export default function AgendaPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AgendaContent />
    </Suspense>
  );
}
