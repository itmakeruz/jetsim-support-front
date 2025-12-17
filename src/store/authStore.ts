import { authAPI } from "@/lib/api";
import { create } from "zustand";
// --- Types ---
interface User {
  id: number;
  name: string;
  login: string;
  status: string;
  created_at: string;
  role: string;
}

interface LoginCredentials {
  username: string;
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
  getProfile: () => Promise<{
    success: boolean;
    user?: User;
    message?: string;
  }>;
  setToken: (token: string) => void;
}

// --- Store ---
export const useAuthStore = create<AuthStore>((set, get) => ({
  token: localStorage.getItem("e_token") || null,
  user: null,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login(credentials);
      const { accessToken } = response.data;
      localStorage.setItem("e_token", accessToken);
      set({ token: accessToken });
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
    localStorage.removeItem("e_token");
  },

  getProfile: async () => {
    set({ isLoading: true });
    try {
      const response = await authAPI.getProfile();
      const user = response.data as User;
      set({
        user: user,
        isLoading: false,
      });
      return {
        success: true,
        user,
        message: "Профиль успешно получен",
      };
    } catch (error: any) {
      set({ isLoading: false });
      return {
        success: false,
        message: "Требуется авторизация",
      };
    }
  },

  setToken: (token) => {
    localStorage.setItem("e_token", token);
    set({ token });
  },
}));
