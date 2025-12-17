'use client';

import { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, File as FileIcon } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHandle,
  DrawerBody,
} from '@/components/ui/drawer';

type FileUploadMenuProps = {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
};

export default function FileUploadMenu({
  onFilesSelected,
  maxFiles = 4,
  disabled = false,
}: FileUploadMenuProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Limit to maxFiles
    const selectedFiles = files.slice(0, maxFiles);

    // Validate file count
    if (files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files at once.`);
    }

    onFilesSelected(selectedFiles);

    // Reset input
    e.target.value = '';
  };

  const triggerFileInput = (accept: 'image' | 'file') => {
    const input = accept === 'image' ? imageInputRef : fileInputRef;
    input.current?.click();
    setIsOpen(false);
  };

  // Close menu when disabled
  useEffect(() => {
    if (disabled && isOpen) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  return (
    <>
      <div className='relative flex flex-col items-center gap-3'>
        <button
          type='button'
          onClick={() => {
            if (disabled) return;
            setIsOpen(true);
          }}
          disabled={disabled}
          className='flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/3 backdrop-blur-md text-white/80 border border-black transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-white/15 hover:text-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.18)] disabled:opacity-50 disabled:cursor-not-allowed'
          aria-label='Add files'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <line x1='12' y1='5' x2='12' y2='19'></line>
            <line x1='5' y1='12' x2='19' y2='12'></line>
          </svg>
        </button>

        {/* Hidden file inputs */}
        <input
          ref={imageInputRef}
          type='file'
          accept='image/*'
          multiple
          className='hidden'
          onChange={handleFileSelect}
        />
        <input
          ref={fileInputRef}
          type='file'
          multiple
          className='hidden'
          onChange={handleFileSelect}
        />
      </div>

      {/* File Upload Drawer - outside relative container to avoid stacking context issues */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent maxHeight='auto'>
          <DrawerHandle />
          <DrawerBody className='pb-8'>
            <div className='flex flex-col gap-2'>
              <button
                type='button'
                onClick={() => triggerFileInput('image')}
                disabled={disabled}
                className='flex items-center gap-4 w-full px-4 py-3 rounded-xl bg-white/5 text-white/90 transition-all duration-200 hover:bg-white/10 active:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10'>
                  <ImageIcon className='h-5 w-5' />
                </div>
                <span className='text-[17px]'>Upload images</span>
              </button>
              <button
                type='button'
                onClick={() => triggerFileInput('file')}
                disabled={disabled}
                className='flex items-center gap-4 w-full px-4 py-3 rounded-xl bg-white/5 text-white/90 transition-all duration-200 hover:bg-white/10 active:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10'>
                  <FileIcon className='h-5 w-5' />
                </div>
                <span className='text-[17px]'>Upload files</span>
              </button>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

