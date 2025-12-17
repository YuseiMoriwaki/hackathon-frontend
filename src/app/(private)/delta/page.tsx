'use client';

import { useRef } from 'react';
import { Header } from '@/components/layouts';
import DeltaChat from '@/features/ai_chat/DeltaChat';

export default function DeltaPage() {
  const isInitialMount = useRef<boolean>(true);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden pt-16">
        <DeltaChat isInitialMount={isInitialMount} />
      </main>
    </div>
  );
}

