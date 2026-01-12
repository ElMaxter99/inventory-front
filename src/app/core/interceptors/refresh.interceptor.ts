import { HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SessionStore } from '../stores/session.store';

const isUnauthorized = (error: unknown): error is HttpErrorResponse =>
  error instanceof HttpErrorResponse && error.status === 401;

const isRefreshRequest = (req: HttpRequest<unknown>): boolean => req.url.includes('/auth/refresh');

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const sessionStore = inject(SessionStore);

  return next(req).pipe(
    catchError((error) => {
      if (!isUnauthorized(error) || isRefreshRequest(req)) {
        return throwError(() => error);
      }

      return authService.refresh().pipe(
        switchMap((tokens) => {
          const current = sessionStore.session();
          if (current) {
            sessionStore.setSession({ ...current, tokens });
          }
          const refreshedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${tokens.accessToken}`
            }
          });
          return next(refreshedReq);
        }),
        catchError((refreshError) => {
          sessionStore.clear();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
