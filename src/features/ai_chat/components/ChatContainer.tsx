import { Message, AIMessage } from '../types';
import { forwardRef } from 'react';
import MessageItem from './MessageItem';
import { useGlobalUI } from '../contexts/GlobalUIContext';
import ScrollableView from '@/components/layouts/ScrollableView';
import type { UploadedFile } from '@/lib/api/workspaceFilesApi';

type ChatContainerProps = {
  messages: Message[] | AIMessage[];
  sendMessage: (
    content: string,
    files?: UploadedFile[],
    mentionedMemberIds?: number[],
    mentionedNoteIds?: number[],
    notificationId?: number,
    timerCompleted?: boolean
  ) => Promise<void>;
  streamingContainerRef?: React.RefObject<HTMLDivElement | null>;
  isInitialMount?: React.RefObject<boolean>;
};

const ChatContainer = forwardRef<HTMLDivElement, ChatContainerProps>(
  ({ messages, sendMessage, streamingContainerRef, isInitialMount }, ref) => {
    // Separate committed (saved to DB) messages from streaming (temporary) messages
    // Temporary messages have string IDs from Date.now().toString()
    const committedMessages: (Message | AIMessage)[] = [];
    const streamingMessages: (Message | AIMessage)[] = [];

    messages.forEach(message => {
      const isTemporary = 'id' in message && typeof message.id === 'string';
      if (isTemporary) {
        streamingMessages.push(message);
      } else {
        committedMessages.push(message);
      }
    });

    const { isInputActive } = useGlobalUI();

    const hasStreamingMessages = streamingMessages.length > 0;

    // If no streaming messages, find recent messages after the last user message
    let recentMessages: (Message | AIMessage)[] = [];
    let messagesBeforeRecent: (Message | AIMessage)[] = committedMessages;

    if (!hasStreamingMessages && committedMessages.length > 0) {
      // Find the index of the most recent user message
      let lastUserMessageIndex = -1;
      for (let i = committedMessages.length - 1; i >= 0; i--) {
        if (committedMessages[i].role === 'user') {
          lastUserMessageIndex = i;
          break;
        }
      }

      // If we found a user message, split the messages
      if (lastUserMessageIndex !== -1 && !isInitialMount?.current) {
        messagesBeforeRecent = committedMessages.slice(0, lastUserMessageIndex);
        recentMessages = committedMessages.slice(lastUserMessageIndex);
      }
    }

    // Determine what to show in the streaming/recent container
    const containerMessages = hasStreamingMessages ? streamingMessages : recentMessages;
    // Don't show container on initial mount
    const shouldShowContainer = !isInitialMount?.current && containerMessages.length > 0;

    return (
      <div className="flex flex-col flex-1 bg-linear-to-br from-slate-950 via-black to-slate-950 relative overflow-hidden">
        {/* メッセージエリア - GPU最適化 */}
        <ScrollableView ref={ref} className={`pt-20 ${isInputActive ? 'pb-6' : 'pb-20'}`}>
          {/* Messages Content */}
          <div className="relative">
            {/* Messages before the recent/streaming section */}
            {messagesBeforeRecent.map((message, i) => {
              const messageId =
                'id' in message && typeof message.id === 'number' ? message.id : `committed-${i}`;
              const key = `${messageId}-${i}`;

              return (
                <div key={key} data-message-index={i}>
                  <MessageItem message={message} sendMessage={sendMessage} />
                </div>
              );
            })}

            {/* Small spacing when no container to show */}
            {!shouldShowContainer && <div className="h-16"></div>}

            {/* Streaming/Recent messages container with min-height of container minus header */}
            {shouldShowContainer && (
              <div
                ref={streamingContainerRef}
                className={`flex flex-col pb-32`}
                style={{ minHeight: 'calc(100vh)' }}
              >
                {containerMessages.map((message, i) => {
                  const messageId = hasStreamingMessages
                    ? `streaming-${message.id}-${i}`
                    : `recent-${message.id}-${i}`;
                  const key = messageId;

                  return (
                    <div key={key} data-message-index={messagesBeforeRecent.length + i}>
                      <MessageItem message={message} sendMessage={sendMessage} />
                    </div>
                  );
                })}
                {/* Extra space to ensure content can grow */}
                <div className="grow"></div>
              </div>
            )}
          </div>
        </ScrollableView>
      </div>
    );
  }
);

ChatContainer.displayName = 'ChatContainer';

export default ChatContainer;
