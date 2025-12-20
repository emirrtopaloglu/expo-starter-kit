import { create } from 'zustand';

interface Item {
  id: string;
  title: string;
}

interface StoreState {
  items: Item[];
  addItem: (title: string) => void;
  removeItem: (id: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  items: [
    { id: '1', title: 'Buy Groceries' },
    { id: '2', title: 'Walk the Dog' },
    { id: '3', title: 'Read Documentation' },
  ],
  addItem: (title) =>
    set((state) => ({
      items: [...state.items, { id: Date.now().toString(), title }],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));
