'use client';

import React from 'react';

type AIInitiatedMessageWrapperProps = {
  children: React.ReactNode;
};

export const AIInitiatedMessageWrapper = ({
  children,
}: AIInitiatedMessageWrapperProps) => {
  return (
    <div
      className='
      border border-white/20 
      shadow-[0_0_5px_rgba(255,255,255,0.4)]
      bg-white/3
      backdrop-blur-md
      rounded-[1.618rem]
      px-6
      py-2
    '
    >
      {children}
    </div>
  );
};
