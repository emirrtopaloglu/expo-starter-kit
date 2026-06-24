import { useEffect, useState } from 'react';
import * as Battery from 'expo-battery';

export interface BatteryState {
  level: number | null;
  isCharging: boolean | null;
}

/**
 * A hook that monitors device battery levels and charging states.
 *
 * @returns batteryState level (0-100) and isCharging flag.
 */
export function useBattery(): BatteryState {
  const [batteryState, setBatteryState] = useState<BatteryState>({
    level: null,
    isCharging: null,
  });

  useEffect(() => {
    let isMounted = true;

    const getBatteryInfo = async () => {
      try {
        const [level, state] = await Promise.all([
          Battery.getBatteryLevelAsync(),
          Battery.getBatteryStateAsync(),
        ]);

        if (isMounted) {
          setBatteryState({
            level: Math.round(level * 100),
            isCharging:
              state === Battery.BatteryState.CHARGING || state === Battery.BatteryState.FULL,
          });
        }
      } catch (error) {
        console.error('useBattery: Error fetching battery state', error);
      }
    };

    getBatteryInfo();

    const levelSubscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      if (isMounted) {
        setBatteryState((prev) => ({ ...prev, level: Math.round(batteryLevel * 100) }));
      }
    });

    const stateSubscription = Battery.addBatteryStateListener(({ batteryState: state }) => {
      if (isMounted) {
        setBatteryState((prev) => ({
          ...prev,
          isCharging:
            state === Battery.BatteryState.CHARGING || state === Battery.BatteryState.FULL,
        }));
      }
    });

    return () => {
      isMounted = false;
      levelSubscription.remove();
      stateSubscription.remove();
    };
  }, []);

  return batteryState;
}
