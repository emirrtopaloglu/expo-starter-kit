import { useRef, useCallback } from 'react';

export interface BottomSheetRef {
  present: () => void;
  dismiss: () => void;
  open: () => void;
  close: () => void;
}

/**
 * A helper hook to reference BottomSheets or Modals, providing type-safe open/close triggers.
 * Compatible with popular libraries (like react-native-bottom-sheet) and custom layouts.
 */
export function useBottomSheetRef() {
  const ref = useRef<any>(null);

  const open = useCallback(() => {
    if (ref.current?.present) {
      ref.current.present();
    } else if (ref.current?.open) {
      ref.current.open();
    } else if (ref.current?.show) {
      ref.current.show();
    }
  }, []);

  const close = useCallback(() => {
    if (ref.current?.dismiss) {
      ref.current.dismiss();
    } else if (ref.current?.close) {
      ref.current.close();
    } else if (ref.current?.hide) {
      ref.current.hide();
    }
  }, []);

  return { ref, open, close };
}
