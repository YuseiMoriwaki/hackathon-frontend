'use client';

import { Mic } from 'lucide-react';

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';

// 音声認識APIの型定義
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: {
    transcript: string;
  };
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string; message?: string }) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

interface VoiceInputButtonProps {
  onTranscriptChange: (text: string) => void;
  currentText?: string;
  disabled?: boolean;
  className?: string;
}

export interface VoiceInputButtonRef {
  restartRecording: () => void;
}

export const VoiceInputButton = forwardRef<
  VoiceInputButtonRef,
  VoiceInputButtonProps
>(
  (
    { onTranscriptChange, currentText = '', disabled = false, className = '' },
    ref
  ) => {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const finalTranscriptRef = useRef<string>('');
    const lastInterimTranscriptRef = useRef<string>('');
    const processedResultIndexRef = useRef<number>(0);

    // 現在のテキストが変更されたら、finalTranscriptRefを更新
    useEffect(() => {
      if (!isRecording) {
        finalTranscriptRef.current = currentText;
      }
    }, [currentText, isRecording]);

    // クリーンアップ
    useEffect(() => {
      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    }, []);

    const startRecording = (overrideText?: string) => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.error('音声認識APIがサポートされていません');
        return;
      }

      // 録音開始時に現在のテキストを保存（overrideTextがあればそれを使用）
      finalTranscriptRef.current =
        overrideText !== undefined ? overrideText : currentText;

      // 未確定文字列をリセット
      lastInterimTranscriptRef.current = '';

      // 処理済みの結果インデックスをリセット
      processedResultIndexRef.current = 0;

      const recognition = new SpeechRecognition();

      recognitionRef.current = recognition;

      recognition.lang = 'ja-JP';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        // ベースとなる確定済み文字列
        let finalTranscript = finalTranscriptRef.current;

        // 処理済みの確定済み結果以降から、新しい確定済み結果を順番に追加
        // event.resultsには全ての結果が含まれるため、処理済み以降から追加する
        const startIndex = processedResultIndexRef.current;

        for (let i = startIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            const transcript = result[0].transcript;
            finalTranscript += transcript;
            finalTranscriptRef.current = finalTranscript;

            // 処理済みインデックスを更新（この結果まで処理した）
            processedResultIndexRef.current = i + 1;
          }
        }

        // 最新の未確定結果を取得（処理済みの確定結果以降から探す）
        // これにより、確定済みに含まれていない未確定結果のみを取得できる
        let currentInterimTranscript = '';
        const lastProcessedIndex = processedResultIndexRef.current;

        for (let i = event.results.length - 1; i >= lastProcessedIndex; --i) {
          const result = event.results[i];
          if (!result.isFinal) {
            currentInterimTranscript = result[0].transcript;
            break; // 最新の未確定結果を取得
          }
        }

        // 未確定文字列を更新
        lastInterimTranscriptRef.current = currentInterimTranscript;

        // 確定済み文字列 + 未確定文字列を表示
        // 未確定が確定されたら、次のイベントで確定済みに置き換わる（重複なし）
        const fullText = finalTranscript + currentInterimTranscript;

        onTranscriptChange(fullText);
      };

      recognition.onerror = event => {
        console.error('音声認識エラー:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        console.log('音声認識が停止しました');

        // ユーザーが手動で停止していない場合は自動で再起動
        if (isRecording && recognitionRef.current) {
          try {
            recognitionRef.current.start();
            console.log('音声認識を自動再起動します');
          } catch (error) {
            console.error('自動再起動エラー:', error);
            setIsRecording(false);
            recognitionRef.current = null;
          }
        }
      };

      try {
        recognition.start();
        setIsRecording(true);
        console.log('音声認識開始');
      } catch (error) {
        console.error('音声認識の開始エラー:', error);
      }
    };

    // Expose restartRecording method to parent
    useImperativeHandle(ref, () => ({
      restartRecording: () => {
        if (isRecording) {
          // Stop current recording
          if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
          }
          setIsRecording(false);
          finalTranscriptRef.current = '';
          onTranscriptChange('');

          setTimeout(() => {
            startRecording('');
          }, 100);
        }
      },
    }));

    const handleVoiceInput = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (!isRecording) {
        startRecording();
      } else {
        // 0.8秒間は音声認識を続けてから停止
        setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
              console.log('音声認識停止');
            } catch (error) {
              console.error('音声認識停止エラー:', error);
            }
            recognitionRef.current = null;
          }
          setIsRecording(false);
        }, 800);
      }
    };

    const Icon = isRecording ? Mic : Mic;

    return (
      <button
        onClick={handleVoiceInput}
        disabled={disabled}
        type='button'
        title={isRecording ? '音声認識を停止' : '音声認識を開始'}
        className={`${className} relative flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300`}
      >
        <Icon
          className={`w-5 h-5 relative z-10 transition-colors duration-300 ${
            isRecording ? 'text-white' : 'text-white/40'
          }`}
          style={isRecording ? { animationDuration: '1.5s' } : undefined}
        />
      </button>
    );
  }
);

VoiceInputButton.displayName = 'VoiceInputButton';
