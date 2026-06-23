import { StateCreator } from 'zustand';
import { AppSlice, RootState } from '../types';

export const createAppSlice: StateCreator<
  RootState,
  [],
  [],
  AppSlice
> = (set) => ({
  items: [
    { id: '1', title: 'Buy Groceries' },
    { id: '2', title: 'Walk the Dog' },
    { id: '3', title: 'Read Documentation' },
  ],
  language: 'en',

  addItem: (title) =>
    set((state) => ({
      items: [...state.items, { id: Date.now().toString(), title }],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  setLanguage: (lang) => set({ language: lang }),
});
