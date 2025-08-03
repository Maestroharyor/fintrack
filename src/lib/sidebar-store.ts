import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isCollapsed: boolean;
}

interface SidebarActions {
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

interface SidebarStore extends SidebarState {
  actions: SidebarActions;
}

// ⬇️ not exported, so that no one can subscribe to the entire store
const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isCollapsed: false,

      // ⬇️ separate "namespace" for actions
      actions: {
        toggleCollapse: () => {
          set((state) => ({ isCollapsed: !state.isCollapsed }));
        },
        setCollapsed: (collapsed: boolean) => {
          set({ isCollapsed: collapsed });
        },
      },
    }),
    {
      name: "sidebar-store",
    }
  )
);

// 💡 exported - consumers don't need to write selectors
export const useSidebarCollapsed = () =>
  useSidebarStore((state) => state.isCollapsed);

// 🎉 one selector for all our actions
export const useSidebarActions = () =>
  useSidebarStore((state) => state.actions);
