import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PinnedStore {
  pinned: number[];
  toggle: (ticketId: number) => void;
  isPinned: (ticketId: number) => boolean;
}

/**
 * Закрепление живёт у оператора, а не в базе: в модели Tickets поля для этого
 * нет, а миграций в jetsim-support-api не ведут (схема идёт через db push).
 * К тому же закрепление по смыслу личное — чужой пин не должен двигать
 * список у других операторов.
 */
export const usePinnedStore = create<PinnedStore>()(
  persist(
    (set, get) => ({
      pinned: [],
      toggle: (ticketId) =>
        set((state) => ({
          pinned: state.pinned.includes(ticketId)
            ? state.pinned.filter((id) => id !== ticketId)
            : [ticketId, ...state.pinned],
        })),
      isPinned: (ticketId) => get().pinned.includes(ticketId),
    }),
    { name: "pinnedChats" }
  )
);
