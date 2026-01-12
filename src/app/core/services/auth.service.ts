import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';
import { AuthSession, AuthTokens } from '../models/auth.models';
import { SessionStore } from '../stores/session.store';

interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private readonly http: HttpClient, private readonly sessionStore: SessionStore) {}

  login(payload: AuthPayload): Observable<AuthSession> {
    return this.http
      .post<ApiResponse<AuthSession>>(`${this.baseUrl}/login`, payload, {
        withCredentials: true
      })
      .pipe(
        map((response) => response.data),
        tap((session) => this.sessionStore.setSession(session))
      );
  }

  register(payload: AuthPayload): Observable<AuthSession> {
    return this.http
      .post<ApiResponse<AuthSession>>(`${this.baseUrl}/register`, payload, {
        withCredentials: true
      })
      .pipe(
        map((response) => response.data),
        tap((session) => this.sessionStore.setSession(session))
      );
  }

  refresh(): Observable<AuthTokens> {
    return this.http
      .post<ApiResponse<AuthTokens>>(`${this.baseUrl}/refresh`, {}, { withCredentials: true })
      .pipe(map((response) => response.data));
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
