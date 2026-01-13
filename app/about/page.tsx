import Link from 'next/link';
import aboutData from '../../data/about.json';

// Helper to convert text with URLs into clickable links
const renderWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a 
          key={i} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#2E5B8D] font-medium hover:underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

export default function AboutPage() {
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
        <h1 className="text-2xl font-bold text-gray-800">About CCOI</h1>
      </header>

      <main className="p-4 space-y-6 pt-28">
        {(aboutData as any[]).map((card, index) => (
          <section key={card.id || index} className="bg-white rounded-lg shadow-sm p-6">
            {/* Render grouped paragraphs for this card */}
            {card.content.map((paragraph: string, pIndex: number) => (
              <p 
                key={pIndex} 
                className={`text-base text-gray-700 leading-relaxed ${pIndex > 0 ? 'mt-4' : ''}`}
              >
                {renderWithLinks(paragraph)}
              </p>
            ))}
          </section>
        ))}
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
