'use client';

import { useRef } from 'react';
import DeltaChat from '@/features/ai_chat/DeltaChat';

export default function DeltaPage() {
  const isInitialMount = useRef<boolean>(true);

  return (
    <main className="flex-1 flex flex-col overflow-hidden pt-16 bg-[#0a0a0a]">
      <DeltaChat isInitialMount={isInitialMount} />
    </main>
  );
}

