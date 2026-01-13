import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';
import { AuthSession, AuthTokens, RegisterResponse } from '../models/auth.models';
import { SessionStore } from '../stores/session.store';

interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}

interface LoginResponse {
  user: AuthSession['user'];
  access: string;
  refresh: string;
}

interface RefreshResponse {
  access: string;
  refresh: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private readonly http: HttpClient, private readonly sessionStore: SessionStore) {}

  login(payload: AuthPayload): Observable<AuthSession> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.baseUrl}/login`, payload, {
        withCredentials: true
      })
      .pipe(
        map((response) => response.data),
        map((data) => ({
          user: data.user,
          tokens: {
            accessToken: data.access,
            refreshToken: data.refresh,
            expiresIn: 0
          }
        })),
        tap((session) => this.sessionStore.setSession(session))
      );
  }

  register(payload: AuthPayload): Observable<RegisterResponse> {
    return this.http
      .post<ApiResponse<RegisterResponse>>(`${this.baseUrl}/register`, payload, {
        withCredentials: true
      })
      .pipe(map((response) => response.data));
  }

  refresh(): Observable<AuthTokens> {
    return this.http
      .post<ApiResponse<RefreshResponse>>(`${this.baseUrl}/refresh`, {}, { withCredentials: true })
      .pipe(
        map((response) => response.data),
        map((data) => ({
          accessToken: data.access,
          refreshToken: data.refresh,
          expiresIn: 0
        }))
      );
  }

  logout(): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(`${this.baseUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        map(() => undefined),
        tap(() => this.sessionStore.clear())
      );
  }

  me(): Observable<AuthSession> {
    return this.http
      .get<ApiResponse<AuthSession>>(`${this.baseUrl}/me`, { withCredentials: true })
      .pipe(
        map((response) => response.data),
        tap((session) => this.sessionStore.setSession(session))
      );
  }
}
