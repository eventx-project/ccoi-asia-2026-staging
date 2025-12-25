"use client";
import { useState, useMemo } from 'react';
import Link from 'next/link';
import agendaData from '../../data/agenda.json';

type Session = {
  time: string;
  title: string;
  location: string;
  speakers: string[];
  moderators?: string[];
  panelists?: string[];
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

export default function AgendaPage() {
  const [day, setDay] = useState<'myopia' | 'innovation'>('myopia');

  const dayInfo = day === 'myopia' ? (agendaData as any).myopia_day : (agendaData as any).innovation_day;
  const sessions: Session[] = dayInfo?.sessions || [];

  // Group sessions by theme
  const groupedSessions = useMemo(() => {
    const groups: Record<string, Session[]> = {};
    sessions.forEach((session) => {
      const theme = session.theme || 'Other';
      if (!groups[theme]) groups[theme] = [];
      groups[theme].push(session);
    });
    return groups;
  }, [sessions]);

  const themes = Object.keys(groupedSessions);

  return (
    <div className="min-h-screen relative overflow-hidden bg-white pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2E5B8D]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E5A96]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      <div className="relative z-10">
      <header className="bg-white py-4 px-4 fixed top-0 left-0 right-0 z-50 shadow-sm">
        <Link href="/" className="text-[#2E5B8D] text-sm mb-2 inline-block">← Back</Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Agenda</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setDay('myopia')}
              className={`px-3 py-1 rounded ${day === 'myopia' ? 'bg-[#2E5B8D] text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Myopia Day
            </button>
            <button
              onClick={() => setDay('innovation')}
              className={`px-3 py-1 rounded ${day === 'innovation' ? 'bg-[#2E5B8D] text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Innovation Day
            </button>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {dayInfo?.title} — {dayInfo?.date}
        </div>
      </header>

      <main className="px-4 pb-6 pt-36">
        <div className="space-y-8">
          {themes.map((theme) => {
            const themeTime = groupedSessions[theme][0]?.time || '';
            return (
              <section key={theme} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#2E5B8D] uppercase tracking-wide">
                    {theme}
                  </h3>
                  {themeTime && (
                    <span className="text-xs text-gray-500">{themeTime}</span>
                  )}
                </div>
                
                {groupedSessions[theme].map((session, idx) => {
                  const timeString = session.block || session.time;
                  const timeDisplay = timeString.split(/[-–]/); // Split by hyphen or en-dash
                  return (
                  <div key={`${theme}-${idx}`} className="flex gap-2 items-start">
                    <div className="w-16 text-right text-xs text-gray-500 flex-shrink-0 pt-1">
                      {timeDisplay.length > 1 ? (
                        <>
                          {timeDisplay[0].trim()}<br/>-<br/>{timeDisplay[1].trim()}
                        </>
                      ) : (
                        timeDisplay[0]
                      )}
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-800 leading-snug">{session.title}</h4>
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
                                  <Link href={`/speakers#${slug}`} className="text-[#2E5B8D] underline">
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
                                  <Link href={`/speakers#${slug}`} className="text-[#2E5B8D] underline">
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
                                  <Link href={`/speakers#${slug}`} className="text-[#2E5B8D] underline">
                                    {speaker}
                                  </Link>
                                ) : (
                                  <span>{speaker}</span>
                                )}
                                {i < session.speakers.length - 1 && <span className="text-gray-400">/</span>}
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
