import { PropsWithChildren, forwardRef } from 'react';

const ScrollableView = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    className?: string;
  }> &
    PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative z-10 flex-1 overflow-y-auto scrollbar-hide ${className}`}
      style={{
        willChange: 'scroll-position',
        transform: 'translateZ(0)',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE and Edge
      }}
      {...props}
    >
      {children}
    </div>
  );
});

ScrollableView.displayName = 'ScrollableView';

export default ScrollableView;
