'use client';

import { useState } from 'react';
import { useSendMessage } from './useSendMessage';
import type { Message } from '../types';

export interface UseChatOptions {
  apiBaseUrl?: string;
}

/**
 * Simplified hook for chat functionality without thread management
 * Just handles message state and sending
 */
export function useChat({ apiBaseUrl }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Message sending
  const sendMessageHook = useSendMessage({
    messages,
    apiBaseUrl,
    onMessageUpdate: setMessages,
  });

  return {
    messages,
    messagesLoading: false,
    messagesError: null,

    // Message sending
    sendMessage: sendMessageHook.sendMessage,
    stopStream: sendMessageHook.stopStream,
    isSending: sendMessageHook.isLoading,
    sendError: sendMessageHook.error,
  };
}
