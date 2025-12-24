import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2E5B8D]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E5A96]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      <div className="relative z-10">
      <header className="bg-white py-4 px-4 sticky top-0">
        <Link href="/" className="text-[#2E5B8D] text-sm mb-2 inline-block">← Back</Link>
        <h1 className="text-2xl font-bold text-gray-800">Contact Us</h1>
      </header>

      <main className="p-4 space-y-6">
        <section className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Get In Touch</h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            Feel free to reach out to us through any of the following ways.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-start gap-3 mb-4">
            <Mail size={20} className="text-[#2E5B8D] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
              <a 
                href="mailto:secretariat@ccoi.asia" 
                className="text-[#2E5B8D] underline text-sm"
              >
                secretariat@ccoi.asia
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-[#2E5B8D] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                11190 Sunrise Valley Dr, Ste 300<br />
                Reston, VA 20191<br />
                USA
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Newsletter</h3>
          <p className="text-sm text-gray-700 mb-3">
            Subscribe to stay up-to-date with our latest events and initiatives.
          </p>
          <a 
            href="https://ccoi.asia/contact/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-[#2E5B8D] text-white rounded text-sm"
          >
            Subscribe
          </a>
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
