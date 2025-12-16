interface StatusBadgeProps {
  status: 'available' | 'sold' | 'pending' | 'completed' | 'cancelled';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const statusConfig = {
    available: {
      label: '販売中',
      className: 'bg-green-500/20 text-green-300 border-green-500/30',
    },
    sold: {
      label: '売却済み',
      className: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    },
    pending: {
      label: '処理中',
      className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    },
    completed: {
      label: '完了',
      className: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    cancelled: {
      label: 'キャンセル',
      className: 'bg-red-500/20 text-red-300 border-red-500/30',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`glass-badge rounded-full border ${sizeClasses[size]} ${config.className} font-medium`}
    >
      {config.label}
    </span>
  );
}

