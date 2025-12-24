import { TOKEN_KEY } from "@/constants/staticDatas";
import { authAPI } from "@/lib/api";
import type { GetProfileResponse, User } from "@/types/profile";
import { create } from "zustand";

interface LoginCredentials {
  login: string;
  password: string;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  getProfile: () => Promise<GetProfileResponse>;
  setToken: (token: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: User | null) => void;
}

// --- Store ---
export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem(TOKEN_KEY) || null,
  user: null,
  isLoading: true,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setUser: (user: User | null) => set({ user }),
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login(credentials);

      const { access_token } = response.data;
      localStorage.setItem(TOKEN_KEY, access_token);
      set({ token: access_token });
      return { success: true, message: "Вход успешный" };
    } catch (error: any) {
      return {
        success: false,
        message: "Неверный логин или пароль",
      };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ token: null, user: null });
    localStorage.removeItem(TOKEN_KEY);
  },

  getProfile: async (): Promise<GetProfileResponse> => {
    set({ isLoading: true });
    try {
      const response = await authAPI.getProfile();
      const user = response.data;
      set({
        user: user,
        isLoading: false,
      });
      return response;
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({ token });
  },
}));
