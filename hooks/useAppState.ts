import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * A hook that returns the current AppState (active, background, inactive).
 *
 * @returns Current state of the application.
 */
export function useAppState(): AppStateStatus {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, []);

  return appState;
}
