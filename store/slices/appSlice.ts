import { StateCreator } from 'zustand';
import { AppSlice, RootState } from '../types';

export const createAppSlice: StateCreator<RootState, [], [], AppSlice> = (set) => ({
  hasCompletedOnboarding: false,
  language: 'en',
  isPremium: false,

  setCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
  setLanguage: (lang) => set({ language: lang }),
  setPremium: (premium) => set({ isPremium: premium }),
});
