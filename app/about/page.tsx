import Link from 'next/link';

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
        <section className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">The Collaborative Community on Ophthalmic Innovation</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Scheduled for February 3 – 4, 2026 in Hong Kong, the CCOI Asia-Pacific Innovation Forum is a clinician-driven innovation meeting focusing on new technologies, entrepreneurial ventures and product commercialization in the ophthalmic healthcare sector.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Focus Areas</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Global innovation with a particular interest in the Asia-Pacific region</li>
            <li>• Groundbreaking advancement in ophthalmic devices, diagnostics and pharmaceuticals</li>
            <li>• Myopia Consensus Workshop (Day 1)</li>
            <li>• Innovation Day (Day 2)</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Participants</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Our meeting brings together physicians, scientists, researchers, regulators, reimbursement specialists, corporate leaders, venture capitalists and angel investors who are interested in furthering ophthalmic care in the Asia-Pacific region and beyond.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Format</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Our meeting will combine panel discussions, company presentations and networking breaks, providing a unique platform for collaboration and business talks.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Learn More</h3>
          <p className="text-sm text-gray-700 mb-3">
            For more information about CCOI and our mission, visit our main website:
          </p>
          <a href="https://cc-oi.org/" target="_blank" rel="noopener noreferrer" className="text-[#2E5B8D] underline text-sm">
            cc-oi.org
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
