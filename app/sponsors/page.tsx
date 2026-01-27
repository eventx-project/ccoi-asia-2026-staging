import Link from 'next/link';
import Image from 'next/image';
import { getImagePath } from '../../lib/utils';

export default function SponsorsPage() {
  const sponsors = [
    { 
      name: 'Alcon', 
      tier: 'Diamond Sponsor', 
      role: 'Full Forum',
      logo: getImagePath('/images/sponsors/alcon.png'),
      website: 'https://www.alcon.com/'
    },
    { 
      name: 'Santen', 
      tier: 'Silver Sponsor', 
      role: 'Full Forum',
      logo: getImagePath('/images/sponsors/santen.png'),
      website: 'https://www.santen.com/en'
    },
    { 
      name: 'Bruno', 
      tier: 'Silver Sponsor', 
      role: 'Full Forum',
      logo: getImagePath('/images/sponsors/bruno.png'),
      website: 'https://www.brunovisioncare.com/'
    },
    { 
      name: 'RSCV', 
      tier: 'Co-Host', 
      role: 'Myopia Day Lunch Symposium',
      logo: getImagePath('/images/sponsors/rscv.png'),
      website: 'https://www.polyu.edu.hk/rcsv/'
    },
    { 
      name: 'Valitor', 
      tier: 'Bronze Sponsor', 
      role: 'Innovation Day',
      logo: getImagePath('/images/sponsors/valitor.png'),
      website: 'https://www.valitorbio.com/'
    }
  ];

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
        <h1 className="text-2xl font-bold text-gray-800">Sponsors & Partners</h1>
      </header>

      <main className="p-4 space-y-6 pt-28">
        <section className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">2026 Asia-Pacific Innovation Forum Supporters</h2>
          <p className="text-sm text-gray-700 mb-4">
            CCOI appreciates the generous contribution of our 2026 Asia-Pacific Innovation Forum supporters.
          </p>
        </section>

        <div className="space-y-3">
          {sponsors.map((sponsor, idx) => (
            <a 
              key={idx} 
              href={sponsor.website}
              target={sponsor.website !== '#' ? '_blank' : undefined}
              rel={sponsor.website !== '#' ? 'noopener noreferrer' : undefined}
              className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="w-full h-24 bg-white rounded-lg mb-3 flex items-center justify-center p-4">
                <Image 
                  src={sponsor.logo} 
                  alt={`${sponsor.name} logo`}
                  width={300}
                  height={100}
                  className="max-h-20 w-auto object-contain"
                />
              </div>
              <div>
                <div className="font-semibold text-gray-800">{sponsor.name}</div>
                <div className="text-xs text-gray-600 mt-1">{sponsor.tier}</div>
                <div className="text-sm text-gray-700 mt-2">{sponsor.role}</div>
              </div>
            </a>
          ))}
        </div>

        <section className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Partnership Opportunities</h3>
          <p className="text-sm text-gray-700 mb-4">
            Interested in becoming a sponsor? Please reach out to us for more information.
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-4 py-2 bg-[#2E5B8D] text-white rounded text-sm"
          >
            Contact Us
          </Link>
        </section>
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
