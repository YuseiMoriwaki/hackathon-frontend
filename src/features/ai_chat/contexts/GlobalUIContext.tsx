'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

/**
 * GlobalUIContext - Manages global UI state across the application
 *
 * Features:
 * - Input focus tracking (isInputActive): Tracks when any input/textarea is focused
 * - Drawer state notification (setDrawerOpen): Notifies when a drawer opens/closes
 *
 * @example
 * ```tsx
 * import { useGlobalUI } from '@/features/ai_chat/contexts/GlobalUIContext';
 *
 * function MyComponent() {
 *   const { isInputActive } = useGlobalUI();
 *
 *   return (
 *     <div className={isInputActive ? 'pb-6' : 'pb-20'}>
 *       Content adjusts based on input focus
 *     </div>
 *   );
 * }
 * ```
 */
interface GlobalUIContextType {
  isInputActive: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const GlobalUIContext = createContext<GlobalUIContextType | undefined>(
  undefined
);

export function GlobalUIProvider({ children }: { children: ReactNode }) {
  const [isInputActive, setIsInputActive] = useState(false);

  useEffect(() => {
    const checkIfInputActive = () => {
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement?.hasAttribute('contenteditable') ?? false);

      setIsInputActive(isInput);
    };

    // Check on focus/blur events
    const handleFocusIn = () => checkIfInputActive();
    const handleFocusOut = () => checkIfInputActive();

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    // Initial check
    checkIfInputActive();

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // setDrawerOpen is a no-op function but kept for compatibility with drawer.tsx
  // It could be used in the future for global drawer state tracking
  const setDrawerOpen = () => {
    // Currently unused, but available for future use
  };

  return (
    <GlobalUIContext.Provider
      value={{
        isInputActive,
        setDrawerOpen,
      }}
    >
      {children}
    </GlobalUIContext.Provider>
  );
}

export function useGlobalUI() {
  const context = useContext(GlobalUIContext);
  if (context === undefined) {
    throw new Error('useGlobalUI must be used within a GlobalUIProvider');
  }
  return context;
}

