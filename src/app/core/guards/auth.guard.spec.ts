import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { SessionStore } from '../stores/session.store';

describe('authGuard', () => {
  it('should redirect to login when no session', () => {
    TestBed.configureTestingModule({
      providers: [
        SessionStore,
        {
          provide: Router,
          useValue: {
            createUrlTree: jasmine.createSpy('createUrlTree')
          }
        }
      ]
    });

    const result = TestBed.runInInjectionContext(() => authGuard());
    const router = TestBed.inject(Router);

    expect(router.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
    expect(result).toBeDefined();
  });
});
