import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  variant: 'error' | 'success' | 'info' | 'warning';
  children: React.ReactNode;
  title?: string;
}

export function Alert({ variant, children, title }: AlertProps) {
  const config = {
    error: {
      icon: XCircle,
      className: 'bg-red-500/20 border-red-500/50 text-red-300',
      iconColor: 'text-red-400',
    },
    success: {
      icon: CheckCircle,
      className: 'bg-green-500/20 border-green-500/50 text-green-300',
      iconColor: 'text-green-400',
    },
    info: {
      icon: Info,
      className: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
      iconColor: 'text-blue-400',
    },
    warning: {
      icon: AlertCircle,
      className: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
      iconColor: 'text-yellow-400',
    },
  };

  const { icon: Icon, className, iconColor } = config[variant];

  return (
    <div className={`border rounded-lg px-4 py-3 flex gap-3 ${className}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
