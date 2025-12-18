import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'rounded-3xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]';

  const variantStyles = {
    primary:
      'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-500/40 backdrop-blur-sm',
    secondary:
      'bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:border-white/20 backdrop-blur-sm',
    danger:
      'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/40 backdrop-blur-sm',
    outline:
      'border border-white/20 text-white/70 hover:bg-white/5 hover:text-white backdrop-blur-sm',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          読み込み中...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
