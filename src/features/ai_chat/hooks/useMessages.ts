'use client';

import { useState } from 'react';
import type { Message } from '../types';

/**
 * Simplified messages hook - no thread fetching
 * Messages are managed in memory only
 */
export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // No fetching - messages are managed by parent component
  // This hook just provides state management

  return {
    messages,
    setMessages,
    loading,
    error,
    refetch: async () => {
      // No-op: no thread to refetch from
    },
  };
}
