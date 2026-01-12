import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        (error.error && error.error?.error?.message) ||
        error.error?.message ||
        error.message ||
        'Ocurrió un error inesperado';
      notification.show(message);
      return throwError(() => error);
    })
  );
};
