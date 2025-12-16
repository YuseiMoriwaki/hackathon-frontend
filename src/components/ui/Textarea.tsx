import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`glass-input w-full px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed resize-vertical outline-none ${
            error ? 'border-red-500/50 focus:border-red-500/70' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-300">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-white/50">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

