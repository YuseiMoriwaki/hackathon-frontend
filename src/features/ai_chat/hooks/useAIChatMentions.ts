'use client';

/**
 * Hook to fetch all workspace members and notes for AI chat mentions
 * Returns empty arrays - workspace functionality removed
 */
export function useAIChatMentions() {
  return {
    members: [],
    notes: [],
    isLoading: false,
    error: null,
  };
}
