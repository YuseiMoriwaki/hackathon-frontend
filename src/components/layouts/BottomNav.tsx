'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, Heart } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'ホーム',
      path: '/home',
      icon: Home,
    },
    {
      label: '出品',
      path: '/sell',
      icon: Plus,
    },
    {
      label: 'お気に入り',
      path: '/favorites',
      icon: Heart,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/5 backdrop-blur-xl border-t border-white/10 md:hidden z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          const isCenter = item.path === '/sell';

          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center gap-1 transition-all duration-200"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                } transition-colors`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-white' : 'text-white/70'
                  }`}
                />
              </div>
              <span
                className={`text-xs ${
                  isActive ? 'text-white font-medium' : 'text-white/60'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

