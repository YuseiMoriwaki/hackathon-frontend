import type { Item } from '@/features/items/types';

export type MessageFile = {
  id: number;
  original_filename: string;
  file_path: string;
  mime_type: string;
  file_size: number;
};

export type Message = {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  files?: MessageFile[];
  file_ids?: number[];
  items?: Item[]; // Items displayed in chat (for SEARCH/PURCHASE actions)
};

export type AIMessage = {
  id: number;
  content: string;
  thread_id?: number; // Optional - thread concept removed
  role: 'user' | 'assistant' | 'system';
  created_at: string;
  meta?: Record<string, any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  files?: MessageFile[];
  items?: Item[]; // Items displayed in chat (for SEARCH/PURCHASE actions)
};

export type InputMode = 'default' | 'expanded';

export type SuggestionConfig = {
  suggestions: string[];
  inputPlaceholder?: string;
};

// Timer types
export type TimerStatus = 'active' | 'completed' | 'cancelled';

export type TimerState = {
  duration_minutes: number; // float型に対応
  duration_seconds?: number; // 秒単位のTimer用
  started_at: string;
  ends_at: string;
  status: TimerStatus;
  unit: string; // "minutes" or "seconds"
  message_id?: number;
};

export type TimerPollResponse = {
  timer: TimerState | null;
  timer_ended: boolean;
  remaining_seconds?: number;
};
