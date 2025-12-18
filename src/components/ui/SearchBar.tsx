'use client';

import { Search, Mic } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
  className?: string;
}

export function SearchBar({
  placeholder = '検索...',
  value = '',
  onChange,
  onSearch,
  className = '',
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div
      className={`
      flex flex-1 items-center 
      bg-white/4 backdrop-blur-sm 
      border border-black/10 
      rounded-4xl px-4 py-3
      transition-all duration-300
      shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]
      hover:shadow-[0_12px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.18)]
      ${className}
    `}
    >
      <Search className="mr-2 size-5 text-gray-400 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent text-base text-white outline-none placeholder-white/50"
      />
      <Mic className="ml-2 size-5 text-gray-400 shrink-0 cursor-pointer hover:text-white/70 transition-colors" />
    </div>
  );
}
