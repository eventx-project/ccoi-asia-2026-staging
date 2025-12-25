"use client";
import { useMemo, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import agendaData from '../../data/agenda.json';
import { getImagePath } from '../../lib/utils';

// Import speaker images mapping if it exists
let speakerImageMap: Record<string, string> = {};
try {
  speakerImageMap = require('../../data/speaker-images.json');
} catch (e) {
  // No speaker images yet
}

type SpeakerSession = {
  dayKey: 'myopia' | 'innovation';
  dayTitle: string;
  date: string;
  time: string;
  block?: string;
  title: string;
  theme?: string;
  location: string;
};

type Speaker = {
  slug: string;
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  image?: string;
  sessions: SpeakerSession[];
};

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'speaker';

// Normalize name by removing country suffix to group variations together
const normalizeName = (name: string) => {
  return name.replace(/\s*\([^)]+\)\s*$/, '').trim();
};

// Get the full name with country if available, otherwise return as-is
const getPreferredName = (name1: string, name2: string) => {
  // Prefer the one with country designation (has parentheses)
  if (name1.includes('(') && name1.includes(')')) return name1;
  if (name2.includes('(') && name2.includes(')')) return name2;
  return name1;
};

const shouldSkip = (name: string) => {
  const n = name.toLowerCase();
  return n === '-' || n.includes('panelist') || n.includes('moderator') || n.includes('hosts & guests');
};

function buildSpeakers(): Speaker[] {
  const map = new Map<string, Speaker>();

  const days: Array<{ key: 'myopia' | 'innovation'; data: any }> = [
    { key: 'myopia', data: (agendaData as any).myopia_day },
    { key: 'innovation', data: (agendaData as any).innovation_day }
  ];

  days.forEach(({ key, data }) => {
    data.sessions.forEach((session: any) => {
      // Check for Fireside Chats special case
      const speakersList = session.speakers as string[];
      const combinedSpeakers = speakersList.join(' ');
      
      if (combinedSpeakers.includes('Hosts:') && combinedSpeakers.includes('Guests:')) {
        // Parse Fireside Chats
        const parts = combinedSpeakers.replace(/\n/g, ' ').split('Guests:');
        const hostsPart = parts[0].replace('Hosts:', '').trim();
        const guestsPart = parts[1].trim();
        
        const parseNames = (text: string) => {
          return text.split(/,|&/).map(s => s.trim()).filter(Boolean);
        };
        
        const allNames = [...parseNames(hostsPart), ...parseNames(guestsPart)];
        
        allNames.forEach(name => {
          const normalizedName = normalizeName(name);
          const slug = slugify(normalizedName);
          
          if (!map.has(slug)) {
            map.set(slug, {
              slug,
              name,
              sessions: []
            });
          } else {
             const existing = map.get(slug)!;
             existing.name = getPreferredName(existing.name, name);
          }
          map.get(slug)!.sessions.push({
            dayKey: key,
            dayTitle: data.title,
            date: data.date,
            time: session.time,
            block: session.block,
            title: session.title,
            theme: session.theme,
            location: session.location
          });
        });
        return; // Skip normal processing
      }

      // Process regular speakers and add their sessions
      speakersList.forEach((rawName) => {
        if (!rawName || shouldSkip(rawName)) return;
        const name = rawName.trim();
        const normalizedName = normalizeName(name);
        const slug = slugify(normalizedName);
        
        if (!map.has(slug)) {
          map.set(slug, {
            slug,
            name,
            sessions: []
          });
        } else {
          // Update to preferred name (one with country)
          const existing = map.get(slug)!;
          existing.name = getPreferredName(existing.name, name);
        }
        map.get(slug)!.sessions.push({
          dayKey: key,
          dayTitle: data.title,
          date: data.date,
          time: session.time,
          block: session.block,
          title: session.title,
          theme: session.theme,
          location: session.location
        });
      });

      // Process moderators - create profile but DON'T add panel session
      if (session.moderators && Array.isArray(session.moderators)) {
        session.moderators.forEach((rawName: string) => {
          if (!rawName || shouldSkip(rawName)) return;
          const name = rawName.trim();
          const normalizedName = normalizeName(name);
          const slug = slugify(normalizedName);
          
          if (!map.has(slug)) {
            map.set(slug, {
              slug,
              name,
              sessions: []
            });
          } else {
            // Update to preferred name (one with country)
            const existing = map.get(slug)!;
            existing.name = getPreferredName(existing.name, name);
          }
          // Don't add the panel session to their profile
        });
      }

      // Process panelists - create profile but DON'T add panel session
      if (session.panelists && Array.isArray(session.panelists)) {
        session.panelists.forEach((rawName: string) => {
          if (!rawName || shouldSkip(rawName)) return;
          const name = rawName.trim();
          const normalizedName = normalizeName(name);
          const slug = slugify(normalizedName);
          
          if (!map.has(slug)) {
            map.set(slug, {
              slug,
              name,
              sessions: []
            });
          } else {
            // Update to preferred name (one with country)
            const existing = map.get(slug)!;
            existing.name = getPreferredName(existing.name, name);
          }
          // Don't add the panel session to their profile
        });
      }
    });
  });

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function groupByLetter(speakers: Speaker[]) {
  return speakers.reduce<Record<string, Speaker[]>>((acc, sp) => {
    const letter = sp.name[0]?.toUpperCase() || '#';
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(sp);
    return acc;
  }, {});
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] || '') + (parts[1][0] || '');
}

