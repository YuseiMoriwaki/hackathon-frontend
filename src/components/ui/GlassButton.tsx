'use client';

import { ReactNode } from 'react';

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export function GlassButton({ children, onClick, className = '', ariaLabel }: GlassButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        size-12 rounded-full p-2
        bg-white/5 backdrop-blur-sm 
        border border-black/10
        flex items-center justify-center
        transition-all duration-300
        shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]
        hover:bg-white/3
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.18)]
        disabled:hover:shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]
        ${className}
      `}
    >
      {children}
    </button>
  );
}

