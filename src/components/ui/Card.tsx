import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  variant?: 'default' | 'glass';
}

export function Card({
  children,
  className = '',
  onClick,
  hover = false,
  variant = 'default',
}: CardProps) {
  const baseStyles = variant === 'glass' ? 'glass-card-special px-5 py-[8px]' : 'glass-card p-6';
  const hoverStyles = hover
    ? 'glass-card-hover cursor-pointer transition-all duration-300 hover:scale-[1.01]'
    : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`border-b border-white/10 pb-3 mb-3 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return <h3 className={`text-lg font-semibold text-white ${className}`}>{children}</h3>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={className}>{children}</div>;
}
