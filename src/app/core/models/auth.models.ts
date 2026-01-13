import { User } from './inventory.models';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
}
