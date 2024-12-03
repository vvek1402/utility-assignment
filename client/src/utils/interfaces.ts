export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  picture: string;
  exp: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  doLogin: (token: string) => void;
  logout: () => void;
}

export interface Application {
  id: string;
  app_name: string;
}