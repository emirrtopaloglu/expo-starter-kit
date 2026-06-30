import { StateCreator } from 'zustand';
import NetInfo from '@react-native-community/netinfo';
import { NetworkSlice, RootState } from '../types';

export const createNetworkSlice: StateCreator<RootState, [], [], NetworkSlice> = (set, get) => {
  // Register NetInfo listener after store construction to avoid race conditions with get() returning undefined
  Promise.resolve().then(() => {
    NetInfo.addEventListener((state) => {
      const storeState = get();
      if (storeState && !storeState.isSimulatedOffline) {
        set({ isConnected: state.isConnected ?? false });
      }
    });
  });

  return {
    isConnected: true,
    isSimulatedOffline: false,

    setIsConnected: (connected) => set({ isConnected: connected }),

    setSimulatedOffline: (simulate) => {
      set({ isSimulatedOffline: simulate });
      if (simulate) {
        set({ isConnected: false });
      } else {
        NetInfo.fetch().then((state) => {
          set({ isConnected: state.isConnected ?? false });
        });
      }
    },
  };
};
