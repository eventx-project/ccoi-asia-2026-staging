import Link from 'next/link';
import { Home, Calendar, Users, ClipboardList, Info, Mail } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Calendar, label: 'Agenda', href: '/agenda' },
    { icon: Users, label: 'Speakers', href: '/speakers' },
    { icon: ClipboardList, label: 'Sponsors', href: '/sponsors' },
    { icon: Info, label: 'About', href: '/about' },
    { icon: Mail, label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex justify-between sm:justify-around items-center h-16 sm:h-20 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 px-2 sm:px-3 py-2 text-gray-600 hover:text-[#2E5B8D] transition-colors flex-shrink-0 min-w-fit"
            >
              <Icon size={20} />
              <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
