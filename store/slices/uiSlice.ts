import { StateCreator } from 'zustand';
import { UISlice, RootState } from '../types';

export const createUISlice: StateCreator<
  RootState,
  [],
  [],
  UISlice
> = (set) => ({
  isModalOpen: false,
  isBottomSheetOpen: false,

  setModalOpen: (open) => set({ isModalOpen: open }),
  setBottomSheetOpen: (open) => set({ isBottomSheetOpen: open }),
});
