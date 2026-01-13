import { Injectable, computed, signal } from '@angular/core';
import { AuthSession } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly storageKey = 'inventory.session';
  private readonly sessionSignal = signal<AuthSession | null>(null);

  readonly session = computed(() => this.sessionSignal());
  readonly user = computed(() => this.sessionSignal()?.user ?? null);
  readonly accessToken = computed(() => this.sessionSignal()?.tokens.accessToken ?? null);
  readonly isAuthenticated = computed(() => Boolean(this.sessionSignal()?.tokens.accessToken));

  constructor() {
    const stored = this.readFromStorage();
    if (stored) {
      this.sessionSignal.set(stored);
    }
  }

  setSession(session: AuthSession | null): void {
    this.sessionSignal.set(session);
    if (session) {
      this.writeToStorage(session);
      return;
    }
    this.clearStorage();
  }

  clear(): void {
    this.sessionSignal.set(null);
    this.clearStorage();
  }

  private readFromStorage(): AuthSession | null {
    if (!this.hasStorage()) {
      return null;
    }
    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      this.clearStorage();
      return null;
    }
  }

  private writeToStorage(session: AuthSession): void {
    if (!this.hasStorage()) {
      return;
    }
    window.localStorage.setItem(this.storageKey, JSON.stringify(session));
  }

  private clearStorage(): void {
    if (!this.hasStorage()) {
      return;
    }
    window.localStorage.removeItem(this.storageKey);
  }

  private hasStorage(): boolean {
    return typeof window !== 'undefined' && Boolean(window.localStorage);
  }
}
