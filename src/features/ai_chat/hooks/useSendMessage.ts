'use client';

import { useState, useCallback, useRef } from 'react';
import type { Message } from '../types';
import type { UploadedFile } from '@/lib/api/workspaceFilesApi';
import type { Item } from '@/features/items/types';

export interface SendMessageOptions {
  content: string;
  files?: UploadedFile[];
  mentionedMemberIds?: number[];
  mentionedNoteIds?: number[];
  notificationId?: number;
  timerCompleted?: boolean;
}

export interface UseSendMessageOptions {
  messages: Message[];
  apiBaseUrl?: string;
  onMessageUpdate?: (messages: Message[]) => void;
  onComplete?: () => void;
}

export function useSendMessage({
  messages,
  apiBaseUrl = '/api',
  onMessageUpdate,
  onComplete,
}: UseSendMessageOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async ({
      content,
      files,
      mentionedMemberIds,
      mentionedNoteIds,
      notificationId,
      timerCompleted,
    }: SendMessageOptions) => {

      // Abort existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsLoading(true);
      setError(null);

      // Remove demo messages when user sends first real message
      const currentMessages = messages.filter(msg => !msg.id?.startsWith('demo-'));
      
      // Create temporary user message
      let tempUserMsg: Message | null = null;
      if (content.trim() || (files && files.length > 0)) {
        tempUserMsg = {
          id: Date.now().toString(),
          content,
          role: 'user',
          file_ids: files?.map(f => f.id),
          // Include full file objects for immediate UI rendering during streaming
          files: files?.map(f => ({
            id: f.id,
            original_filename: f.original_filename,
            file_path: f.file_path,
            mime_type: f.mime_type,
            file_size: f.file_size,
          })),
        };
      }

      // Create temporary AI message
      const tempAIMsg: Message = {
        id: (Date.now() + (tempUserMsg ? 1 : 0)).toString(),
        content: '',
        role: 'assistant',
      };

      // Update messages (without demo messages)
      let updatedMessages: Message[] = [];
      let newMessages: Message[] = [];

      if (tempUserMsg) {
        updatedMessages = [...currentMessages, tempUserMsg];
        newMessages = [...currentMessages, tempUserMsg, tempAIMsg];
      } else {
        updatedMessages = [...currentMessages];
        newMessages = [...currentMessages, tempAIMsg];
      }

      onMessageUpdate?.(newMessages);

      try {
        const url = `${apiBaseUrl}/ai_chat/stream`;
        const requestBody = {
          thread_id: null, // Thread concept removed - send null
          messages: updatedMessages,
          ...(mentionedMemberIds &&
            mentionedMemberIds.length > 0 && {
              mentioned_member_ids: mentionedMemberIds,
            }),
          ...(mentionedNoteIds &&
            mentionedNoteIds.length > 0 && {
              mentioned_note_ids: mentionedNoteIds,
            }),
          ...(notificationId && { notification_id: notificationId }),
          ...(timerCompleted && { timer_completed: true }),
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errorText = await response.text();
          
          // Handle 404 as demo mode (backend not connected)
          if (response.status === 404) {
            // Simulate AI response with typing animation
            const demoResponses = [
              '了解しました！他に何かお手伝いできることはありますか？',
              'なるほど、わかりました。詳しく教えていただけますか？',
              'ありがとうございます。それについて、もう少し詳しく聞かせてください。',
              'おっしゃる通りです。他にも質問があれば、お気軽にどうぞ。',
            ];
            const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
            
            // Simulate typing animation
            let typedContent = '';
            for (let i = 0; i < randomResponse.length; i++) {
              await new Promise(resolve => setTimeout(resolve, 30)); // Typing delay
              typedContent += randomResponse[i];
              onMessageUpdate?.(
                newMessages.map(msg =>
                  msg.id === tempAIMsg.id
                    ? { ...msg, content: typedContent }
                    : msg
                )
              );
            }
            
            setIsLoading(false);
            abortControllerRef.current = null;
            onComplete?.();
            return;
          }
          
          console.error('Failed to send message:', response.status, errorText);
          throw new Error(`Failed to send message: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error('Response body is null');

        let accumulatedContent = '';
        let items: Item[] | undefined = undefined;
        let buffer = '';
        let lastUpdateTime = 0;
        const UPDATE_THROTTLE = 50;

        while (true) {
          if (abortController.signal.aborted) break;

          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsedData = JSON.parse(data);
                
                // Handle items data (sent before content stream)
                if (parsedData.type === 'items' && Array.isArray(parsedData.items)) {
                  items = parsedData.items;
                  // Immediately update message with items
                  onMessageUpdate?.(
                    newMessages.map(msg =>
                      msg.id === tempAIMsg.id
                        ? { ...msg, items }
                        : msg
                    )
                  );
                  continue;
                }
                
                // Handle content stream data
                if (parsedData && typeof parsedData.data === 'string') {
                  accumulatedContent += parsedData.data;
                } else if (typeof data === 'string') {
                  // Fallback: if data is not JSON, use it directly
                  accumulatedContent += data;
                }

                const now = Date.now();
                if (now - lastUpdateTime >= UPDATE_THROTTLE) {
                  onMessageUpdate?.(
                    newMessages.map(msg =>
                      msg.id === tempAIMsg.id
                        ? { ...msg, content: accumulatedContent, items }
                        : msg
                    )
                  );
                  lastUpdateTime = now;
                }
              } catch (parseError) {
                console.warn('Failed to parse SSE data:', data, parseError);
                // Continue processing other chunks
              }
            }
          }
        }

        // Final update (include items if present)
        onMessageUpdate?.(
          newMessages.map(msg =>
            msg.id === tempAIMsg.id
              ? { ...msg, content: accumulatedContent, items }
              : msg
          )
        );

        if (abortController.signal.aborted) {
          return;
        }

        onComplete?.();
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('Error in sendMessage:', err);

        // Remove temporary messages on error
        onMessageUpdate?.(
          messages.filter(
            msg => msg.id !== tempUserMsg?.id && msg.id !== tempAIMsg.id
          )
        );
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, apiBaseUrl, onMessageUpdate, onComplete]
  );

  return {
    sendMessage,
    stopStream,
    isLoading,
    error,
  };
}
