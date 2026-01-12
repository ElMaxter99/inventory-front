import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { SessionStore } from '../stores/session.store';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  it('should login and update session store', () => {
    TestBed.configureTestingModule({
      providers: [AuthService, SessionStore, provideHttpClient(), provideHttpClientTesting()]
    });

    const service = TestBed.inject(AuthService);
    const httpMock = TestBed.inject(HttpTestingController);
    const sessionStore = TestBed.inject(SessionStore);

    service.login({ email: 'test@example.com', password: 'secret' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');

    req.flush({
      data: {
        user: { id: '1', name: 'User', email: 'test@example.com' },
        tokens: { accessToken: 'token', expiresIn: 3600 }
      }
    });

    expect(sessionStore.isAuthenticated()).toBeTrue();
    httpMock.verify();
  });
});
