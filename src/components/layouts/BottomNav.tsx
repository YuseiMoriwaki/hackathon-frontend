'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, Heart, MessageSquare } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = useMemo(() => [
    {
      label: 'ホーム',
      path: '/home',
      icon: Home,
    },
    {
      label: 'お気に入り',
      path: '/favorites',
      icon: Heart,
    },
    {
      label: 'Delta',
      path: '/delta',
      icon: MessageSquare,
    },
    {
      label: '出品',
      path: '/sell',
      icon: Plus,
    },
  ], []);

  // Calculate initial index using useState initializer
  const getInitialIndex = () => {
    return navItems.findIndex(item => pathname === item.path);
  };

  const [activeIndex, setActiveIndex] = useState(getInitialIndex);

  // Update active index when pathname changes (using ref to avoid setState in effect)
  useEffect(() => {
    const currentIndex = navItems.findIndex(item => pathname === item.path);
    if (currentIndex !== -1) {
      // Use setTimeout to defer state update outside of render cycle
      const timeoutId = setTimeout(() => {
        setActiveIndex(currentIndex);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [pathname, navItems]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 my-3 mx-6 md:hidden">
      <div className="
        bg-white/2 backdrop-blur-sm 
        border border-black/10 
        rounded-full 
        transition-all duration-300
        shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.18)]
        relative flex items-center justify-around p-1
      ">
        {/* Active tab background indicator */}
        <div 
          className="absolute h-[calc(100%-8px)] rounded-full bg-white/10 backdrop-blur-sm transition-all duration-500 ease-out"
          style={{
            width: `${100 / navItems.length}%`,
            left: `${(activeIndex * 100) / navItems.length}%`,
          }}
        />
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className="relative z-10 flex flex-col items-center gap-0.5 px-4 py-2 transition-all duration-300 group flex-1"
            >
              <Icon
                className={`w-5 h-5 transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}
              />
              <span
                className={`text-xs transition-colors duration-300 ${
                  isActive ? 'text-white font-medium' : 'text-gray-400 group-hover:text-white'
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

