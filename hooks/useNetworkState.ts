/**
 * Network state hook for detecting online/offline status
 * Uses @react-native-community/netinfo to monitor network connectivity
 */

import NetInfo from "@react-native-community/netinfo";
import {useEffect, useState} from "react";

interface NetworkState {
  isConnected: boolean;
  isOffline: boolean;
  networkType: string | null;
}

/**
 * Custom hook to monitor network connectivity state
 * @returns Network state object with isConnected, isOffline, and networkType
 */
export function useNetworkState(): NetworkState {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    isOffline: false,
    networkType: null,
  });

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then((state) => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isOffline: !(state.isConnected ?? false),
        networkType: state.type,
      });
    });

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isOffline: !(state.isConnected ?? false),
        networkType: state.type,
      });
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return networkState;
}
