'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils/utils';
import { Components } from 'react-markdown';
import { Copy, Check } from 'lucide-react';

type AIMessageViewProps = {
  content: string;
  className?: string;
};

// Extracted component to satisfy React Hooks rule (component names must be Capitalized)
const PreBlock = ({
  children,
  ...rest
}: React.HTMLAttributes<HTMLPreElement>) => {
  const [copied, setCopied] = useState(false);

  // preの中のcode要素からテキストを抽出
  const extractCodeText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (React.isValidElement(node)) {
      if (node.type === 'code') {
        const props = node.props as { children?: React.ReactNode };
        return extractCodeText(props.children || '');
      }
      const props = node.props as { children?: React.ReactNode };
      if (props.children) {
        return React.Children.toArray(props.children)
          .map(child => extractCodeText(child))
          .join('');
      }
    }
    if (Array.isArray(node)) {
      return node.map(child => extractCodeText(child)).join('');
    }
    return '';
  };

  const codeText = extractCodeText(children);

  const handleCopy = async () => {
    if (!codeText) return;

    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  return (
    <div className='my-3 relative'>
      <pre
        className='overflow-x-auto rounded-2xl border border-white/10 p-5 text-sm text-gray-400'
        style={{ overscrollBehaviorX: 'contain', overscrollBehaviorY: 'auto' }}
        {...rest}
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className='absolute top-1 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-black/40 hover:bg-black/60 text-white/70 hover:text-white text-sm transition-colors backdrop-blur-sm'
      >
        {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
};

export const AIMessageView = ({ content, className }: AIMessageViewProps) => {
  const customComponents: Components = {
    h1: ({ children }) => (
      <h1 className='my-3 text-lg font-semibold text-white'>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className='my-2 text-base font-semibold text-white'>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className='my-2 text-sm font-semibold text-white'>{children}</h3>
    ),
    p: ({ children }) => (
      <p className='my-2 text-sm leading-7 text-gray-200'>{children}</p>
    ),
    code: ({ children, className }) => {
      const isCodeBlock = className?.startsWith('language-');

      if (isCodeBlock) {
        return <code className={`${className} text-gray-400`}>{children}</code>;
      }

      return (
        <code className='rounded bg-neutral-800 px-1.5 py-0.5 text-sm text-gray-200'>
          {children}
        </code>
      );
    },
    pre: PreBlock,
    a: ({ children, href }) => (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className='text-blue-400 underline hover:text-blue-300'
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className='my-3 ml-6 list-disc space-y-1 text-gray-200'>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className='my-3 ml-6 list-decimal space-y-1 text-gray-200'>
        {children}
      </ol>
    ),
    li: ({ children }) => <li className='text-gray-200'>{children}</li>,
    strong: ({ children }) => (
      <strong className='font-semibold text-white'>{children}</strong>
    ),
    em: ({ children }) => <em className='italic text-gray-100'>{children}</em>,
  };

  if (!content) return null;

  return (
    <div className={cn('w-full text-sm md:text-base', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
};
