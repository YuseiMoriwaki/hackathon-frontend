import { useRef, useCallback } from 'react';
import ChatContainer from './components/ChatContainer';
import AiChatInput from './components/chat-input/AiChatInput';
import { useChat } from './hooks/useChat';
import { useMessageAutoScroll } from './hooks/useMessageAutoScroll';
import type { UploadedFile } from '@/lib/api/workspaceFilesApi';

interface DeltaChatProps {
  isInitialMount: React.RefObject<boolean>;
}

export default function DeltaChat({ isInitialMount }: DeltaChatProps) {
  const { messages, sendMessage, isSending, stopStream } = useChat();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const streamingContainerRef = useRef<HTMLDivElement>(null);

  // Memoize sendMessage function to prevent ChatContainer re-renders
  const handleSendMessage = useCallback(
    (
      content: string,
      files?: UploadedFile[],
      mentionedMemberIds?: number[],
      mentionedNoteIds?: number[],
      notificationId?: number,
      timerCompleted?: boolean
    ) => {
      return sendMessage({
        content,
        files,
        mentionedMemberIds,
        mentionedNoteIds,
        notificationId,
        timerCompleted,
      });
    },
    [sendMessage]
  );

  // Handle AI chat input send
  const handleAiChatSend = useCallback(
    (
      content: string,
      files?: UploadedFile[],
      mentionedMemberIds?: number[],
      mentionedNoteIds?: number[]
    ) => {
      // eslint-disable-next-line react-hooks/immutability
      isInitialMount.current = false; // Crucial for separate behaviour between intial mount and message sends
      void sendMessage({
        content,
        files,
        mentionedMemberIds,
        mentionedNoteIds,
      });
    },
    [sendMessage, isInitialMount]
  );

  // Auto-scroll when new messages arrive
  useMessageAutoScroll({
    messages: messages,
    scrollContainerRef,
    streamingContainerRef,
    isInitialMount: isInitialMount.current,
  });

  return (
    <div className='flex flex-col h-full transition-all duration-300'>
      <ChatContainer
        ref={scrollContainerRef}
        messages={messages}
        sendMessage={handleSendMessage}
        streamingContainerRef={streamingContainerRef}
        isInitialMount={isInitialMount}
      />

      {/* Absolutely positioned ChatInput - Fixed position */}
      <div className="fixed left-0 right-0 bottom-[60px] z-110 py-4">
        <AiChatInput
          onSend={handleAiChatSend}
          onStop={stopStream}
          isLoading={isSending}
        />
      </div>
    </div>
  );
}