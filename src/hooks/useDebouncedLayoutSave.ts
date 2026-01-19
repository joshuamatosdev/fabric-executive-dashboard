import { useCallback, useMemo, useRef, useEffect } from 'react';
import { Debouncer } from '@tanstack/pacer';
import type { Layouts } from 'react-grid-layout';
import { useUpdateDashboardLayout } from '@/api/mutations';
import { useLayoutStore, useEditorStore } from '@/stores';
import type { DashboardId } from '@/types/common';

interface DebouncedLayoutSaveOptions {
  /** Wait time before saving (ms) */
  wait?: number;
  /** Maximum time to wait before forcing a save (ms) */
  maxWait?: number;
}

/**
 * Hook for debounced layout saves using TanStack Pacer.
 * Provides immediate optimistic updates with debounced API calls.
 */
export function useDebouncedLayoutSave(
  dashboardId: DashboardId,
  options: DebouncedLayoutSaveOptions = {}
) {
  const { wait = 500, maxWait = 2000 } = options;

  const { mutateAsync: updateLayout } = useUpdateDashboardLayout();
  const { setOptimisticLayout, markAsPending, clearPending, setLastSavedLayout } =
    useLayoutStore();
  const { markAsSaved } = useEditorStore();

  // Track the last saved layout to detect actual changes
  const lastSavedRef = useRef<Layouts | null>(null);

  // Create a debounced save function
  const debouncedSave = useMemo(
    () =>
      new Debouncer(
        async (layouts: Layouts) => {
          // Skip if nothing changed
          if (
            lastSavedRef.current &&
            JSON.stringify(lastSavedRef.current) === JSON.stringify(layouts)
          ) {
            return;
          }

          markAsPending(dashboardId);

          try {
            await updateLayout({ id: dashboardId, layouts });
            lastSavedRef.current = layouts;
            setLastSavedLayout(dashboardId, layouts);
            markAsSaved();
          } catch (error) {
            console.error('Failed to save layout:', error);
            // Could trigger rollback here if needed
          } finally {
            clearPending(dashboardId);
          }
        },
        { wait, maxWait }
      ),
    [dashboardId, wait, maxWait, updateLayout, markAsPending, clearPending, setLastSavedLayout, markAsSaved]
  );

  // Save function that updates optimistic state immediately
  const save = useCallback(
    (layouts: Layouts) => {
      // Immediate optimistic update
      setOptimisticLayout(dashboardId, layouts);

      // Debounced API call
      debouncedSave.maybeExecute(layouts);
    },
    [dashboardId, setOptimisticLayout, debouncedSave]
  );

  // Flush any pending saves
  const flush = useCallback(() => {
    debouncedSave.cancel();
    // Note: If there's a pending layout, we might want to save it here
  }, [debouncedSave]);

  // Cancel any pending saves
  const cancel = useCallback(() => {
    debouncedSave.cancel();
  }, [debouncedSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't cancel - let the last save complete
    };
  }, []);

  return {
    save,
    flush,
    cancel,
  };
}
