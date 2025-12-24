"use client";
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import agendaData from '../../data/agenda.json';

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
      // Process regular speakers and add their sessions
      (session.speakers as string[]).forEach((rawName) => {
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

export default function SpeakersPage() {
  const speakers = useMemo(buildSpeakers, []);
  const grouped = useMemo(() => groupByLetter(speakers), [speakers]);
  const letters = Object.keys(grouped).sort();

  const [selected, setSelected] = useState<Speaker | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2E5B8D]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E5A96]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      <div className="relative z-10">
      <header className="bg-white py-4 px-4 sticky top-0 z-10 shadow-sm">
        <Link href="/" className="text-[#2E5B8D] text-sm mb-2 inline-block">← Back</Link>
        <h1 className="text-2xl font-bold text-gray-800">Speakers</h1>
      </header>

      <div className="flex">
        <main className="flex-1 mt-4 px-4">
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
                          src={speakerImageMap[sp.slug]}
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

        <aside className="w-16 bg-transparent py-4 flex flex-col items-center gap-2 sticky top-16 h-screen overflow-y-auto">
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() => {
                document.getElementById(letter)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-gray-500 hover:text-[#2E5B8D] transition-colors w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
            >
              {letter}
            </button>
          ))}
        </aside>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-4">
              {speakerImageMap[selected.slug] ? (
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    src={speakerImageMap[selected.slug]}
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
                <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                  <div className="text-xs text-gray-500">{s.dayTitle} • {s.date}</div>
                  <div className="text-sm font-semibold text-gray-800 mt-1">{s.title}</div>
                  {s.theme && <div className="text-xs text-gray-500 mt-0.5">{s.theme}</div>}
                  <div className="text-xs text-gray-500 mt-0.5">{s.time} — {s.location}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link href="/agenda" className="text-sm text-[#2E5B8D] underline mr-3">View agenda</Link>
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
