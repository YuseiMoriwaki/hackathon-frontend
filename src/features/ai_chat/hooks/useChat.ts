'use client';

import { useState } from 'react';
import { useSendMessage } from './useSendMessage';
import type { Message } from '../types';

export interface UseChatOptions {
  apiBaseUrl?: string;
}

/**
 * Demo messages to show conversation feel when AI is not connected
 */
const DEMO_MESSAGES: Message[] = [
  {
    id: 'demo-1',
    role: 'user',
    content: 'こんにちは',
  },
  {
    id: 'demo-2',
    role: 'assistant',
    content: 'こんにちは！何かお手伝いできることはありますか？',
  },
];

/**
 * Simplified hook for chat functionality without thread management
 * Just handles message state and sending
 */
export function useChat({ apiBaseUrl }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);

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
