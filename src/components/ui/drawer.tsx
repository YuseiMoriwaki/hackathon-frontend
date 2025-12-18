'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils/utils';
import { useGlobalUI } from '@/features/ai_chat/contexts/GlobalUIContext';

// Simple drag handler without @use-gesture/react
function useDragHandler(
  onDrag: (offset: number) => void,
  onDragEnd: (offset: number, velocity: number) => void
) {
  const isDragging = useRef(false);
  const startY = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const onDragRef = useRef(onDrag);
  const onDragEndRef = useRef(onDragEnd);

  React.useEffect(() => {
    onDragRef.current = onDrag;
    onDragEndRef.current = onDragEnd;
  }, [onDrag, onDragEnd]);

  const handleMouseMoveRef = React.useRef<(e: MouseEvent) => void | undefined>(undefined);
  const handleMouseUpRef = React.useRef<() => void | undefined>(undefined);

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const offset = e.clientY - startY.current;
    if (offset > 0) {
      onDragRef.current(offset);
    }
    lastY.current = e.clientY;
    lastTime.current = Date.now();
  }, []);

  const handleMouseUp = React.useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const offset = lastY.current - startY.current;
    const timeDelta = Date.now() - lastTime.current;
    const velocity = timeDelta > 0 ? offset / timeDelta : 0;
    onDragEndRef.current(offset, velocity);
    if (handleMouseMoveRef.current) {
      document.removeEventListener('mousemove', handleMouseMoveRef.current);
    }
    if (handleMouseUpRef.current) {
      document.removeEventListener('mouseup', handleMouseUpRef.current);
    }
  }, []);

  // Update refs in effect to avoid updating during render
  React.useEffect(() => {
    handleMouseMoveRef.current = handleMouseMove;
    handleMouseUpRef.current = handleMouseUp;
  }, [handleMouseMove, handleMouseUp]);

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    lastY.current = e.clientY;
    lastTime.current = Date.now();
    if (handleMouseMoveRef.current) {
      document.addEventListener('mousemove', handleMouseMoveRef.current);
    }
    if (handleMouseUpRef.current) {
      document.addEventListener('mouseup', handleMouseUpRef.current);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (handleMouseMoveRef.current) {
        document.removeEventListener('mousemove', handleMouseMoveRef.current);
      }
      if (handleMouseUpRef.current) {
        document.removeEventListener('mouseup', handleMouseUpRef.current);
      }
    };
  }, []);

  return {
    onMouseDown: handleMouseDown,
  };
}

// ============================================================================
// Drawer Context
// ============================================================================

interface DrawerContextValue {
  isOpen: boolean;
  onClose: () => void;
  dragOffset: number;
  setDragOffset: (offset: number) => void;
  drawerRef: React.RefObject<HTMLDivElement | null>;
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

function useDrawerContext() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('Drawer components must be used within a Drawer');
  }
  return context;
}

// ============================================================================
// Drawer Root
// ============================================================================

