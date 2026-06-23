export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Item {
  id: string;
  title: string;
}

export interface AuthSlice {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  user: User | null;
  login: (
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    user: User
  ) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  setAuthLoading: (loading: boolean) => void;
}

export interface UISlice {
  isModalOpen: boolean;
  isBottomSheetOpen: boolean;
  setModalOpen: (open: boolean) => void;
  setBottomSheetOpen: (open: boolean) => void;
}

export interface NetworkSlice {
  isConnected: boolean;
  isSimulatedOffline: boolean;
  setIsConnected: (connected: boolean) => void;
  setSimulatedOffline: (simulate: boolean) => void;
}

export interface AppSlice {
  items: Item[];
  language: string;
  addItem: (title: string) => void;
  removeItem: (id: string) => void;
  setLanguage: (lang: string) => void;
}

// Combined state for unified useStore hook
export type RootState = AuthSlice & UISlice & NetworkSlice & AppSlice;
