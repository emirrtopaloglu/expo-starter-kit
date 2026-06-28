export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthSlice {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
  hasCompletedOnboarding: boolean;
  language: string;
  isPremium: boolean;
  setCompletedOnboarding: (completed: boolean) => void;
  setLanguage: (lang: string) => void;
  setPremium: (premium: boolean) => void;
}

// Combined state for unified useStore hook
export type RootState = AuthSlice & UISlice & NetworkSlice & AppSlice;
