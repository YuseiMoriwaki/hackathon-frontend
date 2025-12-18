'use client';

import { Providers } from '@/app/providers';
import { BottomNav } from './BottomNav';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="pb-20 md:pb-0">{children}</div>
      <BottomNav />
    </Providers>
  );
}