interface DrawerProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Root drawer component that provides context and manages state
 *
 * @example
 * ```tsx
 * <Drawer open={isOpen} onOpenChange={setIsOpen}>
 *   <DrawerContent>
 *     <DrawerHandle />
 *     <DrawerHeader>
 *       <DrawerTitle>My Drawer</DrawerTitle>
 *     </DrawerHeader>
 *     <DrawerBody>Content here</DrawerBody>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
function Drawer({ children, open, onOpenChange }: DrawerProps) {
  const { setDrawerOpen } = useGlobalUI();
  const [dragOffset, setDragOffset] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle body scroll lock and global UI state
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setDrawerOpen(true);
    } else {
      document.body.style.overflow = 'unset';
      setDrawerOpen(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
      setDrawerOpen(false);
    };
  }, [open, setDrawerOpen]);

  // Reset drag offset when drawer closes (use setTimeout to avoid setState in effect)
  useEffect(() => {
    if (!open) {
      const timeoutId = setTimeout(() => {
        setDragOffset(0);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  const handleClose = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  if (!open) return null;

  return (
    <DrawerContext.Provider
      value={{
        isOpen: open,
        onClose: handleClose,
        dragOffset,
        setDragOffset,
        drawerRef,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

// ============================================================================
// Drawer Overlay (Backdrop)
// ============================================================================

interface DrawerOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Z-index for the overlay. Defaults to 50 */
  zIndex?: number;
}

const DrawerOverlay = React.forwardRef<HTMLDivElement, DrawerOverlayProps>(
  ({ className, zIndex = 50, ...props }, ref) => {
    const { onClose } = useDrawerContext();

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0',
          className
        )}
        style={{ zIndex }}
        onClick={onClose}
        {...props}
      />
    );
  }
);
DrawerOverlay.displayName = 'DrawerOverlay';

// ============================================================================
// Drawer Content
// ============================================================================

interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Z-index for the drawer content. Defaults to 60 */
  zIndex?: number;
  /** Maximum height of the drawer. Defaults to '85vh' */
  maxHeight?: string;
  /** Enable swipe-to-close gesture. Defaults to true */
  swipeToClose?: boolean;
  /** Swipe distance threshold to trigger close (in pixels). Defaults to 100 */
  swipeThreshold?: number;
  /** Velocity threshold to trigger close. Defaults to 0.5 */
  velocityThreshold?: number;
}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  (
    {
      className,
      children,
      zIndex = 100,
      maxHeight = '85vh',
      swipeToClose = true,
      swipeThreshold = 100,
      velocityThreshold = 0.5,
      ...props
    },
    ref
  ) => {
    const { onClose, dragOffset, setDragOffset, drawerRef } =
      useDrawerContext();

    // Merge refs
    const mergedRef = React.useCallback((node: HTMLDivElement | null) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      // Update drawerRef from context (mutable ref)
      if (drawerRef && 'current' in drawerRef) {
        // eslint-disable-next-line react-hooks/immutability
        (drawerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    }, [ref, drawerRef]);

    // Swipe-to-close gesture (simplified without @use-gesture/react)
    const dragHandler = useDragHandler(
      (offset: number) => {
        if (!swipeToClose) return;
        if (offset > 0) {
          setDragOffset(offset);
        }
      },
      (offset: number, velocity: number) => {
        if (!swipeToClose) return;
            // Close if swiped down past threshold or fast swipe down
        if (offset > swipeThreshold || (velocity > velocityThreshold && offset > 0)) {
              onClose();
        }
        setDragOffset(0);
      }
    );

    return (
      <>
        <DrawerOverlay zIndex={zIndex} />
        <div
          ref={mergedRef}
          className={cn(
            'fixed inset-x-0 bottom-0 flex flex-col z-110',
            'bg-white/4 backdrop-blur-sm border border-black/10',
            'shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]',
            'rounded-t-3xl',
            'animate-[slide-up_0.3s_ease-out]',
            className
          )}
          style={{
            zIndex,
            maxHeight,
            transform: `translateY(${dragOffset}px)`,
            transition: dragOffset === 0 ? 'transform 0.2s ease-out' : 'none',
          }}
          {...(swipeToClose ? dragHandler : {})}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);
DrawerContent.displayName = 'DrawerContent';

// ============================================================================
// Drawer Handle (Drag indicator)
// ============================================================================

type DrawerHandleProps = React.HTMLAttributes<HTMLDivElement>;

const DrawerHandle = React.forwardRef<HTMLDivElement, DrawerHandleProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none',
          className
        )}
        {...props}
      >
        <div className='w-12 h-1 bg-white/20 rounded-full mx-auto' />
      </div>
    );
  }
);
DrawerHandle.displayName = 'DrawerHandle';

// ============================================================================
// Drawer Header
// ============================================================================

type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between px-4 py-3 border-b border-white/10',
          className
        )}
        {...props}
      />
    );
  }
);
DrawerHeader.displayName = 'DrawerHeader';

// ============================================================================
// Drawer Title
// ============================================================================

type DrawerTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const DrawerTitle = React.forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-lg font-semibold text-white', className)}
        {...props}
      />
    );
  }
);
DrawerTitle.displayName = 'DrawerTitle';

// ============================================================================
// Drawer Body
// ============================================================================

type DrawerBodyProps = React.HTMLAttributes<HTMLDivElement>;

const DrawerBody = React.forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1 overflow-y-auto p-4', className)}
        {...props}
      />
    );
  }
);
DrawerBody.displayName = 'DrawerBody';

// ============================================================================
// Drawer Footer
// ============================================================================

type DrawerFooterProps = React.HTMLAttributes<HTMLDivElement>;

const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end gap-2 px-4 py-3 border-t border-white/10',
          className
        )}
        {...props}
      />
    );
  }
);
DrawerFooter.displayName = 'DrawerFooter';

// ============================================================================
// Drawer Close Button
// ============================================================================

type DrawerCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ className, onClick, ...props }, ref) => {
    const { onClose } = useDrawerContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      onClose();
    };

    return (
      <button
        ref={ref}
        type='button'
        className={cn(
          'p-2 hover:bg-white/10 rounded-lg transition-colors',
          className
        )}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
DrawerClose.displayName = 'DrawerClose';

// ============================================================================
// Exports
// ============================================================================

export {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerHandle,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
  useDrawerContext,
};

export type {
  DrawerProps,
  DrawerContentProps,
  DrawerOverlayProps,
  DrawerHandleProps,
  DrawerHeaderProps,
  DrawerTitleProps,
  DrawerBodyProps,
  DrawerFooterProps,
  DrawerCloseProps,
};
