import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, Info, Network, ClipboardList, BookOpen } from 'lucide-react';

export default function Home() {
  const quickLinks = [
    { icon: Calendar, label: 'Agenda', href: '/agenda' },
    { icon: Users, label: 'Speakers', href: '/speakers' },
    { icon: Info, label: 'About CCOI', href: '/about' },
    { icon: Network, label: 'Networking', href: 'https://spot.eventx.io/events/7f1c370a-d533-4e1a-ad98-5a17bcfcd5d3' },
    { icon: ClipboardList, label: 'Sponsors', href: '/sponsors' },
    { icon: BookOpen, label: 'Register', href: 'https://spot.eventx.io/events/7f1c370a-d533-4e1a-ad98-5a17bcfcd5d3' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2E5B8D]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E5A96]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-4 py-3">
        {/* Logo */}
        <div className="text-center flex-shrink-0">
          <div className="inline-flex items-center justify-center mb-2">
            <Image 
              src="/ccoi-logo.png" 
              alt="CCOI Logo" 
              width={80} 
              height={80}
              className="w-12 h-12 sm:w-20 sm:h-20 object-contain"
              priority
            />
          </div>
          
          {/* Event Banner */}
          <div className="mb-2 max-w-3xl mx-auto">
            <Image 
              src="/images/event-banner.jpg" 
              alt="CCOI Asia 2026 Event Banner" 
              width={1200} 
              height={400}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          
          {/* Title below banner */}
          <h1 className="text-xl sm:text-4xl md:text-5xl font-bold mb-2 tracking-tight">
            <span className="bg-gradient-to-r from-[#1E5A96] via-[#2E5B8D] to-[#1E5A96] bg-clip-text text-transparent">
              CCOI Asia-Pacific Innovation Forum 2026
            </span>
          </h1>
          
          {/* Detailed Event Info */}
          <div className="text-xs sm:text-sm text-gray-600 mb-3">
            <p className="font-semibold text-sm sm:text-base text-gray-700">February 3-4, 2026 • Hong Kong SAR, China</p>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            <Link
              href="https://spot.eventx.io/events/7f1c370a-d533-4e1a-ad98-5a17bcfcd5d3"
              target="_blank"
              className="group relative px-4 py-1.5 sm:px-6 sm:py-2 bg-gradient-to-r from-[#1E5A96] to-[#2E5B8D] text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden text-xs sm:text-sm"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <BookOpen size={14} className="sm:w-4 sm:h-4" />
                Register Now
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2E5B8D] to-[#1E5A96] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              href="/agenda"
              className="px-4 py-1.5 sm:px-6 sm:py-2 bg-white text-[#2E5B8D] font-semibold rounded-full shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#2E5B8D]/20 hover:border-[#2E5B8D] flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <Calendar size={14} className="sm:w-4 sm:h-4" />
              View Program
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex-1 flex items-center justify-center w-full pb-24">
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-6">
            {quickLinks.map((link, idx) => {
              const Icon = link.icon;
              const isExternal = link.href.startsWith('http');
              return (
                <Link
                  key={idx}
                  href={link.href}
                  target={isExternal ? '_blank' : undefined}
                  className="group relative backdrop-blur-xl bg-white/60 hover:bg-white border border-gray-200/50 rounded-2xl p-3 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="relative mb-2 sm:mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1E5A96] to-[#2E5B8D] rounded-xl blur group-hover:blur-md transition-all duration-300 opacity-20 group-hover:opacity-40"></div>
                    <div className="relative w-10 h-10 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-[#1E5A96] to-[#2E5B8D] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <Icon size={18} className="sm:w-9 sm:h-9 text-white" />
                    </div>
                  </div>
                  <span className="text-xs sm:text-base font-semibold text-gray-700 group-hover:text-[#2E5B8D] transition-colors duration-300">
                    {link.label}
                  </span>
                </Link>
              );
            })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 text-center py-3 text-xs text-gray-500">
        <a href="https://eventx.io" target="_blank" rel="noopener noreferrer" className="hover:text-[#2E5B8D] transition-colors">
          Powered by EventX
        </a>
      </footer>
    </div>
  );
}
