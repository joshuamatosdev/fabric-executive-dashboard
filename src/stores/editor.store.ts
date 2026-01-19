import { create } from 'zustand';
import type { Layout } from 'react-grid-layout';
import type { WidgetId } from '../types/common';
import type { WidgetInstance } from '../types/widget';

const MAX_UNDO_STACK_SIZE = 50;

interface EditorState {
  // Edit mode
  isEditMode: boolean;

  // Selection
  selectedWidgetId: WidgetId | null;

  // Clipboard for copy/paste
  clipboard: WidgetInstance | null;

  // Drag state
  isDragging: boolean;
  isResizing: boolean;

  // Undo/Redo stacks
  undoStack: Layout[][];
  redoStack: Layout[][];

  // Dirty state (unsaved changes)
  hasUnsavedChanges: boolean;

  // Actions
  setEditMode: (enabled: boolean) => void;
  toggleEditMode: () => void;

  selectWidget: (id: WidgetId | null) => void;
  clearSelection: () => void;

  copyWidget: (widget: WidgetInstance) => void;
  pasteWidget: () => WidgetInstance | null;
  clearClipboard: () => void;

  setDragging: (dragging: boolean) => void;
  setResizing: (resizing: boolean) => void;

  pushUndoState: (layout: Layout[]) => void;
  undo: () => Layout[] | null;
  redo: () => Layout[] | null;
  clearHistory: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  setUnsavedChanges: (hasChanges: boolean) => void;
  markAsSaved: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  isEditMode: false,
  selectedWidgetId: null,
  clipboard: null,
  isDragging: false,
  isResizing: false,
  undoStack: [],
  redoStack: [],
  hasUnsavedChanges: false,

  // Edit mode actions
  setEditMode: (enabled) =>
    set({
      isEditMode: enabled,
      // Clear selection when exiting edit mode
      selectedWidgetId: enabled ? get().selectedWidgetId : null,
    }),
  toggleEditMode: () => {
    const current = get().isEditMode;
    set({
      isEditMode: !current,
      selectedWidgetId: !current ? get().selectedWidgetId : null,
    });
  },

  // Selection actions
  selectWidget: (id) => set({ selectedWidgetId: id }),
  clearSelection: () => set({ selectedWidgetId: null }),

  // Clipboard actions
  copyWidget: (widget) =>
    set({
      clipboard: {
        ...widget,
        // Deep clone the config to avoid mutations
        config: JSON.parse(JSON.stringify(widget.config)),
      },
    }),
  pasteWidget: () => {
    const { clipboard } = get();
    if (!clipboard) return null;

    // Return a copy of the clipboard content
    // The caller is responsible for generating a new ID
    return {
      ...clipboard,
      config: JSON.parse(JSON.stringify(clipboard.config)),
    };
  },
  clearClipboard: () => set({ clipboard: null }),

  // Drag/Resize state
  setDragging: (dragging) => set({ isDragging: dragging }),
  setResizing: (resizing) => set({ isResizing: resizing }),

  // Undo/Redo actions
  pushUndoState: (layout) => {
    set((state) => {
      const newUndoStack = [...state.undoStack, layout];

      // Limit stack size
      if (newUndoStack.length > MAX_UNDO_STACK_SIZE) {
        newUndoStack.shift();
      }

      return {
        undoStack: newUndoStack,
        // Clear redo stack when new action is performed
        redoStack: [],
        hasUnsavedChanges: true,
      };
    });
  },

  undo: () => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return null;

    const newUndoStack = [...undoStack];
    const layoutToRestore = newUndoStack.pop()!;

    set({
      undoStack: newUndoStack,
      redoStack: [...redoStack, layoutToRestore],
      hasUnsavedChanges: true,
    });

    // Return the previous state (the one before this undo)
    return newUndoStack[newUndoStack.length - 1] ?? null;
  },

  redo: () => {
    const { undoStack, redoStack } = get();
    if (redoStack.length === 0) return null;

    const newRedoStack = [...redoStack];
    const layoutToRestore = newRedoStack.pop()!;

    set({
      undoStack: [...undoStack, layoutToRestore],
      redoStack: newRedoStack,
      hasUnsavedChanges: true,
    });

    return layoutToRestore;
  },

  clearHistory: () =>
    set({
      undoStack: [],
      redoStack: [],
    }),

  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,

  // Dirty state actions
  setUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
  markAsSaved: () => set({ hasUnsavedChanges: false }),
}));

// Keyboard shortcuts hook
export function useEditorKeyboardShortcuts() {
  const { isEditMode, undo, redo, canUndo, canRedo, selectedWidgetId, clearSelection } =
    useEditorStore();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isEditMode) return;

    // Undo: Ctrl+Z / Cmd+Z
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      if (canUndo()) {
        undo();
      }
    }

    // Redo: Ctrl+Y / Cmd+Shift+Z
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      if (canRedo()) {
        redo();
      }
    }

    // Escape: Clear selection
    if (e.key === 'Escape' && selectedWidgetId) {
      e.preventDefault();
      clearSelection();
    }
  };

  return handleKeyDown;
}
