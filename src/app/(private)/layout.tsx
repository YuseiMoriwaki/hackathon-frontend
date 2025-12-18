'use client';

import { AuthGuard } from '@/features/auth';
import { GlobalUIProvider } from '@/features/ai_chat/contexts/GlobalUIContext';
import { Header } from '@/components/layouts';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <GlobalUIProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          {children}
        </div>
      </GlobalUIProvider>
    </AuthGuard>
  );
}

