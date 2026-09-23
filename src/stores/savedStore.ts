import { create } from 'zustand';

import type { Space } from '../types';

interface SavedStore {
  items: Space[];
  addItem: (item: Space) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  isItemSaved: (id: string) => boolean;
}

export const useSavedStore = create<SavedStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    const alreadySaved = get().items.some((saved) => saved.id === item.id);
    if (alreadySaved) {
      return;
    }

    set((state) => ({ items: [...state.items, item] }));
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  clearAll: () => {
    set({ items: [] });
  },

  isItemSaved: (id) => {
    return get().items.some((item) => item.id === id);
  },
}));
