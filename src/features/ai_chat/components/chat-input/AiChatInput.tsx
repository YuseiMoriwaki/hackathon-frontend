import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  KeyboardEvent,
} from 'react';
import FileUploadMenu from './FileUploadMenu';
import FileUploadPreview from './FileUploadPreview';
import { type UploadedFile } from '@/lib/api/workspaceFilesApi';
import { Send, StopCircle } from 'lucide-react';

export type FileUploadItem = {
  file: File;
  id: string;
  preview?: string;
  uploaded?: UploadedFile;
  uploading: boolean;
  progress: number;
  error?: string;
};

type AiChatInputProps = {
  onSend: (
    content: string,
    files?: UploadedFile[],
    mentionedMemberIds?: number[],
    mentionedNoteIds?: number[]
  ) => void;
  onStop?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  canStop?: boolean;
};

export type AiChatInputRef = {
  focus: () => void;
  clearContent: () => void;
};

const AiChatInput = forwardRef<AiChatInputRef, AiChatInputProps>(
  function AiChatInput(
    {
      onSend,
      onStop,
      isLoading = false,
      placeholder = 'Ask anything',
      canStop = true,
    },
    ref
  ) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [content, setContent] = useState('');
    const [uploadItems, setUploadItems] = useState<FileUploadItem[]>([]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
      clearContent: () => {
        setContent('');
      },
    }));

    const handleFilesSelected = useCallback((files: File[]) => {
      const newItems: FileUploadItem[] = files.map(file => {
        const id = `${Date.now()}-${Math.random()}`;
        const isImage = file.type.startsWith('image/');
        let preview: string | undefined;

        if (isImage) {
          preview = URL.createObjectURL(file);
        }

        return {
          file,
          id,
          preview,
          uploading: true, // Start in uploading state
          progress: 0,
        };
      });

      setUploadItems(prev => {
        const combined = [...prev, ...newItems];
        // Limit to 4 files
        return combined.slice(0, 4);
      });

      // File upload functionality removed - files are not uploaded
      // Mark all items as failed since upload API is not available
      setUploadItems(prev =>
        prev.map(entry => {
          if (newItems.some(item => item.id === entry.id)) {
            return { ...entry, error: 'File upload is not available', uploading: false };
          }
          return entry;
        })
      );
    }, []);

    const handleRemoveFile = useCallback((id: string) => {
      setUploadItems(prev => {
        const item = prev.find(entry => entry.id === id);
        if (item?.preview) {
          URL.revokeObjectURL(item.preview);
        }
        return prev.filter(entry => entry.id !== id);
      });
    }, []);

    useEffect(() => {
      return () => {
        uploadItems.forEach(item => {
          if (item.preview) {
            URL.revokeObjectURL(item.preview);
          }
        });
      };
    }, [uploadItems]);

    // Check if any files are still uploading
    const hasUploadingFiles = uploadItems.some(item => item.uploading);

    const handleSend = useCallback(
      async (
        contentToSend: string,
        mentionedMemberIds: number[] = [],
        mentionedNoteIds: number[] = []
      ) => {
        if (isLoading || hasUploadingFiles) return;

        const trimmed = contentToSend.trim();
        const hasText = trimmed.length > 0;

        if (!hasText && uploadItems.length === 0) return;

        // Check if any uploads failed
        const failedUploads = uploadItems.filter(item => item.error);
        if (failedUploads.length > 0) {
          alert(
            'Some files failed to upload. Please remove them and try again.'
          );
          return;
        }

        // Get all successfully uploaded files
        const uploadedFiles = uploadItems
          .filter(item => item.uploaded)
          .map(item => item.uploaded!);

        onSend(
          trimmed || '',
          uploadedFiles.length > 0 ? uploadedFiles : undefined,
          mentionedMemberIds,
          mentionedNoteIds
        );

        // Clear content and upload items
        setContent('');
        setUploadItems(prev => {
          prev.forEach(item => {
            if (item.preview) {
              URL.revokeObjectURL(item.preview);
            }
          });
          return [];
        });
      },
      [isLoading, hasUploadingFiles, onSend, uploadItems]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend(content);
        }
      },
      [content, handleSend]
    );

    // Auto-resize textarea
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [content]);

    const canSend = !isLoading && !hasUploadingFiles && (content.trim().length > 0 || uploadItems.length > 0);

    return (
      <div className='relative z-100 rounded-t-3xl'>
        {/* Input UI */}
        <div className='px-4 md:px-6 py-2'>
          <div className='w-full md:max-w-4xl md:mx-auto'>
            <div className='relative'>
              {/* File Upload Menu - Plus button */}
              <div className='absolute left-0 bottom-0 z-100'>
                <FileUploadMenu
                  onFilesSelected={handleFilesSelected}
                  maxFiles={4}
                  disabled={
                    isLoading || hasUploadingFiles || uploadItems.length >= 4
                  }
                />
              </div>

              {/* File Upload Preview */}
              {uploadItems.length > 0 && (
                <div className='mb-2'>
                  <FileUploadPreview
                    files={uploadItems}
                    onRemove={handleRemoveFile}
                  />
                </div>
              )}

              {/* Textarea and Send Button - SearchBar style with integrated send button */}
              <div className='flex items-center pl-12 pr-2'>
                <div className={`
                  flex flex-1 items-center 
                  bg-white/4 backdrop-blur-sm 
                  border border-black/10 
                  rounded-4xl px-4 py-3 pr-2
                  transition-all duration-300
                  shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]
                  hover:shadow-[0_12px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.18)]
                  ${isLoading || hasUploadingFiles ? 'opacity-50' : ''}
                `}>
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={isLoading || hasUploadingFiles}
                    rows={1}
                    className='flex-1 bg-transparent text-base text-white outline-none placeholder-white/50 min-h-[20px] max-h-[200px] resize-none pr-2'
                    style={{ height: 'auto' }}
                  />
                  {/* Send button inside input field */}
                  <button
                    type="button"
                    onClick={() => isLoading && canStop ? onStop?.() : handleSend(content)}
                    disabled={!canSend && !(isLoading && canStop)}
                    className={`
                      flex items-center justify-center
                      p-1.5 rounded-full
                      transition-colors duration-200
                      ${isLoading && canStop 
                        ? 'text-gray-400 hover:text-gray-300' 
                        : canSend 
                          ? 'text-gray-400 hover:text-gray-300 cursor-pointer' 
                          : 'text-gray-500 cursor-not-allowed opacity-50'
                      }
                    `}
                    title={isLoading && canStop ? 'Stop' : 'Send'}
                  >
                    {isLoading && canStop ? (
                      <StopCircle className='w-5 h-5' />
                    ) : (
                      <Send className='w-5 h-5' />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default AiChatInput;
