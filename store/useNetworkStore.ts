import { create } from 'zustand';
import NetInfo from '@react-native-community/netinfo';

interface NetworkState {
  isConnected: boolean;
  isSimulatedOffline: boolean;
  setIsConnected: (connected: boolean) => void;
  setSimulatedOffline: (simulate: boolean) => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => {
  // Register NetInfo listener
  NetInfo.addEventListener((state) => {
    // Only update if simulation is inactive
    if (!get().isSimulatedOffline) {
      set({ isConnected: state.isConnected ?? false });
    }
  });

  return {
    isConnected: true, // Default to true
    isSimulatedOffline: false,
    setIsConnected: (connected) => set({ isConnected: connected }),
    setSimulatedOffline: (simulate) => {
      set({ isSimulatedOffline: simulate });
      if (simulate) {
        set({ isConnected: false }); // Force offline
      } else {
        // Query current network state
        NetInfo.fetch().then((state) => {
          set({ isConnected: state.isConnected ?? false });
        });
      }
    },
  };
});
