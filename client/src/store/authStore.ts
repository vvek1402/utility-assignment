import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { AuthState, TokenPayload, User } from "../utils/interfaces";

const getInitialAuthState = (): {
  isAuthenticated: boolean;
  user: User | null;
} => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded: TokenPayload = jwtDecode(token);

    const isTokenExpired = decoded.exp * 1000 < Date.now();
    if (!isTokenExpired) {
      const { id, email, name, picture } = decoded;
      return {
        isAuthenticated: true,
        user: { id, email, name, picture },
      };
    }
  }
  return {
    isAuthenticated: false,
    user: null,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialAuthState(),
  doLogin: (token: string) => {
    const decoded: TokenPayload = jwtDecode(token);
    const { id, email, name, picture } = decoded;

    localStorage.setItem("token", token);

    set({
      isAuthenticated: true,
      user: { id, email, name, picture },
    });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({
      isAuthenticated: false,
      user: null,
    });
  },
}));
