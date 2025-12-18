'use client';

import { use, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ItemDetailPage } from '@/features/items';
import { GlassButton } from '@/components/ui';
import { ArrowLeft, EllipsisVertical, Share2, Flag } from 'lucide-react';

export default function ItemDetailPageRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handlePurchaseClick = () => {
    router.push(`/checkout/${id}`);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Fixed Navigation Buttons */}
      <div className="fixed top-20 left-0 right-0 z-40 px-4 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Back Button */}
          <GlassButton onClick={() => router.back()} ariaLabel="戻る">
            <ArrowLeft className="w-5 h-5 text-white" />
          </GlassButton>

          {/* Menu Button */}
          <div className="relative" ref={menuRef}>
            <GlassButton onClick={() => setIsMenuOpen(!isMenuOpen)} ariaLabel="メニュー">
              <EllipsisVertical className="w-5 h-5 text-white" />
            </GlassButton>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div
                className="
                absolute right-0 mt-2 z-110 w-40 
                rounded-lg p-1 
                bg-black/60 backdrop-blur-sm 
                border border-black/10
                transition-all duration-300
                shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]
                hover:shadow-[0_12px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.18)]
              "
              >
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Share functionality placeholder
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-white/10 rounded-md flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Report functionality placeholder
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-white/10 rounded-md flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 pt-28 pb-24">
        <ItemDetailPage itemId={id} onPurchaseClick={handlePurchaseClick} />
      </main>
    </>
  );
}
