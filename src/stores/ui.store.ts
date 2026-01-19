import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  sidebarTab: 'widgets' | 'settings' | 'data';

  // Modals
  activeModal: string | null;
  modalData: unknown;

  // Toasts
  toasts: Toast[];

  // Theme
  theme: 'dark' | 'light';

  // Loading states
  isGlobalLoading: boolean;

  // Actions
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  setSidebarTab: (tab: 'widgets' | 'settings' | 'data') => void;

  openModal: (modalId: string, data?: unknown) => void;
  closeModal: () => void;

  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;

  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isSidebarOpen: false,
  sidebarTab: 'widgets',
  activeModal: null,
  modalData: null,
  toasts: [],
  theme: 'dark',
  isGlobalLoading: false,

  // Sidebar actions
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),

  // Modal actions
  openModal: (modalId, data) => set({ activeModal: modalId, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Toast actions
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: `toast-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),

  // Theme actions
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),

  // Loading actions
  setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),
}));

// Auto-remove toasts after duration
export function useAutoRemoveToast() {
  const { toasts, removeToast } = useUIStore();

  toasts.forEach((toast) => {
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);
    }
  });
}
