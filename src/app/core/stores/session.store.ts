import { Injectable, computed, signal } from '@angular/core';
import { AuthSession } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly sessionSignal = signal<AuthSession | null>(null);

  readonly session = computed(() => this.sessionSignal());
  readonly user = computed(() => this.sessionSignal()?.user ?? null);
  readonly accessToken = computed(() => this.sessionSignal()?.tokens.accessToken ?? null);
  readonly isAuthenticated = computed(() => Boolean(this.sessionSignal()?.tokens.accessToken));

  setSession(session: AuthSession | null): void {
    this.sessionSignal.set(session);
  }

  clear(): void {
    this.sessionSignal.set(null);
  }
}