function SpeakersContent() {
  const speakers = useMemo(buildSpeakers, []);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpeakers = useMemo(() => {
    if (!searchQuery) return speakers;
    return speakers.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [speakers, searchQuery]);

  const grouped = useMemo(() => groupByLetter(filteredSpeakers), [filteredSpeakers]);
  const letters = Object.keys(grouped).sort();

  const [selected, setSelected] = useState<Speaker | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const slug = searchParams.get('slug');
    if (slug) {
      const speaker = speakers.find(s => s.slug === slug);
      if (speaker) {
        setSelected(speaker);
      }
    }
  }, [searchParams, speakers]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2E5B8D]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E5A96]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      <div className="relative z-10">
      <header className="bg-white/95 backdrop-blur-sm py-4 px-4 fixed top-0 left-0 right-0 z-50 shadow-sm border-b border-gray-100">
        <Link href="/" className="text-[#2E5B8D] text-sm font-medium hover:underline mb-2 inline-block">← Back</Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Speakers</h1>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#2E5B8D] transition-colors" />
          <input
            type="text"
            placeholder="Search speakers..."
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
      </header>

      <div className="flex pt-40">
        <main className="flex-1 mt-4 px-4 pr-12">
          {letters.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-medium mb-1">No speakers found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search</p>
            </div>
          )}
          {letters.map((letter) => (
            <section key={letter} id={letter} className="mb-6 scroll-mt-20">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">{letter}</h3>
              <div className="space-y-3">
                {grouped[letter].map((sp) => (
                  <button
                    key={sp.slug}
                    id={sp.slug}
                    onClick={() => setSelected(sp)}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm text-left scroll-mt-20"
                  >
                    {speakerImageMap[sp.slug] ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image
                          src={getImagePath(speakerImageMap[sp.slug])}
                          alt={sp.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E5A96] to-[#2E5B8D] flex items-center justify-center text-white font-semibold uppercase flex-shrink-0">
                        {initials(sp.name)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-800">{sp.name}</div>
                      <div className="text-xs text-gray-500">{sp.sessions.length} session{sp.sessions.length > 1 ? 's' : ''}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </main>

        <aside className="w-10 bg-transparent py-4 flex flex-col items-center gap-1 fixed right-0 top-32 bottom-24 overflow-y-auto z-40">
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() => {
                document.getElementById(letter)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[10px] font-semibold text-gray-500 hover:text-[#2E5B8D] transition-colors w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded"
            >
              {letter}
            </button>
          ))}
        </aside>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-4">
              {speakerImageMap[selected.slug] ? (
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    src={getImagePath(speakerImageMap[selected.slug])}
                    alt={selected.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E5A96] to-[#2E5B8D] flex items-center justify-center text-white font-semibold uppercase flex-shrink-0">
                  {initials(selected.name)}
                </div>
              )}
              <div>
                <h4 className="text-lg font-bold">{selected.name}</h4>
                <div className="text-sm text-gray-600">Sessions: {selected.sessions.length}</div>
              </div>
            </div>
            <div className="mt-3 space-y-3 max-h-72 overflow-y-auto pr-1">
              {selected.sessions.map((s, idx) => (
                <Link 
                  href={`/agenda?day=${s.dayKey}#${s.block || s.time}`} 
                  key={idx} 
                  className="block border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="text-xs text-gray-500">{s.dayTitle} • {s.date}</div>
                  <div className="text-sm font-semibold text-gray-800 mt-1">{s.title}</div>
                  {s.theme && <div className="text-xs text-gray-500 mt-0.5">{s.theme}</div>}
                  <div className="text-xs text-gray-500 mt-0.5">{s.time} — {s.location}</div>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-right">
              <button onClick={() => setSelected(null)} className="px-4 py-2 rounded bg-[#2E5B8D] text-white">Close</button>
            </div>
          </div>
        </div>
      )}
      
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

export default function SpeakersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpeakersContent />
    </Suspense>
  );
}
