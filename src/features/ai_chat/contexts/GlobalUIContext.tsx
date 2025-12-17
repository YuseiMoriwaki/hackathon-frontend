'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import type { FilePreviewData } from '@/components/FilePreviewDrawer';

/**
 * GlobalUIContext - Manages global UI state across the application
 *
 * Features:
 * - Input focus tracking (isInputActive)
 * - General drawer state (isDrawerOpen)
 * - Global Note Drawer management
 * - Global File Preview Drawer management
 *
 * Note Drawer Usage:
 * The Note Drawer is available globally across all screens in the (private) layout.
 * To open a note from any component:
 *
 * @example
 * ```tsx
 * import { useGlobalUI } from '@/features/ai_chat/contexts/GlobalUIContext';
 *
 * function MyComponent() {
 *   const { openNoteDrawer } = useGlobalUI();
 *
 *   const handleNoteClick = (noteId: number) => {
 *     openNoteDrawer(noteId);
 *   };
 *
 *   return <button onClick={() => handleNoteClick(123)}>View Note</button>;
 * }
 * ```
 *
 * File Preview Drawer Usage:
 * The File Preview Drawer is available globally across all screens in the (private) layout.
 * To open a file preview from any component:
 *
 * @example
 * ```tsx
 * import { useGlobalUI } from '@/features/ai_chat/contexts/GlobalUIContext';
 *
 * function MyComponent() {
 *   const { openFileDrawer } = useGlobalUI();
 *
 *   const handleFileClick = (file: FilePreviewData) => {
 *     openFileDrawer(file);
 *   };
 *
 *   return <button onClick={() => handleFileClick(fileData)}>View File</button>;
 * }
 * ```
 */
interface GlobalUIContextType {
  isInputActive: boolean;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  // Note Drawer state
  noteDrawerOpen: boolean;
  selectedNoteId: number | null;
  openNoteDrawer: (noteId: number) => void;
  closeNoteDrawer: () => void;
  // File Preview Drawer state
  fileDrawerOpen: boolean;
  selectedFile: FilePreviewData | null;
  openFileDrawer: (file: FilePreviewData) => void;
  closeFileDrawer: () => void;
}

const GlobalUIContext = createContext<GlobalUIContextType | undefined>(
  undefined
);

export function GlobalUIProvider({ children }: { children: ReactNode }) {
  const [isInputActive, setIsInputActive] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [noteDrawerOpen, setNoteDrawerOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [fileDrawerOpen, setFileDrawerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FilePreviewData | null>(
    null
  );

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

  const openNoteDrawer = useCallback((noteId: number) => {
    setSelectedNoteId(noteId);
    setNoteDrawerOpen(true);
  }, []);

  const closeNoteDrawer = useCallback(() => {
    setNoteDrawerOpen(false);
    setSelectedNoteId(null);
  }, []);

  const openFileDrawer = useCallback((file: FilePreviewData) => {
    setSelectedFile(file);
    setFileDrawerOpen(true);
  }, []);

  const closeFileDrawer = useCallback(() => {
    setFileDrawerOpen(false);
    setSelectedFile(null);
  }, []);

  return (
    <GlobalUIContext.Provider
      value={{
        isInputActive,
        isDrawerOpen,
        setDrawerOpen: setIsDrawerOpen,
        noteDrawerOpen,
        selectedNoteId,
        openNoteDrawer,
        closeNoteDrawer,
        fileDrawerOpen,
        selectedFile,
        openFileDrawer,
        closeFileDrawer,
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

