'use client';

import React, { useEffect, useState, useRef } from 'react';
import { TimerState } from '../types';

type TimerDisplayProps = {
  timer: TimerState;
  sendMessage: (
    content: string,
    notificationId?: number,
    timerCompleted?: boolean
  ) => Promise<void>;
};

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timer,
  sendMessage,
}) => {
  // Calculate initial remaining seconds using useState initializer
  const calculateInitialRemaining = () => {
    const endsAt = new Date(timer.ends_at);
    const now = new Date();
    return Math.max(0, Math.floor((endsAt.getTime() - now.getTime()) / 1000));
  };

  const [remainingSeconds, setRemainingSeconds] = useState<number>(calculateInitialRemaining);
  const hasCompleted = useRef(false);

  // デバッグ用ログ
  console.log('TimerDisplay rendered with timer:', timer);
  console.log('Timer status:', timer.status);
  console.log('Timer ends_at:', timer.ends_at);

  useEffect(() => {
    console.log('TimerDisplay useEffect triggered');
    // 残り時間を計算する関数
    const calculateRemaining = () => {
      const endsAt = new Date(timer.ends_at);
      const now = new Date();

      // デバッグログ追加
      console.log('=== Timer Timezone Debug ===');
      console.log('timer.ends_at (raw):', timer.ends_at);
      console.log('endsAt (parsed):', endsAt.toISOString());
      console.log('endsAt (local):', endsAt.toString());
      console.log('now (UTC):', now.toISOString());
      console.log('now (local):', now.toString());
      console.log('endsAt timestamp:', endsAt.getTime());
      console.log('now timestamp:', now.getTime());
      console.log('difference (ms):', endsAt.getTime() - now.getTime());

      const remaining = Math.max(
        0,
        Math.floor((endsAt.getTime() - now.getTime()) / 1000)
      );
      console.log('Calculated remaining seconds:', remaining);
      console.log('===========================');

      return remaining;
    };

    console.log('Current remaining seconds:', remainingSeconds);

    // 2秒前に送信するための閾値チェック
    const EARLY_SEND_SECONDS = 1;

    // 1秒ごとに更新
    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setRemainingSeconds(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        return;
      }

      // 残り1秒になったら送信
      if (remaining === EARLY_SEND_SECONDS && !hasCompleted.current) {
        hasCompleted.current = true;
        console.log('Timer reached 1 seconds remaining, calling sendMessage');
        sendMessage('', undefined, true).catch(err => {
          console.error('Error completing timer:', err);
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, sendMessage]); // timer, sendMessageに依存

  console.log('Current remainingSeconds:', remainingSeconds);
  console.log('Timer status check:', timer.status === 'completed');
  console.log(
    'Will render?',
    !(remainingSeconds === 0 || timer.status === 'completed')
  );

  // 時間切れまたはcompleted → 非表示
  if (remainingSeconds === 0 || timer.status === 'completed') {
    console.log('TimerDisplay returning null');
    return null;
  }

  // const totalSeconds = timer.duration_seconds || timer.duration_minutes * 60;
  // const progress =
  //   totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;

  // 残り時間をMM:SS形式に変換（先行ゼロ付き）
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  console.log('TimerDisplay rendering with timeDisplay:', timeDisplay);

  return (
    <div className='flex justify-start items-center my-6 px-2'>
      <div className='bg-black/20 backdrop-blur-xl rounded-[20px] px-6 py-2 flex items-center justify-between min-w-[270px] border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-300'>
        {/* 左側: 時間表示 */}
        <div className='flex flex-col items-start'>
          <div className='text-3xl font-light text-white tracking-tight'>
            {timeDisplay}
          </div>
          <div className='text-sm text-white/60 font-normal mt-1 px-2'>
            Timer
          </div>
        </div>

        {/* 右側: 一時停止ボタン */}
        <div className='relative'>
          {/* 一時停止ボタン - 円の中にアイコン */}
          <button className='w-12 h-12 rounded-full border-2 border-orange-400 bg-transparent flex items-center justify-center hover:bg-orange-400/10 transition-colors'>
            <div className='flex space-x-1'>
              <div className='w-1 h-4 bg-orange-400 rounded-full'></div>
              <div className='w-1 h-4 bg-orange-400 rounded-full'></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
