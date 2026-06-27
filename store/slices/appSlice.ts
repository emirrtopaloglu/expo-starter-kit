import { StateCreator } from 'zustand';
import { AppSlice, RootState } from '../types';

export const createAppSlice: StateCreator<RootState, [], [], AppSlice> = (set) => ({
  hasCompletedOnboarding: false,
  language: 'en',

  setCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
  setLanguage: (lang) => set({ language: lang }),
});
