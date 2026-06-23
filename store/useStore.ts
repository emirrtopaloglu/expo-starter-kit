import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Item {
  id: string;
  title: string;
}

interface StoreState {
  items: Item[];
  isLoggedIn: boolean;
  language: string;
  addItem: (title: string) => void;
  removeItem: (id: string) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setLanguage: (lang: string) => void;
}

/**
 * Persisted Zustand store using AsyncStorage.
 * Keeps user session (isLoggedIn), preferences (language), and data items across app closing and opening.
 */
export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      items: [
        { id: '1', title: 'Buy Groceries' },
        { id: '2', title: 'Walk the Dog' },
        { id: '3', title: 'Read Documentation' },
      ],
      isLoggedIn: false,
      language: 'en',
      addItem: (title) =>
        set((state) => ({
          items: [...state.items, { id: Date.now().toString(), title }],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'app-state-storage', // Unique name for the storage key
      storage: createJSONStorage(() => AsyncStorage), // Custom connector for React Native's AsyncStorage
    }
  )
);
