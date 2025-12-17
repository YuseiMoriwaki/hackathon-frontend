import { useCallback } from 'react';
import { Message, AIMessage } from '../types';
import { TimerDisplay } from './TimerDisplay';
import { AIInitiatedMessageWrapper } from './AIInitiatedMessageWrapper';
import { AIMessageView } from './AIMessageView';
import { ChatItemCard } from './ChatItemCard';
import type { UploadedFile } from '@/lib/api/workspaceFilesApi';

type MessageItemProps = {
  message: Message | AIMessage;
  sendMessage: (
    content: string,
    files?: UploadedFile[],
    mentionedMemberIds?: number[],
    mentionedNoteIds?: number[],
    notificationId?: number,
    timerCompleted?: boolean
  ) => Promise<void>;
};

export default function MessageItem({
  message,
  sendMessage,
}: MessageItemProps) {

  // Wrapper for TimerDisplay - adapts full sendMessage to simplified version
  const handleTimerSendMessage = useCallback(
    async (
      content: string,
      notificationId?: number,
      timerCompleted?: boolean
    ) => {
      return sendMessage(
        content,
        undefined, // files
        undefined, // mentionedMemberIds
        undefined, // mentionedNoteIds
        notificationId,
        timerCompleted
      );
    },
    [sendMessage]
  );

  // assistantメッセージの表示
  if (message.role === 'assistant') {
    const hasTimer = 'meta' in message && message.meta?.timer;
    const isAIInitiated =
      'meta' in message && message.meta?.is_ai_initiated === true;

    const content = message.content;
    const items = 'items' in message ? message.items : undefined;

    // Use AIMessageView for markdown rendering
    const aiMessageContent = (
      <div className='prose prose-invert max-w-none text-white leading-relaxed'>
        <AIMessageView content={content} />
      </div>
    );

    return (
      <div className='w-full max-w-5xl mx-auto mb-6 px-6 md:px-8 select-none'>
        {/* 商品表示を先に表示 (SEARCH または PURCHASE の場合) - AI出力より前に */}
        {items && items.length > 0 && (
          <div className="mb-4">
            {items.length === 1 ? (
              // PURCHASE: 1つの商品を表示（カード形式）
              <div className="max-w-md">
                <ChatItemCard
                  key={items[0].id}
                  item={items[0]}
                  showPurchaseButton={true} // PURCHASE の場合のみ購入ボタンを表示
                />
              </div>
            ) : (
              // SEARCH: 3つの商品をグリッドで表示
              <div className="grid grid-cols-3 gap-3">
                {items.map((item) => (
                  <ChatItemCard
                    key={item.id}
                    item={item}
                    showPurchaseButton={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* AIメッセージコンテンツ */}
        {isAIInitiated ? (
          <AIInitiatedMessageWrapper>
            {aiMessageContent}
          </AIInitiatedMessageWrapper>
        ) : (
          aiMessageContent
        )}

        {/* タイマー表示 - TimerDisplayが完全自己完結 */}
        {hasTimer &&
          'meta' in message &&
          message.meta?.timer && (
            <TimerDisplay
              timer={message.meta.timer}
              sendMessage={handleTimerSendMessage}
            />
          )}
      </div>
    );
  }

  // ユーザーメッセージの場合 - ChatGPT風の右寄せスタイル
  return (
    <div className='w-full max-w-5xl mx-auto flex justify-end mb-6 px-6 md:px-8 select-none'>
      <div className='max-w-[75%] flex flex-col items-end gap-2'>
        {/* Text content */}
        {message.content && (
          <div className='rounded-3xl px-5 py-3 bg-white/8 backdrop-blur-xl border border-black shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]'>
            <div className='text-sm md:text-base text-white whitespace-pre-wrap break-words leading-relaxed'>
              {message.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
