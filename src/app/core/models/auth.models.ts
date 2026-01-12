import { User } from './inventory.models';

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}
