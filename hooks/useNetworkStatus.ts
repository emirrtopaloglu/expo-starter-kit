import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState, NetInfoCellularGeneration } from '@react-native-community/netinfo';

export interface NetworkStatus {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
  cellularGeneration: NetInfoCellularGeneration | null;
}

/**
 * A hook that listens to network connection changes (online/offline state).
 *
 * @returns Object indicating network parameters.
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
    cellularGeneration: null,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        cellularGeneration: (state.details as any)?.cellularGeneration || null,
      });
    });
    return () => unsubscribe();
  }, []);

  return status;
}
