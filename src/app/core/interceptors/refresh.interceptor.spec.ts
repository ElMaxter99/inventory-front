import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { refreshInterceptor } from './refresh.interceptor';
import { authInterceptor } from './auth.interceptor';
import { SessionStore } from '../stores/session.store';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

describe('refreshInterceptor', () => {
  it('should refresh token on 401 and retry request', () => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        SessionStore,
        provideHttpClient(withInterceptors([authInterceptor, refreshInterceptor])),
        provideHttpClientTesting()
      ]
    });

    const http = TestBed.inject(HttpClient);
    const httpMock = TestBed.inject(HttpTestingController);
    const sessionStore = TestBed.inject(SessionStore);

    sessionStore.setSession({
      user: { id: '1', name: 'User', email: 'test@example.com' },
      tokens: { accessToken: 'expired', refreshToken: 'refresh', expiresIn: 3600 }
    });

    http.get(`${environment.apiBaseUrl}/inventories`).subscribe();

    const initialReq = httpMock.expectOne(`${environment.apiBaseUrl}/inventories`);
    initialReq.flush({ message: 'unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    const refreshReq = httpMock.expectOne(`${environment.apiBaseUrl}/auth/refresh`);
    expect(refreshReq.request.method).toBe('POST');
    refreshReq.flush({ data: { access: 'new-token', refresh: 'new-refresh' } });

    const retryReq = httpMock.expectOne(`${environment.apiBaseUrl}/inventories`);
    retryReq.flush({ data: [] });

    expect(sessionStore.accessToken()).toBe('new-token');
    httpMock.verify();
  });
});
