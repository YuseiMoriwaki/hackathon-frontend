'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserCircle, User, ShoppingBag, Package, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLogout = async () => {
    // Clear session
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        <div className="flex justify-between items-center">
          <Link
            href="/home"
            className="text-2xl font-bold text-white/90 hover:text-white transition-colors flex items-center gap-4 ml-10"
          >
            Delta
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/home"
              className={`${
                pathname === '/home' ? 'text-white' : 'text-white/70'
              } hover:text-white transition-colors`}
            >
              ホーム
            </Link>
            <Link
              href="/sell"
              className={`${
                pathname?.startsWith('/sell') ? 'text-white' : 'text-white/70'
              } hover:text-white transition-colors`}
            >
              出品する
            </Link>
          </nav>

          {/* Avatar Button with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleAvatarClick}
              className="relative focus:outline-none transition-transform hover:scale-105 duration-200"
              aria-label={isAuthenticated ? 'マイページメニュー' : 'ログイン'}
            >
              {isAuthenticated ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-lg">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  {/* Notification badge */}
                  <span className="absolute -top-1 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </>
              ) : (
                <UserCircle className="w-10 h-10 text-white/70 hover:text-white transition-colors" />
              )}
            </button>

            {/* Dropdown Menu */}
            {isAuthenticated && isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-card border border-white/20 rounded-xl overflow-hidden shadow-2xl">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm text-white/60">ログイン中</p>
                  <p className="font-semibold text-white truncate">{user?.name}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push('/user');
                    }}
                    className="w-full px-4 py-2 text-left text-white/90 hover:bg-white/10 transition-colors flex items-center gap-3"
                  >
                    <User className="w-4 h-4" />
                    マイページ
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push('/user/purchases');
                    }}
                    className="w-full px-4 py-2 text-left text-white/90 hover:bg-white/10 transition-colors flex items-center gap-3"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    購入履歴
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push('/user/items');
                    }}
                    className="w-full px-4 py-2 text-left text-white/90 hover:bg-white/10 transition-colors flex items-center gap-3"
                  >
                    <Package className="w-4 h-4" />
                    出品した商品
                  </button>
                </div>

                <div className="border-t border-white/10">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/10 transition-colors flex items-center gap-3"
                  >
                    <LogOut className="w-4 h-4" />
                    ログアウト
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
