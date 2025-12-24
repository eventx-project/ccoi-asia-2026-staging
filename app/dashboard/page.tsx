"use client";
import Link from 'next/link';
import menuData from '../../data/menu.json';
import { Info, ClipboardList, Calendar, Mic2, Users, Home, Mail } from 'lucide-react';

const ICONS: Record<string, any> = {
  Info,
  ClipboardList,
  Calendar,
  Mic2,
  Users,
  Home,
  Mail
};

export default function DashboardPage() {
  const menu: Array<any> = menuData;

  return (
    <div className="min-h-screen p-4">
      <header className="sticky top-0 bg-white py-4 z-10">
        <h2 className="text-xl font-bold text-gray-800">CCOI Asia 2026</h2>
      </header>

      <main className="grid grid-cols-2 gap-4 mt-6 pb-6">
        {menu.map((item, idx) => {
          const Icon = ICONS[item.icon] || Info;
          const isExternal = item.external;
          return (
            <Link
              key={idx}
              href={item.link}
              target={isExternal ? '_blank' : undefined}
              className="flex flex-col items-center justify-center rounded-xl p-6 shadow-md aspect-square text-center text-white teal-gradient"
            >
              <Icon size={28} className="mb-2" />
              <span className="font-semibold text-sm">{item.title}</span>
            </Link>
          );
        })}
      </main>
    </div>
  );
}
