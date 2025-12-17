'use client';

import { AuthGuard } from '@/features/auth';
import { GlobalUIProvider } from '@/features/ai_chat/contexts/GlobalUIContext';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <GlobalUIProvider>
      {children}
      </GlobalUIProvider>
    </AuthGuard>
  );
}

